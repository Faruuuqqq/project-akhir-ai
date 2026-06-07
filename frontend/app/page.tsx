'use client';

import React from 'react';
import Link from 'next/link';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-clinical-pearl flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white flex-grow">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
          {/* Contour line background SVG */}
          <svg className="absolute inset-0 opacity-5" width="100%" height="100%">
            <defs>
              <pattern id="contours" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 40, 50 50 T 100 50" stroke="#64748B" fill="none" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contours)" />
          </svg>

          <div className="relative z-10 max-w-2xl">
            <h1 className="mb-6 text-5xl font-bold text-charcoal lg:text-6xl">
              AI-Powered Breast Cancer Detection
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-slate">
              Using deep learning on the RSNA Kaggle dataset to provide radiologists with a second opinion. 
              This tool assists in identifying potential malignancies in mammography scans, helping reduce 
              diagnostic burden and improve screening efficiency.
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <Link
                href="/screening"
                className="rounded-lg bg-trust-teal px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-teal-dark hover:shadow-xl"
              >
                Try the Workspace
              </Link>
              <a
                href="#research"
                className="rounded-lg border-2 border-light-silver bg-white px-8 py-4 font-semibold text-charcoal transition-colors hover:bg-clinical-pearl"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Research methodology page is planned for Phase 2.");
                }}
              >
                View Research
              </a>
            </div>

            <div className="rounded-lg border-l-4 border-calm-blue bg-blue-50 p-6">
              <p className="text-sm text-slate">
                <strong className="text-calm-blue">Global Need:</strong> According to WHO, there is a shortage 
                of approximately 1 million radiologists worldwide. AI-assisted screening can help bridge this gap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-charcoal py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <MedicalDisclaimer />
          </div>
          <p className="text-center text-sm text-slate">
            © {new Date().getFullYear()} RSNA Mammography AI. This is a research and educational project.
          </p>
        </div>
      </footer>
    </div>
  );
}