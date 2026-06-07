/**
 * frontend/lib/api.ts
 * Axios client for API communication with the FastAPI backend
 * Handles file uploads, analysis requests, and demo data fetching
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './constants';
import { UploadResponse, AnalysisResult, DemoResponse } from './types';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Format axios error into user-friendly message
 * @param error - Axios error object
 * @returns User-friendly error message
 */
function formatErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Server responded with error
    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (data?.detail) {
        return `Error: ${data.detail}`;
      }

      switch (status) {
        case 400:
          return 'Invalid file format. Please upload a valid DICOM or PNG file.';
        case 413:
          return 'File is too large. Maximum size is 50MB.';
        case 415:
          return 'Unsupported file type. Please upload DICOM or PNG.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Error: ${status} - ${axiosError.response.statusText}`;
      }
    }

    // Request timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timed out. The server took too long to respond. Please try again.';
    }

    // Network error
    if (!axiosError.response) {
      return 'Network error. Please check your internet connection.';
    }

    return axiosError.message || 'An unknown error occurred.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred. Please try again.';
}

/**
 * Uploads a mammogram file to the backend
 * @param file - File object (DICOM or PNG)
 * @returns UploadResponse with fileId, previewUrl, and metadata
 * @throws Error with user-friendly message
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Requests AI analysis for an uploaded file
 * @param fileId - File ID returned from uploadFile
 * @returns AnalysisResult with probability, BI-RADS, and explanation
 * @throws Error with user-friendly message
 */
export async function analyzeFile(fileId: string): Promise<AnalysisResult> {
  try {
    const response = await apiClient.post<AnalysisResult>('/api/analyze', {
      file_id: fileId,
    });

    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Fetches a demo result for testing without uploading a real file
 * @returns DemoResponse with sample file, metadata, and analysis
 * @throws Error with user-friendly message
 */
export async function getDemo(): Promise<DemoResponse> {
  try {
    const response = await apiClient.get<DemoResponse>('/api/demo');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Checks backend health/connectivity
 * @returns true if backend is reachable
 */
export async function checkHealthy(): Promise<boolean> {
  try {
    const response = await apiClient.get('/api/health', {
      timeout: 5000, // Shorter timeout for health check
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

export default apiClient;
