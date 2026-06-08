'use client';

import React from 'react';
import Link from 'next/link';

const VALUES = [
  {
    icon: 'verified',
    title: 'Ketelitian Klinis',
    desc: 'Setiap aspek sistem dirancang dengan standar medis tertinggi. Dari preprocessing citra hingga interpretasi BI-RADS, tidak ada shortcut dalam akurasi.',
  },
  {
    icon: 'visibility',
    title: 'Transparansi Penuh',
    desc: 'Kami membuka arsitektur model, pipeline preprocessing, dan metrik evaluasi. Tidak ada black box — setiap keputusan AI dapat dilacak dan dijelaskan.',
  },
  {
    icon: 'favorite',
    title: 'Empati Pasien',
    desc: 'Bahasa Indonesia, antarmuka yang menenangkan, dan hasil yang disajikan dengan konteks klinis yang jelas. Pasien berhak mengerti kondisi mereka.',
  },
  {
    icon: 'lock',
    title: 'Privasi Data',
    desc: 'Zero-data retention. File dihapus setelah analisis. Tidak ada database. Setiap sesi bersifat ephemeral dan terisolasi.',
  },
];

const TIMELINE = [
  { year: '2024 Q3', title: 'Inisiasi Riset', desc: 'Studi literatur arsitektur CNN untuk klasifikasi mammografi. Pemilihan EfficientNet sebagai backbone.' },
  { year: '2024 Q4', title: 'Pengembangan Model', desc: 'Implementasi MammoAIModel dengan 9 blok MBConv + Squeeze-and-Excitation. Training prototype.' },
  { year: '2025 Q1', title: 'Backend & API', desc: 'FastAPI backend dengan endpoints upload, analisis, dan demo. Integrasi preprocessing DICOM.' },
  { year: '2025 Q2', title: 'Frontend & UI/UX', desc: 'Next.js 14 + Tailwind + Framer Motion. Desain Clinical Pearl dengan pendekatan mobile-first.' },
  { year: '2025 Q3', title: 'Grad-CAM & Interpretability', desc: 'Implementasi visualisasi heatmap untuk explainability model. Forward/backward hooks.' },
  { year: '2026 Q1', title: 'Production Deployment', desc: 'Deployment Vercel + Railway. CORS, env vars, production-ready pipeline.' },
];

export default function AboutPage() {
  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-trust-teal transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-trust-teal font-bold">Tentang</span>
        </nav>

        {/* Hero */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-trust-teal/5 rounded-full border border-trust-teal/10 text-trust-teal text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">psychiatry</span>
            MammoAI Precision
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-6">
            Misi Kami: Deteksi Dini
            <br />
            <span className="text-trust-teal">untuk Semua</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate max-w-3xl mx-auto">
            MammoAI Precision adalah platform skrining kanker payudara berbasis kecerdasan buatan yang
            dirancang untuk membantu tenaga medis dalam deteksi dini. Kami percaya akses ke teknologi
            diagnostik berkualitas adalah hak setiap pasien.
          </p>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-trust-teal mb-3 block">Nilai Inti</span>
            <h2 className="font-jakarta text-3xl font-bold text-charcoal">Prinsip yang Kami Pegang</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical hover:shadow-teal-glow transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-trust-teal/5 flex items-center justify-center text-trust-teal mb-4">
                  <span className="material-symbols-outlined">{v.icon}</span>
                </div>
                <h3 className="font-jakarta text-lg font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-slate leading-relaxed mb-0">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20 bg-white p-8 md:p-12 rounded-3xl border border-light-silver shadow-medical">
          <div className="text-center mb-10">
            <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-calm-blue mb-3 block">Teknologi</span>
            <h2 className="font-jakarta text-3xl font-bold text-charcoal">Tumpukan Teknologi</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Frontend', tech: 'Next.js 14', icon: 'code', color: 'text-calm-blue' },
              { label: 'Backend', tech: 'FastAPI', icon: 'dns', color: 'text-trust-teal' },
              { label: 'Model', tech: 'PyTorch', icon: 'memory', color: 'text-muted-rose' },
              { label: 'Deploy', tech: 'Vercel + Railway', icon: 'cloud', color: 'text-warning' },
            ].map((t) => (
              <div key={t.label} className="text-center p-5 rounded-xl bg-clinical-pearl border border-light-silver">
                <span className={`material-symbols-outlined text-2xl ${t.color} mb-2 block`}>{t.icon}</span>
                <div className="font-jakarta text-sm font-bold text-charcoal mb-1">{t.tech}</div>
                <div className="text-xs text-slate">{t.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-trust-teal mb-3 block">Perjalanan</span>
            <h2 className="font-jakarta text-3xl font-bold text-charcoal">Rilis & Milestone</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-trust-teal via-trust-teal/30 to-transparent" aria-hidden="true" />
            <div className="space-y-8">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative pl-16">
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-xl bg-white border border-light-silver shadow-sm flex items-center justify-center z-10">
                    <span className="font-jakarta text-[10px] font-bold text-trust-teal leading-tight text-center">{item.year.split(' ')[1]}<br />{item.year.split(' ')[0]}</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-light-silver shadow-sm hover:shadow-medical transition-shadow">
                    <h3 className="font-jakarta text-base font-bold text-charcoal mb-1">{item.title}</h3>
                    <p className="text-sm text-slate leading-relaxed mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-warm-amber/10 border-l-4 border-warning rounded-r-2xl p-6 md:p-8">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-warning shrink-0 mt-0.5">warning</span>
            <div>
              <h3 className="font-jakarta text-sm font-bold text-charcoal mb-2">Informasi Penting</h3>
              <p className="text-sm text-slate leading-relaxed mb-0">
                MammoAI Precision adalah alat bantu skrining (Clinical Decision Support) dan bukan perangkat medis diagnostik mandiri.
                Seluruh hasil analisis harus diinterpretasikan oleh tenaga medis profesional. Proyek ini dikembangkan sebagai
                bagian dari riset akademik dan tidak menggantikan konsultasi medis langsung.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
