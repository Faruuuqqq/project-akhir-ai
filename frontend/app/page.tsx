'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export default function HomePage() {
  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-white border-b border-light-silver relative overflow-hidden">
        {/* Topographic background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contours" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M0 60 Q 30 40, 60 60 T 120 60 M0 30 Q 30 10, 60 30 T 120 30 M0 90 Q 30 70, 60 90 T 120 90" 
                      stroke="#0F766E" fill="none" strokeWidth="1.5" strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contours)" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-trust-teal/10 border border-trust-teal/20 rounded-full w-fit">
                <span className="material-symbols-outlined text-base text-trust-teal" aria-hidden="true">verified</span>
                <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-trust-teal">
                  Teknologi Standar Medis
                </span>
              </div>

              <h1 className="font-jakarta text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-charcoal">
                Kecerdasan Presisi untuk <span className="text-trust-teal">Deteksi Dini.</span>
              </h1>

              <p className="text-lg leading-relaxed text-slate max-w-md">
                Memberdayakan radiolog dengan analisis jaringan saraf mutakhir dan dukungan klinis yang empati untuk hasil yang lebih akurat dan cepat.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/screening"
                  className="bg-trust-teal text-white px-8 py-4 rounded-lg font-semibold shadow-teal-glow hover:bg-teal-dark hover:shadow-teal-glow-hover hover:-translate-y-1 transition-all"
                >
                  Mulai Analisis Baru
                </Link>
                <Link
                  href="/research"
                  className="border border-light-silver bg-white text-charcoal px-8 py-4 rounded-lg font-semibold hover:bg-clinical-pearl transition-all"
                >
                  Lihat Dokumentasi
                </Link>
              </div>

              <div className="pt-4 border-l-4 border-warm-amber pl-4 py-2 flex items-start gap-3">
                <span className="material-symbols-outlined text-warm-amber mt-0.5" aria-hidden="true">warning</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-warm-amber mb-1">Disclaimer</p>
                  <p className="text-xs text-slate italic">
                    Hanya untuk dukungan keputusan klinis. Validasi hasil dengan dokter radiologi.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden md:block relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-medical bg-mri-black p-1">
                  <svg viewBox="0 0 512 640" className="w-full aspect-[4/5] bg-gradient-to-br from-gray-900 to-black" aria-hidden="true">
                    {/* Simulated DICOM scan */}
                    <defs>
                      <radialGradient id="breastGradient" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="#4a5568" stopOpacity="0.3"/>
                        <stop offset="70%" stopColor="#2d3748" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#1a202c" stopOpacity="0.9"/>
                      </radialGradient>
                      <pattern id="mriGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M32 0L0 32M0 0L32 32" stroke="#1e293b" strokeWidth="0.3" opacity="0.4"/>
                      </pattern>
                    </defs>
                    <rect width="512" height="640" fill="url(#breastGradient)"/>
                    <rect width="512" height="640" fill="url(#mriGrid)" />
                    {/* Tissue density contours */}
                    <circle cx="236" cy="280" r="140" fill="none" stroke="#0F766E" strokeWidth="0.5" opacity="0.2"/>
                    <circle cx="246" cy="280" r="120" fill="none" stroke="#0F766E" strokeWidth="0.5" opacity="0.25"/>
                    <circle cx="256" cy="280" r="100" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.2"/>
                    <ellipse cx="320" cy="240" rx="45" ry="75" fill="none" stroke="#BE123C" strokeWidth="2" opacity="0.35"/>
                    {/* Additional tissue structures */}
                    <path d="M180,320 Q200,290 240,300 Q260,305 270,320" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.15"/>
                    <path d="M200,200 Q230,180 250,210" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.15"/>
                    <path d="M160,260 Q190,250 200,270" fill="none" stroke="#3B82F6" strokeWidth="0.5" opacity="0.15"/>
                    {/* Pectoral muscle line */}
                    <path d="M80,120 Q120,200 100,340" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.15"/>
                  </svg>

                {/* Scanner line animation — single pass to convey concept */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                  <motion.div
                    initial={{ top: '10%' }}
                    animate={{ top: ['10%', '90%'] }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-1 w-full bg-gradient-to-r from-transparent via-trust-teal to-transparent absolute shadow-[0_0_15px_3px_rgba(15,118,110,0.6)] opacity-80"
                  />
                </div>

                {/* Floating result card */}
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/90 border border-white/30 rounded-xl p-6 shadow-medical">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate mb-1">
                        SKOR PROBABILITAS
                      </p>
                      <h3 className="font-mono text-5xl font-bold text-trust-teal">89.2<span className="text-xl text-trust-teal/60">%</span></h3>
                    </div>
                    <div className="text-right">
                      <div className="bg-trust-teal/10 text-trust-teal px-3 py-1 rounded text-xs font-mono font-bold mb-2 inline-block">
                        BI-RADS 4
                      </div>
                      <p className="text-xs text-slate font-medium">Analisis Selesai</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-light-silver mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-trust-teal w-[89.2%]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-clinical-pearl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="font-jakarta text-4xl font-bold text-charcoal mb-4">Efisiensi yang Berbasis Bukti</h2>
            <p className="text-lg text-slate max-w-2xl">
              Kami menggabungkan arsitektur deep learning terbaru dengan kebutuhan praktis departemen radiologi yang sibuk.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Feature 1 */}
            <div className="group bg-white border border-light-silver rounded-2xl p-8 shadow-sm hover:shadow-teal-glow hover:border-trust-teal/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-trust-teal/10 flex items-center justify-center mb-6 text-trust-teal group-hover:bg-trust-teal group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl">neurology</span>
              </div>
              <h3 className="font-jakarta text-xl font-bold text-charcoal mb-3">Analisis Jaringan Saraf</h3>
              <p className="text-slate leading-relaxed mb-6">
                Algoritma canggih mendeteksi anomali halus pada struktur jaringan padat dengan tingkat kepercayaan tinggi, mengurangi risiko interpretasi yang terlewat.
              </p>
              <Link href="/research" className="inline-flex items-center gap-2 text-trust-teal font-semibold text-sm group/link">
                Pelajari Algoritma 
                <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white border border-light-silver rounded-2xl p-8 shadow-sm hover:shadow-teal-glow hover:border-trust-teal/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-trust-teal/10 flex items-center justify-center mb-6 text-trust-teal group-hover:bg-trust-teal group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl">speed</span>
              </div>
              <h3 className="font-jakarta text-xl font-bold text-charcoal mb-3">Pemrosesan Cepat</h3>
              <p className="text-slate leading-relaxed mb-6">
                Analisis sub-menit untuk mengoptimalkan alur kerja klinis. Memberikan hasil instan saat Anda membutuhkannya paling krusial.
              </p>
              <div className="p-4 bg-clinical-pearl rounded-lg border-l-4 border-trust-teal group-hover:bg-trust-teal/5 transition-colors">
                <p className="font-mono text-sm font-bold text-trust-teal">0.8 detik latensi</p>
                <p className="text-xs text-slate mt-1">Rata-rata kecepatan per slice DICOM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
