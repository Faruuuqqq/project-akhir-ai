'use client';

import React from 'react';
import { PatientMetadata } from '@/lib/types';
import { getDICOMViewType, getBreastDensityLabel, sanitizePatientId, formatStudyDate } from '@/lib/validators';

interface MetadataCardProps {
  metadata: PatientMetadata;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({ metadata }) => {
  return (
    <div className="rounded-2xl border border-light-silver bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-charcoal">Study Information</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">Patient ID</p>
          <p className="font-mono text-charcoal">{sanitizePatientId(metadata.patientId).replace('Patient ID: ', '')}</p>
        </div>
        
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">Study Date</p>
          <p className="text-charcoal">{formatStudyDate(metadata.studyDate)}</p>
        </div>
        
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">View Type</p>
          <p className="text-charcoal">{getDICOMViewType(metadata.viewType)}</p>
        </div>
        
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">Age</p>
          <p className="text-charcoal">{metadata.age} years</p>
        </div>
        
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">Breast Density</p>
          <p className="text-charcoal">{getBreastDensityLabel(metadata.breastDensity)}</p>
        </div>
      </div>
    </div>
  );
};