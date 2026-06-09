'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Skrining', href: '/screening' },
    { name: 'Riwayat', href: '/history' },
    { name: 'Cara Kerja', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-light-silver bg-white/80 backdrop-blur-md shadow-sm font-inter">
      <div className="mx-auto max-w-6xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-jakarta text-xl font-bold text-ribbon-pink flex items-center gap-2 group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">biotech</span>
            <span className="hidden sm:inline">MammoAI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 border-l border-light-silver pl-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-ribbon-pink' : 'text-slate hover:text-ribbon-pink'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-ribbon-pink"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-ribbon-pink animate-pulse"></div>
             <span className="text-xs font-semibold uppercase tracking-widest text-ribbon-pink">Sistem Siap</span>
          </div>
          {pathname !== '/screening' && (
            <Link
              href="/screening"
              className="hidden md:inline-flex bg-ribbon-pink text-white px-4 py-2 rounded-lg font-semibold hover:bg-ribbon-dark transition-all shadow-pink-glow hover:shadow-pink-glow-hover text-sm"
            >
              Mulai Analisis
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden flex items-center justify-center p-2 text-charcoal hover:bg-clinical-pearl rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-light-silver"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-2 border-b border-light-silver/50 transition-colors ${
                      isActive ? 'text-ribbon-pink font-bold' : 'text-charcoal'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {pathname !== '/screening' && (
                <Link
                  href="/screening"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 bg-ribbon-pink text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-ribbon-dark transition-all shadow-pink-glow"
                >
                  Mulai Analisis Sekarang
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
