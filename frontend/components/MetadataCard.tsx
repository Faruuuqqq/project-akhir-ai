'use client';

import React from 'react';
import { PatientMetadata } from '@/lib/types';
import { getDICOMViewType, getBreastDensityLabel, sanitizePatientId, formatStudyDate } from '@/lib/validators';

interface MetadataCardProps {
  metadata: PatientMetadata;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({ metadata }) => {
  return (
    <div className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical font-inter">
      <h3 className="mb-6 font-jakarta text-sm font-semibold uppercase tracking-[0.1em] text-slate">Informasi Studi Klinis</h3>
      
      <div className="space-y-2">
        <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">ID Pasien</p>
          <p className="font-mono text-sm font-medium text-charcoal">{sanitizePatientId(metadata.patientId).replace('Patient ID: ', '')}</p>
        </div>
        
        <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">Tanggal Akuisisi</p>
          <p className="font-mono text-sm text-charcoal">{formatStudyDate(metadata.studyDate)}</p>
        </div>
        
        <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">Tipe Tampilan (View)</p>
          <p className="text-sm font-medium text-charcoal">{getDICOMViewType(metadata.viewType)}</p>
        </div>
        
        <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">Usia</p>
          <p className="font-mono text-sm text-charcoal">{metadata.age} <span className="font-sans text-xs text-slate">tahun</span></p>
        </div>
        
        <div className="group hover:bg-clinical-pearl px-3 py-2 -mx-3 rounded-md transition-colors">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate group-hover:text-trust-teal transition-colors">Kepadatan Jaringan (Density)</p>
          <p className="text-sm font-medium text-charcoal">{getBreastDensityLabel(metadata.breastDensity)}</p>
        </div>
      </div>
    </div>
  );
};