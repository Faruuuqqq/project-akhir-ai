/**
 * frontend/lib/constants.ts
 * Design system constants and application-wide configuration
 * Based on DESIGN.md specifications
 */

/**
 * Color palette from DESIGN.md
 * All colors used throughout the application
 */
export const COLORS = {
  // Neutrals
  background: '#FAFAFA', // Clinical Pearl
  surface: '#FFFFFF', // Pure White
  surfaceDark: '#121417', // MRI Black
  textPrimary: '#1F2937', // Charcoal
  textSecondary: '#64748B', // Slate
  border: '#E2E8F0', // Light Silver

  // Accents
  accentPrimary: '#E64C7E', // Ribbon Pink
  accentHover: '#C1124B', // Ribbon Dark
  accentDim: 'rgba(230,76,126,0.06)', // Accent at 6% opacity

  // Semantics
  semanticNormal: '#3B82F6', // Calm Blue (for < 50% probability)
  semanticAlert: '#BE123C', // Muted Rose (for > 50% probability / cancer detected)
  warning: '#F9A029', // Ribbon Orange (for disclaimers)
};

/**
 * File upload constraints
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
export const ALLOWED_MIMES = ['application/dicom', 'image/png', 'application/x-dicom'];
export const ALLOWED_EXTENSIONS = ['.dcm', '.png'];

/**
 * Animation constants
 */
export const SCANNING_ANIMATION_DURATION = 2.5; // seconds

/**
 * API configuration
 */
export const API_TIMEOUT = 120000; // milliseconds (120 seconds) - increased for slow CPU inference
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * BI-RADS categories labels for UI display (Bahasa Indonesia)
 */
export const BIRADS_LABELS = {
  1: 'Negatif',
  2: 'Jinak',
  3: 'Kemungkinan Jinak',
  4: 'Mencurigakan',
  5: 'Ganas',
} as const;

/**
 * Breast density labels mapping (Bahasa Indonesia)
 */
export const BREAST_DENSITY_LABELS = {
  A: 'Hampir seluruhnya lemak',
  B: 'Kepadatan fibroglandular tersebar',
  C: 'Padat secara heterogen',
  D: 'Sangat padat',
} as const;

/**
 * DICOM view type mappings
 */
export const DICOM_VIEW_TYPES = {
  CC: 'Craniocaudal',
  MLO: 'Mediolateral Oblique',
  LCC: 'Left Craniocaudal',
  LMLO: 'Left Mediolateral Oblique',
  RCC: 'Right Craniocaudal',
  RMLO: 'Right Mediolateral Oblique',
  ML: 'Mediolateral',
} as const;
