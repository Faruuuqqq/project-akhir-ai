'use client';

import React, { useRef } from 'react';
import { COLORS } from '@/lib/constants';

interface DICOMViewerProps {
  previewUrl: string | null;
  isLoading?: boolean;
}

export const DICOMViewer: React.FC<DICOMViewerProps> = ({ previewUrl, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-96 w-full items-center justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: COLORS.mriBlack }}
    >
      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="DICOM Preview"
            className="h-full w-full object-contain"
          />
          {isLoading && <div className="absolute inset-0 bg-black bg-opacity-30" />}
        </>
      ) : (
        <p className="text-sm text-light-silver">Waiting for image...</p>
      )}
    </div>
  );
};