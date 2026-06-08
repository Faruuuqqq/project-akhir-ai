'use client';

import React from 'react';
import Link from 'next/link';

export default function ResearchPage() {
  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-trust-teal transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-trust-teal font-bold">Metodologi</span>
        </nav>
        <section className="text-center mb-16">
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-6">
            Arsitektur & Metodologi Riset
          </h1>
          <p className="text-lg leading-relaxed text-slate max-w-2xl mx-auto">
            Transparansi dalam pengembangan model AI untuk deteksi dini kanker payudara. 
            Kami menggabungkan ketelitian klinis dengan inovasi deep learning terbaru.
          </p>
        </section>

        <article className="prose prose-slate max-w-none">
          
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-jakarta text-xs font-bold uppercase tracking-[0.15em] text-trust-teal mb-3 block">
                  Dataset Utama
                </span>
                <h2 className="text-3xl font-jakarta font-bold text-charcoal mb-6 mt-0">
                  RSNA Kaggle Dataset
                </h2>
                <p className="text-charcoal leading-relaxed mb-8">
                  Model kami dilatih menggunakan dataset dari RSNA Screening Mammography Breast Cancer Detection. 
                  Dataset ini mencakup ribuan citra mammografi berkualitas tinggi dengan anotasi ahli radiologi.
                </p>
                
                <div className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical">
                  <h4 className="font-jakarta text-lg font-bold text-charcoal mb-3 mt-0">Tantangan Class Imbalance</h4>
                  <p className="text-sm italic text-slate mb-6">
                    "Hanya 2% dari total kasus yang positif kanker payudara."
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-2 flex-grow bg-light-silver rounded-full overflow-hidden flex">
                      <div className="w-[2%] bg-muted-rose"></div>
                      <div className="w-[98%] bg-trust-teal/20"></div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate">2% vs 98%</span>
                  </div>
                  
                  <p className="text-sm text-charcoal leading-relaxed mb-0">
                    Kami menggunakan teknik <strong>Weighted Binary Cross Entropy</strong> dan data augmentation 
                    khusus untuk memastikan sensitivitas terhadap kasus minoritas.
                  </p>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-medical h-[400px] bg-mri-black p-1 border border-light-silver/50">
                <svg viewBox="0 0 512 640" className="w-full h-full bg-gradient-to-br from-gray-900 to-black">
                  <defs>
                    <radialGradient id="breastGradient" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="#0F766E" stopOpacity="0.3"/>
                      <stop offset="70%" stopColor="#0F5F59" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#121417" stopOpacity="0.9"/>
                    </radialGradient>
                  </defs>
                  <rect width="512" height="640" fill="url(#breastGradient)"/>
                  <circle cx="256" cy="280" r="150" fill="none" stroke="#0F766E" strokeWidth="1" opacity="0.3"/>
                  <path d="M100,280 Q256,100 412,280" fill="none" stroke="#64748B" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.5"/>
                  <path d="M100,280 Q256,460 412,280" fill="none" stroke="#64748B" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.5"/>
                </svg>
              </div>
            </div>
          </section>

          <section className="mb-20 bg-white p-8 rounded-2xl border border-light-silver shadow-medical relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2 className="text-2xl font-jakarta font-bold text-charcoal mb-10 mt-0">Pipeline Pengolahan Citra</h2>
            
            <div className="grid md:grid-cols-4 gap-6 relative z-10">
              {[
                { step: '01', title: 'DICOM Preprocessing', desc: 'Konversi metadata raw ke format pixel array dengan presisi 16-bit.' },
                { step: '02', title: 'VOI LUT / Windowing', desc: 'Penerapan Value of Interest Look-Up Table untuk meningkatkan kontras jaringan.' },
                { step: '03', title: 'Normalisasi Citra', desc: 'Rescaling intensitas piksel ke rentang [0,1] dan reduksi noise artefak.' },
                { step: '04', title: 'Deep Learning Inference', desc: 'Ekstraksi fitur melalui CNN untuk klasifikasi probabilitas keganasan.' }
              ].map((item, i) => (
                <div key={i} className="bg-clinical-pearl p-6 rounded-xl border-t-4 border-trust-teal shadow-sm">
                  <div className="font-mono text-2xl font-bold text-trust-teal mb-3">{item.step}</div>
                  <h3 className="font-jakarta text-sm font-bold uppercase tracking-wide text-charcoal mb-2 mt-0">{item.title}</h3>
                  <p className="text-xs text-slate leading-relaxed mb-0">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <h2 className="text-2xl font-jakarta font-bold text-charcoal mb-4 mt-0">Etika & Limitasi</h2>
                <p className="text-charcoal leading-relaxed mb-8">
                  Kami berkomitmen pada akurasi diagnostik melalui pemantauan metrik kesalahan yang ketat.
                </p>
                
                <div className="p-5 bg-warm-amber/10 border-l-4 border-warning rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2 text-warning">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span className="font-bold text-sm uppercase tracking-widest">Disclaimer</span>
                  </div>
                  <p className="text-xs text-slate italic leading-relaxed mb-0">
                    AI ini bukan pengganti dokter. Semua hasil harus divalidasi oleh radiolog bersertifikat.
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-trust-teal/10 rounded-lg text-trust-teal shrink-0">
                      <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div>
                      <h4 className="font-jakarta text-lg font-bold text-charcoal mb-2 mt-0">Evaluasi Metrik: pF1</h4>
                      <p className="text-sm text-charcoal leading-relaxed mb-0">
                        Kami menggunakan <strong>Probabilistic F1 Score</strong>. Metrik ini menilai kemampuan model 
                        dalam mengkalibrasi confidence secara kontinu, yang jauh lebih relevan untuk diagnosis medis 
                        dibandingkan threshold biner konvensional.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-calm-blue/10 rounded-lg text-calm-blue shrink-0">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div>
                      <h4 className="font-jakarta text-lg font-bold text-charcoal mb-2 mt-0">Potensi Bias Data</h4>
                      <p className="text-sm text-charcoal leading-relaxed mb-0">
                        Dataset RSNA didominasi oleh populasi dari wilayah tertentu. Kami secara aktif melakukan 
                        validasi silang untuk memastikan model tetap akurat bagi berbagai profil demografis pasien.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </article>
      </main>
    </div>
  );
}