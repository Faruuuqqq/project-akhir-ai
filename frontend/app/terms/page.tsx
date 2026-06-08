import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 font-inter text-charcoal">
      <div className="mb-12">
        <h1 className="font-jakarta text-4xl font-bold mb-4">Syarat & Ketentuan Penggunaan</h1>
        <p className="text-slate">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <div className="p-6 bg-rose-50 border-l-4 border-muted-rose mb-8 rounded-r-lg">
          <h3 className="font-jakarta text-lg font-bold text-muted-rose mt-0 mb-2">Peringatan Klinis Penting</h3>
          <p className="mb-0 text-sm font-medium text-rose-900">
            Aplikasi ini adalah prototipe Clinical Decision Support System (CDSS) dan <strong>bukanlah perangkat medis yang sah untuk tujuan diagnostik final</strong>. Semua probabilitas AI dan rekomendasi BI-RADS yang dihasilkan harus diverifikasi secara independen oleh dokter ahli radiologi tersertifikasi.
          </p>
        </div>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">1. Penerimaan Syarat</h2>
        <p>
          Dengan mengakses dan menggunakan platform MammoAI Precision, Anda menyatakan setuju dan terikat oleh seluruh poin yang disebutkan dalam Syarat dan Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak mengunggah data medis apa pun ke sistem ini.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">2. Kewajiban Pengguna Profesional</h2>
        <p>
          Platform ini dirancang khusus untuk para profesional medis, peneliti, atau perekrut teknis. Jika Anda menggunakan sistem ini dengan data pasien yang nyata:
        </p>
        <ul>
          <li>Anda memikul tanggung jawab penuh terhadap keabsahan hak untuk memproses citra radiologi tersebut.</li>
          <li>Anda wajib tidak mengandalkan hasil yang diberikan oleh AI untuk mengarahkan pengobatan pasien secara langsung.</li>
        </ul>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">3. Keterbatasan Kewajiban (Liability)</h2>
        <p>
          Pengembang sistem ini tidak bertanggung jawab atas kerugian fisik, mental, finansial, maupun malapraktik medis yang disebabkan oleh salah tafsir terhadap probabilitas indikasi kanker payudara yang disajikan oleh algoritma sistem kami.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">4. Hak Kekayaan Intelektual</h2>
        <p>
          Kode sumber, estetika, desain logo (MammoAI), dan antarmuka adalah hak milik dari pengembang proyek ini. Dataset yang mungkin telah digunakan untuk melatih model (RSNA Breast Cancer Screening) tunduk pada lisensi aslinya.
        </p>
      </div>
    </main>
  );
}
