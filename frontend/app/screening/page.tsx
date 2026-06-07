/**
 * frontend/app/screening/page.tsx
 * Main screening page with upload zone and analysis display
 */

'use client';

import React from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { UploadZone } from '@/components/UploadZone';

export default function ScreeningPage() {
  const { loadDemo, currentStudy, analysisResult, loading } = useScreening();

  /**
   * Handle demo button click
   */
  const handleDemoClick = async () => {
    try {
      await loadDemo();
    } catch (error) {
      console.error('Failed to load demo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-clinical-pearl">
      {/* Header */}
      <header className="border-b border-light-silver bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-4xl font-bold text-charcoal">
            RSNA Mammography AI
          </h1>
          <p className="mt-2 text-slate">
            AI-powered breast cancer detection screening tool
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Upload Zone Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-charcoal">
            Upload Mammogram
          </h2>
          <UploadZone onDemoClick={handleDemoClick} />
        </div>

        {/* Study Info Section */}
        {currentStudy && (
          <div className="rounded-lg border border-light-silver bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-charcoal">
              Current Study
            </h3>
            <div className="mt-4 space-y-2 text-sm text-slate">
              <p>
                <strong>File ID:</strong> {currentStudy.fileId}
              </p>
              <p>
                <strong>Patient ID:</strong> {currentStudy.metadata.patientId}
              </p>
              <p>
                <strong>Study Date:</strong> {currentStudy.metadata.studyDate}
              </p>
              <p>
                <strong>View Type:</strong> {currentStudy.metadata.viewType}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Result Section */}
        {analysisResult && (
          <div className="mt-8 rounded-lg border border-light-silver bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-charcoal">
              Analysis Result
            </h3>
            <div className="mt-4 space-y-2 text-sm text-slate">
              <p>
                <strong>Probability:</strong>{' '}
                {analysisResult.probabilityPercent.toFixed(1)}%
              </p>
              <p>
                <strong>BI-RADS:</strong> {analysisResult.biRads} -{' '}
                {analysisResult.biRadsDescription}
              </p>
              <p>
                <strong>Confidence:</strong>{' '}
                {(analysisResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
