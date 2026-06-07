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
  const { uploadFile, loading, error, clearError } = useScreening();
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
    <div className="w-full max-w-2xl">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-12 transition-all duration-200 ${
          dragActive
            ? 'border-teal-700 bg-blue-50'
            : 'border-slate-300 bg-white'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Icon */}
        <div className="text-center">
          <div className="mb-4 text-4xl">🖼️</div>

          {/* Heading */}
          <h3 className="text-lg font-semibold text-slate-900">
            Drop .dcm or .png mammogram here
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-slate-600">
            or click to browse
          </p>

          {/* Button Group */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleBrowseClick}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Browse Files
            </button>

            <button
              onClick={onDemoClick}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try Demo
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="mt-6 text-xs italic text-slate-600">
            Your files are processed securely and not stored after analysis.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".dcm,.png,application/dicom,image/png"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={loading}
      />

      {/* Error Display */}
      {displayError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}
    </div>
  );
}
