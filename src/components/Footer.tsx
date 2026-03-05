"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4 md:px-8 mt-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <p>© 2026 Public-Facing Intelligence Platform. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button className="hover:text-black transition-colors">Privacy Policy</button>
            <button className="hover:text-black transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
