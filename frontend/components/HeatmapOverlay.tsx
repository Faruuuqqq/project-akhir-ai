'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeatmapOverlayProps {
  heatmapUrl: string | null;
  isVisible: boolean;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ heatmapUrl, isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!heatmapUrl || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = heatmapUrl;
  }, [heatmapUrl]);

  if (!isVisible || !heatmapUrl) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full object-contain mix-blend-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
};