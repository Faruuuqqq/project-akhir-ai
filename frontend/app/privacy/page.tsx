import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 font-inter text-charcoal">
      <div className="mb-12">
        <h1 className="font-jakarta text-4xl font-bold mb-4">Kebijakan Privasi</h1>
        <p className="text-slate">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="lead text-lg mb-8">
          MammoAI Precision ("kami", "milik kami") berkomitmen penuh untuk melindungi privasi dan keamanan data medis Anda. Kebijakan ini menguraikan bagaimana kami memproses data dalam lingkungan aplikasi kami.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">1. Pemrosesan Data In-Memory</h2>
        <p>
          Aplikasi ini dirancang sebagai MVP (Minimum Viable Product) untuk tujuan demonstrasi klinis. <strong>Semua gambar DICOM dan PNG yang diunggah diproses secara in-memory.</strong> Artinya, setelah sesi analisis selesai dan Anda menutup peramban, tidak ada satu pun piksel dari gambar medis Anda yang disimpan, dicadangkan, atau didistribusikan ke peladen kami.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">2. Anonimisasi Data Pasien</h2>
        <p>
          Meskipun sistem kami mengekstrak metadata dari file DICOM (seperti Usia dan ID Pasien) untuk ditampilkan pada dasbor klinis Anda, kami mengharuskan seluruh pengguna untuk memastikan bahwa file yang diunggah telah dianonimkan (de-identified) sesuai dengan protokol privasi medis standar (seperti HIPAA di AS, GDPR di Eropa, atau UU PDP di Indonesia).
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">3. Persetujuan Informed Consent</h2>
        <p>
          Sebelum menggunakan ruang kerja (Workspace) untuk mengunggah atau melihat file, Anda diwajibkan untuk menyetujui pernyataan persetujuan. Kami melacak persetujuan ini hanya melalui <code>localStorage</code> di peramban Anda dan tidak pernah menyimpannya di basis data eksternal.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">4. Penggunaan Model AI</h2>
        <p>
          Algoritma klasifikasi dan Grad-CAM yang digunakan oleh platform ini tidak dilatih secara real-time menggunakan gambar yang Anda unggah. Gambar yang Anda unggah murni digunakan untuk tujuan inferensi dan evaluasi.
        </p>

        <h2 className="font-jakarta text-2xl font-bold mt-10 mb-4">5. Kontak</h2>
        <p>
          Jika Anda memiliki pertanyaan seputar cara kerja privasi data dalam prototipe ini, Anda dapat menghubungi tim pengembang sistem RSNA Mammography AI.
        </p>
      </div>
    </main>
  );
}
