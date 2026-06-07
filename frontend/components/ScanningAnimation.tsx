'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScanningAnimationProps {
  isActive: boolean;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-40">
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
        AI is analyzing tissue density...
      </div>
    </div>
  );
};