'use client';

import React, { useEffect, useRef } from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { UploadZone } from '@/components/UploadZone';
import { DICOMViewer } from '@/components/DICOMViewer';
import { ScanningAnimation } from '@/components/ScanningAnimation';
import { HeatmapOverlay } from '@/components/HeatmapOverlay';
import { MetadataCard } from '@/components/MetadataCard';
import { ResultsCard } from '@/components/ResultsCard';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';
import { motion } from 'framer-motion';

const STEPS = [
  { key: 'upload', label: 'Upload Citra' },
  { key: 'analisis', label: 'Analisis AI' },
  { key: 'hasil', label: 'Hasil & Rekomendasi' },
];

export default function ScreeningPage() {
  const {
    currentStudy,
    analysisResult,
    loading,
    error,
    analyzeStudy,
    loadDemo,
    resetWorkflow,
    clearError,
  } = useScreening();

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (error) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => clearError(), 5000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [error, clearError]);

  const isImageLoaded = Boolean(currentStudy?.previewUrl);
  const isAnalyzed = Boolean(analysisResult);
  const currentStep = isAnalyzed ? 2 : isImageLoaded ? 1 : 0;

  const handleAnalyze = async () => {
    if (currentStudy?.fileId) {
      await analyzeStudy(currentStudy.fileId);
    }
  };

  return (
    <div className="bg-clinical-pearl font-inter min-h-dvh">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-6 py-8"
      >
        {/* Header */}
        <section className="mb-10">
          <h1 className="font-jakarta text-3xl font-bold text-charcoal mb-2">Pusat Skrining Diagnostik</h1>
          <p className="text-slate max-w-2xl">Lakukan analisis citra mamografi secara presisi menggunakan teknologi AI yang didukung oleh riset medis mendalam.</p>
        </section>

        {/* Step Indicator */}
        <div className="mb-10 flex items-center gap-0">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-jakarta text-xs font-bold transition-all duration-300 ${
                  i <= currentStep
                    ? 'bg-trust-teal text-white shadow-teal-glow'
                    : 'bg-light-silver text-slate'
                }`}>
                  {i < currentStep ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`font-jakarta text-sm font-semibold transition-colors duration-300 hidden sm:inline ${
                  i <= currentStep ? 'text-charcoal' : 'text-slate'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-4 flex-1 h-px transition-all duration-500 ${
                  i < currentStep ? 'bg-trust-teal' : 'bg-light-silver'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border-l-4 border-muted-rose bg-red-50 p-4 flex items-center justify-between" role="alert" aria-live="polite">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-rose text-sm">warning</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="font-semibold text-xs text-muted-rose hover:text-red-700"
              aria-label="Tutup pesan error"
            >
              Tutup
            </button>
          </div>
        )}

        {!isImageLoaded ? (
          /* Step 0: Upload */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md py-12"
          >
            <UploadZone onDemoClick={loadDemo} />
          </motion.div>
        ) : (
          /* Steps 1-2: Viewer + Results */
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column: DICOM Viewer */}
            <div className="space-y-6">
              <div className="relative h-96 overflow-hidden rounded-lg bg-mri-black">
                <DICOMViewer previewUrl={currentStudy?.previewUrl || null} isLoading={loading} />
                {loading && <ScanningAnimation isActive={true} />}
                {isAnalyzed && (
                  <HeatmapOverlay heatmapUrl={analysisResult?.heatmapUrl || null} isVisible={true} />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetWorkflow}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-light-silver bg-white px-4 py-3 font-semibold tracking-wide text-charcoal transition-all hover:bg-clinical-pearl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                >
                  Pindai Citra Baru
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !isImageLoaded || isAnalyzed}
                  className="flex-1 rounded-lg bg-trust-teal px-4 py-3 font-semibold tracking-wide text-white transition-all hover:bg-teal-dark hover:shadow-teal-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:bg-slate/50 disabled:text-white/70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Menganalisis...</>
                  ) : isAnalyzed ? 'Selesai Dianalisis' : 'Jalankan Analisis AI'}
                </button>
              </div>

              {/* Metadata card below buttons */}
              {currentStudy?.metadata && (
                <MetadataCard metadata={currentStudy.metadata} />
              )}
            </div>

            {/* Right Column: Results */}
            <div className="space-y-6">
              {loading ? (
                /* Skeleton */
                <div className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical space-y-4" aria-hidden="true">
                  <div className="h-4 w-1/3 bg-light-silver rounded animate-pulse" />
                  <div className="h-16 w-1/2 bg-light-silver rounded animate-pulse" />
                  <div className="h-2 w-full bg-light-silver rounded animate-pulse mt-6" />
                  <div className="h-2 w-3/4 bg-light-silver rounded animate-pulse" />
                  <div className="h-8 w-full bg-light-silver rounded animate-pulse mt-4" />
                  <div className="h-12 w-full bg-light-silver rounded animate-pulse mt-4" />
                </div>
              ) : isAnalyzed && analysisResult ? (
                <ResultsCard analysis={analysisResult} />
              ) : (
                /* Pre-analysis: Show upload info */
                <div className="rounded-2xl border border-light-silver bg-white p-8 shadow-medical">
                  <div className="flex items-center gap-2 mb-4 text-trust-teal">
                    <span className="material-symbols-outlined">info</span>
                    <h3 className="font-jakarta text-xs font-bold uppercase tracking-[0.1em] text-charcoal">Siap Analisis</h3>
                  </div>
                  <p className="text-sm text-slate leading-relaxed">
                    Citra berhasil dimuat. Tekan tombol <strong className="text-charcoal">&ldquo;Jalankan Analisis AI&rdquo;</strong> untuk memulai proses deteksi berbasis deep learning.
                  </p>
                </div>
              )}

              <MedicalDisclaimer />
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}
