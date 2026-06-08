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
    <div className="bg-clinical-pearl font-inter min-h-dvh relative overflow-hidden">
      {/* Subtle Dot Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-6 py-8 relative z-10"
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
                <div className={`mx-4 flex-1 h-px transition-all duration-500 relative ${
                  i < currentStep ? 'bg-trust-teal' : 'bg-light-silver'
                }`}>
                  {i === currentStep - 1 && (
                    <motion.div 
                      className="absolute inset-0 bg-trust-teal shadow-[0_0_10px_2px_rgba(15,118,110,0.6)]"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border-l-4 border-muted-rose bg-muted-rose/5 p-4 flex items-center justify-between" role="alert" aria-live="polite">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-muted-rose text-sm">warning</span>
              <p className="text-sm font-medium text-muted-rose">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="font-semibold text-xs text-muted-rose hover:text-muted-rose/80"
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
                <div className="rounded-2xl border border-trust-teal/20 bg-gradient-to-b from-white to-clinical-pearl p-10 shadow-medical relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                  {/* Radar/Pulse Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <motion.div 
                      animate={{ scale: [1, 2, 3], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                      className="absolute w-32 h-32 rounded-full border-2 border-trust-teal"
                    />
                    <motion.div 
                      animate={{ scale: [1, 2, 3], opacity: [0.5, 0, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
                      className="absolute w-32 h-32 rounded-full border-2 border-trust-teal"
                    />
                  </div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-teal-glow flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-2xl border border-trust-teal/30"></div>
                      <span className="material-symbols-outlined text-4xl text-trust-teal">memory</span>
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-2 right-2 w-2 h-2 rounded-full bg-trust-teal"
                      />
                    </div>
                    
                    <h3 className="font-jakarta text-xl font-bold text-charcoal mb-3">Sistem AI Siaga</h3>
                    <p className="text-sm text-slate leading-relaxed max-w-sm">
                      Citra berhasil dimuat dengan aman ke memori volatil. Sistem siap menjalankan algoritma deteksi jaringan saraf.
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-trust-teal uppercase tracking-widest bg-trust-teal/5 px-4 py-2 rounded-full border border-trust-teal/10">
                      <span className="w-2 h-2 rounded-full bg-trust-teal animate-pulse"></span>
                      Menunggu Instruksi
                    </div>
                  </motion.div>
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
