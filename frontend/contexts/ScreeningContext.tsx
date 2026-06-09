/**
 * frontend/contexts/ScreeningContext.tsx
 * React Context for managing screening session state and API interactions
 * Provides global state for file uploads, analysis, and user consent
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import * as api from '@/lib/api';
import { ScreeningState, UploadResponse, AnalysisResult, DemoResponse, PatientMetadata, HistoryRecord } from '@/lib/types';

/**
 * Screening context type definition
 * Includes all state properties and methods for managing screening workflow
 */
export interface ScreeningContextType {
  // State
  currentStudy: {
    fileId: string;
    previewUrl: string;
    metadata: PatientMetadata;
  } | null;
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  consentGiven: boolean;

  // Methods
  uploadFile: (file: File) => Promise<void>;
  analyzeStudy: (fileId: string) => Promise<void>;
  loadDemo: () => Promise<void>;
  resetWorkflow: () => void;
  setConsent: (given: boolean) => void;
  clearError: () => void;
  
  // History methods
  saveToHistory: () => void;
  getHistory: () => HistoryRecord[];
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

/**
 * Create the screening context
 */
const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

/**
 * Props for ScreeningProvider
 */
interface ScreeningProviderProps {
  children: ReactNode;
}

/**
 * Screening provider component
 * Wraps the app and provides screening state and methods
 */
export function ScreeningProvider({ children }: ScreeningProviderProps) {
  const [state, setState] = useState<ScreeningState>({
    currentStudy: null,
    analysisResult: null,
    loading: false,
    error: null,
    consentGiven: false,
  });
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mammoai_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
    }
  }, []);

  /**
   * Upload a file to the backend
   */
  const uploadFile = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response: UploadResponse = await api.uploadFile(file);
      setState((prev) => ({
        ...prev,
        currentStudy: {
          fileId: response.fileId,
          previewUrl: response.previewUrl,
          metadata: response.metadata,
        },
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Analyze a study using the backend AI
   */
  const analyzeStudy = useCallback(async (fileId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result: AnalysisResult = await api.analyzeFile(fileId);
      setState((prev) => ({
        ...prev,
        analysisResult: result,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze study';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Load demo data for testing
   */
  const loadDemo = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response: DemoResponse = await api.getDemo();
      setState((prev) => ({
        ...prev,
        currentStudy: {
          fileId: response.fileId,
          previewUrl: response.previewUrl,
          metadata: response.metadata,
        },
        analysisResult: response.analysis,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load demo';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Reset workflow to initial state
   */
  const resetWorkflow = useCallback(() => {
    setState({
      currentStudy: null,
      analysisResult: null,
      loading: false,
      error: null,
      consentGiven: state.consentGiven, // Preserve consent across resets
    });
  }, [state.consentGiven]);

  /**
   * Set consent status
   */
  const setConsent = useCallback((given: boolean) => {
    setState((prev) => ({
      ...prev,
      consentGiven: given,
    }));
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Save current analysis result to history
   */
  const saveToHistory = useCallback(() => {
    if (!state.analysisResult || !state.currentStudy) return;

    const newRecord: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      date: new Date().toLocaleString('id-ID'),
      patientId: state.currentStudy.metadata?.patientId,
      biRads: state.analysisResult.biRads,
      probabilityPercent: state.analysisResult.probabilityPercent,
      isHighRisk: state.analysisResult.probability > 0.5,
      findingsCount: state.analysisResult.findings?.length || 0,
      previewUrl: state.currentStudy.previewUrl,
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('mammoai_history', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
    }
  }, [state.analysisResult, state.currentStudy, history]);

  /**
   * Get all history records
   */
  const getHistory = useCallback(() => {
    return history;
  }, [history]);

  /**
   * Delete a history record by ID
   */
  const deleteFromHistory = useCallback((id: string) => {
    const updated = history.filter((record) => record.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('mammoai_history', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update history in localStorage:', error);
    }
  }, [history]);

  /**
   * Clear all history records
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('mammoai_history');
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
    }
  }, []);

  const value: ScreeningContextType = {
    currentStudy: state.currentStudy,
    analysisResult: state.analysisResult,
    loading: state.loading,
    error: state.error,
    consentGiven: state.consentGiven,
    uploadFile,
    analyzeStudy,
    loadDemo,
    resetWorkflow,
    setConsent,
    clearError,
    saveToHistory,
    getHistory,
    deleteFromHistory,
    clearHistory,
  };

  return (
    <ScreeningContext.Provider value={value}>
      {children}
    </ScreeningContext.Provider>
  );
}

/**
 * Hook to use the screening context
 * @throws Error if used outside ScreeningProvider
 */
export function useScreening(): ScreeningContextType {
  const context = useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
}
