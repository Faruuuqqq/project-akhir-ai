'use client';

import React from 'react';
import Link from 'next/link';

const PIPELINE_STEPS = [
  {
    icon: 'upload_file',
    title: 'Unggah Citra Mamografi',
    desc: 'Pasien atau tenaga medis mengunggah citra DICOM atau PNG melalui portal aman. Sistem mendeteksi format, memvalidasi integritas file, dan mengekstrak metadata klinis (usia, kepadatan jaringan, view).',
    detail: 'Format: .DCM / .PNG | Maks. 50MB | Dienkripsi end-to-end',
  },
  {
    icon: 'transform',
    title: 'Preprocessing & Normalisasi',
    desc: 'Citra mentah dikonversi ke tensor 3-channel RGB 512×512 piksel. Penerapan normalisasi intensitas dan augmentasi untuk meningkatkan konsistensi antar perangkat akuisisi.',
    detail: 'Resize 512×512 | Normalisasi Z-Score | Augmentasi rotasi ±15°',
  },
  {
    icon: 'neurology',
    title: 'Inferensi Deep Learning',
    desc: 'Tensor diproses oleh arsitektur EfficientNet-B4 (18,59M parameter) yang telah dilatih pada dataset RSNA. Sembilan blok MBConv dengan Squeeze-and-Excitation mengekstraksi fitur hierarkis.',
    detail: 'EfficientNet-B4 | 9 MBConv | SE Attention | Sigmoid output',
  },
  {
    icon: 'grading',
    title: 'Klasifikasi BI-RADS',
    desc: 'Skor probabilitas (0–100%) diterjemahkan ke kategori BI-RADS 1–5. Sistem juga menghasilkan temuan terstruktur: jenis lesi, lokasi, karakteristik morfologi, dan ukuran estimasi.',
    detail: 'Probabilitas → BI-RADS 1–5 | Confidence Score | Temuan terstruktur',
  },
  {
    icon: 'overview',
    title: 'Grad-CAM Heatmap',
    desc: 'Model menghasilkan peta aktivasi (Grad-CAM) yang menyoroti area paling berpengaruh dalam keputusan klasifikasi. Overlay transparan biru (low-risk) hingga merah (high-risk).',
    detail: 'Fitur features[8] | Resolusi pixel | Overlay RGBA',
  },
  {
    icon: 'summarize',
    title: 'Laporan Diagnostik',
    desc: 'Sistem menyusun laporan lengkap: skor AI, confidence interval, temuan radiologis, komposisi payudara, dan rekomendasi tindakan lanjut — semuanya dalam Bahasa Indonesia.',
    detail: 'PDF siap cetak | Rekomendasi klinis | Arsip pasien',
  },
];

const ARCH_SECTIONS = [
  {
    title: 'Convolutional Stem',
    code: 'features[0]',
    desc: 'Konvolusi 3×3 stride 2 mengubah input 512×512×3 menjadi 256×256×48.',
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    title: 'MBConv Blocks (1–7)',
    code: 'features[1..7]',
    desc: 'Tujuh blok MBConv dengan expansion ratio 6, depthwise separable conv, squeeze-and-excitation. Dimensi spasial menyusut dari 256→8, saluran meningkat 24→448.',
    color: 'from-trust-teal/20 to-teal-dark/10',
  },
  {
    title: 'Final 1×1 Expansion',
    code: 'features[8]',
    desc: 'Proyeksi 1×1 Conv + BatchNorm + SiLU memperluas 448→1792 kanal sebagai representasi fitur akhir sebelum pooling.',
    color: 'from-calm-blue/20 to-blue-700/10',
  },
  {
    title: 'Custom Classification Head',
    code: 'custom_head',
    desc: '1792→512 Linear + BatchNorm1d + SiLU + Dropout(0.2) + Linear(512→1). Output logit tunggal → Sigmoid → probabilitas keganasan.',
    color: 'from-muted-rose/20 to-rose-800/10',
  },
];

const METRICS = [
  { label: 'Parameter', value: '18.59M' },
  { label: 'Input Size', value: '512×512' },
  { label: 'Inference (CPU)', value: '3–7 dtk' },
  { label: 'Channels Maks', value: '1.792' },
  { label: 'Blok Konvolusi', value: '9' },
  { label: 'Feature Map Akhir', value: '8×8' },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-trust-teal transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-trust-teal font-bold">Cara Kerja</span>
        </nav>

        {/* Hero */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-trust-teal/5 rounded-full border border-trust-teal/10 text-trust-teal text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Transparansi Algoritma
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-6">
            Bagaimana AI Mendeteksi
            <br />
            <span className="text-trust-teal">Kanker Payudara?</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate max-w-3xl mx-auto">
            Setiap analisis melalui enam tahap — dari unggahan citra hingga laporan diagnostik siap baca.
            Seluruh proses dirancang untuk kecepatan, akurasi, dan kepercayaan klinis.
          </p>
        </section>

        {/* Pipeline */}
        <section className="mb-24">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-trust-teal via-trust-teal/30 to-transparent hidden md:block" aria-hidden="true" />
            <div className="space-y-12">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={i} className="relative md:pl-20">
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border border-light-silver shadow-medical items-center justify-center text-trust-teal z-10">
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-light-silver shadow-medical hover:shadow-teal-glow transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-3 md:hidden">
                      <span className="material-symbols-outlined text-trust-teal">{step.icon}</span>
                      <span className="font-mono text-xs text-trust-teal/60 font-bold">LANGKAH {i + 1}</span>
                    </div>
                    <span className="hidden md:block font-mono text-xs text-trust-teal/60 font-bold mb-2">LANGKAH {i + 1}</span>
                    <h2 className="font-jakarta text-xl font-bold text-charcoal mb-3">{step.title}</h2>
                    <p className="text-sm text-slate leading-relaxed mb-4 max-w-2xl">{step.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-clinical-pearl rounded-lg text-xs font-mono text-slate border border-light-silver">
                      <span className="material-symbols-outlined text-[14px] text-trust-teal">info</span>
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Summary */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-trust-teal mb-3 block">Arsitektur Model</span>
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-charcoal mb-4">EfficientNet-B4</h2>
            <p className="text-slate max-w-2xl mx-auto">
              Model berbasis EfficientNet-B4 dengan 18,59 juta parameter yang dioptimalkan untuk klasifikasi mammografi.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-white p-5 rounded-xl border border-light-silver shadow-sm text-center">
                <div className="font-jakarta text-2xl font-bold text-trust-teal mb-1">{m.value}</div>
                <div className="text-xs text-slate font-medium">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {ARCH_SECTIONS.map((sec) => (
              <div key={sec.title} className={`bg-gradient-to-r ${sec.color} p-5 rounded-xl border border-light-silver/50`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-jakarta text-sm font-bold text-charcoal">{sec.title}</h3>
                  <code className="text-xs font-mono text-slate bg-white/60 px-2 py-0.5 rounded border border-light-silver">{sec.code}</code>
                </div>
                <p className="text-sm text-slate leading-relaxed mb-0">{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-br from-trust-teal to-teal-dark rounded-3xl p-12 md:p-16 shadow-teal-glow">
          <h2 className="font-jakarta text-3xl font-bold text-white mb-4">Siap Melakukan Skrining?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Gunakan alat diagnostik kami untuk analisis citra mamografi secara cepat dan presisi. Hasil langsung dalam hitungan detik.
          </p>
          <Link
            href="/screening"
            className="inline-flex items-center gap-2 bg-white text-trust-teal px-8 py-4 rounded-xl font-jakarta font-bold text-sm hover:bg-clinical-pearl transition-all hover:-translate-y-[1px]"
          >
            Mulai Skrining Sekarang
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
