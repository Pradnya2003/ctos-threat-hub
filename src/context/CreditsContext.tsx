"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

type CreditTransaction = {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
  type: 'earn' | 'spend';
};

type CreditsContextType = {
  credits: number;
  history: CreditTransaction[];
  spendCredits: (amount: number, description: string) => boolean;
  addCredits: (amount: number, description: string) => void;
  isUnlocked: (featureId: string) => boolean;
  unlockFeature: (featureId: string, cost: number) => boolean;
  resetCredits: () => void;
};

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

const WELCOME_BONUS = 50;
const DAILY_BONUS = 10;
const WEEKLY_BONUS = 30;
const MIN_DAILY_BALANCE = 10;
const MAX_FREE_CREDITS = 50;

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<number>(0);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
  const [lastDailyLogin, setLastDailyLogin] = useState<number>(0);
  const [lastWeeklyLogin, setLastWeeklyLogin] = useState<number>(0);
  const { isAuthenticated, user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Check if user is admin
  const isAdmin = user?.is_admin || false;

  useEffect(() => {
    if (!isAuthenticated) {
      // Reset state when logged out
      setCredits(0);
      setHistory([]);
      setUnlockedFeatures([]);
      setLastDailyLogin(0);
      setLastWeeklyLogin(0);
      setInitialized(false);
      return;
    }
    
    // For admin users, set unlimited credits
    if (isAdmin) {
      setCredits(999999); // Unlimited credits representation
      const adminHistory: CreditTransaction[] = [{
        id: Math.random().toString(36).substr(2, 9),
        amount: 999999,
        description: 'Admin unlimited credits',
        timestamp: Date.now(),
        type: 'earn'
      }];
      setHistory(adminHistory);
      setUnlockedFeatures(['all']); // Admin has access to all features
      setInitialized(true);
      return;
    }
    
    // Load from localStorage for regular users
    const savedCredits = localStorage.getItem('cti_credits');
    const savedHistory = localStorage.getItem('cti_credits_history');
    const savedUnlocked = localStorage.getItem('cti_unlocked_features');
    const savedLastDaily = localStorage.getItem('cti_last_daily');
    const savedLastWeekly = localStorage.getItem('cti_last_weekly');

    if (savedCredits) setCredits(parseInt(savedCredits));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedUnlocked) setUnlockedFeatures(JSON.parse(savedUnlocked));
    if (savedLastDaily) setLastDailyLogin(parseInt(savedLastDaily));
    if (savedLastWeekly) setLastWeeklyLogin(parseInt(savedLastWeekly));

    // Initial Welcome Bonus
    if (!savedCredits && (!savedHistory || JSON.parse(savedHistory).length === 0)) {
      const initialCredits = WELCOME_BONUS;
      setCredits(initialCredits);
      const initialHistory: CreditTransaction[] = [{
        id: Math.random().toString(36).substr(2, 9),
        amount: WELCOME_BONUS,
        description: 'New account welcome bonus',
        timestamp: Date.now(),
        type: 'earn'
      }];
      setHistory(initialHistory);
      localStorage.setItem('cti_credits', initialCredits.toString());
      localStorage.setItem('cti_credits_history', JSON.stringify(initialHistory));
    }

    setInitialized(true);
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!initialized || !isAuthenticated) return;

    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const startOfWeek = thisWeek.setHours(0, 0, 0, 0);

    let newCredits = credits;
    const newTransactions: CreditTransaction[] = [];

    // Daily Bonus & Refill
    if (lastDailyLogin < today) {
      // Daily bonus
      newCredits += DAILY_BONUS;
      newTransactions.push({
        id: Math.random().toString(36).substr(2, 9),
        amount: DAILY_BONUS,
        description: 'Daily login bonus',
        timestamp: now,
        type: 'earn'
      });
      
      toast.success('🎉 Daily Login Bonus', {
        description: `You earned +${DAILY_BONUS} credits today! Added to your wallet.`,
        duration: 5000,
      });

      // Refill to minimum daily balance if below
      if (newCredits < MIN_DAILY_BALANCE) {
        const refillAmount = MIN_DAILY_BALANCE - newCredits;
        newCredits = MIN_DAILY_BALANCE;
        newTransactions.push({
          id: Math.random().toString(36).substr(2, 9),
          amount: refillAmount,
          description: 'Daily credit refill',
          timestamp: now,
          type: 'earn'
        });
      }

      setLastDailyLogin(today);
      localStorage.setItem('cti_last_daily', today.toString());
    }

    // Weekly Bonus
    if (lastWeeklyLogin < startOfWeek) {
      newCredits += WEEKLY_BONUS;
      newTransactions.push({
        id: Math.random().toString(36).substr(2, 9),
        amount: WEEKLY_BONUS,
        description: 'First login of the week bonus',
        timestamp: now,
        type: 'earn'
      });

      setLastWeeklyLogin(startOfWeek);
      localStorage.setItem('cti_last_weekly', startOfWeek.toString());
    }

    if (newTransactions.length > 0) {
      // Cap at MAX_FREE_CREDITS
      if (newCredits > MAX_FREE_CREDITS) newCredits = MAX_FREE_CREDITS;
      
      setCredits(newCredits);
      const updatedHistory = [...newTransactions, ...history].slice(0, 50);
      setHistory(updatedHistory);
      
      localStorage.setItem('cti_credits', newCredits.toString());
      localStorage.setItem('cti_credits_history', JSON.stringify(updatedHistory));
    }
  }, [initialized, lastDailyLogin, lastWeeklyLogin, credits, history, isAuthenticated]);

  const addCredits = useCallback((amount: number, description: string) => {
    setCredits(prev => {
      const next = Math.min(prev + amount, MAX_FREE_CREDITS);
      localStorage.setItem('cti_credits', next.toString());
      return next;
    });
    setHistory(prev => {
      const next = [{
        id: Math.random().toString(36).substr(2, 9),
        amount,
        description,
        timestamp: Date.now(),
        type: 'earn' as const
      }, ...prev].slice(0, 50);
      localStorage.setItem('cti_credits_history', JSON.stringify(next));
      return next;
    });
  }, []);

  const spendCredits = useCallback((amount: number, description: string) => {
    // Admin users have unlimited credits
    if (isAdmin) {
      // Add transaction for tracking but don't deduct credits
      setHistory(prev => {
        const next = [{
          id: Math.random().toString(36).substr(2, 9),
          amount: 0, // No actual deduction for admin
          description: `${description} (Admin - Free)`,
          timestamp: Date.now(),
          type: 'spend' as const
        }, ...prev].slice(0, 50);
        return next;
      });
      return true;
    }

    let success = false;
    setCredits(prev => {
      if (prev >= amount) {
        success = true;
        const next = prev - amount;
        localStorage.setItem('cti_credits', next.toString());
        return next;
      }
      return prev;
    });

    if (success) {
      setHistory(prev => {
        const next = [{
          id: Math.random().toString(36).substr(2, 9),
          amount,
          description,
          timestamp: Date.now(),
          type: 'spend' as const
        }, ...prev].slice(0, 50);
        localStorage.setItem('cti_credits_history', JSON.stringify(next));
        return next;
      });
    }

    return success;
  }, [isAdmin]);

  const isUnlocked = useCallback((featureId: string) => {
    // Admin users have access to all features
    if (isAdmin) return true;
    return unlockedFeatures.includes(featureId);
  }, [unlockedFeatures, isAdmin]);

  const unlockFeature = useCallback((featureId: string, cost: number) => {
    if (isUnlocked(featureId)) return true;
    
    if (spendCredits(cost, `Unlocked ${featureId}`)) {
      setUnlockedFeatures(prev => {
        const next = [...prev, featureId];
        localStorage.setItem('cti_unlocked_features', JSON.stringify(next));
        return next;
      });
      return true;
    }
    return false;
  }, [isUnlocked, spendCredits]);

  const resetCredits = useCallback(() => {
    setCredits(0);
    setHistory([]);
    setUnlockedFeatures([]);
    setLastDailyLogin(0);
    setLastWeeklyLogin(0);
    setInitialized(false);
    
    // Clear localStorage
    localStorage.removeItem('cti_credits');
    localStorage.removeItem('cti_credits_history');
    localStorage.removeItem('cti_unlocked_features');
    localStorage.removeItem('cti_last_daily');
    localStorage.removeItem('cti_last_weekly');
  }, []);

  return (
    <CreditsContext.Provider value={{ credits, history, spendCredits, addCredits, isUnlocked, unlockFeature, resetCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};
