'use client';

import React from 'react';
import { COLORS } from '@/lib/constants';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div
      className="rounded-lg border-l-4 bg-ribbon-orange/10 p-5 shadow-sm"
      style={{ borderColor: COLORS.warning }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: COLORS.warning }}>
        <span className="material-symbols-outlined text-[20px]">warning</span>
        <p className="text-xs font-bold uppercase tracking-[0.1em]">
          Disclaimer Medis
        </p>
      </div>
      <p className="text-xs italic leading-relaxed text-slate">
        Hasil ini dihasilkan oleh algoritma Artificial Intelligence (AI) dan dimaksudkan 
        <strong> hanya untuk dukungan keputusan klinis investigasional</strong>. 
        Sistem ini BUKAN pengganti diagnosis medis profesional. 
        Semua temuan harus divalidasi dan dikonfirmasi oleh dokter spesialis radiologi 
        atau onkologi bersertifikat sebelum pengambilan tindakan medis apa pun.
      </p>
    </div>
  );
};