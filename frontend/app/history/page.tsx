'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScreening } from '@/contexts/ScreeningContext';
import { HistoryRecord } from '@/lib/types';
import { BIRADS_LABELS } from '@/lib/constants';

export default function HistoryPage() {
  const { getHistory, deleteFromHistory, clearHistory } = useScreening();
  const history = getHistory();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setDeleteConfirmId(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Hapus semua riwayat? Tindakan ini tidak dapat dibatalkan.')) {
      clearHistory();
    }
  };

  return (
    <div className="bg-clinical-pearl font-inter text-charcoal">
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-32">
        <nav className="flex items-center gap-2 mb-8 text-xs font-mono text-slate" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ribbon-pink transition-colors">Beranda</Link>
          <span className="text-light-silver">/</span>
          <span className="text-ribbon-pink font-bold">Riwayat Analisis</span>
        </nav>

        {/* Header */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ribbon-pink/5 rounded-full border border-ribbon-pink/10 text-ribbon-pink text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-sm">history</span>
            Riwayat Lokal
          </div>
          <h1 className="font-jakarta text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
            Riwayat Analisis
          </h1>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Lihat semua hasil skrining yang pernah Anda lakukan. Data disimpan secara lokal di perangkat Anda.
          </p>
        </section>

        {history.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-light-silver/30 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-slate">history</span>
            </div>
            <h2 className="font-jakarta text-2xl font-bold text-charcoal mb-2">Belum Ada Riwayat</h2>
            <p className="text-slate max-w-md mx-auto mb-8">
              Setiap hasil analisis yang Anda simpan akan muncul di sini. Mulai dengan melakukan skrining.
            </p>
            <Link
              href="/screening"
              className="inline-flex items-center gap-2 bg-ribbon-pink text-white px-6 py-3 rounded-lg font-jakarta font-semibold hover:bg-ribbon-dark transition-all"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              Mulai Skrining
            </Link>
          </motion.div>
        ) : (
          <>
            {/* History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-light-silver shadow-medical overflow-hidden mb-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-silver bg-clinical-pearl">
                      <th className="px-4 sm:px-6 py-4 text-left font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Tanggal</th>
                      <th className="hidden sm:table-cell px-6 py-4 text-left font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">ID Pasien</th>
                      <th className="px-4 sm:px-6 py-4 text-left font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">BI-RADS</th>
                      <th className="px-4 sm:px-6 py-4 text-left font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Probabilitas</th>
                      <th className="hidden md:table-cell px-6 py-4 text-left font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Temuan</th>
                      <th className="px-4 sm:px-6 py-4 text-center font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id} className="border-b border-light-silver hover:bg-clinical-pearl/30 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-charcoal font-medium whitespace-nowrap">{record.date.split(' ')[0]}</td>
                        <td className="hidden sm:table-cell px-6 py-4 text-sm font-mono text-slate">{record.patientId || '-'}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                            parseInt(record.biRads.replace(/\D/g, '')) >= 4
                              ? 'bg-muted-rose/10 text-muted-rose'
                              : 'bg-calm-blue/10 text-calm-blue'
                          }`}>
                            {record.biRads}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: record.isHighRisk ? '#BE123C' : '#3B82F6',
                              }}
                            />
                            <span className="text-xs sm:text-sm font-mono font-bold text-charcoal">{record.probabilityPercent}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm text-slate">{record.findingsCount} temuan</td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <button
                            onClick={() => setDeleteConfirmId(record.id)}
                            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-muted-rose hover:text-muted-rose/80 transition-colors p-2 -m-2"
                            aria-label={`Hapus riwayat tanggal ${record.date.split(' ')[0]}`}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Delete Confirmation */}
            {deleteConfirmId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <div className="bg-white rounded-2xl p-6 max-w-sm shadow-lg">
                  <h3 className="font-jakarta text-lg font-bold text-charcoal mb-2">Hapus Riwayat?</h3>
                  <p className="text-sm text-slate mb-6">
                    Riwayat analisis ini akan dihapus secara permanen dari perangkat Anda.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 px-4 py-2 rounded-lg border border-light-silver bg-white text-charcoal font-semibold hover:bg-clinical-pearl transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirmId)}
                      className="flex-1 px-4 py-2 rounded-lg bg-muted-rose text-white font-semibold hover:bg-muted-rose/80 transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Clear All Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-slate hover:text-muted-rose transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Hapus Semua
              </button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
