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
 * AI analysis result for a single mammogram
 */
export interface AnalysisResult {
  probability: number; // Raw probability (0.0 to 1.0)
  probabilityPercent: number; // Percentage (0 to 100)
  biRads: 1 | 2 | 3 | 4 | 5; // BI-RADS category
  biRadsDescription: string; // Human-readable description
  biRadsRecommendation: string; // Clinical recommendation
  confidence: number; // Model confidence (0.0 to 1.0)
  explanation: string; // Plain-English explanation of the result
  heatmapUrl: string; // URL to attention/grad-CAM visualization
  processingTimeMs: number; // Time taken for analysis in milliseconds
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
