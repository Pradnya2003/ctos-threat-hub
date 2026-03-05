"use client";

import { useCredits } from "@/context/CreditsContext";
import { useAuth } from "@/context/AuthContext";
import { Coins, History, TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownLeft, Calendar, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { credits, history } = useCredits();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.is_admin || false;

  return (
    <div className="px-4 md:px-8 py-12 max-w-[1000px] mx-auto bg-background transition-colors duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-foreground mb-2">
            Node <span className="text-brand">Account</span>
        </h1>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-tight italic">
            Manage your intelligence credits and view your tactical usage history across the network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Credit Card */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 bg-foreground rounded-[2.5rem] p-8 text-background relative overflow-hidden shadow-2xl group ${
          isAdmin ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : ''
        }`}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            {isAdmin ? (
              <Crown className="h-40 w-40" />
            ) : (
              <Coins className="h-40 w-40" />
            )}
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">
              {isAdmin ? 'Admin Balance' : 'Available Balance'}
            </p>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-7xl font-black tracking-tighter italic">
                {isAdmin ? '∞' : credits}
              </span>
              <span className="text-xs font-black text-brand uppercase tracking-widest italic">Credits</span>
            </div>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {isAdmin ? 'Administrator Access' : 'Tactical Access Active'}
                </p>
              </div>
              {isAdmin ? (
                <div className="flex items-center gap-3">
                  <Crown className="h-4 w-4 text-emerald-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Unlimited Credits</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 opacity-40">
                  <TrendingUp className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Daily Refill: +10 CR</p>
                </div>
              )}
            </div>

            {!isAdmin && (
              <Link 
                href="/request-demo"
                className="block w-full text-center py-4.5 bg-brand text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-brand/90 transition-all active:scale-95 shadow-xl shadow-brand/20 italic"
              >
                Request Credit Refill
              </Link>
            )}
            
            {isAdmin && (
              <div className="text-center py-4.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400 italic">
                  🎉 Unlimited Access Granted
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl group hover:border-brand/30 transition-all"
          >
            <div className="h-14 w-14 bg-secondary rounded-2xl flex items-center justify-center mb-8 border border-border group-hover:bg-brand/10 transition-colors">
              <Calendar className="h-6 w-6 text-muted-foreground group-hover:text-brand" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 italic text-foreground">Protocol Refresh</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight italic opacity-60">
              Your nodes automatically synchronize every 24 hours at 00:00 UTC. Standard dossiers are capped at 50 credits per session.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl group hover:border-brand/30 transition-all"
          >
            <div className="h-14 w-14 bg-brand/10 rounded-2xl flex items-center justify-center mb-8 border border-brand/20">
              <Sparkles className="h-6 w-6 text-brand" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 italic text-foreground">Earn Intelligence</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight italic opacity-60">
              Maintain active session status for weekly +30 CR bonuses. Participating in cross-entity threat telemetry earns additional credits.
            </p>
          </motion.div>
        </div>
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center border border-border">
              <History className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-foreground">Transaction Log</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors italic">Export Session Logs</button>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
          {history.length > 0 ? (
            <div className="divide-y divide-border">
              {history.map((item) => (
                <div key={item.id} className="p-7 flex items-center justify-between hover:bg-secondary/30 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${item.type === 'earn' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-brand/10 border border-brand/20'}`}>
                      {item.type === 'earn' ? <ArrowUpRight className={`h-6 w-6 text-emerald-500`} /> : <ArrowDownLeft className="h-6 w-6 text-brand" />}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors italic">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-40 italic">
                        {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-black uppercase tracking-tighter italic ${item.type === 'earn' ? 'text-emerald-500' : 'text-brand'}`}>
                    {item.type === 'earn' ? '+' : '-'}{item.amount} <span className="text-[10px]">CR</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-secondary/10">
              <History className="h-16 w-16 text-muted-foreground/10 mx-auto mb-6" />
              <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] italic">Zero Transaction Telemetry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
