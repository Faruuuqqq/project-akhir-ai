import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-light-silver py-12 font-inter mt-auto">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="font-jakarta text-lg font-bold text-charcoal flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-trust-teal">biotech</span>
            MammoAI Precision
          </div>
          <p className="text-xs text-slate">
            © {new Date().getFullYear()} MammoAI. Dirancang untuk membantu tenaga medis ahli.
          </p>
        </div>
        <div className="flex gap-12">
           <div>
             <h4 className="font-jakarta text-xs uppercase tracking-widest font-bold mb-4 text-charcoal">Produk</h4>
             <ul className="space-y-3 text-sm text-slate">
               <li><Link href="/screening" className="hover:text-trust-teal transition-colors">Skrining AI</Link></li>
               <li><Link href="/how-it-works" className="hover:text-trust-teal transition-colors">Cara Kerja</Link></li>
               <li><Link href="/research" className="hover:text-trust-teal transition-colors">Metodologi</Link></li>
             </ul>
           </div>
           <div>
             <h4 className="font-jakarta text-xs uppercase tracking-widest font-bold mb-4 text-charcoal">Informasi</h4>
             <ul className="space-y-3 text-sm text-slate">
               <li><Link href="/faq" className="hover:text-trust-teal transition-colors">FAQ</Link></li>
               <li><Link href="/about" className="hover:text-trust-teal transition-colors">Tentang</Link></li>
               <li><Link href="/contact" className="hover:text-trust-teal transition-colors">Kontak</Link></li>
             </ul>
           </div>
        </div>
      </div>
    </footer>
  );
}
