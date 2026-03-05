"use client";

import { use, useState } from "react";
import { threatActors, iocs } from "@/lib/demo-data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Lock, Check, X, ExternalLink, FileText, Coins, Share2, Twitter, Linkedin, Copy, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/context/CreditsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ActorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const actor = threatActors.find((a) => a.id === id);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { credits, isUnlocked, unlockFeature, spendCredits } = useCredits();

  if (!actor) {
    notFound();
  }

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `Threat actor profile: ${actor.name} – Public CTI dashboard`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const tabs = ["Overview", "Targets", "Malware", "MITRE ATT&CK", "IOCs", "References"];

  const GatedContent = ({ title, featureId, cost = 5 }: { title: string, featureId: string, cost?: number }) => {
    const unlocked = isUnlocked(`${actor.id}_${featureId}`);
    
    if (unlocked) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-foreground italic">{title}</h3>
            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="h-3.5 w-3.5" /> Intelligence Unlocked
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-card border border-border rounded-2xl p-6 shadow-sm group">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Tactical Intelligence Mapping</p>
                <div className="space-y-4">
                   <div className="h-2 bg-secondary rounded-full w-full group-hover:bg-brand/10 transition-colors"></div>
                   <div className="h-2 bg-secondary rounded-full w-3/4 group-hover:bg-brand/10 transition-colors"></div>
                   <div className="h-2 bg-secondary rounded-full w-5/6 group-hover:bg-brand/10 transition-colors"></div>
                </div>
                <div className="mt-6 pt-6 border-t border-border text-[11px] font-medium text-muted-foreground italic leading-relaxed">
                  Advanced {featureId.toLowerCase()} behavioral signatures for {actor.name} are currently under classification. Full forensic dossiers available for enterprise partners.
                </div>
             </div>
             <div className="bg-foreground rounded-2xl p-6 shadow-2xl text-background">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Strategic Intelligence Assessment</p>
                <p className="text-sm font-bold leading-relaxed mb-6 italic uppercase tracking-tight">
                  "Based on recent telemetry, {actor.name} has recalibrated their {featureId.toLowerCase()} vectors to bypass next-gen endpoint detection mechanisms."
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-background/10 rounded-xl p-3 border border-background/20 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-black opacity-40">Criticality</p>
                      <p className="text-xs font-black text-brand">P0 - IMMEDIATE</p>
                   </div>
                   <div className="bg-background/10 rounded-xl p-3 border border-background/20 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-black opacity-40">Confidence Score</p>
                      <p className="text-xs font-black text-emerald-500">98% / HIGH</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="relative min-h-[450px] overflow-hidden rounded-3xl border border-border bg-secondary/20">
        <div className="absolute inset-0 filter blur-[8px] select-none pointer-events-none opacity-20 grayscale">
          <div className="p-8 space-y-6">
            <div className="h-8 bg-foreground/20 rounded-lg w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-foreground/10 rounded-2xl"></div>
              <div className="h-32 bg-foreground/10 rounded-2xl"></div>
            </div>
            <div className="h-6 bg-foreground/20 rounded-lg w-1/2"></div>
            <div className="space-y-3">
              <div className="h-3 bg-foreground/5 rounded-full w-full"></div>
              <div className="h-3 bg-foreground/5 rounded-full w-full"></div>
              <div className="h-3 bg-foreground/5 rounded-full w-full"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-8 bg-background/40 backdrop-blur-[2px]">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card/80 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 max-w-md text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>
            <div className="bg-brand/10 h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative border border-brand/20 shadow-[0_0_30px_rgba(224,82,36,0.2)]">
              <Lock className="h-8 w-8 text-brand" />
              <motion.div 
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="absolute -top-2 -right-2 bg-brand text-white text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-card shadow-lg"
              >
                {cost} CR
              </motion.div>
            </div>
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter italic text-foreground">Classified Intelligence</h3>
            <p className="text-muted-foreground text-xs mb-8 font-medium leading-relaxed uppercase tracking-wider">
              Deep-dive {featureId.toLowerCase()} analysis, historical campaign patterns, and tactical TTP mappings are restricted to authorized analysts.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  if (unlockFeature(`${actor.id}_${featureId}`, cost)) {
                    // Success!
                  } else {
                    alert("Credit exhaustion. Daily refill pending.");
                  }
                }}
                className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-brand hover:text-white transition-all active:scale-95 shadow-2xl group"
              >
                <Coins className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Initialize Access: {cost} Credits
              </button>
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">
                Node Balance: <span className="text-brand">{credits} Credits</span>
              </div>
              <div className="h-px bg-border my-4"></div>
              <Link href="/request-demo" className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline hover:scale-105 transition-all">
                Upgrade to Tactical Tier
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1200px] mx-auto pb-20 bg-background transition-colors duration-300">
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card border border-border rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter italic text-foreground">Relay Intelligence</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center gap-4 p-4 bg-secondary/50 hover:bg-secondary rounded-2xl transition-all text-left group border border-border/50"
                >
                  <div className="h-12 w-12 bg-card border border-border rounded-xl flex items-center justify-center shrink-0 group-hover:border-brand/50 transition-all">
                    {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-muted-foreground group-hover:text-brand" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-foreground">{copied ? 'Data Sequenced' : 'Copy Direct Link'}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Secure SHA-256 Pointer</p>
                  </div>
                </button>

                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 p-4 bg-[#1DA1F2]/5 hover:bg-[#1DA1F2]/10 rounded-2xl transition-all text-left group border border-[#1DA1F2]/20"
                >
                  <div className="h-12 w-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#1DA1F2]/20">
                    <Twitter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#1DA1F2]">Signal to X</p>
                    <p className="text-[9px] text-[#1DA1F2]/60 uppercase tracking-widest font-bold">Broadcast to network</p>
                  </div>
                </a>

                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 p-4 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10 rounded-2xl transition-all text-left group border border-[#0A66C2]/20"
                >
                  <div className="h-12 w-12 bg-[#0A66C2] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#0A66C2]/20">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#0A66C2]">Relay to LinkedIn</p>
                    <p className="text-[9px] text-[#0A66C2]/60 uppercase tracking-widest font-bold">Professional briefing</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
        <div className="relative h-48 w-48 rounded-[2rem] overflow-hidden border border-border shrink-0 shadow-2xl group">
          <Image src={actor.profileImage} alt={actor.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex gap-2">
              <span className={`text-[10px] px-2.5 py-1 rounded uppercase font-black tracking-widest border ${
                actor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                actor.status === 'Emerging' ? 'bg-brand/10 text-brand border-brand/20' : 
                'bg-secondary text-muted-foreground border-border'
              }`}>
                {actor.status}
              </span>
              <span className="text-[10px] bg-secondary text-muted-foreground px-2.5 py-1 rounded uppercase font-black tracking-widest border border-border">
                {actor.category}
              </span>
            </div>
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-all group"
            >
              <Share2 className="h-4 w-4 group-hover:rotate-12 transition-transform" /> Relay Intel
            </button>
          </div>
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter italic text-foreground">
            {actor.name}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl font-medium">
            {actor.description}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1.5">Primary Theatres</p>
              <p className="text-xs font-black text-foreground uppercase tracking-wider">{actor.targetedCountries.join(", ")}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1.5">Last Transmission</p>
              <p className="text-xs font-black text-foreground uppercase tracking-wider">{actor.lastUpdated}</p>
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1.5">Threat Grade</p>
                <p className="text-xs font-black text-brand uppercase tracking-wider">High Density / APT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-10 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? "text-brand" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-brand rounded-t-full"></motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <section>
                  <h3 className="text-xl font-black mb-5 uppercase tracking-tighter italic text-foreground">Executive Summary</h3>
                  <div className="bg-secondary/30 rounded-3xl p-8 border border-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="h-24 w-24 text-foreground" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-bold italic uppercase tracking-tight text-sm">
                      "{actor.name} represents a high-sophistication threat vector. They primarily execute {actor.category.toLowerCase()} campaigns, demonstrating surgical precision and advanced persistence mechanisms. Intelligence suggests significant resource backing and access to bespoke toolsets."
                    </p>
                  </div>
                </section>
                <section>
                  <h3 className="text-xl font-black mb-5 uppercase tracking-tighter italic text-foreground">Bespoke Arsenal</h3>
                  <div className="flex flex-wrap gap-3">
                    {actor.associatedMalware.map(m => (
                      <div key={m} className="bg-card border border-border px-5 py-3 rounded-2xl text-[11px] font-black text-foreground uppercase tracking-wider hover:border-brand transition-colors cursor-default shadow-sm">
                        {m}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <div className="space-y-8">
                <section className="bg-card rounded-[2rem] p-8 border border-border shadow-xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 pb-2 border-b border-border">Entity Metadata</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Operational Tier</span>
                      <span className="text-xs font-black text-brand">ELITE / APT</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Infrastructure Origin</span>
                      <span className="text-xs font-black text-foreground uppercase">[REDACTED]</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Detection Epoch</span>
                      <span className="text-xs font-black text-foreground">2021-Q3</span>
                    </div>
                    <div className="flex justify-between items-center group pt-4 border-t border-border">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Confidence Rating</span>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-3 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-secondary'}`}></div>)}
                        </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
  
          {activeTab === "Targets" && <GatedContent title="Tactical Targets & Sectors" featureId="Targets" cost={5} />}
          {activeTab === "Malware" && <GatedContent title="Bespoke Malware Analysis" featureId="Malware" cost={5} />}
          {activeTab === "MITRE ATT&CK" && <GatedContent title="MITRE ATT&CK Behavioral Matrix" featureId="MITRE" cost={5} />}
          
          {activeTab === "IOCs" && (
            isUnlocked(`${actor.id}_IOCs`) ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground italic">Technical Indicators (IOCs)</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (spendCredits(10, `Exported IOCs for ${actor.name}`)) {
                          alert("IOC Dataset sequences exported to secure buffer (Demo)");
                        } else {
                          alert("Insufficient credits for dataset export (10 required)");
                        }
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.15em] bg-foreground text-background px-5 py-2.5 rounded-xl hover:bg-brand hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      Export Dataset (10 CR)
                    </button>
                    <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full flex items-center gap-1.5 border border-emerald-500/20">
                      <ShieldCheck className="h-4 w-4" /> Unlocked
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-border shadow-2xl bg-card">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border">
                      <tr>
                        <th className="px-8 py-5">Indicator Identity</th>
                        <th className="px-8 py-5">Classification</th>
                        <th className="px-8 py-5">Detection Epoch</th>
                        <th className="px-8 py-5">Last Observed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-bold">
                      {iocs.map((ioc) => (
                        <tr key={ioc.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-8 py-5 font-mono text-xs text-brand">{ioc.value}</td>
                          <td className="px-8 py-5">
                            <span className="bg-secondary px-3 py-1 rounded text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-border">{ioc.type}</span>
                          </td>
                          <td className="px-8 py-5 text-muted-foreground text-[11px] uppercase tracking-wider">{ioc.firstSeen}</td>
                          <td className="px-8 py-5 text-muted-foreground text-[11px] uppercase tracking-wider">{ioc.lastSeen}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-border bg-secondary/10">
                <div className="mb-6 overflow-hidden select-none pointer-events-none opacity-20 filter blur-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border">
                      <tr>
                        <th className="px-8 py-5">Indicator Identity</th>
                        <th className="px-8 py-5">Classification</th>
                        <th className="px-8 py-5">Detection Epoch</th>
                        <th className="px-8 py-5">Last Observed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {iocs.slice(0, 5).map((ioc) => (
                        <tr key={ioc.id}>
                          <td className="px-8 py-5 font-mono text-xs blur-md text-foreground">{ioc.value}</td>
                          <td className="px-8 py-5">
                            <span className="bg-secondary px-3 py-1 rounded text-[10px] font-black text-muted-foreground uppercase">{ioc.type}</span>
                          </td>
                          <td className="px-8 py-5 text-muted-foreground font-black uppercase">{ioc.firstSeen}</td>
                          <td className="px-8 py-5 text-muted-foreground font-black uppercase">{ioc.lastSeen}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card/90 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 max-w-md text-center shadow-2xl relative"
                  >
                      <div className="bg-brand/10 h-16 w-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 relative border border-brand/20">
                        <Lock className="h-7 w-7 text-brand" />
                        <div className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-card shadow-lg">
                          5 CR
                        </div>
                      </div>
                      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter italic text-foreground">Indicator Dataset Restricted</h3>
                      <p className="text-muted-foreground text-[10px] mb-8 uppercase font-bold tracking-widest leading-relaxed">
                        Access to the technical indicator feed and cross-entity correlation data requires tactical authorization.
                      </p>
                      <button 
                        onClick={() => {
                          if (unlockFeature(`${actor.id}_IOCs`, 5)) {
                            // Success
                          } else {
                            alert("Insufficient node balance. Requesting refill...");
                          }
                        }}
                        className="inline-block bg-brand text-white px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-brand/20 group"
                      >
                        Authorize Access <ArrowRight className="inline h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="mt-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        Node Balance: {credits} Credits
                      </div>
                  </motion.div>
                </div>
              </div>
            )
          )}

        {activeTab === "References" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-foreground mb-8">Intelligence Source Log</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: `Analysis of ${actor.name} Evolution: Epoch 2026`, source: 'SOC Global', date: '2026-02-15' },
                { title: `Observed Infrastructure Pivot: ${actor.name}`, source: 'Intel Bureau', date: '2026-01-22' },
                { title: `Legacy Campaign Sequence: ${actor.name}`, source: 'Public Archive', date: '2025-11-05' },
                { title: `Technical Audit: Bespoke Arsenal v2.4`, source: 'Tactical Lab', date: '2026-02-01' },
              ].map((ref, i) => (
                <div key={i} className="flex items-start gap-5 p-6 bg-card border border-border rounded-3xl hover:border-brand/40 transition-all group shadow-sm">
                  <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors border border-border/50">
                    <FileText className="h-5 w-5 text-muted-foreground group-hover:text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-foreground group-hover:text-brand transition-colors mb-2 truncate uppercase tracking-tight">{ref.title}</p>
                    <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                      <span>{ref.source}</span>
                      <span className="h-1 w-1 bg-border rounded-full" />
                      <span>{ref.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/30 group-hover:text-brand transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
