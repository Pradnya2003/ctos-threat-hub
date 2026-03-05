"use client";

import { useState } from "react";
import { CheckCircle2, Shield, Globe, Zap, Mail, User, Building2, MessageSquare } from "lucide-react";

export default function RequestDemoPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-12 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Request Received</h1>
          <p className="text-gray-500 mb-8">
            Thank you for your interest. A threat intelligence specialist will contact you shortly to schedule your personalized demo.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand/90 transition-colors uppercase tracking-widest text-sm"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-16 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-black mb-6 uppercase tracking-tight leading-none">
            Unlock Enterprise <span className="text-brand">Threat Intelligence</span>
          </h1>
          <p className="text-gray-500 text-xl mb-12 max-w-lg">
            Get unrestricted access to our full suite of CTI tools, deep-web monitoring, and real-time threat feeds.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand/5 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Advanced Actor Profiles</h3>
                <p className="text-gray-500 text-sm">Detailed TTPs, infrastructure mapping, and attribution data for 5,000+ threat actors.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand/5 flex items-center justify-center shrink-0">
                <Globe className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Global IOC Feeds</h3>
                <p className="text-gray-500 text-sm">Real-time API access to millions of validated indicators with 100% confidence scores.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand/5 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Priority Notifications</h3>
                <p className="text-gray-500 text-sm">Early warning alerts for emerging threats specifically relevant to your industry.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -mr-16 -mt-16" />
          
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-wider">Schedule a Demo</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input required type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input required type="email" placeholder="john@company.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand transition-all text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <input required type="text" placeholder="Enterprise Security Corp" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Use Case</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <select required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand transition-all text-sm appearance-none">
                  <option value="">Select an option</option>
                  <option value="incident-response">Incident Response</option>
                  <option value="threat-hunting">Threat Hunting</option>
                  <option value="brand-protection">Brand Protection</option>
                  <option value="vulnerability-management">Vulnerability Management</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-brand transition-colors uppercase tracking-widest text-sm shadow-lg shadow-gray-200">
              Request Demo
            </button>
            
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
              By submitting, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
