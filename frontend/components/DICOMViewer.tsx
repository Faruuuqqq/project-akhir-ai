'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
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
      style={{ backgroundColor: COLORS.surfaceDark }}
    >
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center' }}
      />
      
      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="DICOM Preview"
            className="h-full w-full object-contain z-10"
          />
          {isLoading && <div className="absolute inset-0 bg-black bg-opacity-30 z-20" />}
          
          {/* Medical HUD Overlays */}
          <div className="absolute top-4 left-4 z-30 font-mono text-[10px] text-ribbon-pink/80">
            <p>WL: 2048 / WW: 4096</p>
            <p>Zoom: 100%</p>
          </div>
          <div className="absolute top-4 right-4 z-30 font-mono text-[10px] text-ribbon-pink/80 text-right">
            <p>MammoAI Study</p>
            <p>LCC</p>
          </div>
          <div className="absolute bottom-4 left-4 z-30 font-mono text-[10px] text-ribbon-pink/80">
            <p>T: 2.0mm</p>
            <p>kVp: 28 / mAs: 120</p>
          </div>
          <div className="absolute bottom-4 right-4 z-30 font-mono text-[10px] text-ribbon-pink/80 text-right">
            <p>Frame: 1/1</p>
            <p>Uncompressed</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6 z-10">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            {/* Animated crosshair target */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-white/10 rounded-full border-t-ribbon-pink/50"
            />
            <span className="material-symbols-outlined text-3xl text-white/30">center_focus_weak</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/50">Menunggu Unggahan</p>
          <p className="text-[10px] text-white/30 mt-2 max-w-[200px]">Data klinis akan divisualisasikan secara aman di area ini.</p>
        </div>
      )}
    </div>
  );
};