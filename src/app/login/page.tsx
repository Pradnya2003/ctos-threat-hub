"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NetworkBackground from '@/components/NetworkBackground';
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for registration success message
    const message = searchParams.get('message');
    if (message === 'registration-success') {
      setSuccessMessage('Registration successful! Please check your email for verification, then log in.');
    }
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/');
    }
  }, [searchParams, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await login(email, password);
      // Login successful, AuthContext will handle redirect
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <NetworkBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center mb-4 border border-brand/30 shadow-[0_0_20px_rgba(224,82,36,0.3)]">
              <Shield className="h-8 w-8 text-brand" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              CTI<span className="text-brand">OS</span>
            </h1>
            <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Threat Intelligence Console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-blue-300/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-blue-300/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-sm"
                  placeholder="Email address"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-blue-300/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-blue-300/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-sm"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-blue-300/40 hover:text-blue-300/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-xs font-bold"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3 text-green-400 text-xs font-bold"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-brand focus:ring-0 transition-all cursor-pointer" />
                <span className="text-blue-200/40 group-hover:text-blue-200/60 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-brand/60 hover:text-brand transition-colors font-bold uppercase tracking-wider">
                Forgot?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:bg-brand/90 text-white font-black py-4 rounded-xl transition-all uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(224,82,36,0.3)] hover:scale-[1.02] active:scale-95 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-[0.1em] font-bold">
              Secure Terminal Connection v2.4.0
            </p>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-blue-200/40 uppercase tracking-[0.1em] font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-brand hover:text-brand/80 transition-colors font-bold">
                Register Now
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-blue-200/20 uppercase tracking-[0.3em] font-medium">
            Project CTOS Intelligence Network
          </p>
        </div>
      </motion.div>
    </main>
  );
}
