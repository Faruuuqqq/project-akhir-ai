'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapOverlayProps {
  heatmapUrl: string | null;
  isVisible: boolean;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ heatmapUrl, isVisible }) => {
  if (!isVisible || !heatmapUrl) return null;

  return (
    <motion.img
      src={heatmapUrl}
      alt="Grad-CAM Heatmap"
      className="absolute inset-0 h-full w-full object-contain pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};