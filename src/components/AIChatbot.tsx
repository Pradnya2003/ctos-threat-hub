"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2, Coins, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { credits, spendCredits } = useCredits();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Operational Session Initialized. I am your CTI Intelligence Assistant. You can inquire about threat actors, malware families, or recent SIGINT detections.' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const query = userMsg.toLowerCase();
    
    // Advanced queries cost credits
    let cost = 0;
    let description = "";
    
    if (query.includes("summarize") || query.includes("last 7 days")) {
      cost = 3;
      description = "Summarize last 7 days of activity";
    } else if (query.includes("compare")) {
      cost = 5;
      description = "Compare threat actors";
    } else if (query.includes("report") || query.includes("generate")) {
      cost = 5;
      description = "Generate threat report summary";
    }

    if (cost > 0) {
      if (!spendCredits(cost, description)) {
        setMessages(prev => [...prev, 
          { role: 'user', text: userMsg },
          { role: 'bot', text: `PROTOCOL ERROR: Insufficient node credits for this high-density query (${cost} CR required). Basic telemetry is free, or await daily refill.` }
        ]);
        setInput("");
        return;
      }
    }

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    // Realistic AI Response logic
    setTimeout(() => {
      let botResponse = "SIGNAL INTERRUPTED: Direct match not found in current local dataset. Exploring federated CTI directory or contact support for higher-tier tactical access.";

      if (query === "hello" || query === "hi" || query === "hey") {
        botResponse = "Session Active. I’m your CTI assistant. You can inquire about threat actors, malware families, or recent Telegram detections.";
      } else if (query.includes("summarize") && query.includes("lockbit")) {
        botResponse = "[PREMIUM INTEL] LockBit has been observed launching 14 new campaigns in the last 7 days, primarily targeting manufacturing sectors in the EU. They have released a new version of their encryptor (v4.0) with improved anti-debugging features.";
      } else if (query.includes("lockbit")) {
        botResponse = "LockBit is a ransomware group known for targeting enterprises globally. You can explore its profile in the Threat Actor section. Would you like me to summarize recent activity?";
      } else if (query.includes("redline")) {
        botResponse = "RedLine Stealer is a popular info-stealer targeting browser credentials and crypto wallets. We have several recent IOCs linked to it in our database. You can search for 'RedLine' in the Malware section for more details.";
      } else if (query.includes("malware") || query.includes("trending")) {
        botResponse = "Currently trending malware families include LockBit, RedLine Stealer, and Lazarus-linked backdoors. Most observed payloads this week are focusing on financial data exfiltration.";
      } else if (query.includes("ioc")) {
        botResponse = "I have access to thousands of Indicators of Compromise (IOCs). You can use our 'IOC Lookup' tool in the navigation bar to search for specific IPs, domains, or hashes.";
      } else if (query.includes("telegram")) {
        botResponse = "Our Telegram Threat Intelligence monitors thousands of malicious channels. Recent detections include defacements by Anonymous Sudan and DDoS coordination by KillNet.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-card border border-border rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] overflow-hidden mb-4 transition-all duration-300 ease-in-out ${isMinimized ? 'h-16 w-64' : 'h-[550px] w-[360px] md:w-[420px]'}`}
          >
              {/* Header */}
              <div className="bg-foreground p-5 flex items-center justify-between text-background">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Intelligence Node</p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[9px] opacity-40 font-black uppercase tracking-widest italic">Signal Sync Active</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background/10 rounded-lg backdrop-blur-md border border-background/20">
                    <Coins className="h-3 w-3 text-brand" />
                    <span className="text-[10px] font-black">{credits}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-background/10 rounded-lg transition-colors">
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-background/10 rounded-lg transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

            {!isMinimized && (
              <div className="flex flex-col h-[calc(100%-80px)] bg-background">
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-secondary/10">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-[11px] leading-relaxed font-bold uppercase tracking-tight italic ${
                        m.role === 'user' ? 'bg-brand text-white rounded-tr-none shadow-lg shadow-brand/20' : 'bg-card border border-border text-foreground rounded-tl-none shadow-sm'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-5 bg-card border-t border-border flex gap-3">
                  <input
                    type="text"
                    placeholder="Establish query protocol..."
                    className="flex-1 bg-secondary border border-border rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-tight italic focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-foreground placeholder:text-muted-foreground/30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button type="submit" className="h-12 w-12 bg-foreground text-background rounded-2xl flex items-center justify-center hover:bg-brand hover:text-white transition-all active:scale-90 shadow-2xl shrink-0 group">
                    <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`h-16 w-16 rounded-[2rem] bg-foreground text-background flex items-center justify-center shadow-2xl hover:bg-brand transition-all duration-500 transform hover:scale-105 group active:scale-95 border-4 border-background overflow-hidden ${isOpen && !isMinimized ? 'opacity-0 scale-0 pointer-events-none translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}
      >
        <Zap className="h-7 w-7 group-hover:rotate-12 transition-transform text-white" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand rounded-full border-[3px] border-background shadow-md animate-pulse" />
      </motion.button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
