/**
 * frontend/components/UploadZone.tsx
 * File upload component with drag-drop functionality
 * Allows users to upload DICOM or PNG mammogram files
 * Features: Drag-drop zone, file validation, error display, demo button
 */

'use client';

import React, { useRef, useState } from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { validateFile } from '@/lib/validators';
import { motion } from 'framer-motion';

/**
 * Props for UploadZone component
 */
interface UploadZoneProps {
  onDemoClick: () => void;
}

/**
 * UploadZone component
 * Main upload area with drag-drop and file validation
 */
export function UploadZone({ onDemoClick }: UploadZoneProps) {
  const { uploadFile, loading, error, clearError, consentGiven, setConsent } = useScreening();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Handle drag over event
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Handle file processing
   */
  const handleFile = async (file: File) => {
    setLocalError(null);
    clearError();

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    // Upload file
    try {
      await uploadFile(file);
    } catch (err) {
      // Error is already set in context, no need to set localError
      console.error('Upload failed:', err);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  /**
   * Trigger file input click
   */
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Display error from context or local validation
  const displayError = error || localError;

  return (
    <div className="w-full font-inter">
      {/* Informed Consent Card */}
      <div className="bg-white p-8 rounded-2xl shadow-medical border border-light-silver/50 mb-6">
        <div className="flex items-center gap-2 mb-4 text-trust-teal">
          <span className="material-symbols-outlined">fact_check</span>
          <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.1em]">Persetujuan Pasien</h2>
        </div>
        <p className="text-xs leading-relaxed text-slate mb-6">
          Saya mengonfirmasi bahwa data pasien telah dianonimkan sesuai dengan protokol HIPAA/GDPR dan pasien telah memberikan persetujuan untuk analisis berbasis kecerdasan buatan.
        </p>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            className="mt-0.5 w-4 h-4 rounded border-light-silver text-trust-teal focus:ring-trust-teal cursor-pointer"
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span className="text-sm font-medium text-charcoal select-none group-hover:text-trust-teal transition-colors">Saya menyetujui seluruh syarat & ketentuan medis.</span>
        </label>
      </div>

      {/* Upload Zone */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{ scale: dragActive ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-16 transition-colors duration-300 flex flex-col items-center justify-center text-center ${
            dragActive
              ? 'border-trust-teal bg-trust-teal/5 shadow-teal-glow'
              : 'border-light-silver bg-white hover:border-trust-teal/50 hover:bg-clinical-pearl'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".dcm,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={loading}
        />
        
        {/* SVG Icon */}
        <div className={`mb-6 transition-colors ${dragActive ? 'text-trust-teal' : 'text-slate'}`}>
          <span className="material-symbols-outlined text-[48px]">cloud_upload</span>
        </div>

        <h3 className="mb-2 font-jakarta text-xl font-bold text-charcoal">
          {dragActive ? 'Lepaskan gambar untuk analisis' : 'Unggah Berkas Mamografi'}
        </h3>
        <p className="mb-8 text-sm text-slate font-medium">
          Format: .DCM, .PNG (Maks. 50MB)
        </p>

        <button
          className="rounded-lg bg-trust-teal px-8 py-3 font-semibold text-white shadow-teal-glow transition-all hover:bg-teal-dark hover:shadow-teal-glow-hover hover:-translate-y-[1px] tracking-wide"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            if (!consentGiven) {
              setLocalError("Mohon setujui syarat & ketentuan medis terlebih dahulu sebelum mengunggah.");
              return;
            }
            handleBrowseClick();
          }}
        >
          {loading ? 'Memproses...' : 'Pilih Berkas'}
        </button>
      </motion.div>

      {/* Error Message */}
      {displayError && (
        <div className="mt-6 rounded-lg border-l-4 border-muted-rose bg-rose-50 p-5 flex items-start gap-3" role="alert" aria-live="polite">
          <span className="material-symbols-outlined text-muted-rose" aria-hidden="true">error</span>
          <p className="text-sm font-medium text-muted-rose">{displayError}</p>
        </div>
      )}

      {/* Demo Option */}
      <div className="mt-10 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate">Tidak ada berkas?</p>
        <button
          onClick={() => {
            if (!consentGiven) {
              setLocalError("Mohon setujui syarat & ketentuan medis terlebih dahulu.");
              return;
            }
            onDemoClick();
          }}
          disabled={loading}
          className="rounded-lg border border-light-silver bg-white px-8 py-3 font-semibold text-charcoal transition-all hover:bg-clinical-pearl disabled:opacity-50 hover:shadow-sm"
        >
          Coba Data Demo Klinis
        </button>
      </div>
    </div>
  );
}
