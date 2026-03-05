"use client";

import HeroSection from "@/components/HeroSection";
import ThreatCollage from "@/components/ThreatCollage";
import { threatActors, malwareFamilies } from "@/lib/demo-data";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const activeScrollRef = useRef<HTMLDivElement>(null);
  const updatedScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 600;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    document.title = "Public Cyber Threat Intelligence Dashboard – Threat Actors, Malware, IOCs";
  }, []);

  // 3D Tilt Component
  const TiltCard = ({ children, className = "", href }: { children: React.ReactNode, className?: string, href: string }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deg = 8; // Max tilt degree
      
      setRotateX(((y - centerY) / centerY) * -deg);
      setRotateY(((x - centerX) / centerX) * deg);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    return (
      <Link 
        href={href}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`perspective-1000 block ${className}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: rotateX === 0 ? 'all 0.5s ease-out' : 'none',
        }}
      >
        <div className="h-full w-full preserve-3d">
          {children}
        </div>
      </Link>
    );
  };

  return (
    <div className="pb-10 bg-background transition-colors duration-300">
      {/* 1. Hero Boxes / Featured Boxes */}
      <HeroSection />
      
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
        
        {/* 2. Split Section (Single Row Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
          <div className="lg:col-span-7">
            <ThreatCollage />
          </div>
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-xl font-black uppercase tracking-tight mb-1 text-foreground">Trending Malware</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Vertical Intelligence Feed</p>
            </div>
            <div className="flex-1 bg-secondary/30 rounded-3xl p-6 border border-border overflow-hidden">
              <div className="space-y-3">
                {malwareFamilies.slice(0, 5).map((malware) => (
                  <div key={malware.id} className="bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors">{malware.name}</h3>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-brand/5 text-brand px-2 py-0.5 rounded font-black uppercase tracking-widest">{malware.type}</span>
                      <span className="text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded font-black uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/browse" className="mt-6 flex items-center justify-center gap-2 py-3 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand hover:text-white transition-colors">
                Explore Full Directory
              </Link>
            </div>
          </div>
        </section>

        <div className="space-y-16">
          {/* 3. Active Threat Actors (3D Playing Cards) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-1 text-foreground">Active Threat Entities</h2>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">High operational tempo entities</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scroll(activeScrollRef, 'left')} className="p-2.5 border border-border rounded-xl hover:bg-secondary transition-all shadow-sm active:scale-95 text-foreground"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => scroll(activeScrollRef, 'right')} className="p-2.5 border border-border rounded-xl hover:bg-secondary transition-all shadow-sm active:scale-95 text-foreground"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div ref={activeScrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
              {threatActors.filter(a => a.status === 'Active').map((actor) => (
                <TiltCard 
                  key={actor.id} 
                  href={`/actor/${actor.id}`} 
                  className="min-w-[260px] aspect-[1/1.2] group"
                >
                  <div className="h-full bg-card rounded-3xl p-6 border border-border group-hover:border-brand/50 group-hover:shadow-[0_20px_40px_-15px_rgba(224,82,36,0.15)] transition-all duration-300 flex flex-col relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                      <div className="w-16 h-16 border-4 border-foreground rounded-full" />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-border shrink-0 shadow-sm">
                        <Image 
                          src={actor.profileImage} 
                          alt={actor.name} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-base font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors truncate leading-tight">{actor.name}</h3>
                        <p className="text-[9px] text-brand font-black uppercase tracking-widest mt-1">{actor.category}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                        {actor.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-3 mb-4 leading-relaxed font-medium">{actor.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {actor.targetedCountries.slice(0, 3).map(c => (
                          <div key={c} title={c} className="w-6 h-6 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[7px] font-black text-muted-foreground uppercase shadow-sm">
                            {c.substring(0, 2)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-brand transition-colors">Open Dossier</span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </section>

          {/* 4. Recently Updated Intel (A4 Dossier Cards) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-1 text-foreground">Recently Updated Intel</h2>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Latest intelligence attribute updates</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => scroll(updatedScrollRef, 'left')} className="p-2.5 border border-border rounded-xl hover:bg-secondary transition-all shadow-sm active:scale-95 text-foreground"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => scroll(updatedScrollRef, 'right')} className="p-2.5 border border-border rounded-xl hover:bg-secondary transition-all shadow-sm active:scale-95 text-foreground"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
            <div ref={updatedScrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
              {threatActors.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).map((actor) => (
                <Link key={actor.id} href={`/actor/${actor.id}`} className="min-w-[200px] aspect-[1/1.414] group flex flex-col">
                  <div className="relative flex-1 bg-card rounded-xl overflow-hidden mb-3 border border-border shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-brand/20 transition-all duration-500 flex flex-col p-4">
                    {/* Header Image as portrait at top */}
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 border border-border">
                      <Image 
                        src={actor.profileImage} 
                        alt={actor.name} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 rounded-[4px] bg-black/70 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-[0.1em] border border-white/10">
                          Updated
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-brand transition-colors truncate mb-1">{actor.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[8px] bg-brand/5 text-brand px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{actor.category}</span>
                        <span className="text-[8px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{actor.status}</span>
                      </div>

                      <div className="mt-auto flex flex-col gap-1.5 pt-3 border-t border-border">
                        <p className="text-[7px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Intel Rev Date</p>
                        <p className="text-[9px] text-foreground font-black uppercase tracking-widest flex items-center">
                          <span className="w-1 h-1 rounded-full bg-brand mr-1.5"></span>
                          {new Date(actor.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Subtle Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
