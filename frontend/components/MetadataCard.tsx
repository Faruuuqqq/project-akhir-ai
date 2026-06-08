'use client';

import React from 'react';
import { PatientMetadata } from '@/lib/types';
import { getDICOMViewType, getBreastDensityLabel, sanitizePatientId, formatStudyDate } from '@/lib/validators';

interface MetadataCardProps {
  metadata: PatientMetadata;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">{label}</p>
      <p className="text-sm font-medium text-charcoal">{children}</p>
    </div>
  );
}

function Unavailable() {
  return <span className="text-slate/50 italic text-xs">Tidak tersedia</span>;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({ metadata }) => {
  return (
    <div className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical font-inter">
      <h3 className="mb-6 font-jakarta text-sm font-semibold uppercase tracking-[0.1em] text-slate">Informasi Studi Klinis</h3>
      
      <div className="space-y-2">
        <MetaRow label="ID Pasien">
          {metadata.patientId ? (
            <span className="font-mono">{sanitizePatientId(metadata.patientId).replace('Patient ID: ', '')}</span>
          ) : <Unavailable />}
        </MetaRow>
        
        <MetaRow label="Tanggal Akuisisi">
          {metadata.studyDate ? (
            <span className="font-mono">{formatStudyDate(metadata.studyDate)}</span>
          ) : <Unavailable />}
        </MetaRow>
        
        <MetaRow label="Tipe Tampilan (View)">
          {metadata.viewType ? (
            <span>{getDICOMViewType(metadata.viewType)}</span>
          ) : <Unavailable />}
        </MetaRow>
        
        <MetaRow label="Usia">
          {metadata.age != null && metadata.age > 0 ? (
            <span className="font-mono">{metadata.age} <span className="font-sans text-xs text-slate">tahun</span></span>
          ) : <Unavailable />}
        </MetaRow>
        
        <MetaRow label="Kepadatan Jaringan (Density)">
          {metadata.breastDensity ? (
            <span>{getBreastDensityLabel(metadata.breastDensity)}</span>
          ) : <Unavailable />}
        </MetaRow>
      </div>
    </div>
  );
};