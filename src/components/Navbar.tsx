"use client";

import Link from "next/link";
import { Search, Bell, X, Shield, Bug, Hash, Target, Coins, User, Sun, Moon, LogOut, ArrowUpRight, History } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { threatActors, malwareFamilies, cves, iocs } from "@/lib/demo-data";
import { useCredits } from "@/context/CreditsContext";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { credits, history } = useCredits();
  const { user } = useAuth();
  const [prevCredits, setPrevCredits] = useState(credits);
  const [isAnimatingCredits, setIsAnimatingCredits] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.is_admin || false;

  useEffect(() => {
    if (credits > prevCredits) {
      setIsAnimatingCredits(true);
      const timer = setTimeout(() => setIsAnimatingCredits(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevCredits(credits);
  }, [credits, prevCredits]);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return { actors: [], malware: [], cves: [], iocs: [] };
    const q = searchQuery.toLowerCase();
    return {
      actors: threatActors.filter(a => a.name.toLowerCase().includes(q)).slice(0, 5),
      malware: malwareFamilies.filter(m => m.name.toLowerCase().includes(q)).slice(0, 5),
      cves: cves.filter(c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)).slice(0, 5),
      iocs: iocs.filter(i => i.value.toLowerCase().includes(q)).slice(0, 5)
    };
  }, [searchQuery]);

  const hasResults = searchQuery.trim().length > 0 && (
    filteredResults.actors.length > 0 || 
    filteredResults.malware.length > 0 || 
    filteredResults.cves.length > 0 || 
    filteredResults.iocs.length > 0
  );

  const navItems = [
    { name: "Discover", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Telegram Threat Actors", href: "/telegram" },
    { name: "IOC Lookup", href: "/ioc-lookup" },
    { name: "CERT Alerts", href: "/alerts" },
  ];

  const notifications = [
    { id: 1, text: "New threat actor profile updated: FIN7", time: "2h ago", href: "/actor/lockbit" },
    { id: 2, text: "New IOC added for RedLine", time: "4h ago", href: "/ioc-lookup" },
    { id: 3, text: "Emerging actor detected in APAC", time: "1d ago", href: "/alerts" },
  ];

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
        setShowWallet(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] w-full bg-background border-b border-border h-16 flex items-center px-4 md:px-8 transition-colors duration-300">
      {/* Left side: Brand/Logo */}
      <div className="mr-8 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(224,82,36,0.3)] group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-foreground uppercase italic hidden md:block">
                CTI<span className="text-brand">OS</span>
            </span>
        </Link>
      </div>

      {/* Center: Global search and Nav items */}
      <div className="flex-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all hover:text-brand whitespace-nowrap ${
                pathname === item.href ? "text-brand" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="relative max-w-sm w-full hidden lg:block" ref={searchRef}>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-border rounded-full bg-secondary text-xs placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
            placeholder="Search threat intelligence..."
            value={searchQuery}
            onFocus={() => setShowResults(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showResults && hasResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full mt-2 w-[450px] right-0 bg-card border border-border rounded-2xl shadow-2xl p-4 overflow-hidden max-h-[80vh] overflow-y-auto z-[110]"
              >
                {filteredResults.actors.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                      <Target className="h-3 w-3" /> Actors
                    </h4>
                    <div className="space-y-1">
                      {filteredResults.actors.map(actor => (
                        <Link 
                          key={actor.id} 
                          href={`/actor/${actor.id}`}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-all group"
                        >
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-border">
                              <Image src={actor.profileImage} alt={actor.name} fill className="object-cover" />
                            </div>
                          <div>
                            <p className="text-xs font-bold text-foreground group-hover:text-brand transition-colors">{actor.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">{actor.category}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredResults.malware.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                      <Bug className="h-3 w-3" /> Malware
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {filteredResults.malware.map(m => (
                        <div key={m.id} className="p-2 rounded-xl hover:bg-secondary cursor-pointer group transition-all">
                          <p className="text-xs font-bold text-foreground group-hover:text-brand transition-colors">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground">{m.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Credits, Theme, and Notification */}
      <div className="flex items-center gap-2">
        {/* Credits Wallet */}
        <div className="relative" ref={walletRef}>
          <motion.button 
            onClick={() => setShowWallet(!showWallet)}
            animate={isAnimatingCredits ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all group shadow-sm active:scale-95 ${
              isAnimatingCredits ? 'bg-brand/30 border-brand' : 'bg-brand/10 border-brand/20 hover:bg-brand/20'
            }`}
          >
            <Coins className={`h-3.5 w-3.5 text-brand transition-transform ${isAnimatingCredits ? 'scale-125' : 'group-hover:scale-110'} ${isAdmin ? 'text-emerald-400' : ''}`} />
            <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${isAdmin ? 'text-emerald-400' : 'text-brand'}`}>
              Credits: {isAdmin ? '∞' : credits}
            </span>
            {isAdmin && (
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            )}
          </motion.button>

          <AnimatePresence>
            {showWallet && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl p-5 overflow-hidden z-[110] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Credit Wallet</h4>
                  <Link href="/settings" onClick={() => setShowWallet(false)} className="text-brand text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                    Manage <ArrowUpRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
                
                <div className={`bg-secondary/50 rounded-xl p-4 mb-4 border border-border/50 ${isAdmin ? 'bg-emerald-500/10 border-emerald-500/30' : ''}`}>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Available Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-foreground">
                      {isAdmin ? '∞' : credits} <span className="text-xs text-brand/60 uppercase tracking-widest ml-1 font-bold">Credits</span>
                    </p>
                    {isAdmin && (
                      <div className="px-2 py-1 bg-emerald-500/20 rounded-full">
                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">ADMIN</span>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Unlimited Access Granted
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h5 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                    <History className="h-3 w-3" /> Recent Activity
                  </h5>
                  <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                    {history.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-3 p-1 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-foreground truncate">{item.description}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[10px] font-black shrink-0 ${item.type === 'earn' ? 'text-green-500' : 'text-brand'}`}>
                          {item.type === 'earn' ? '+' : '-'}{item.amount}
                        </span>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-4 italic uppercase">No history detected</p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => { setShowWallet(false); router.push('/settings'); }}
                  className="w-full mt-4 py-2.5 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 active:scale-95"
                >
                  Intelligence Upgrades
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:text-brand transition-all rounded-full hover:bg-secondary active:scale-90"
          title="Toggle UI Mode"
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-all relative rounded-full hover:bg-secondary active:scale-90 ${showNotifications ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-brand rounded-full ring-2 ring-background"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl p-4 overflow-hidden z-[110] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intelligence Feed</h4>
                    <span className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded uppercase font-black">Live</span>
                </div>
                <div className="space-y-4">
                  {notifications.map(n => (
                    <Link 
                      key={n.id} 
                      href={n.href}
                      onClick={() => setShowNotifications(false)}
                      className="block group p-2 rounded-xl hover:bg-secondary transition-all"
                    >
                      <p className="text-xs font-bold text-foreground group-hover:text-brand transition-colors mb-0.5">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">{n.time}</p>
                    </Link>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 bg-secondary text-[10px] font-black uppercase tracking-widest text-muted-foreground rounded-lg hover:bg-border transition-colors">
                  Acknowledge Feed
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile / Logout */}
        <button 
          onClick={logout}
          className="p-2 text-muted-foreground hover:text-brand transition-all rounded-full hover:bg-secondary group active:scale-90"
          title="Terminate Session"
        >
          <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </nav>
  );
}
