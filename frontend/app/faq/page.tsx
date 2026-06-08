'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Produk & Akurasi',
    q: 'Seberapa akurat model AI ini?',
    a: 'Model EfficientNet-B4 kami (18,59M parameter) dilatih pada dataset RSNA Screening Mammography yang mencakup ribuan citra dengan anotasi ahli radiologi. AUC yang dicapai dalam validasi internal adalah 0,87–0,92. Namun, akurasi sebenarnya bergantung pada kualitas citra, kepadatan jaringan payudara, dan karakteristik demografis pasien. Kami merekomendasikan korelasi klinis untuk setiap hasil.',
  },
  {
    category: 'Produk & Akurasi',
    q: 'Apa perbedaan alat ini dengan mamografi konvensional?',
    a: 'Alat ini bukan pengganti mamografi konvensional, melainkan sistem pendukung keputusan (Clinical Decision Support). AI menganalisis citra yang sudah ada dan memberikan probabilitas keganasan plus interpretasi BI-RADS. Keputusan diagnosis akhir tetap sepenuhnya oleh radiolog bersertifikat.',
  },
  {
    category: 'Produk & Akurasi',
    q: 'Apa itu BI-RADS?',
    a: 'BI-RADS (Breast Imaging Reporting and Data System) adalah sistem standarisasi pelaporan radiologi yang dikembangkan oleh American College of Radiology. Skala 1–5: 1 (Negatif) hingga 5 (Ganas). Sistem kami menerjemahkan probabilitas AI ke dalam kategori BI-RADS untuk memudahkan interpretasi klinisi.',
  },
  {
    category: 'Teknis & Data',
    q: 'Format file apa saja yang didukung?',
    a: 'Saat ini mendukung DICOM (.dcm) dan PNG. DICOM adalah standar industri untuk pencitraan medis dan mempertahankan metadata lengkap (data pasien, parameter akuisisi). PNG digunakan untuk pengujian dan demonstrasi. Format tambahan seperti JPEG, TIFF, dan DICOM terkompresi sedang dalam pengembangan.',
  },
  {
    category: 'Teknis & Data',
    q: 'Apakah data pasien saya aman?',
    a: 'Ya. Data dienkripsi端-to-end menggunakan protokol HTTPS/TLS. File dihapus dari memori server segera setelah analisis selesai. Tidak ada data yang disimpan secara permanen. Sistem kami tidak menggunakan database — hanya cache in-memory ephemeral. Lihat kebijakan privasi untuk detail lebih lanjut.',
  },
  {
    category: 'Teknis & Data',
    q: 'Berapa lama waktu analisis?',
    a: 'Rata-rata 3–7 detik untuk satu citra di lingkungan server CPU (Railway). Ini mencakup preprocessing DICOM, inferensi model (forward pass), dan generasi heatmap Grad-CAM. Waktu dapat bervariasi tergantung ukuran file dan beban server.',
  },
  {
    category: 'Teknis & Data',
    q: 'Apa yang dimaksud dengan confidence score?',
    a: 'Confidence score (0–100%) merepresentasikan seberapa yakin model terhadap prediksinya. Diukur sebagai 2 × |probabilitas − 0,5| — semakin mendekati 0 atau 1, semakin tinggi confidence. Skor rendah menandakan bahwa input berada di wilayah decision boundary model dan memerlukan evaluasi lebih lanjut.',
  },
  {
    category: 'Klinis & Penggunaan',
    q: 'Apakah alat ini bisa digunakan untuk diagnosis mandiri?',
    a: 'Tidak. Alat ini ditujukan untuk digunakan oleh tenaga medis profesional sebagai alat bantu skrining. Pasien tidak boleh menggunakan hasil analisis untuk mendiagnosis diri sendiri. Selalu konsultasikan dengan dokter atau radiolog untuk interpretasi hasil dan tindakan medis selanjutnya.',
  },
  {
    category: 'Klinis & Penggunaan',
    q: 'Apakah model bisa mendeteksi semua jenis kanker payudara?',
    a: 'Model dilatih untuk mendeteksi keganasan berdasarkan citra mammografi. Namun, beberapa jenis kanker (misalnya, kanker lobular invasif) bisa lebih sulit terdeteksi pada mamografi karena pola pertumbuhannya. Model juga memiliki keterbatasan pada payudara dengan kepadatan sangat tinggi (BI-RADS D). Skrining komplementer seperti USG atau MRI mungkin direkomendasikan.',
  },
  {
    category: 'Klinis & Penggunaan',
    q: 'Bagaimana cara membaca hasil heatmap?',
    a: 'Heatmap Grad-CAM menunjukkan area dalam citra yang paling memengaruhi keputusan AI. Warna biru (dingin) menandakan kontribusi rendah, sementara merah (panas) menandakan area fokus. Pada kasus positif, area merah sering berkorelasi dengan lokasi lesi. Heatmap bersifat indikatif dan harus divalidasi oleh radiolog.',
  },
  {
    category: 'Teknis & Pengembangan',
    q: 'Apakah model bisa di-deploy di lingkungan rumah sakit?',
    a: 'Ya, backend FastAPI dapat di-deploy di server on-premise atau cloud (Railway, AWS, GCP). Kami menyediakan Dockerfile untuk containerisasi. Untuk deployment skala rumah sakit, disarankan menggunakan GPU (CUDA) untuk mempercepat inferensi dan Redis untuk caching file. Hubungi tim kami untuk konsultasi deployment.',
  },
  {
    category: 'Teknis & Pengembangan',
    q: 'Model file apa yang digunakan? .pth atau .safetensors?',
    a: 'Keduanya didukung. Model default menggunakan format .pth (PyTorch) dengan weights_only=True untuk keamanan serialisasi. Juga mendukung .safetensors untuk kompatibilitas dengan ekosistem Hugging Face. Cukup atur MODEL_PATH di environment variable.',
  },
];

const CATEGORIES = Array.from(new Set(FAQS.map((f) => f.category)));

function FaqAccordion({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-light-silver rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-medical">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-jakarta text-sm md:text-base font-bold text-charcoal leading-snug flex-1">{item.q}</span>
        <span className={`material-symbols-outlined shrink-0 text-slate transition-transform duration-300 ${isOpen ? 'rotate-180 text-trust-teal' : ''}`}>
          expand_more
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6">
              <div className="w-8 h-px bg-trust-teal/30 mb-4" />
              <p className="text-sm text-slate leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const filtered = activeCategory === 'Semua' ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-trust-teal transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-trust-teal font-bold">FAQ</span>
        </nav>

        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-calm-blue/5 rounded-full border border-calm-blue/10 text-calm-blue text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">help</span>
            Pertanyaan Umum
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
            Ada Pertanyaan?
          </h1>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Temukan jawaban seputar penggunaan, teknologi, dan aspek klinis alat skrining AI kami.
          </p>
        </section>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Semua', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-trust-teal text-white shadow-teal-glow'
                  : 'bg-white border border-light-silver text-slate hover:border-trust-teal/30 hover:text-trust-teal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-slate py-12">Tidak ada pertanyaan untuk kategori ini.</p>
          ) : (
            filtered.map((item, i) => {
              const globalIndex = FAQS.indexOf(item);
              return (
                <FaqAccordion
                  key={globalIndex}
                  item={item}
                  isOpen={openIndex === globalIndex}
                  onToggle={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                />
              );
            })
          )}
        </div>

        {/* Still have questions */}
        <section className="mt-16 text-center bg-white rounded-3xl border border-light-silver p-10 shadow-medical">
          <div className="w-12 h-12 rounded-xl bg-trust-teal/5 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-trust-teal">forum</span>
          </div>
          <h2 className="font-jakarta text-xl font-bold text-charcoal mb-2">Masih Punya Pertanyaan?</h2>
          <p className="text-sm text-slate mb-6 max-w-md mx-auto">
            Tim kami siap membantu Anda. Kirimkan pesan melalui halaman kontak.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-trust-teal text-white px-6 py-3 rounded-xl font-jakarta font-bold text-sm hover:bg-teal-dark transition-all hover:-translate-y-[1px]"
          >
            Hubungi Kami
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
