/**
 * frontend/components/ConsentModal.tsx
 * Informed consent modal component with localStorage persistence
 * Displays medical disclaimers and requires explicit user acknowledgment
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useScreening } from '@/contexts/ScreeningContext';

/**
 * ConsentModal component
 * Shows informed consent on first visit, saves preference to localStorage
 */
export function ConsentModal() {
  const [consentGiven, setConsentGivenLocal, isReady] = useLocalStorage<boolean>('consentGiven', false);
  const { setConsent } = useScreening();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    notReplacement: false,
    demoOnly: false,
    noMedicalDecision: false,
  });

  // Initialize modal visibility after localStorage is ready
  useEffect(() => {
    if (isReady) {
      if (consentGiven) {
        // User has already consented, set context and close modal
        setConsent(true);
        setIsOpen(false);
      } else {
        // First visit, show modal
        setIsOpen(true);
      }
    }
  }, [isReady, consentGiven, setConsent]);

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = (key: keyof typeof checkedItems) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /**
   * Handle continue button click
   */
  const handleContinue = () => {
    try {
      setConsentGivenLocal(true);
      setConsent(true);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    try {
      // Navigate to home
      window.location.href = '/';
    } catch (error) {
      console.error('Error navigating to home:', error);
    }
  };

  // Check if all checkboxes are checked
  const allChecked =
    checkedItems.notReplacement &&
    checkedItems.demoOnly &&
    checkedItems.noMedicalDecision;

  // Don't render until localStorage is ready (SSR safety)
  if (!isReady) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Before You Begin
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This is a research and demonstration tool. Please read and acknowledge
          the following before proceeding.
        </p>

        {/* Consent Items */}
        <div className="mt-6 space-y-4">
          {/* Checkbox 1 */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checkedItems.notReplacement}
              onChange={() => handleCheckboxChange('notReplacement')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-700"
            />
            <span className="text-sm text-slate-700">
              I understand this is <strong>not a replacement</strong> for
              professional radiologist evaluation
            </span>
          </label>

          {/* Checkbox 2 */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checkedItems.demoOnly}
              onChange={() => handleCheckboxChange('demoOnly')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-700"
            />
            <span className="text-sm text-slate-700">
              I agree that results are for <strong>demonstration purposes only</strong>
            </span>
          </label>

          {/* Checkbox 3 */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={checkedItems.noMedicalDecision}
              onChange={() => handleCheckboxChange('noMedicalDecision')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-700"
            />
            <span className="text-sm text-slate-700">
              I will <strong>not rely on this tool</strong> for medical decision-making
            </span>
          </label>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 border-l-4 border-amber-500 bg-amber-50 p-3">
          <p className="text-xs italic text-slate-600">
            If you suspect breast cancer or have any concerns, please consult with
            a qualified healthcare provider immediately.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!allChecked}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
              allChecked
                ? 'bg-teal-700 hover:bg-teal-800 active:shadow-md'
                : 'cursor-not-allowed bg-slate-400 opacity-50'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
