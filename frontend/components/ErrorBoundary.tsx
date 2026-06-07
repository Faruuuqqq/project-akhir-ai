/**
 * frontend/components/ErrorBoundary.tsx
 * Real React Error Boundary component (class-based)
 * Catches both React render errors and window-level errors
 */

'use client';

import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component - catches React errors during rendering
 * Also catches window-level errors via event listener
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details to console
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  /**
   * Set up window error listener for runtime errors
   */
  componentDidMount() {
    window.addEventListener('error', this.handleWindowError);
  }

  /**
   * Clean up window error listener
   */
  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError);
  }

  /**
   * Handle window-level errors (not caught by React)
   */
  handleWindowError = (event: ErrorEvent) => {
    console.error('Window error caught:', event.error);
    this.setState({
      hasError: true,
      error: event.error instanceof Error ? event.error : new Error(String(event.error)),
    });
  };

  /**
   * Handle page refresh
   */
  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg border border-red-200 bg-red-50 p-6">
            {/* Heading */}
            <h2 className="text-lg font-bold text-red-600">
              Something went wrong
            </h2>

            {/* Message */}
            <p className="mt-2 text-sm text-red-600">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>

            {/* Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <pre className="mt-4 max-h-40 overflow-auto rounded bg-red-100 p-2 text-xs text-red-700">
                {this.state.error.stack}
              </pre>
            )}

            {/* Refresh Button */}
            <button
              onClick={this.handleRefresh}
              className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
