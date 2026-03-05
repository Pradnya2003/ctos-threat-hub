"use client";

import { useState, useMemo, useEffect } from "react";
import { telegramDetections } from "@/lib/telegram-data";
import Link from "next/link";
import { Search, MessageSquare, ShieldAlert, Lock, Globe, Building2, Calendar, Coins, Check, ExternalLink, ArrowRight, ShieldCheck, Eye } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TelegramActorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { credits, isUnlocked, unlockFeature } = useCredits();

  const categories = ['Defacement', 'DDoS', 'Data Breach', 'Malware', 'Alert'];

  const filteredDetections = useMemo(() => {
    return telegramDetections.filter(detection => {
      const matchesSearch = 
        detection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detection.threatActor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detection.victimCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detection.victimIndustry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || detection.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    document.title = "Telegram Threat Intelligence – Public CTI Platform";
  }, []);

  return (
    <div className="px-4 md:px-8 py-12 max-w-[1600px] mx-auto bg-background transition-colors duration-300">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter italic text-foreground">
            Telegram <span className="text-brand">Detectors</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm font-bold uppercase tracking-tight italic">
          Real-time SIGINT monitoring of malicious Telegram infrastructure. Tracking cross-border coordination, exfiltrated data drops, and threat actor coordination.
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10">
        {/* Left Filter Panel */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter Telegram feed..."
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand text-foreground placeholder:text-muted-foreground/40 font-bold uppercase tracking-tight italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Classifications</h3>
              {(selectedCategory) && (
                <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-brand hover:underline uppercase font-black tracking-widest">Reset</button>
              )}
            </div>
            <div className="space-y-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    selectedCategory === cat ? "bg-brand text-white shadow-lg shadow-brand/20" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 bg-brand/10 rounded-lg flex items-center justify-center border border-brand/20">
                      <Coins className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Balance</p>
                      <p className="text-base font-black text-foreground">{credits} <span className="text-[10px] text-brand uppercase">CR</span></p>
                  </div>
              </div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold leading-relaxed">
                  Decryption of Telegram content and URL reveal requires node credits. Credits refresh every 24h.
              </p>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDetections.map((detection) => (
                <motion.div
                  layout
                  key={detection.id}
                  className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-brand/30 transition-all flex flex-col p-7 relative"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border ${
                      detection.category === 'Alert' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      detection.category === 'Malware' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {detection.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{new Date(detection.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground mb-3 leading-[1.1] group-hover:text-brand transition-colors italic">
                    {detection.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand">Actor:</span>
                    <span className="text-xs font-black text-foreground uppercase tracking-tight">{detection.threatActor}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-secondary/30 rounded-2xl p-3 border border-border/50">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Theatre</p>
                        <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-brand" />
                            <p className="text-[11px] font-black text-foreground uppercase truncate">{detection.victimCountry}</p>
                        </div>
                    </div>
                    <div className="bg-secondary/30 rounded-2xl p-3 border border-border/50">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Industry</p>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-brand" />
                            <p className="text-[11px] font-black text-foreground uppercase truncate">{detection.victimIndustry}</p>
                        </div>
                    </div>
                  </div>

                  <div className="relative mb-8 flex-1">
                    {isUnlocked(`telegram_content_${detection.id}`) ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-secondary/50 p-5 rounded-2xl border border-brand/20 shadow-inner"
                      >
                        <p className="text-xs text-foreground font-bold leading-relaxed italic uppercase tracking-tight">
                          "{detection.contentPreview} — FULL INTELLIGENCE DECRYPTED. ANALYST NOTE: COORDINATED EFFORT DETECTED ACROSS EASTERN CLUSTER NODES."
                        </p>
                      </motion.div>
                    ) : (
                      <div className="relative group/content bg-secondary/20 p-5 rounded-2xl border border-dashed border-border overflow-hidden">
                        <p className="text-xs text-muted-foreground/30 line-clamp-3 italic uppercase font-bold blur-[3px] select-none">
                          "{detection.contentPreview}"
                        </p>
                        <button 
                          onClick={() => {
                            if (!unlockFeature(`telegram_content_${detection.id}`, 3)) {
                              alert("Node balance insufficient (3 CR required)");
                            }
                          }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/content:opacity-100 transition-all bg-background/60 backdrop-blur-[2px] rounded-2xl cursor-pointer"
                        >
                           <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-brand px-4 py-2 rounded-full shadow-2xl active:scale-95">
                             <Eye className="h-3.5 w-3.5" /> Decrypt Data (3 CR)
                           </span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 mt-auto">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-black mb-2 flex items-center justify-between tracking-[0.2em]">
                        Source Vector {isUnlocked(`telegram_url_${detection.id}`) ? <ShieldCheck className="h-3 w-3 text-emerald-500" /> : <Lock className="h-3 w-3" />}
                      </p>
                      <div className="relative group/link">
                        {isUnlocked(`telegram_url_${detection.id}`) ? (
                          <div className="bg-secondary/80 p-3 rounded-xl text-[10px] font-mono text-brand font-black truncate border border-brand/20 flex items-center justify-between shadow-sm">
                            {detection.telegramUrl}
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        ) : (
                          <>
                            <div className="bg-secondary/50 p-3 rounded-xl text-[10px] font-mono text-muted-foreground/20 truncate blur-[4px] select-none border border-border">
                              {detection.telegramUrl}
                            </div>
                            <button 
                              onClick={() => {
                                if (!unlockFeature(`telegram_url_${detection.id}`, 3)) {
                                  alert("Node balance insufficient (3 CR required)");
                                }
                              }}
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-all bg-background/60 backdrop-blur-[2px] rounded-xl cursor-pointer"
                            >
                               <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest active:scale-95 bg-foreground px-4 py-2 rounded-full shadow-2xl">
                                 <Lock className="h-3.5 w-3.5" /> Reveal URL (3 CR)
                               </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {!isUnlocked(`telegram_content_${detection.id}`) && !isUnlocked(`telegram_url_${detection.id}`) ? (
                      <Link
                        href="/request-demo"
                        className="flex items-center justify-center gap-2 w-full text-center py-4 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-brand hover:text-white transition-all active:scale-95 shadow-lg group"
                      >
                        Initiate Investigation <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 rounded-xl border border-emerald-500/20 shadow-inner italic">
                        Node Synchronized
                      </div>
                    )}
                  </div>
                </motion.div>
            ))}
          </div>

          {filteredDetections.length === 0 && (
            <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
              <MessageSquare className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-muted-foreground italic">No Detections Captured</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-3">Try adjusting your SIGINT filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
