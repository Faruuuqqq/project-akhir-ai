/**
 * frontend/lib/validators.ts
 * File validation, DICOM parsing, and data transformation utilities
 */

import { ALLOWED_EXTENSIONS, ALLOWED_MIMES, MAX_FILE_SIZE, BREAST_DENSITY_LABELS, DICOM_VIEW_TYPES } from './constants';

/**
 * Validates a file for upload (size, type, extension)
 * @param file - File object from input
 * @returns Error message if invalid, null if valid
 */
export function validateFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
  }

  // Check file extension first (more reliable than MIME type)
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `Invalid file extension. Supported: ${ALLOWED_EXTENSIONS.join(', ')}. Provided: ${extension}`;
  }

  // For DICOM files, browsers often report application/octet-stream or empty string
  // For PNG files, accept standard MIME types
  const isDicom = extension === '.dcm';
  const isPng = extension === '.png';
  
  if (isDicom) {
    // Accept common MIME types for DICOM
    const dicomMimes = ['application/dicom', 'application/octet-stream', ''];
    if (!dicomMimes.includes(file.type)) {
      // Log warning but don't fail - browsers are inconsistent with DICOM MIME types
      console.warn(`DICOM file has unexpected MIME type: ${file.type}`);
    }
  } else if (isPng) {
    // PNG must have correct MIME type
    if (!['image/png'].includes(file.type)) {
      return `Invalid PNG file type. Expected image/png, got: ${file.type}`;
    }
  }

  return null; // Valid
}

/**
 * Converts DICOM view code to human-readable format
 * @param viewCode - Short code like "CC", "MLO", etc.
 * @returns Human-readable view type or the original code if not mapped
 */
export function getDICOMViewType(viewCode: string): string {
  if (!viewCode) return 'Unknown';
  
  const normalized = viewCode.toUpperCase();
  return (DICOM_VIEW_TYPES as Record<string, string>)[normalized] || viewCode;
}

/**
 * Gets human-readable label for breast density classification
 * @param density - Density code: 'A', 'B', 'C', or 'D'
 * @returns Human-readable density description
 */
export function getBreastDensityLabel(density?: string): string {
  if (!density) return 'Unknown';
  
  const normalized = density.toUpperCase() as keyof typeof BREAST_DENSITY_LABELS;
  return BREAST_DENSITY_LABELS[normalized] || 'Unknown';
}

/**
 * Sanitizes and validates patient ID
 * @param patientId - Patient ID string
 * @returns Sanitized patient ID or default placeholder
 */
export function sanitizePatientId(patientId?: string): string {
  if (!patientId) return 'Patient ID: Not provided';
  return `Patient ID: ${patientId.slice(0, 20)}`; // Limit to 20 chars for display
}

/**
 * Formats a date string to ISO 8601
 * @param dateString - Date in various formats
 * @returns ISO 8601 formatted date or today's date as fallback
 */
export function formatStudyDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}
