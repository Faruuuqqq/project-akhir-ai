'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScanningAnimationProps {
  isActive: boolean;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ isActive }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-40">
      {prefersReducedMotion ? (
        <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="w-4 h-4 rounded-full border-2 border-trust-teal border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-white">AI sedang menganalisis jaringan mamografi...</span>
        </div>
      ) : (
        <>
          <motion.div
            className="h-full w-1 bg-gradient-to-b from-transparent via-trust-teal to-transparent"
            animate={{ y: ['-100%', '100%'] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="absolute bottom-12 text-sm font-medium text-white">
            AI sedang menganalisis jaringan mamografi...
          </div>
        </>
      )}
    </div>
  );
};