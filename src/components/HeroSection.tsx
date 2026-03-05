"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroItem {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
}

const heroItems: HeroItem[] = [
  {
    id: "lockbit",
    name: "LockBit",
    type: "Ransomware Family",
    description: "LockBit continues to be the most active ransomware operation globally, targeting critical infrastructure and enterprise organizations.",
    image: "https://app.foresiet.com/img/24.97c9986c.png",
  },
  {
    id: "lazarus-group",
    name: "Lazarus Group",
    type: "Threat Actor",
    description: "Sophisticated North Korean state-sponsored group known for high-profile financial theft and cyber espionage campaigns.",
    image: "https://app.foresiet.com/img/19.dfb70c36.png",
  },
  {
    id: "wizard-spider",
    name: "Wizard Spider",
    type: "Threat Actor",
    description: "Russia-based cybercriminal group responsible for major ransomware families including Ryuk and Conti.",
    image: "https://app.foresiet.com/img/21.f53b6bbd.png",
  },
  {
    id: "cl0p",
    name: "CL0P",
    type: "Ransomware Family",
    description: "Financially motivated threat actor group known for large-scale data theft and extortion through zero-day vulnerabilities.",
    image: "https://app.foresiet.com/img/16.8933de94.png",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeItem = heroItems[activeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-8 py-6 max-w-[1600px] mx-auto bg-background transition-colors duration-300">
      {/* Primary Hero Banner */}
      <div className="lg:col-span-3 relative h-[350px] md:h-[550px] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeItem.image}
              alt={activeItem.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0 transition-all"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent flex flex-col justify-end p-10">
          <motion.div 
            key={`content-${activeItem.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand text-white text-[9px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded shadow-lg shadow-brand/20">
                    Live Intel
                </span>
                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                    / Featured {activeItem.type}
                </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">
              {activeItem.name}
            </h2>
            <p className="text-white/70 text-xs md:text-sm mb-8 line-clamp-2 leading-relaxed max-w-xl font-bold uppercase tracking-tight italic opacity-80">
              "{activeItem.description}"
            </p>
            <div className="flex gap-4">
              <Link
                href={`/actor/${activeItem.id}`}
                className="bg-brand text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand/90 transition-all active:scale-95 shadow-xl shadow-brand/20 flex items-center gap-2"
              >
                Establish Protocol <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5" /> Monitor Node
              </button>
            </div>
          </motion.div>
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-10 right-10 flex gap-2">
            {heroItems.map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'}`} 
                />
            ))}
        </div>
      </div>

      {/* Vertical Preview Cards */}
      <div className="hidden lg:flex flex-col gap-3">
        {heroItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all relative overflow-hidden group/btn ${
              activeIndex === index
                ? "bg-card border-2 border-brand shadow-2xl scale-[1.02]"
                : "hover:bg-secondary border border-border opacity-60 hover:opacity-100"
            }`}
          >
            <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className={`object-cover transition-all ${activeIndex === index ? 'grayscale-0' : 'grayscale group-hover/btn:grayscale-0'}`}
              />
            </div>
            <div className="text-left overflow-hidden relative z-10">
              <h3 className={`text-xs font-black uppercase tracking-tight truncate ${activeIndex === index ? 'text-brand' : 'text-foreground'}`}>{item.name}</h3>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate mt-1 opacity-60">{item.type}</p>
            </div>
            {activeIndex === index && (
                <motion.div layoutId="activeHighlight" className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />
            )}
          </button>
        ))}
        
        <div className="mt-auto bg-foreground rounded-[2rem] p-6 text-background relative overflow-hidden group cursor-pointer hover:bg-brand transition-colors duration-500 shadow-xl">
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Tactical Status</p>
                <p className="text-base font-black uppercase tracking-tighter italic">Live Signal Active</p>
            </div>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 opacity-20 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </div>
  );
}
