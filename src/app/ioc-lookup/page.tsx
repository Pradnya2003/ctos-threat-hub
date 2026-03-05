"use client";

import { useState, useEffect } from "react";
import { apiClient, type IOC } from "@/lib/api";
import { Search, ShieldAlert, Clock, Globe, Target, Lock, Coins, Check, ArrowRight, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/context/CreditsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function IOCLookupPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [iocs, setIOCs] = useState<IOC[]>([]);
  const [loading, setLoading] = useState(false);
  const { credits, isUnlocked, unlockFeature } = useCredits();

  // Fetch IOCs when component mounts or when search is performed
  useEffect(() => {
    const fetchIOCs = async () => {
      setLoading(true);
      try {
        const data = query 
          ? await apiClient.searchIOCs(query)
          : await apiClient.getIOCs();
        setIOCs(data);
      } catch (error) {
        console.error('Error fetching IOCs:', error);
        setIOCs([]);
      } finally {
        setLoading(false);
      }
    };

    if (searched) {
      fetchIOCs();
    }
  }, [searched, query]);

  return (
    <div className="px-4 md:px-8 py-12 max-w-[1600px] mx-auto min-h-[80vh] bg-background transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 uppercase tracking-tighter italic text-foreground"
        >
            IOC <span className="text-brand">Sentinel</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg font-bold uppercase tracking-tight italic max-w-2xl mx-auto"
        >
          Cross-correlate technical indicators across billions of telemetry points. Search IPs, domains, and malware signatures.
        </motion.p>
      </div>

      <div className="max-w-2xl mx-auto mb-20">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-40 py-6 bg-card border border-border rounded-[2rem] shadow-2xl text-lg focus:outline-none focus:border-brand transition-all text-foreground placeholder:text-muted-foreground/30 font-bold uppercase tracking-tight italic"
            placeholder="Search IP, Domain, or Hash..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (searched) setSearched(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setSearched(true)}
          />
          <button 
            onClick={() => setSearched(true)}
            className="absolute right-3 top-3 bottom-3 px-8 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-brand hover:text-white transition-all active:scale-95 shadow-lg group"
          >
            Query <ArrowRight className="inline h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">Detection Matches ({iocs.length})</h2>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-brand/5 border border-brand/20 rounded-2xl shadow-sm">
                <Coins className="h-4 w-4 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Node Balance: {credits} Credits</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Indicator Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Classification</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detection Epoch</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Last Observed</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {iocs.map((ioc: IOC) => {
                      const unlocked = isUnlocked(`ioc_${ioc.id}`);
                      return (
                        <tr key={ioc.id} className="hover:bg-secondary/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${unlocked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-brand/5 border border-brand/10'}`}>
                                {unlocked ? <ShieldCheck className="h-5 w-5 text-emerald-500" /> : <ShieldAlert className="h-5 w-5 text-brand" />}
                              </div>
                              <span className={`font-mono text-sm font-bold tracking-tight transition-all ${unlocked ? 'text-brand' : 'text-foreground/20 blur-[6px] select-none'}`}>
                                {ioc.value}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] px-2.5 py-1 bg-secondary rounded uppercase font-black text-muted-foreground tracking-widest border border-border">
                              {ioc.type}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-wider italic">{ioc.firstSeen}</td>
                          <td className="px-8 py-6 text-[11px] font-black text-muted-foreground uppercase tracking-wider italic">{ioc.lastSeen}</td>
                          <td className="px-8 py-6 text-right">
                            {unlocked ? (
                              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center justify-end gap-2 italic">
                                <Check className="h-3.5 w-3.5" /> De-masked
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  if (!unlockFeature(`ioc_${ioc.id}`, 2)) {
                                    alert("Node balance insufficient (2 CR required)");
                                  }
                                }}
                                className="text-[10px] font-black text-brand uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-end gap-2 ml-auto group/btn italic"
                              >
                                <Coins className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform" /> Reveal (2 CR)
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {iocs.length === 0 && (
                <div className="py-32 text-center bg-secondary/10">
                  <Globe className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-muted-foreground italic">Zero Matches Discovered</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-3">Try a different indicator identity or classification.</p>
                </div>
              )}
            </div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mt-16 p-10 bg-foreground rounded-[2.5rem] text-background flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Database className="h-48 w-48" />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter italic">Tactical Tier Intelligence</h3>
                <p className="opacity-60 max-w-xl text-sm font-bold uppercase tracking-tight italic">
                  Gain unrestricted access to 50M+ validated indicators of compromise. Real-time API sequences, forensic enrichment, and automated correlation.
                </p>
              </div>
              <Link href="/request-demo" className="relative z-10 px-10 py-5 bg-brand hover:bg-brand/90 transition-all rounded-[1.5rem] text-white font-black uppercase tracking-[0.2em] text-[11px] whitespace-nowrap shadow-xl hover:scale-105 active:scale-95">
                Establish Protocol <ArrowRight className="inline h-3.5 w-3.5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
