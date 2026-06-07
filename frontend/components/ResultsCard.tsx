'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';
import { getBIRADSColor } from '@/lib/birads';
import { COLORS } from '@/lib/constants';

interface ResultsCardProps {
  analysis: AnalysisResult;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ analysis }) => {
  const scoreColor = getBIRADSColor(analysis.probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Probability Score */}
      <div className="rounded-2xl border border-light-silver bg-white p-8 shadow-sm">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate">
          AI Probability of Malignancy
        </p>
        <div
          className="mb-6 font-mono text-6xl font-bold"
          style={{ color: scoreColor }}
        >
          {analysis.probabilityPercent}
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate">Model Confidence</span>
            <span className="font-mono text-xs text-slate">
              {(analysis.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-light-silver">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: COLORS.trustTeal }}
              initial={{ width: 0 }}
              animate={{ width: `${analysis.confidence * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* BI-RADS */}
      <div
        className="rounded-2xl border-l-4 bg-white p-6 shadow-sm"
        style={{ borderColor: COLORS.warmAmber }}
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate">
          Clinical Assessment
        </p>
        <h4 className="mb-2 text-lg font-bold text-charcoal">{analysis.biRads}</h4>
        <p className="mb-3 text-sm text-charcoal">{analysis.biRadsDescription}</p>
        <p className="text-sm font-medium italic text-slate">{analysis.biRadsRecommendation}</p>
      </div>

      {/* Interpretation */}
      <div className="rounded-2xl border border-light-silver bg-white p-6 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-charcoal">What This Means</h4>
        <p className="text-sm leading-relaxed text-slate">{analysis.explanation}</p>
      </div>
    </motion.div>
  );
};