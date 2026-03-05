"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NetworkBackground from '@/components/NetworkBackground';
import { Shield, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new verification email.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now log in to your account.');
        } else {
          setStatus('error');
          setMessage(data.detail || 'Email verification failed. Please try again or request a new verification email.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

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
              <Mail className="h-8 w-8 text-brand" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Email Verification
            </h1>
            <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              CTOS Threat Hub
            </p>
          </div>

          <div className="text-center">
            {status === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-blue-200/80 text-sm">Verifying your email address...</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Verification Successful!
                  </h2>
                  <p className="text-blue-200/80 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full bg-brand hover:bg-brand/90 text-white font-black py-3 rounded-xl transition-all uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(224,82,36,0.3)] hover:scale-[1.02] active:scale-95 text-xs"
                  >
                    Proceed to Login
                  </Link>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Verification Failed
                  </h2>
                  <p className="text-blue-200/80 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full bg-secondary hover:bg-secondary/80 text-white font-black py-3 rounded-xl transition-all uppercase tracking-[0.1em] text-xs"
                  >
                    Back to Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-brand/60 hover:text-brand transition-colors font-bold uppercase tracking-wider text-xs"
                  >
                    Request New Verification
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-blue-200/30 uppercase tracking-[0.1em] font-bold">
              Secure Terminal Connection v2.4.0
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
