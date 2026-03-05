"use client";

import { ShieldAlert, Bell, ExternalLink, Calendar, Search } from "lucide-react";
import Link from "next/link";

const alerts = [
  {
    id: "CERT-2026-001",
    title: "Critical Vulnerability in Popular RDP Clients",
    severity: "Critical",
    date: "2026-02-25",
    description: "A new remote code execution vulnerability has been identified in several RDP client implementations. Threat actors are actively developing exploits.",
    source: "Global CERT Network"
  },
  {
    id: "CERT-2026-002",
    title: "Widespread Phishing Campaign Targeting Financial Institutions",
    severity: "High",
    date: "2026-02-24",
    description: "Multiple CERT organizations report a coordinated phishing campaign using sophisticated social engineering tactics and look-alike domains.",
    source: "Regional Security Office"
  },
  {
    id: "CERT-2026-003",
    title: "New Malware Strain: 'VoltStealer' Emerging in APAC",
    severity: "Medium",
    date: "2026-02-22",
    description: "Initial analysis of a new information stealer targeting cryptocurrency wallets and browser credentials across the Asia-Pacific region.",
    source: "Intelligence Community"
  },
  {
    id: "CERT-2026-004",
    title: "Ransomware Operations Resuming After Infrastructure Takedown",
    severity: "High",
    date: "2026-02-20",
    description: "Affiliates of a recently disrupted RaaS operation have been observed migrating to new, smaller-scale infrastructure.",
    source: "Law Enforcement Liaison"
  }
];

export default function AlertsPage() {
  return (
    <div className="px-4 md:px-8 py-12 max-w-[1600px] mx-auto min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">CERT Alerts</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Critical security notifications and advisories from global Computer Emergency Response Teams (CERTs) and intelligence partners.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-brand w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand/20 transition-all">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-48 shrink-0">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  <ShieldAlert className="h-3 w-3" /> {alert.severity} Severity
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1">
                  <Calendar className="h-3 w-3" /> {alert.date}
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{alert.id}</p>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 group-hover:text-brand transition-colors">{alert.title}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Source:</span>
                    <span className="text-xs font-bold text-black">{alert.source}</span>
                  </div>
                  <Link href="/request-demo" className="flex items-center gap-2 text-[10px] font-bold text-brand uppercase hover:underline">
                    View Full Advisory <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-colors">
          Load Historical Alerts
        </button>
      </div>
    </div>
  );
}
