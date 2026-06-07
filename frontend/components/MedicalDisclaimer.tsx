'use client';

import React from 'react';
import { COLORS } from '@/lib/constants';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div
      className="rounded-lg border-l-4 bg-orange-50 p-4"
      style={{ borderColor: COLORS.warmAmber }}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.warmAmber }}>
        ⚠️ Medical Disclaimer
      </p>
      <p className="text-xs italic leading-relaxed text-slate">
        This analysis is based on artificial intelligence and is <strong>NOT</strong> a clinical diagnosis. 
        AI probability does not confirm or rule out cancer. Always consult a qualified radiologist for 
        official diagnosis and treatment decisions.
      </p>
    </div>
  );
};