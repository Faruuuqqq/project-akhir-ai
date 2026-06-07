'use client';

import React from 'react';
import { ScreeningProvider } from '@/contexts/ScreeningContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ConsentModal } from '@/components/ConsentModal';

interface RootClientProps {
  children: React.ReactNode;
}

export function RootClient({ children }: RootClientProps) {
  return (
    <ErrorBoundary>
      <ScreeningProvider>
        <ConsentModal />
        {children}
      </ScreeningProvider>
    </ErrorBoundary>
  );
}
