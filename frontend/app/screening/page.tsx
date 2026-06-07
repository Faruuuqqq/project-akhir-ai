'use client';

import React from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { UploadZone } from '@/components/UploadZone';
import { DICOMViewer } from '@/components/DICOMViewer';
import { ScanningAnimation } from '@/components/ScanningAnimation';
import { HeatmapOverlay } from '@/components/HeatmapOverlay';
import { MetadataCard } from '@/components/MetadataCard';
import { ResultsCard } from '@/components/ResultsCard';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

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

  const handleAnalyze = async () => {
    if (currentStudy.fileId) {
      await analyzeStudy(currentStudy.fileId);
    }
  };

  const isImageLoaded = Boolean(currentStudy.previewUrl);
  const isAnalyzed = Boolean(analysisResult);

  return (
    <div className="min-h-screen bg-clinical-pearl">
      {/* Header */}
      <header className="border-b border-light-silver bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold text-charcoal">Breast Cancer Detection Screening</h1>
          <p className="mt-2 text-slate">Upload a mammogram or try a demo</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="mb-2 text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="font-semibold text-xs text-red-600 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {!isImageLoaded ? (
          // Empty State: Upload Zone
          <div className="mx-auto max-w-md py-12">
            <UploadZone onDemoClick={loadDemo} />
          </div>
        ) : (
          // Image Loaded: Two-column layout
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: DICOM Viewer */}
            <div>
              <div className="relative h-96 overflow-hidden rounded-lg bg-mri-black">
                <DICOMViewer previewUrl={currentStudy.previewUrl} isLoading={loading} />
                {loading && <ScanningAnimation isActive={true} />}
                {isAnalyzed && (
                  <HeatmapOverlay heatmapUrl={analysisResult?.heatmapUrl || null} isVisible={true} />
                )}
              </div>

              {/* Buttons under viewer */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetWorkflow}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-light-silver bg-white px-4 py-3 font-medium text-charcoal transition-colors hover:bg-clinical-pearl disabled:opacity-50"
                >
                  Scan New Image
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !isImageLoaded || isAnalyzed}
                  className="flex-1 rounded-lg bg-trust-teal px-4 py-3 font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : isAnalyzed ? 'Analyzed' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Right: Metadata + Results */}
            <div className="space-y-6">
              {currentStudy.metadata && (
                <MetadataCard metadata={currentStudy.metadata} />
              )}

              {isAnalyzed && analysisResult && (
                <ResultsCard analysis={analysisResult} />
              )}

              {/* Medical Disclaimer (always visible) */}
              <MedicalDisclaimer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}