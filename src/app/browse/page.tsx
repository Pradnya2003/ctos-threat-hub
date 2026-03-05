"use client";

import { useState, useMemo, useEffect } from "react";
import { threatActors } from "@/lib/demo-data";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, X } from "lucide-react";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const categories = ['Ransomware', 'Stealer', 'Initial Access Broker', 'APT', 'Botnet', 'Cryptominer'];
  const statuses = ['Active', 'Inactive', 'Emerging'];

  const filteredActors = useMemo(() => {
    return threatActors.filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          actor.associatedMalware.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || actor.category === selectedCategory;
      const matchesStatus = !selectedStatus || actor.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    document.title = "Threat Actor Directory – Public CTI Platform";
  }, []);

  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto bg-background transition-colors duration-300">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-foreground italic">
        Threat Actor <span className="text-brand">Directory</span>
      </h1>

      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
        {/* Left Filter Panel */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by name, malware..."
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</h3>
              {(selectedCategory) && (
                <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-brand hover:underline font-black uppercase tracking-widest">Reset</button>
              )}
            </div>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat ? "bg-brand text-white" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</h3>
              {(selectedStatus) && (
                <button onClick={() => setSelectedStatus(null)} className="text-[10px] text-brand hover:underline font-black uppercase tracking-widest">Reset</button>
              )}
            </div>
            <div className="space-y-1">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedStatus === status ? "bg-brand text-white" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActors.map((actor) => (
              <Link
                key={actor.id}
                href={`/actor/${actor.id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-brand/30 transition-all flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden border-b border-border">
                  <Image
                    src={actor.profileImage}
                    alt={actor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-black tracking-widest ${
                      actor.status === 'Active' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 
                      actor.status === 'Emerging' ? 'bg-brand text-white shadow-[0_0_10px_rgba(224,82,36,0.3)]' : 
                      'bg-gray-500 text-white'
                    }`}>
                      {actor.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-1 group-hover:text-brand transition-colors">
                      {actor.name}
                    </h3>
                    <p className="text-[10px] text-brand font-black uppercase tracking-widest">
                      {actor.category}
                    </p>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Targeted Countries</p>
                      <div className="flex flex-wrap gap-1.5">
                        {actor.targetedCountries.map(c => (
                          <span key={c} className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded text-foreground font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">Associated Malware</p>
                      <div className="flex flex-wrap gap-1.5">
                        {actor.associatedMalware.map(m => (
                          <span key={m} className="text-[10px] bg-brand/10 border border-brand/20 px-2 py-0.5 rounded text-brand font-black italic">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredActors.length === 0 && (
            <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight text-muted-foreground">No entities discovered</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
