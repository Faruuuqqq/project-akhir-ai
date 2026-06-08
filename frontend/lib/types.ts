/**
 * frontend/lib/types.ts
 * TypeScript interfaces for RSNA Mammography AI
 * Defines all data structures for patient metadata, uploads, and analysis results
 */

/**
 * Patient metadata extracted from DICOM files or UI input
 */
export interface PatientMetadata {
  patientId: string;
  studyDate: string; // ISO 8601 format
  viewType: string; // e.g., "Craniocaudal", "Mediolateral"
  age?: number;
  breastDensity?: 'A' | 'B' | 'C' | 'D'; // BI-RADS density classification
}

/**
 * Response from successful file upload
 */
export interface UploadResponse {
  fileId: string;
  previewUrl: string;
  metadata: PatientMetadata;
}

/**
 * Structured finding detected by AI analysis
 */
export interface FindingDetail {
  type: string;
  location: string;
  side: string;
  characteristics: string[];
  sizeMm?: number;
  biRadsAssessment: string;
}

/**
 * AI analysis result for a single mammogram
 */
export interface AnalysisResult {
  probability: number;
  probabilityPercent: string;
  biRads: string;
  biRadsDescription: string;
  biRadsRecommendation: string;
  confidence: number;
  explanation: string;
  heatmapUrl: string;
  processingTimeMs: number;
  findings?: FindingDetail[];
  breastComposition?: string;
  impression?: string;
}

/**
 * Complete response containing file and analysis data
 * Used for demo endpoint and after full analysis
 */
export interface DemoResponse {
  fileId: string;
  previewUrl: string;
  metadata: PatientMetadata;
  analysis: AnalysisResult;
}

/**
 * Screening session state
 * Tracks the current upload, analysis result, loading state, and errors
 */
export interface ScreeningState {
  currentStudy: {
    fileId: string;
    previewUrl: string;
    metadata: PatientMetadata;
  } | null;
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  consentGiven: boolean;
}
