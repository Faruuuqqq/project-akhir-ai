'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Skrining', href: '/screening' },
    { name: 'Cara Kerja', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-light-silver bg-white/80 backdrop-blur-md shadow-sm font-inter">
      <div className="mx-auto max-w-6xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-jakarta text-xl font-bold text-trust-teal flex items-center gap-2 group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">biotech</span>
            MammoAI
          </Link>
          
          <div className="hidden md:flex items-center gap-6 border-l border-light-silver pl-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-trust-teal' : 'text-slate hover:text-trust-teal'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-trust-teal"
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
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-trust-teal animate-pulse"></div>
             <span className="text-xs font-semibold uppercase tracking-widest text-trust-teal">Sistem Siap</span>
          </div>
          {pathname !== '/screening' && (
            <Link
              href="/screening"
              className="hidden md:inline-flex bg-trust-teal text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-dark transition-all shadow-teal-glow hover:shadow-teal-glow-hover text-sm"
            >
              Mulai Analisis
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
