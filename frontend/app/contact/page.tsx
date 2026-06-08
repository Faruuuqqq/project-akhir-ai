'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type FormData = {
  name: string;
  email: string;
  category: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const CATEGORIES = [
  'Pertanyaan Medis',
  'Kerja Sama Rumah Sakit',
  'Teknis & Deployment',
  'Saran & Masukan',
  'Lainnya',
];

const CONTACT_CHANNELS = [
  { icon: 'mail', label: 'Email', value: 'hello@mammoai.id', href: 'mailto:hello@mammoai.id' },
  { icon: 'call', label: 'Telepon', value: '+62 812 3456 7890', href: 'tel:+6281234567890' },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', category: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Nama harus diisi.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email tidak valid.';
    if (!form.category) e.category = 'Pilih kategori pesan.';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Pesan minimal 10 karakter.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-trust-teal transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-trust-teal font-bold">Kontak</span>
        </nav>

        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-trust-teal/5 rounded-full border border-trust-teal/10 text-trust-teal text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">forum</span>
            Hubungi Kami
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
            Mari Berdiskusi
          </h1>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Punya pertanyaan tentang platform, tertarik kerja sama, atau butuh bantuan deployment?
            Tim kami siap merespon dalam 1×24 jam.
          </p>
        </section>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Channels */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical">
              <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-4">Saluran Resmi</h2>
              <div className="space-y-4">
                {CONTACT_CHANNELS.map((ch) => (
                  <a
                    key={ch.label}
                    href={ch.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-clinical-pearl border border-light-silver hover:border-trust-teal/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-trust-teal/5 flex items-center justify-center text-trust-teal group-hover:bg-trust-teal/10 transition-colors">
                      <span className="material-symbols-outlined">{ch.icon}</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate font-medium">{ch.label}</div>
                      <div className="font-jakarta text-sm font-bold text-charcoal">{ch.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-light-silver shadow-medical">
              <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.1em] text-charcoal mb-3">Respon Cepat</h2>
              <p className="text-sm text-slate leading-relaxed mb-0">
                Tim kami merespon setiap pertanyaan dalam 1×24 jam kerja. Untuk pertanyaan medis
                mendesak, hubungi fasilitas kesehatan terdekat.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-white p-10 rounded-2xl border border-light-silver shadow-medical text-center">
                <div className="w-16 h-16 rounded-2xl bg-trust-teal/5 flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-trust-teal">check_circle</span>
                </div>
                <h2 className="font-jakarta text-2xl font-bold text-charcoal mb-3">Pesan Terkirim!</h2>
                <p className="text-sm text-slate mb-6 max-w-sm mx-auto">
                  Terima kasih, {form.name}. Tim kami akan menghubungi Anda melalui {form.email} dalam 1×24 jam.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: '', message: '' }); }}
                  className="inline-flex items-center gap-2 bg-trust-teal text-white px-6 py-3 rounded-xl font-jakarta font-bold text-sm hover:bg-teal-dark transition-all"
                >
                  Kirim Pesan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-light-silver shadow-medical space-y-5" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-jakarta text-xs font-bold uppercase tracking-[0.05em] text-charcoal mb-2">
                    Nama Lengkap <span className="text-muted-rose">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-clinical-pearl text-charcoal text-sm transition-all focus:outline-none focus:ring-2 focus:ring-trust-teal/30 ${
                      errors.name ? 'border-muted-rose' : 'border-light-silver'
                    }`}
                    placeholder="dr. Andi Pratama"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-muted-rose flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">error</span>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-jakarta text-xs font-bold uppercase tracking-[0.05em] text-charcoal mb-2">
                    Email <span className="text-muted-rose">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-clinical-pearl text-charcoal text-sm transition-all focus:outline-none focus:ring-2 focus:ring-trust-teal/30 ${
                      errors.email ? 'border-muted-rose' : 'border-light-silver'
                    }`}
                    placeholder="andi@rumahsakit.id"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-muted-rose flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">error</span>{errors.email}</p>}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block font-jakarta text-xs font-bold uppercase tracking-[0.05em] text-charcoal mb-2">
                    Kategori <span className="text-muted-rose">*</span>
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-clinical-pearl text-charcoal text-sm transition-all focus:outline-none focus:ring-2 focus:ring-trust-teal/30 ${
                      errors.category ? 'border-muted-rose' : 'border-light-silver'
                    }`}
                  >
                    <option value="">Pilih kategori...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="mt-1.5 text-xs text-muted-rose flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">error</span>{errors.category}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-jakarta text-xs font-bold uppercase tracking-[0.05em] text-charcoal mb-2">
                    Pesan <span className="text-muted-rose">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-clinical-pearl text-charcoal text-sm transition-all focus:outline-none focus:ring-2 focus:ring-trust-teal/30 resize-y ${
                      errors.message ? 'border-muted-rose' : 'border-light-silver'
                    }`}
                    placeholder="Jelaskan pertanyaan atau kebutuhan Anda secara singkat..."
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-muted-rose flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">error</span>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-trust-teal text-white py-3.5 rounded-xl font-jakarta font-bold text-sm hover:bg-teal-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Mengirim...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">send</span> Kirim Pesan</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
