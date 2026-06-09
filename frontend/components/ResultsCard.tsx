'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult, FindingDetail } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { useScreening } from '@/contexts/ScreeningContext';

interface ResultsCardProps {
  analysis: AnalysisResult;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function FindingRow({ finding }: { finding: FindingDetail }) {
  const isSuspicious = finding.biRadsAssessment === 'BI-RADS 4' || finding.biRadsAssessment === 'BI-RADS 5';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-light-silver last:border-b-0">
      <span className={`material-symbols-outlined mt-0.5 ${isSuspicious ? 'text-muted-rose' : 'text-ribbon-pink'}`}>
        {finding.type === 'Massa' ? 'circle' : finding.type === 'Kalsifikasi' ? 'grain' : finding.type === 'Distorsi Arsitektur' ? 'width' : 'right_panel_close'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-jakarta text-sm font-bold text-charcoal">{finding.type}</span>
          {finding.sizeMm && (
            <span className="font-mono text-xs text-slate">{finding.sizeMm} mm</span>
          )}
          <span className={`ml-auto font-jakarta text-[10px] font-bold uppercase tracking-[0.1em] ${isSuspicious ? 'text-muted-rose' : 'text-calm-blue'}`}>
            {finding.biRadsAssessment}
          </span>
        </div>
        <p className="text-xs text-slate mb-1.5">{finding.location} — {finding.side === 'L' ? 'Payudara Kiri' : finding.side === 'R' ? 'Payudara Kanan' : finding.side}</p>
        <div className="flex flex-wrap gap-1.5">
          {finding.characteristics.map((c, i) => (
            <span key={i} className="rounded-full bg-clinical-pearl px-2.5 py-0.5 font-jakarta text-[10px] font-medium text-slate">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ analysis }) => {
  const { saveToHistory } = useScreening();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveToHistory();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isProbHigh = analysis.probability > 0.5;
  const scoreColor = isProbHigh ? COLORS.semanticAlert : COLORS.semanticNormal;
  const labelRisk = isProbHigh ? 'TINGGI' : 'RENDAH';
  const biRadsLevel = parseInt(analysis.biRads.replace(/\D/g, '')) || 0;
  const findings = analysis.findings || [];

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-6 font-inter"
    >
      {/* REPORT HEADER */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-light-silver bg-white p-6 shadow-medical flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1 text-ribbon-pink">
            <span className="material-symbols-outlined text-base">description</span>
            <span className="font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-slate">Laporan Hasil Skrining</span>
          </div>
          <h2 className="font-jakarta text-lg font-bold text-charcoal">Ringkasan Diagnostik AI</h2>
          {analysis.impression && (
            <p className="mt-2 text-sm leading-relaxed text-charcoal">{analysis.impression}</p>
          )}
          {analysis.breastComposition && (
            <p className="mt-2 text-xs text-slate">
              <span className="font-semibold">Komposisi Payudara:</span> {analysis.breastComposition}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            saved 
              ? 'bg-ribbon-pink/10 text-ribbon-pink border border-ribbon-pink/20'
              : 'bg-white text-charcoal border border-light-silver hover:bg-clinical-pearl hover:border-ribbon-pink/30 hover:text-ribbon-pink'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">{saved ? 'check_circle' : 'bookmark_add'}</span>
          <span className="hidden sm:inline">{saved ? 'Tersimpan di Riwayat' : 'Simpan ke Riwayat Lokal'}</span>
        </button>
      </motion.div>

      {/* AI PROBABILITY SCORE */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical transition-all hover:shadow-pink-glow hover:border-ribbon-pink/30 group">
        <p className="mb-4 font-jakarta text-sm font-semibold uppercase tracking-[0.1em] text-slate">
          Probabilitas Indikasi Malignansi
        </p>

        <div className="flex items-baseline gap-3 mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-current to-transparent opacity-[0.03] blur-xl" style={{ color: scoreColor }} />
          <div
            className="font-mono text-[5rem] font-medium tracking-tight leading-none relative z-10"
            style={{ color: scoreColor, textShadow: `0 4px 20px ${scoreColor}40` }}
          >
            {analysis.probabilityPercent}
          </div>
          <span
            className="font-jakarta text-sm font-bold uppercase tracking-widest relative z-10"
            style={{ color: scoreColor }}
          >
            {labelRisk}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-jakarta text-xs font-semibold uppercase tracking-widest text-slate">Keyakinan AI</span>
            <span className="font-mono text-xs font-bold text-slate">
              {(analysis.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-light-silver/50 shadow-inner">
            <motion.div
              className="h-full rounded-full relative shadow-[0_0_12px_rgba(0,0,0,0.2)]"
              style={{ backgroundColor: scoreColor, boxShadow: `0 0 10px ${scoreColor}80` }}
              initial={{ width: 0 }}
              animate={{ width: `${analysis.probability * 100}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/40" />
            </motion.div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-light-silver">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate">Waktu Pemrosesan</span>
            <span className="font-mono font-medium text-charcoal">{analysis.processingTimeMs} ms</span>
          </div>
        </div>
      </motion.div>

      {/* FINDINGS */}
      {findings.length > 0 && (
        <motion.div variants={fadeUp} className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-ribbon-pink material-symbols-outlined">list_alt</span>
            <h4 className="font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">
              Temuan Radiologis ({findings.length})
            </h4>
          </div>
          <div className="divide-y divide-light-silver">
            {findings.map((f, i) => (
              <FindingRow key={i} finding={f} />
            ))}
          </div>
        </motion.div>
      )}

      {/* BI-RADS */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical border-l-4"
        style={{ borderLeftColor: biRadsLevel >= 4 ? COLORS.semanticAlert : biRadsLevel >= 3 ? COLORS.warning : COLORS.semanticNormal }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-slate">Kategori</span>
          {biRadsLevel >= 4 && (
            <motion.span 
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-muted-rose/10 px-2 py-0.5 font-jakarta text-[10px] font-bold text-muted-rose uppercase tracking-wider border border-muted-rose/20"
            >
              Perhatian Klinis
            </motion.span>
          )}
        </div>
        <h4 className="mb-2 font-jakarta text-xl font-bold text-charcoal">{analysis.biRads}</h4>
        <p className="mb-4 text-sm text-charcoal font-medium">{analysis.biRadsDescription}</p>
        <div className="bg-clinical-pearl px-4 py-3 rounded-lg border-l-2 border-ribbon-pink">
          <p className="text-sm font-medium text-slate">
            <strong className="text-charcoal font-bold">Rekomendasi:</strong> {analysis.biRadsRecommendation}
          </p>
        </div>
      </motion.div>

      {/* AI EXPLANATION */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical">
        <div className="flex items-center gap-2 mb-4 text-ribbon-pink">
          <span className="material-symbols-outlined">analytics</span>
          <h4 className="font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Analisis AI</h4>
        </div>
        <p className="text-sm leading-relaxed text-charcoal">{analysis.explanation}</p>
      </motion.div>
    </motion.div>
  );
};
