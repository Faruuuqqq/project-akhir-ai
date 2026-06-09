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
      <div className="bg-gradient-to-br from-ribbon-pink/[0.02] to-ribbon-pink/[0.05] p-8 rounded-2xl shadow-sm border border-ribbon-pink/20 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[100px]">gavel</span>
        </div>
        <div className="flex items-center gap-2 mb-4 text-ribbon-pink relative z-10">
          <span className="material-symbols-outlined">fact_check</span>
          <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.1em]">Persetujuan Klinis</h2>
        </div>
        <p className="text-xs leading-relaxed text-slate mb-6 relative z-10">
          Saya mengonfirmasi bahwa data pasien telah dianonimkan sesuai dengan protokol HIPAA/GDPR dan pasien telah memberikan persetujuan untuk analisis berbasis kecerdasan buatan.
        </p>
        <label className="flex items-start gap-3 cursor-pointer group relative z-10">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              className="peer w-5 h-5 rounded border-2 border-light-silver text-ribbon-pink focus:ring-ribbon-pink/30 focus:ring-offset-0 cursor-pointer transition-all hover:border-ribbon-pink"
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsent(e.target.checked)}
            />
          </div>
          <span className="text-sm font-medium text-charcoal select-none group-hover:text-ribbon-pink transition-colors">Saya menyetujui seluruh syarat & ketentuan medis.</span>
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
          className={`rounded-2xl border-2 border-dashed p-16 transition-colors duration-300 flex flex-col items-center justify-center text-center touch-manipulation ${
            dragActive
              ? 'border-ribbon-pink bg-ribbon-pink/5 shadow-pink-glow'
              : 'border-light-silver bg-white hover:border-ribbon-pink/50 hover:bg-clinical-pearl'
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
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`mb-6 transition-colors ${dragActive ? 'text-ribbon-pink drop-shadow-md' : 'text-slate/80'}`}
        >
          <span className="material-symbols-outlined text-[64px]">cloud_upload</span>
        </motion.div>

        <h3 className="mb-2 font-jakarta text-xl font-bold text-charcoal">
          {dragActive ? 'Lepaskan gambar untuk analisis' : 'Unggah Berkas Mamografi'}
        </h3>
        <p className="mb-8 text-sm text-slate font-medium">
          Format: .DCM, .PNG (Maks. 50MB)
        </p>

        <button
          className="rounded-lg bg-ribbon-pink px-8 py-3 font-semibold text-white shadow-pink-glow transition-all hover:bg-ribbon-dark hover:shadow-pink-glow-hover hover:-translate-y-[1px] tracking-wide"
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
      <div className="mt-10 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 mb-5 w-full max-w-xs mx-auto">
          <div className="h-px flex-1 bg-light-silver"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate">Atau</p>
          <div className="h-px flex-1 bg-light-silver"></div>
        </div>
        <button
          onClick={() => {
            if (!consentGiven) {
              setLocalError("Mohon setujui syarat & ketentuan medis terlebih dahulu.");
              return;
            }
            onDemoClick();
          }}
          disabled={loading}
          className="group inline-flex items-center gap-2 rounded-xl border border-light-silver bg-white px-8 py-3.5 font-semibold text-charcoal transition-all hover:border-ribbon-pink/30 hover:bg-ribbon-pink/5 hover:text-ribbon-pink hover:shadow-pink-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-ribbon-pink group-hover:rotate-12 transition-transform">science</span>
          Coba Data Demo Klinis
        </button>
      </div>
    </div>
  );
}
