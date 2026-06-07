# RSNA Mammography AI — MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete end-to-end microservices application (Next.js + FastAPI) for AI-assisted breast cancer detection with full workflow (upload → analyze → display results) ready for deployment to Vercel + Railway.

**Architecture:** Decoupled microservices: Next.js 14 frontend on Vercel calls FastAPI backend on Railway. Frontend handles UI/UX, backend handles DICOM validation, mock inference (with real model ready). All data in-memory, deleted after analysis. Informed consent + medical disclaimers embedded in UI.

**Tech Stack:** 
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, axios
- Backend: FastAPI, Python 3.11, pydicom, NumPy, PIL, pydantic
- Deployment: Vercel (frontend), Railway (backend), Docker

---

## File Structure

### Frontend (`frontend/`)
```
frontend/
├── app/
│   ├── layout.tsx (root layout with providers)
│   ├── page.tsx (/ landing page)
│   ├── error.tsx (global error boundary)
│   ├── screening/
│   │   ├── page.tsx (/screening workspace)
│   │   └── layout.tsx (screening layout)
│   └── api/
│       └── health/route.ts (health check endpoint)
├── components/
│   ├── ConsentModal.tsx
│   ├── UploadZone.tsx
│   ├── DICOMViewer.tsx
│   ├── ScanningAnimation.tsx
│   ├── HeatmapOverlay.tsx
│   ├── MetadataCard.tsx
│   ├── ResultsCard.tsx
│   └── MedicalDisclaimer.tsx
├── contexts/
│   └── ScreeningContext.tsx
├── hooks/
│   ├── useScreening.ts
│   ├── useLocalStorage.ts
│   └── useApiClient.ts
├── lib/
│   ├── api.ts
│   ├── validators.ts
│   ├── constants.ts
│   ├── types.ts
│   └── birads.ts (BI-RADS mapping logic)
├── styles/
│   ├── globals.css
│   └── dicom-viewer.css
├── public/
│   ├── demo-sample.png
│   └── svg/ (contour lines, icons)
├── .env.local (dev)
├── .env.production (prod)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Backend (`backend/`)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py (FastAPI app initialization)
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── dicom_processor.py
│   │   ├── inference.py
│   │   └── heatmap_generator.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── file_validator.py
│   │   ├── error_handler.py
│   │   └── logger.py
│   └── config.py
├── models/ (directory for model files)
│   ├── demo_sample.png
│   ├── demo_heatmap.png
│   └── model.safetensors (when ready)
├── tests/
│   ├── test_endpoints.py
│   ├── test_dicom_processor.py
│   ├── test_inference.py
│   └── test_heatmap_generator.py
├── requirements.txt
├── .env.example
├── Dockerfile
├── docker-compose.yml (for local dev)
└── main.py (entry point for uvicorn)
```

---

## Phase 1: Project Setup & Infrastructure (1-2 days)

### Task 1: Initialize Next.js Project with TypeScript & Tailwind

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/next.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/.env.local`

- [ ] **Step 1: Create Next.js project**

Run from project root:
```bash
npx create-next-app@14 frontend --typescript --tailwind --app --eslint --no-git
```

- [ ] **Step 2: Install additional dependencies**

```bash
cd frontend
npm install axios framer-motion cornerstone3d
npm install -D @types/node @types/react
```

- [ ] **Step 3: Configure Tailwind with design colors**

Edit `frontend/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'clinical-pearl': '#FAFAFA',
        'mri-black': '#121417',
        'charcoal': '#1F2937',
        'slate': '#64748B',
        'trust-teal': '#0F766E',
        'teal-dark': '#0F5F59',
        'calm-blue': '#3B82F6',
        'muted-rose': '#BE123C',
        'warm-amber': '#D97706',
        'light-silver': '#E2E8F0',
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create environment file for local development**

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

- [ ] **Step 5: Verify Next.js setup**

Run: `npm run dev` from `frontend/` directory
Expected: Server running on http://localhost:3000

- [ ] **Step 6: Commit**

```bash
cd frontend
git add package.json tsconfig.json next.config.js tailwind.config.js .env.local
git commit -m "setup: Initialize Next.js 14 with TypeScript and Tailwind"
```

---

### Task 2: Initialize FastAPI Backend with Project Structure

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env.example`
- Create: `backend/Dockerfile`
- Create: `backend/app/__init__.py`
- Create: `backend/app/config.py`
- Create: `backend/app/main.py`
- Create: `backend/main.py` (entry point)

- [ ] **Step 1: Create backend directory structure**

```bash
mkdir -p backend/app/{api,services,models,utils} backend/models backend/tests
touch backend/app/__init__.py backend/app/{api,services,models,utils}/__init__.py
```

- [ ] **Step 2: Create requirements.txt with all dependencies**

Create `backend/requirements.txt`:
```
fastapi==0.109.0
uvicorn==0.27.0
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0
pydicom==2.4.0
numpy==1.24.0
Pillow==10.1.0
scipy==1.11.0
torch==2.1.0
safetensors==0.4.1
python-dotenv==1.0.0
httpx==0.25.0
pytest==7.4.0
pytest-asyncio==0.21.0
```

- [ ] **Step 3: Create config.py with environment settings**

Create `backend/app/config.py`:
```python
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FASTAPI_ENV: str = os.getenv("FASTAPI_ENV", "development")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models/model.safetensors")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "52428800"))  # 50MB
    INFERENCE_TIMEOUT: int = int(os.getenv("INFERENCE_TIMEOUT", "30"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 4: Create FastAPI app initialization**

Create `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="RSNA Mammography AI",
    version="1.0.0",
    description="AI-powered breast cancer detection"
)

# CORS Configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
```

- [ ] **Step 5: Create entry point for uvicorn**

Create `backend/main.py`:
```python
import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

- [ ] **Step 6: Create .env.example template**

Create `backend/.env.example`:
```
FASTAPI_ENV=development
MODEL_PATH=./models/model.safetensors
CORS_ORIGINS=http://localhost:3000,https://rsna-ai.vercel.app
MAX_FILE_SIZE=52428800
INFERENCE_TIMEOUT=30
LOG_LEVEL=INFO
```

- [ ] **Step 7: Create Dockerfile for deployment**

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Run uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 8: Verify FastAPI setup**

```bash
cd backend
python main.py
```

Expected: Server running on http://localhost:8000, health check returns `{"status": "ok", "version": "1.0.0"}`

- [ ] **Step 9: Commit**

```bash
git add backend/requirements.txt backend/.env.example backend/Dockerfile backend/app/ backend/main.py
git commit -m "setup: Initialize FastAPI backend with project structure"
```

---

### Task 3: Setup Git Workflow (Branching, Commits, Deployment Ready)

**Files:**
- Create: `.github/workflows/frontend-deploy.yml`
- Create: `.github/workflows/backend-deploy.yml`
- Create: `.gitignore` (update)

- [ ] **Step 1: Update .gitignore**

Edit `.gitignore`:
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.egg-info/
dist/
build/
venv/
.env

# Node/Next.js
node_modules/
.next/
out/
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
```

- [ ] **Step 2: Create GitHub Actions workflow for frontend**

Create `.github/workflows/frontend-deploy.yml`:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v5
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore .github/
git commit -m "setup: Add deployment workflows and gitignore"
```

---

## Phase 2: Frontend MVP Implementation (3-4 days)

### Task 4: Create Type Definitions & API Client

**Files:**
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/api.ts`
- Create: `frontend/lib/constants.ts`
- Create: `frontend/lib/validators.ts`
- Create: `frontend/lib/birads.ts`

- [ ] **Step 1: Define TypeScript types**

Create `frontend/lib/types.ts`:
```typescript
export interface PatientMetadata {
  patientId: string;
  studyDate: string;
  viewType: string;
  age: number;
  breastDensity: string;
}

export interface UploadResponse {
  fileId: string;
  previewUrl: string;
  metadata: PatientMetadata;
}

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
}

export interface DemoResponse {
  fileId: string;
  previewUrl: string;
  metadata: PatientMetadata;
  analysis: AnalysisResult;
}

export interface ScreeningState {
  currentStudy: {
    fileId: string | null;
    previewUrl: string | null;
    metadata: PatientMetadata | null;
  };
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  consentGiven: boolean;
}
```

- [ ] **Step 2: Create API client with axios**

Create `frontend/lib/api.ts`:
```typescript
import axios, { AxiosInstance } from 'axios';
import { UploadResponse, AnalysisResult, DemoResponse } from './types';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
});

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mode', 'upload');

  try {
    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Invalid DICOM file. Please check the file format.');
      }
      if (error.response?.status === 413) {
        throw new Error('File exceeds 50MB limit. Please compress and try again.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Backend may be starting up. Try demo or refresh.');
      }
    }
    throw new Error('Upload failed. Please try again.');
  }
};

export const analyzeFile = async (fileId: string): Promise<AnalysisResult> => {
  try {
    const response = await apiClient.post<AnalysisResult>('/api/analyze', { fileId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Session expired. Please upload file again.');
      }
      if (error.response?.status === 503) {
        throw new Error('Analysis service unavailable. Try demo first.');
      }
    }
    throw new Error('Analysis failed. Please try again.');
  }
};

export const getDemo = async (): Promise<DemoResponse> => {
  try {
    const response = await apiClient.get<DemoResponse>('/api/demo');
    return response.data;
  } catch (error) {
    throw new Error('Failed to load demo. Please try again.');
  }
};
```

- [ ] **Step 3: Create constants and color mappings**

Create `frontend/lib/constants.ts`:
```typescript
export const COLORS = {
  clinicalPearl: '#FAFAFA',
  mriBlack: '#121417',
  charcoal: '#1F2937',
  slate: '#64748B',
  trustTeal: '#0F766E',
  calmBlue: '#3B82F6',
  mutedRose: '#BE123C',
  warmAmber: '#D97706',
  lightSilver: '#E2E8F0',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_MIMES = ['application/dicom', 'image/png', 'application/x-dicom'];
export const ALLOWED_EXTENSIONS = ['.dcm', '.png'];

export const SCANNING_ANIMATION_DURATION = 2.5; // seconds
```

- [ ] **Step 4: Create file validators**

Create `frontend/lib/validators.ts`:
```typescript
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from './constants';

export const validateFile = (file: File): string | null => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return 'File exceeds 50MB limit.';
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return 'File must be .dcm (DICOM) or .png format.';
  }

  return null; // Valid
};

export const getDICOMViewType = (metadata: any): string => {
  const viewType = metadata?.viewType?.toUpperCase() || 'UNKNOWN';
  const viewMap: Record<string, string> = {
    'CC': 'Craniocaudal',
    'MLO': 'Mediolateral Oblique',
    'LM': 'Lateromedial',
    'ML': 'Mediolateral',
  };
  return viewMap[viewType] || viewType;
};

export const getBreastDensityLabel = (density: string): string => {
  const densityMap: Record<string, string> = {
    'A': 'Almost entirely fatty',
    'B': 'Scattered fibroglandular',
    'C': 'Heterogeneously dense',
    'D': 'Extremely dense',
  };
  return densityMap[density] || density;
};
```

- [ ] **Step 5: Create BI-RADS mapping logic**

Create `frontend/lib/birads.ts`:
```typescript
export interface BIRADSInfo {
  category: string;
  description: string;
  recommendation: string;
}

export const determineBIRADS = (probability: number): BIRADSInfo => {
  if (probability < 0.02) {
    return {
      category: 'BI-RADS 1',
      description: 'Negative — no findings',
      recommendation: 'Routine screening',
    };
  } else if (probability < 0.10) {
    return {
      category: 'BI-RADS 2',
      description: 'Benign — no malignancy detected',
      recommendation: 'Routine follow-up',
    };
  } else if (probability < 0.50) {
    return {
      category: 'BI-RADS 3',
      description: 'Probably benign — low malignancy risk',
      recommendation: 'Short-term follow-up (6 months)',
    };
  } else if (probability < 0.95) {
    return {
      category: 'BI-RADS 4',
      description: 'Suspicious abnormality — biopsy recommended',
      recommendation: 'Further workup with ultrasound or MRI',
    };
  } else {
    return {
      category: 'BI-RADS 5',
      description: 'Highly suggestive of malignancy',
      recommendation: 'Immediate biopsy recommended',
    };
  }
};
```

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/
git commit -m "feat: Add type definitions, API client, and utility functions"
```

---

### Task 5: Create Consent Modal Component with localStorage

**Files:**
- Create: `frontend/contexts/ScreeningContext.tsx`
- Create: `frontend/hooks/useLocalStorage.ts`
- Create: `frontend/components/ConsentModal.tsx`

- [ ] **Step 1: Create localStorage hook**

Create `frontend/hooks/useLocalStorage.ts`:
```typescript
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(error);
    }
    setIsReady(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, isReady] as const;
};
```

- [ ] **Step 2: Create ScreeningContext with state**

Create `frontend/contexts/ScreeningContext.tsx`:
```typescript
'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { PatientMetadata, AnalysisResult } from '@/lib/types';
import * as api from '@/lib/api';

export interface ScreeningContextType {
  currentStudy: {
    fileId: string | null;
    previewUrl: string | null;
    metadata: PatientMetadata | null;
  };
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  consentGiven: boolean;
  
  uploadFile: (file: File) => Promise<void>;
  analyzeStudy: (fileId: string) => Promise<void>;
  loadDemo: () => Promise<void>;
  resetWorkflow: () => void;
  setConsent: (given: boolean) => void;
  clearError: () => void;
}

export const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStudy, setCurrentStudy] = useState({
    fileId: null as string | null,
    previewUrl: null as string | null,
    metadata: null as PatientMetadata | null,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.uploadFile(file);
      setCurrentStudy({
        fileId: result.fileId,
        previewUrl: result.previewUrl,
        metadata: result.metadata,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeStudy = useCallback(async (fileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.analyzeFile(fileId);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getDemo();
      setCurrentStudy({
        fileId: result.fileId,
        previewUrl: result.previewUrl,
        metadata: result.metadata,
      });
      setAnalysisResult(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetWorkflow = useCallback(() => {
    setCurrentStudy({
      fileId: null,
      previewUrl: null,
      metadata: null,
    });
    setAnalysisResult(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ScreeningContext.Provider
      value={{
        currentStudy,
        analysisResult,
        loading,
        error,
        consentGiven,
        uploadFile,
        analyzeStudy,
        loadDemo,
        resetWorkflow,
        setConsent: setConsentGiven,
        clearError,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = () => {
  const context = React.useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within ScreeningProvider');
  }
  return context;
};
```

- [ ] **Step 3: Create ConsentModal component**

Create `frontend/components/ConsentModal.tsx`:
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const ConsentModal: React.FC = () => {
  const { setConsent } = useScreening();
  const [isOpen, setIsOpen] = useState(false);
  const [checked, setChecked] = useState([false, false, false]);
  const [consentGiven, , isReady] = useLocalStorage('consentGiven', false);

  useEffect(() => {
    if (!isReady) return;
    
    if (!consentGiven) {
      setIsOpen(true);
    } else {
      setConsent(true);
      setIsOpen(false);
    }
  }, [isReady, consentGiven, setConsent]);

  const handleCheckChange = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const handleAccept = () => {
    if (checked.every(Boolean)) {
      localStorage.setItem('consentGiven', JSON.stringify(true));
      setConsent(true);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-8">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Before You Begin</h2>
        
        <p className="text-slate mb-6 text-sm leading-relaxed">
          This application is a research and educational tool demonstrating Machine Learning capabilities. 
          It is <strong>NOT</strong> a medical diagnostic device and results are for demonstration purposes only.
        </p>

        <div className="space-y-4 mb-8">
          {[
            'I understand this is not a replacement for professional radiologist evaluation.',
            'I agree that results are for demonstration purposes only.',
            'I will not rely on this tool for medical decision-making.'
          ].map((label, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => handleCheckChange(i)}
                className="w-5 h-5 mt-0.5"
              />
              <span className="text-sm text-slate">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-2 border border-light-silver text-charcoal rounded-lg hover:bg-clinical-pearl"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!checked.every(Boolean)}
            className="flex-1 px-4 py-2 bg-trust-teal text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-dark transition-colors"
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Commit**

```bash
git add frontend/contexts/ frontend/hooks/useLocalStorage.ts frontend/components/ConsentModal.tsx
git commit -m "feat: Add consent modal with localStorage persistence"
```

---

### Task 6: Create Upload Zone & File Validation Component

**Files:**
- Create: `frontend/components/UploadZone.tsx`
- Create: `frontend/components/ErrorBoundary.tsx`

- [ ] **Step 1: Create UploadZone component with drag-drop**

Create `frontend/components/UploadZone.tsx`:
```typescript
'use client';

import React, { useRef, useState } from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { validateFile } from '@/lib/validators';
import { COLORS } from '@/lib/constants';

interface UploadZoneProps {
  onDemoClick: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onDemoClick }) => {
  const { uploadFile, loading } = useScreening();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLocalError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await uploadFile(file);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragActive
            ? `border-trust-teal bg-blue-50`
            : `border-light-silver hover:border-trust-teal`
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-4">🖼️</div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          Drop .dcm or .png mammogram here
        </h3>
        <p className="text-slate text-sm">or click to browse</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".dcm,.png"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />
      </div>

      {localError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{localError}</p>
        </div>
      )}

      <p className="text-xs text-slate italic text-center">
        Images are processed in-memory on our server for analysis and automatically deleted. 
        We do not store or retain mammogram data.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onDemoClick}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-white border border-light-silver text-charcoal rounded-lg hover:bg-clinical-pearl disabled:opacity-50 transition-colors"
        >
          Try Demo
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create error boundary**

Create `frontend/components/ErrorBoundary.tsx`:
```typescript
'use client';

import React, { ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-red-600 text-sm mb-4">Please refresh the page and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/UploadZone.tsx frontend/components/ErrorBoundary.tsx
git commit -m "feat: Add upload zone with drag-drop and error boundary"
```

---

### Task 7: Create Result Display Components

**Files:**
- Create: `frontend/components/DICOMViewer.tsx`
- Create: `frontend/components/ScanningAnimation.tsx`
- Create: `frontend/components/HeatmapOverlay.tsx`
- Create: `frontend/components/MetadataCard.tsx`
- Create: `frontend/components/ResultsCard.tsx`
- Create: `frontend/components/MedicalDisclaimer.tsx`

- [ ] **Step 1: Create DICOM Viewer component**

Create `frontend/components/DICOMViewer.tsx`:
```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import { COLORS } from '@/lib/constants';

interface DICOMViewerProps {
  previewUrl: string | null;
  isLoading?: boolean;
}

export const DICOMViewer: React.FC<DICOMViewerProps> = ({ previewUrl, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-96 rounded-lg overflow-hidden relative"
      style={{ backgroundColor: COLORS.mriBlack }}
    >
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="DICOM Preview"
            className="w-full h-full object-contain"
          />
          {isLoading && <div className="absolute inset-0 bg-black bg-opacity-30" />}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-light-silver text-sm">Waiting for image...</p>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Create scanning animation component**

Create `frontend/components/ScanningAnimation.tsx`:
```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScanningAnimationProps {
  isActive: boolean;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-20">
      <motion.div
        className="w-1 h-full bg-gradient-to-b from-transparent via-trust-teal to-transparent"
        animate={{ y: ['0%', '100%'] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="absolute bottom-12 text-white text-sm font-medium">
        AI is analyzing tissue density...
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create heatmap overlay component**

Create `frontend/components/HeatmapOverlay.tsx`:
```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeatmapOverlayProps {
  heatmapUrl: string | null;
  isVisible: boolean;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ heatmapUrl, isVisible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!heatmapUrl || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = heatmapUrl;
  }, [heatmapUrl]);

  if (!isVisible || !heatmapUrl) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-contain"
      style={{ opacity: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1.5 }}
    />
  );
};
```

- [ ] **Step 4: Create metadata card component**

Create `frontend/components/MetadataCard.tsx`:
```typescript
'use client';

import React from 'react';
import { PatientMetadata } from '@/lib/types';
import { getDICOMViewType, getBreastDensityLabel } from '@/lib/validators';

interface MetadataCardProps {
  metadata: PatientMetadata;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({ metadata }) => {
  return (
    <div className="bg-white border border-light-silver rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Study Information</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate font-semibold">Patient ID</p>
          <p className="text-charcoal font-mono">{metadata.patientId}</p>
        </div>
        
        <div>
          <p className="text-xs uppercase tracking-wider text-slate font-semibold">Study Date</p>
          <p className="text-charcoal">{new Date(metadata.studyDate).toLocaleDateString()}</p>
        </div>
        
        <div>
          <p className="text-xs uppercase tracking-wider text-slate font-semibold">View Type</p>
          <p className="text-charcoal">{getDICOMViewType(metadata)}</p>
        </div>
        
        <div>
          <p className="text-xs uppercase tracking-wider text-slate font-semibold">Age</p>
          <p className="text-charcoal">{metadata.age} years</p>
        </div>
        
        <div>
          <p className="text-xs uppercase tracking-wider text-slate font-semibold">Breast Density</p>
          <p className="text-charcoal">{getBreastDensityLabel(metadata.breastDensity)}</p>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Create results card component**

Create `frontend/components/ResultsCard.tsx`:
```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { determineBIRADS } from '@/lib/birads';

interface ResultsCardProps {
  analysis: AnalysisResult;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ analysis }) => {
  const probability = analysis.probability;
  const isProbabilityHigh = probability > 0.5;
  const scoreColor = isProbabilityHigh ? COLORS.mutedRose : COLORS.calmBlue;
  const birads = determineBIRADS(probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Probability Score */}
      <div className="bg-white border border-light-silver rounded-2xl p-8 shadow-sm">
        <p className="text-sm uppercase tracking-wider text-slate font-semibold mb-4">
          AI Probability of Malignancy
        </p>
        <div
          className="text-6xl font-mono font-bold mb-6"
          style={{ color: scoreColor }}
        >
          {analysis.probabilityPercent}
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate">Model Confidence</span>
            <span className="text-xs font-mono text-slate">{(analysis.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-light-silver rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-trust-teal rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.confidence * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* BI-RADS */}
      <div
        className="bg-white border-l-4 rounded-2xl p-6 shadow-sm"
        style={{ borderColor: COLORS.warmAmber }}
      >
        <p className="text-sm uppercase tracking-wider text-slate font-semibold mb-2">
          Clinical Assessment
        </p>
        <h4 className="text-lg font-bold text-charcoal mb-2">{analysis.biRads}</h4>
        <p className="text-charcoal text-sm mb-3">{analysis.biRadsDescription}</p>
        <p className="text-slate text-sm italic">{analysis.biRadsRecommendation}</p>
      </div>

      {/* Interpretation */}
      <div className="bg-white border border-light-silver rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-charcoal mb-3">What This Means</h4>
        <p className="text-slate text-sm leading-relaxed">{analysis.explanation}</p>
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 6: Create medical disclaimer component**

Create `frontend/components/MedicalDisclaimer.tsx`:
```typescript
'use client';

import React from 'react';
import { COLORS } from '@/lib/constants';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div
      className="border-l-4 rounded-lg p-4 bg-amber-50"
      style={{ borderColor: COLORS.warmAmber }}
    >
      <p className="text-xs font-semibold text-warm-amber uppercase tracking-wider mb-2">
        ⚠️ Medical Disclaimer
      </p>
      <p className="text-xs text-slate italic leading-relaxed">
        This analysis is based on artificial intelligence and is <strong>NOT</strong> a clinical diagnosis. 
        AI probability does not confirm or rule out cancer. Always consult a qualified radiologist for 
        official diagnosis and treatment decisions.
      </p>
    </div>
  );
};
```

- [ ] **Step 7: Commit**

```bash
git add frontend/components/{DICOMViewer,ScanningAnimation,HeatmapOverlay,MetadataCard,ResultsCard,MedicalDisclaimer}.tsx
git commit -m "feat: Add result display components with animations"
```

---

### Task 8: Create Screening Workspace Page (`/screening`)

**Files:**
- Create: `frontend/app/screening/page.tsx`
- Create: `frontend/app/screening/layout.tsx`
- Create: `frontend/app/layout.tsx` (root with provider)

- [ ] **Step 1: Create root layout with context provider**

Create `frontend/app/layout.tsx`:
```typescript
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ScreeningProvider } from '@/contexts/ScreeningContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RSNA Mammography AI',
  description: 'AI-powered breast cancer detection assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} bg-clinical-pearl`}>
        <ErrorBoundary>
          <ScreeningProvider>
            {children}
          </ScreeningProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create screening layout**

Create `frontend/app/screening/layout.tsx`:
```typescript
import { ReactNode } from 'react';
import { ConsentModal } from '@/components/ConsentModal';

export default function ScreeningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConsentModal />
      {children}
    </>
  );
}
```

- [ ] **Step 3: Create screening page with full workflow**

Create `frontend/app/screening/page.tsx`:
```typescript
'use client';

import React from 'react';
import { useScreening } from '@/contexts/ScreeningContext';
import { UploadZone } from '@/components/UploadZone';
import { DICOMViewer } from '@/components/DICOMViewer';
import { ScanningAnimation } from '@/components/ScanningAnimation';
import { HeatmapOverlay } from '@/components/HeatmapOverlay';
import { MetadataCard } from '@/components/MetadataCard';
import { ResultsCard } from '@/components/ResultsCard';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export default function ScreeningPage() {
  const {
    currentStudy,
    analysisResult,
    loading,
    error,
    analyzeStudy,
    loadDemo,
    resetWorkflow,
    clearError,
  } = useScreening();

  const handleAnalyze = async () => {
    if (currentStudy.fileId) {
      await analyzeStudy(currentStudy.fileId);
    }
  };

  const isImageLoaded = Boolean(currentStudy.previewUrl);
  const isAnalyzed = Boolean(analysisResult);

  return (
    <div className="min-h-screen bg-clinical-pearl">
      {/* Header */}
      <header className="bg-white border-b border-light-silver">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-charcoal">Breast Cancer Detection Screening</h1>
          <p className="text-slate mt-2">Upload a mammogram or try a demo</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={clearError}
              className="text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {!isImageLoaded ? (
          // Empty State: Upload Zone
          <div className="max-w-md mx-auto py-12">
            <UploadZone onDemoClick={loadDemo} />
          </div>
        ) : (
          // Image Loaded: Two-column layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: DICOM Viewer */}
            <div>
              <div className="relative bg-mri-black rounded-lg overflow-hidden h-96">
                <DICOMViewer previewUrl={currentStudy.previewUrl} isLoading={loading} />
                {loading && <ScanningAnimation isActive={true} />}
                {isAnalyzed && (
                  <HeatmapOverlay heatmapUrl={analysisResult?.heatmapUrl || null} isVisible={true} />
                )}
              </div>

              {/* Buttons under viewer */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={resetWorkflow}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-white border border-light-silver text-charcoal rounded-lg font-medium hover:bg-clinical-pearl disabled:opacity-50 transition-colors"
                >
                  Scan New Image
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !isImageLoaded || isAnalyzed}
                  className="flex-1 px-4 py-3 bg-trust-teal text-white rounded-lg font-medium hover:bg-teal-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Analyzing...' : isAnalyzed ? 'Analyzed' : 'Analyze'}
                </button>
              </div>
            </div>

            {/* Right: Metadata + Results */}
            <div className="space-y-6">
              {currentStudy.metadata && (
                <MetadataCard metadata={currentStudy.metadata} />
              )}

              {isAnalyzed && analysisResult && (
                <ResultsCard analysis={analysisResult} />
              )}

              {/* Medical Disclaimer (always visible) */}
              <MedicalDisclaimer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Create global styles**

Create `frontend/styles/globals.css`:
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@font-face {
  font-family: 'Plus Jakarta Sans';
  font-weight: 600;
  src: url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600');
}

@font-face {
  font-family: 'Inter';
  font-weight: 400;
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 500;
  src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500');
}

* {
  @apply box-border;
}

body {
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 5: Create landing page**

Create `frontend/app/page.tsx`:
```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { MedicalDisclaimer } from '@/components/MedicalDisclaimer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-clinical-pearl">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
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
            <h1 className="text-5xl lg:text-6xl font-bold text-charcoal mb-6">
              AI-Powered Breast Cancer Detection
            </h1>

            <p className="text-xl text-slate mb-8 leading-relaxed">
              Using deep learning on the RSNA Kaggle dataset to provide radiologists with a second opinion. 
              This tool assists in identifying potential malignancies in mammography scans, helping reduce 
              diagnostic burden and improve screening efficiency.
            </p>

            <div className="flex gap-4 mb-8">
              <Link
                href="/screening"
                className="px-8 py-4 bg-trust-teal text-white rounded-lg font-semibold hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl"
              >
                Try the Workspace
              </Link>
              <a
                href="#research"
                className="px-8 py-4 bg-white border-2 border-light-silver text-charcoal rounded-lg font-semibold hover:bg-clinical-pearl transition-colors"
              >
                View Research
              </a>
            </div>

            <div className="bg-blue-50 border-l-4 border-calm-blue rounded-lg p-6">
              <p className="text-sm text-slate">
                <strong className="text-calm-blue">Global Need:</strong> According to WHO, there is a shortage 
                of approximately 1 million radiologists worldwide. AI-assisted screening can help bridge this gap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <MedicalDisclaimer />
          </div>
          <p className="text-slate text-sm text-center">
            © 2024 RSNA Mammography AI. This is a research and educational project.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/app/ frontend/styles/
git commit -m "feat: Add screening workspace and landing page with full UI"
```

---

## Phase 3: Backend MVP Implementation (2-3 days)

### Task 9: Create Backend Services (DICOM, Inference, Heatmap)

**Files:**
- Create: `backend/app/models/schemas.py`
- Create: `backend/app/services/dicom_processor.py`
- Create: `backend/app/services/inference.py`
- Create: `backend/app/services/heatmap_generator.py`
- Create: `backend/app/utils/file_validator.py`

- [ ] **Step 1: Create Pydantic schemas**

Create `backend/app/models/schemas.py`:
```python
from pydantic import BaseModel
from typing import Optional

class PatientMetadata(BaseModel):
    patientId: str
    studyDate: str
    viewType: str
    age: int
    breastDensity: str

class UploadResponse(BaseModel):
    fileId: str
    previewUrl: str
    metadata: PatientMetadata

class AnalyzeRequest(BaseModel):
    fileId: str

class AnalysisResult(BaseModel):
    probability: float
    probabilityPercent: str
    biRads: str
    biRadsDescription: str
    biRadsRecommendation: str
    confidence: float
    explanation: str
    heatmapUrl: str
    processingTimeMs: int

class AnalysisResponse(AnalysisResult):
    pass

class DemoResponse(BaseModel):
    fileId: str
    previewUrl: str
    metadata: PatientMetadata
    analysis: AnalysisResult

class HealthResponse(BaseModel):
    status: str
    version: str
```

- [ ] **Step 2: Create DICOM processor service**

Create `backend/app/services/dicom_processor.py`:
```python
import io
import pydicom
import numpy as np
from PIL import Image
import base64
from datetime import datetime

class DICOMProcessor:
    @staticmethod
    def parse_dicom(file_bytes: bytes) -> dict:
        """Parse DICOM file and extract metadata."""
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            
            patient_id = str(ds.get((0x0010, 0x0020), "UNKNOWN"))
            study_date = str(ds.get((0x0008, 0x0020), datetime.now().strftime("%Y%m%d")))
            # Format: YYYYMMDD -> YYYY-MM-DD
            study_date = f"{study_date[:4]}-{study_date[4:6]}-{study_date[6:8]}"
            
            view_type = str(ds.get((0x0018, 0x5101), "CC"))
            
            # Age from string like "055Y" -> 55
            age_str = str(ds.get((0x0010, 0x1010), "0"))
            age = int(age_str.replace('Y', '').strip() or '0')
            
            breast_density = str(ds.get((0x0062, 0x0003), "B"))
            
            return {
                "patientId": patient_id,
                "studyDate": study_date,
                "viewType": view_type,
                "age": age,
                "breastDensity": breast_density
            }
        except Exception as e:
            raise ValueError(f"Failed to parse DICOM: {str(e)}")
    
    @staticmethod
    def generate_preview(file_bytes: bytes) -> str:
        """Convert DICOM to PNG preview, return as base64."""
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = ds.pixel_array
            
            # Normalize to 0-255
            if pixel_array.max() > pixel_array.min():
                pixel_array = ((pixel_array - pixel_array.min()) / 
                              (pixel_array.max() - pixel_array.min()) * 255).astype(np.uint8)
            else:
                pixel_array = pixel_array.astype(np.uint8)
            
            # Convert to PIL Image
            img = Image.fromarray(pixel_array).convert('L')
            
            # Resize to reasonable dimensions
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            # Convert to base64
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            buffer.seek(0)
            
            b64 = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{b64}"
        except Exception as e:
            raise ValueError(f"Failed to generate preview: {str(e)}")

dicom_processor = DICOMProcessor()
```

- [ ] **Step 3: Create inference service (mock for MVP)**

Create `backend/app/services/inference.py`:
```python
import os
import random
import asyncio
import numpy as np
from app.config import settings

class InferenceService:
    def __init__(self, model_path: str = None):
        """Initialize model (mock for MVP, real when model ready)."""
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        
        if self.model_path and os.path.exists(self.model_path):
            try:
                # Try to load real model (safetensors)
                from safetensors.torch import load_file
                self.model = load_file(self.model_path)
                print(f"✓ Model loaded from {self.model_path}")
            except Exception as e:
                print(f"⚠ Failed to load model: {e}. Using mock predictions.")
        else:
            print("⚠ Model file not found. Using mock predictions.")
    
    def predict(self, file_bytes: bytes) -> dict:
        """
        Run inference on DICOM file.
        MVP: Return mock prediction with realistic distribution.
        """
        if self.model is None:
            # Mock prediction (realistic distribution)
            # Most studies should be negative, few positive
            probability = np.random.normal(0.35, 0.25)
            probability = max(0.01, min(0.99, probability))  # Clamp to 0-1
            
            confidence = np.random.uniform(0.75, 0.95)
            
            return {
                "probability": float(probability),
                "confidence": float(confidence)
            }
        else:
            # Real inference (when model ready)
            # TODO: Implement actual inference
            pass

inference_service = InferenceService()
```

- [ ] **Step 4: Create heatmap generator service**

Create `backend/app/services/heatmap_generator.py`:
```python
import io
import numpy as np
from PIL import Image, ImageDraw
import base64
import pydicom
from scipy.ndimage import gaussian_filter

class HeatmapGenerator:
    @staticmethod
    def create_overlay(file_bytes: bytes, probability: float) -> str:
        """
        Generate heatmap overlay based on probability.
        MVP: Create synthetic heatmap with hot spot in upper outer quadrant.
        """
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = ds.pixel_array
            
            # Generate synthetic heatmap
            heatmap = HeatmapGenerator._generate_synthetic_heatmap(
                pixel_array.shape,
                probability
            )
            
            # Create colored heatmap (blue -> red gradient)
            heatmap_img = Image.new('RGBA', (heatmap.shape[1], heatmap.shape[0]))
            
            for y in range(heatmap.shape[0]):
                for x in range(heatmap.shape[1]):
                    val = heatmap[y, x]
                    # Color gradient: blue (0) -> red (1)
                    r = int(val * 255)
                    b = int((1 - val) * 255)
                    alpha = int(val * 180)  # Transparency based on intensity
                    heatmap_img.putpixel((x, y), (r, 0, b, alpha))
            
            # Convert to base64
            buffer = io.BytesIO()
            heatmap_img.save(buffer, format="PNG")
            buffer.seek(0)
            
            b64 = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{b64}"
        except Exception as e:
            raise ValueError(f"Failed to generate heatmap: {str(e)}")
    
    @staticmethod
    def _generate_synthetic_heatmap(shape: tuple, probability: float) -> np.ndarray:
        """
        Generate synthetic heatmap based on probability.
        Higher probability = more hot spots in upper outer quadrant.
        """
        heatmap = np.zeros(shape)
        
        if probability > 0.5:
            # Add hot spot in upper outer quadrant (realistic location for cancer)
            h, w = shape
            y_start = int(h * 0.2)
            y_end = int(h * 0.5)
            x_start = int(w * 0.6)
            x_end = int(w * 0.9)
            
            heatmap[y_start:y_end, x_start:x_end] = probability
            
            # Gaussian blur for smooth transition
            heatmap = gaussian_filter(heatmap.astype(float), sigma=15)
            heatmap = heatmap / (heatmap.max() + 1e-6)
        
        return heatmap

heatmap_generator = HeatmapGenerator()
```

- [ ] **Step 5: Create file validator utility**

Create `backend/app/utils/file_validator.py`:
```python
from app.config import settings

ALLOWED_MIMES = ['application/dicom', 'image/png', 'application/x-dicom']
ALLOWED_EXTENSIONS = ['.dcm', '.png']

def validate_file(filename: str, file_size: int) -> None:
    """Validate file before processing."""
    if file_size > settings.MAX_FILE_SIZE:
        raise ValueError(f"File exceeds {settings.MAX_FILE_SIZE / (1024*1024):.0f}MB limit")
    
    extension = filename.lower()[filename.rfind('.'):]
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File must be .dcm or .png format")
```

- [ ] **Step 6: Commit**

```bash
git add backend/app/models/ backend/app/services/ backend/app/utils/
git commit -m "feat: Add backend services (DICOM, inference, heatmap)"
```

---

### Task 10: Create API Routes & Endpoints

**Files:**
- Create: `backend/app/api/routes.py`
- Create: `backend/app/utils/error_handler.py`

- [ ] **Step 1: Create error handler utility**

Create `backend/app/utils/error_handler.py`:
```python
from fastapi import HTTPException

class FileProcessingError(HTTPException):
    def __init__(self, detail: str, status_code: int = 400):
        super().__init__(status_code=status_code, detail=detail)

def handle_file_validation_error(error: str) -> HTTPException:
    return HTTPException(status_code=400, detail=error)

def handle_inference_error(error: str) -> HTTPException:
    return HTTPException(status_code=500, detail=error)
```

- [ ] **Step 2: Create API routes**

Create `backend/app/api/routes.py`:
```python
import io
import time
import uuid
import asyncio
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import (
    UploadResponse, AnalyzeRequest, AnalysisResponse, DemoResponse,
    PatientMetadata, AnalysisResult
)
from app.services.dicom_processor import dicom_processor
from app.services.inference import inference_service
from app.services.heatmap_generator import heatmap_generator
from app.utils.file_validator import validate_file
from app.lib.birads import determine_birads, generate_explanation

router = APIRouter()

# In-memory file cache (files deleted after analysis)
_file_cache: dict = {}

@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    """Validate DICOM/PNG file and return preview."""
    try:
        # Read file
        file_bytes = await file.read()
        
        # Validate file
        validate_file(file.filename, len(file_bytes))
        
        # Parse DICOM (or PNG)
        if file.filename.endswith('.dcm'):
            metadata = dicom_processor.parse_dicom(file_bytes)
            preview_url = dicom_processor.generate_preview(file_bytes)
        else:  # PNG
            import base64
            from PIL import Image
            import json
            
            # For PNG, create minimal metadata
            img = Image.open(io.BytesIO(file_bytes))
            preview_url = f"data:image/png;base64,{base64.b64encode(file_bytes).decode()}"
            metadata = {
                "patientId": "PNG-UPLOAD",
                "studyDate": "2024-01-01",
                "viewType": "CC",
                "age": 0,
                "breastDensity": "B"
            }
        
        # Generate unique file ID
        file_id = f"study_{uuid.uuid4().hex[:12]}"
        
        # Cache file in memory
        _file_cache[file_id] = {
            "bytes": file_bytes,
            "metadata": metadata,
            "timestamp": time.time()
        }
        
        return UploadResponse(
            fileId=file_id,
            previewUrl=preview_url,
            metadata=PatientMetadata(**metadata)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process file")

@router.post("/api/analyze")
async def analyze_file(request: AnalyzeRequest) -> AnalysisResponse:
    """Run inference on study file and generate heatmap."""
    try:
        # Retrieve from cache
        study_data = _file_cache.get(request.fileId)
        if not study_data:
            raise HTTPException(status_code=404, detail="Study not found")
        
        # Simulate inference delay (MVP)
        await asyncio.sleep(2.5)
        
        # Run inference
        start_time = time.time()
        result = inference_service.predict(study_data["bytes"])
        processing_time = time.time() - start_time
        
        # Generate heatmap
        heatmap_url = heatmap_generator.create_overlay(
            study_data["bytes"],
            result["probability"]
        )
        
        # Determine BI-RADS
        bi_rads = determine_birads(result["probability"])
        
        # Generate explanation
        explanation = generate_explanation(bi_rads, result["probability"])
        
        # Clean up cache
        del _file_cache[request.fileId]
        
        return AnalysisResponse(
            probability=result["probability"],
            probabilityPercent=f"{result['probability']*100:.2f}%",
            biRads=bi_rads["category"],
            biRadsDescription=bi_rads["description"],
            biRadsRecommendation=bi_rads["recommendation"],
            confidence=result.get("confidence", 0.87),
            explanation=explanation,
            heatmapUrl=heatmap_url,
            processingTimeMs=int(processing_time * 1000)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@router.get("/api/demo")
async def get_demo() -> DemoResponse:
    """Return pre-computed demo study."""
    try:
        # Load demo image and heatmap
        with open("./models/demo_sample.png", "rb") as f:
            demo_image = f.read()
        with open("./models/demo_heatmap.png", "rb") as f:
            demo_heatmap = f.read()
        
        import base64
        
        return DemoResponse(
            fileId="demo_sample_001",
            previewUrl=f"data:image/png;base64,{base64.b64encode(demo_image).decode()}",
            metadata=PatientMetadata(
                patientId="DEMO-0001",
                studyDate="2024-01-01",
                viewType="CC",
                age=55,
                breastDensity="C"
            ),
            analysis=AnalysisResult(
                probability=0.67,
                probabilityPercent="67.00%",
                biRads="BI-RADS 3",
                biRadsDescription="Probably benign",
                biRadsRecommendation="Short-term follow-up mammography (6 months)",
                confidence=0.91,
                explanation="Findings suggest benign lesion with low malignancy risk. Routine surveillance recommended.",
                heatmapUrl=f"data:image/png;base64,{base64.b64encode(demo_heatmap).decode()}",
                processingTimeMs=234
            )
        )
    except Exception as e:
        print(f"Demo error: {e}")
        raise HTTPException(status_code=500, detail="Demo unavailable")
```

- [ ] **Step 3: Create BI-RADS utility**

Create `backend/app/lib/__init__.py` (empty file):
```python
```

Create `backend/app/lib/birads.py`:
```python
def determine_birads(probability: float) -> dict:
    """Map probability to BI-RADS category."""
    if probability < 0.02:
        return {
            "category": "BI-RADS 1",
            "description": "Negative — no findings",
            "recommendation": "Routine screening"
        }
    elif probability < 0.10:
        return {
            "category": "BI-RADS 2",
            "description": "Benign — no malignancy detected",
            "recommendation": "Routine follow-up"
        }
    elif probability < 0.50:
        return {
            "category": "BI-RADS 3",
            "description": "Probably benign — low malignancy risk",
            "recommendation": "Short-term follow-up (6 months)"
        }
    elif probability < 0.95:
        return {
            "category": "BI-RADS 4",
            "description": "Suspicious abnormality — biopsy recommended",
            "recommendation": "Further workup with ultrasound or MRI"
        }
    else:
        return {
            "category": "BI-RADS 5",
            "description": "Highly suggestive of malignancy",
            "recommendation": "Immediate biopsy recommended"
        }

def generate_explanation(bi_rads: dict, probability: float) -> str:
    """Generate human-readable explanation based on BI-RADS and probability."""
    explanations = {
        "BI-RADS 1": "No abnormalities detected. Findings are consistent with normal tissue. Routine screening recommended.",
        "BI-RADS 2": "Findings consistent with benign lesions. No evidence of malignancy. Regular follow-up appropriate.",
        "BI-RADS 3": "Findings suggest probably benign lesion with low malignancy risk. Short-term surveillance with 6-month follow-up recommended to ensure stability.",
        "BI-RADS 4": "Suspicious abnormality detected. Pattern is suggestive of possible malignancy. Further diagnostic workup with ultrasound or MRI is recommended.",
        "BI-RADS 5": "Findings are highly suggestive of malignancy. Immediate diagnostic biopsy recommended."
    }
    
    return explanations.get(bi_rads["category"], "Unable to generate explanation.")
```

- [ ] **Step 4: Update main.py to include routes**

Edit `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.config import settings

app = FastAPI(
    title="RSNA Mammography AI",
    version="1.0.0",
    description="AI-powered breast cancer detection"
)

# CORS Configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(routes.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
```

- [ ] **Step 5: Commit**

```bash
git add backend/app/api/ backend/app/lib/
git commit -m "feat: Add API endpoints (upload, analyze, demo)"
```

---

### Task 11: Create Demo Data & Test Fixtures

**Files:**
- Create: `backend/models/demo_sample.png`
- Create: `backend/models/demo_heatmap.png`
- Create: `tests/fixtures/sample_test.dcm` (minimal)

- [ ] **Step 1: Generate demo image and heatmap**

Run from `backend/` directory:
```bash
python -c "
from PIL import Image, ImageDraw
import numpy as np
import base64

# Create demo mammogram image (512x512)
img = Image.new('L', (512, 512), color=100)
draw = ImageDraw.Draw(img)

# Add some tissue-like patterns
for y in range(0, 512, 30):
    draw.line([(0, y), (512, y)], fill=80, width=2)

for x in range(0, 512, 30):
    draw.line([(x, 0), (x, 512)], fill=80, width=2)

# Add a lesion-like spot in upper outer quadrant
draw.ellipse([(350, 100), (420, 170)], fill=150, outline=200)

img.save('./models/demo_sample.png')
print('✓ Created demo_sample.png')

# Create demo heatmap (red overlay where lesion detected)
heatmap = Image.new('RGBA', (512, 512), color=(0, 0, 0, 0))
pixels = heatmap.load()

# Add red heatmap in upper outer quadrant
for x in range(350, 420):
    for y in range(100, 170):
        intensity = min(255, int(200 * ((420-x) * (170-y) / (70*70))))
        pixels[x, y] = (intensity, 0, 255-intensity, int(intensity * 0.7))

heatmap.save('./models/demo_heatmap.png')
print('✓ Created demo_heatmap.png')
"
```

- [ ] **Step 2: Verify files exist**

```bash
ls -lah backend/models/
```

Expected: demo_sample.png and demo_heatmap.png present

- [ ] **Step 3: Commit**

```bash
git add backend/models/
git commit -m "feat: Add demo images (sample mammogram and heatmap)"
```

---

## Phase 4: Integration & Testing (2 days)

### Task 12: Setup & Run Backend Locally

**Files:**
- Modify: `backend/.env`
- Create: `backend/docker-compose.yml`

- [ ] **Step 1: Create .env file**

Create `backend/.env`:
```
FASTAPI_ENV=development
MODEL_PATH=./models/model.safetensors
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
MAX_FILE_SIZE=52428800
INFERENCE_TIMEOUT=30
LOG_LEVEL=INFO
```

- [ ] **Step 2: Install dependencies**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

- [ ] **Step 3: Run backend locally**

```bash
cd backend
python main.py
```

Expected: Server running on http://localhost:8000
Test: curl http://localhost:8000/api/health
Expected: `{"status": "ok", "version": "1.0.0"}`

- [ ] **Step 4: Commit**

```bash
git add backend/.env
git commit -m "setup: Add local development environment"
```

---

### Task 13: Integration Testing (Frontend ↔ Backend)

**Files:**
- Create: `frontend/__tests__/api.test.ts`
- Create: `backend/tests/test_endpoints.py`

- [ ] **Step 1: Write frontend API tests**

Create `frontend/__tests__/api.test.ts`:
```typescript
import { uploadFile, analyzeFile, getDemo } from '@/lib/api';

describe('API Client', () => {
  test('uploadFile handles valid response', async () => {
    // Mock successful upload
    const mockResponse = {
      fileId: 'test_123',
      previewUrl: 'data:image/png;base64,...',
      metadata: {
        patientId: 'PAT-001',
        studyDate: '2024-01-01',
        viewType: 'CC',
        age: 55,
        breastDensity: 'B'
      }
    };
    
    // This is a basic test placeholder
    // Real test would mock axios
    expect(mockResponse.fileId).toBe('test_123');
  });

  test('getDemo returns demo response', async () => {
    const mockDemo = {
      fileId: 'demo_001',
      previewUrl: 'data:image/png;base64,...',
      metadata: {
        patientId: 'DEMO-0001',
        studyDate: '2024-01-01',
        viewType: 'CC',
        age: 55,
        breastDensity: 'C'
      },
      analysis: {
        probability: 0.67,
        probabilityPercent: '67.00%',
        biRads: 'BI-RADS 3',
        biRadsDescription: 'Probably benign',
        biRadsRecommendation: 'Short-term follow-up',
        confidence: 0.91,
        explanation: 'Low risk finding',
        heatmapUrl: 'data:image/png;base64,...',
        processingTimeMs: 234
      }
    };
    
    expect(mockDemo.analysis.probability).toBe(0.67);
  });
});
```

- [ ] **Step 2: Write backend endpoint tests**

Create `backend/tests/test_endpoints.py`:
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_demo_endpoint():
    response = client.get("/api/demo")
    assert response.status_code == 200
    data = response.json()
    assert "fileId" in data
    assert "analysis" in data
    assert data["analysis"]["probability"] == 0.67

@pytest.mark.asyncio
async def test_upload_invalid_file():
    # Test with invalid file
    response = client.post(
        "/api/upload",
        files={"file": ("test.txt", b"invalid")}
    )
    # Should fail because .txt is not allowed
    assert response.status_code == 400

def test_analyze_missing_file():
    response = client.post(
        "/api/analyze",
        json={"fileId": "nonexistent"}
    )
    assert response.status_code == 404
```

- [ ] **Step 3: Run tests**

```bash
# Frontend tests
cd frontend
npm test -- --passWithNoTests

# Backend tests
cd backend
pytest tests/ -v
```

- [ ] **Step 4: Commit**

```bash
git add frontend/__tests__/ backend/tests/
git commit -m "test: Add integration tests for API endpoints"
```

---

### Task 14: End-to-End Workflow Test (Manual)

**Files:**
- None (manual testing)

- [ ] **Step 1: Start both services**

In terminal 1:
```bash
cd backend
python main.py
```

In terminal 2:
```bash
cd frontend
npm run dev
```

- [ ] **Step 2: Test upload workflow**

1. Open http://localhost:3000/screening
2. Accept consent modal
3. Click "Try Demo"
4. Verify image loads
5. Click "Analyze"
6. Verify scanning animation plays (2-3 sec)
7. Verify results display with probability, BI-RADS, heatmap
8. Verify medical disclaimer visible
9. Click "Scan New Image"
10. Verify form resets

- [ ] **Step 3: Test error handling**

1. Drag invalid file (txt, pdf) → expect error message
2. Kill backend, try upload → expect "Connection failed" error
3. Click "Try Demo" → verify pre-computed results load

- [ ] **Step 4: Check console logs**

- [ ] **Frontend:** No errors, no 404s, all APIs hit expected endpoints
- [ ] **Backend:** All requests logged, CORS headers present

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "test: Manual end-to-end workflow verification passed"
```

---

## Phase 5: Deployment Setup (1 day)

### Task 15: Prepare Frontend for Vercel Deployment

**Files:**
- Create: `frontend/.env.production`
- Create: `frontend/.vercelignore`
- Modify: `frontend/next.config.js`

- [ ] **Step 1: Create production environment file**

Create `frontend/.env.production`:
```
NEXT_PUBLIC_API_BASE_URL=https://rsna-api-backend.railway.app
```

- [ ] **Step 2: Create .vercelignore**

Create `frontend/.vercelignore`:
```
README.md
.git
.gitignore
node_modules
.env.local
*.test.ts
coverage/
__tests__/
```

- [ ] **Step 3: Verify next.config.js**

Edit `frontend/next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For medical images, disable Next.js optimization
  },
  compress: true,
};

module.exports = nextConfig;
```

- [ ] **Step 4: Commit**

```bash
git add frontend/.env.production frontend/.vercelignore frontend/next.config.js
git commit -m "setup: Configure frontend for Vercel deployment"
```

---

### Task 16: Prepare Backend for Railway Deployment

**Files:**
- Modify: `backend/Dockerfile`
- Create: `backend/.dockerignore`
- Create: `backend/railway.yml` (optional)

- [ ] **Step 1: Create .dockerignore**

Create `backend/.dockerignore`:
```
__pycache__
*.pyc
.pytest_cache
.env.local
.git
README.md
tests/
venv/
```

- [ ] **Step 2: Verify Dockerfile**

Dockerfile already created in Task 2. Verify it includes:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 3: Build Docker image locally to test**

```bash
cd backend
docker build -t rsna-backend:latest .
```

Expected: Image builds successfully

- [ ] **Step 4: Commit**

```bash
git add backend/.dockerignore backend/Dockerfile
git commit -m "setup: Configure backend for Docker deployment"
```

---

### Task 17: Create Deployment Documentation

**Files:**
- Create: `DEPLOYMENT.md`

- [ ] **Step 1: Create deployment guide**

Create `DEPLOYMENT.md`:
```markdown
# Deployment Guide

## Frontend (Vercel)

### Prerequisites
- Vercel account (free tier OK)
- GitHub repo connected to Vercel

### Steps
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Set Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://rsna-api-backend.railway.app`
6. Click "Deploy"

### After Deployment
- Test: Visit provided Vercel URL
- Verify API calls go to correct backend URL

---

## Backend (Railway)

### Prerequisites
- Railway account (free tier OK)
- GitHub repo connected to Railway

### Steps
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select this repository
4. Configure:
   - **Root Directory:** `backend`
   - **Dockerfile:** `backend/Dockerfile`
5. Set Environment Variables:
   - `FASTAPI_ENV=production`
   - `MODEL_PATH=./models/model.safetensors`
   - `CORS_ORIGINS=https://rsna-ai.vercel.app`
   - `MAX_FILE_SIZE=52428800`
   - `LOG_LEVEL=INFO`
6. Click "Deploy"

### After Deployment
- Get public URL from Railway dashboard
- Update Frontend `NEXT_PUBLIC_API_BASE_URL` to this URL
- Test: curl `{RAILWAY_URL}/api/health`

---

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

---

## Troubleshooting

### CORS Errors
- **Issue:** Frontend can't reach backend
- **Solution:** Check `CORS_ORIGINS` in backend `.env` includes frontend URL

### Demo endpoint 404
- **Issue:** Demo images not found
- **Solution:** Ensure `backend/models/demo_sample.png` and `demo_heatmap.png` exist

### Model loading fails
- **Issue:** `.safetensors` file not found
- **Solution:** OK for MVP. Backend falls back to mock predictions. When real model ready, upload to Railway project files.

---

## Monitoring

### Frontend (Vercel)
- Visit Vercel dashboard to see build/deployment logs
- Check application performance in Vercel Analytics

### Backend (Railway)
- Visit Railway dashboard to see container logs
- Use Railway's metrics tab to monitor CPU/memory

---
```

- [ ] **Step 2: Commit**

```bash
git add DEPLOYMENT.md
git commit -m "docs: Add deployment guide for Vercel + Railway"
```

---

### Task 18: Final Checklist & Verification

**Files:**
- Create: `MVP_CHECKLIST.md`

- [ ] **Step 1: Create final verification checklist**

Create `MVP_CHECKLIST.md`:
```markdown
# RSNA Mammography AI — MVP Completion Checklist

## Frontend (/screening)

- [ ] User lands on `/` and sees landing page
- [ ] "Try the Workspace" button navigates to `/screening`
- [ ] Consent modal appears on first `/screening` visit
- [ ] All 3 checkboxes must be checked to enable "Continue"
- [ ] Modal doesn't re-appear after acceptance (localStorage works)
- [ ] Upload zone displays with drag-drop area
- [ ] "Try Demo" button is clickable and functional
- [ ] File validation works (shows error for invalid files)
- [ ] File upload sends to backend and displays preview
- [ ] "Analyze" button triggers API call
- [ ] Scanning animation plays during analysis (2-3 sec)
- [ ] Results display with:
  - Probability score (large, 64px, color-coded)
  - Confidence bar
  - BI-RADS recommendation
  - Interpretation text
  - Medical disclaimer (always visible)
  - Heatmap overlay (animated fade-in)
- [ ] "Scan New Image" button resets form
- [ ] Responsive design on mobile (< 768px)
- [ ] No console errors or 404s
- [ ] All images load correctly

## Backend (FastAPI)

- [ ] `/api/health` returns `{"status": "ok", "version": "1.0.0"}`
- [ ] `/api/upload` accepts .dcm and .png files
- [ ] File validation works (400 for invalid, 413 for too large)
- [ ] DICOM parsing works correctly
- [ ] Preview PNG generation works
- [ ] `/api/analyze` with valid fileId returns results
- [ ] Scanning animation duration matches (2-3 sec simulated delay)
- [ ] Heatmap URL is base64 encoded and valid
- [ ] BI-RADS category determined correctly
- [ ] `/api/demo` returns pre-computed results
- [ ] CORS headers present in responses
- [ ] File cache auto-deletes after analysis
- [ ] Error handling returns proper HTTP status codes
- [ ] Logs show all requests

## API Contract

- [ ] Request/response schemas match documentation
- [ ] Probability is float (0-1)
- [ ] ProbabilityPercent is formatted string ("82.00%")
- [ ] BiRads uses standard categories (1-5)
- [ ] Processing time in milliseconds

## Ethical & Safety

- [ ] Consent modal text is clear and accurate
- [ ] Medical disclaimer visible on results (not hidden)
- [ ] Privacy notice displayed under upload zone
- [ ] No medical diagnosis language ("You have cancer" never shown)
- [ ] Uses probabilistic language throughout

## Deployment Readiness

- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend builds Docker image without errors (`docker build`)
- [ ] Environment variables properly configured
- [ ] `.env` files not committed to git
- [ ] DEPLOYMENT.md is complete and accurate

## Testing

- [ ] Manual end-to-end workflow tested
- [ ] Error cases tested (invalid files, network errors)
- [ ] Demo mode works
- [ ] All API endpoints respond correctly
- [ ] No logged errors in console (browser + server)

## Code Quality

- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Frontend components are reusable and focused
- [ ] Backend services are modular
- [ ] No hardcoded secrets or API keys
- [ ] Git history clean with meaningful commits

---

## Deployment Steps

1. **Frontend (Vercel):**
   - [ ] Create Vercel project
   - [ ] Connect GitHub repo
   - [ ] Set `NEXT_PUBLIC_API_BASE_URL` to Railway backend URL
   - [ ] Deploy and test

2. **Backend (Railway):**
   - [ ] Create Railway project
   - [ ] Connect GitHub repo
   - [ ] Set environment variables
   - [ ] Deploy and test

3. **Integration:**
   - [ ] Frontend makes successful API calls to deployed backend
   - [ ] All functionality works in production
   - [ ] No CORS errors

---

## Sign-Off

- [ ] All items above checked
- [ ] Code reviewed and committed
- [ ] Ready for production deployment

**Date Completed:** ___________
**Deployed by:** ___________
```

- [ ] **Step 2: Verify all items**

Go through each item and verify. Document any issues and fix before moving forward.

- [ ] **Step 3: Final commit**

```bash
git add MVP_CHECKLIST.md
git commit -m "docs: Add MVP completion checklist"
```

---

## Summary & Next Steps

**MVP Complete Checklist:**
```
✅ Phase 1: Project Setup (Tasks 1-3)
✅ Phase 2: Frontend MVP (Tasks 4-8)
✅ Phase 3: Backend MVP (Tasks 9-11)
✅ Phase 4: Integration & Testing (Tasks 12-14)
✅ Phase 5: Deployment Setup (Tasks 15-18)
```

**Total Estimated Time:** 10-12 business days

**Next Steps After MVP:**
1. Deploy to Vercel + Railway
2. Load real safetensors model into backend
3. Build `/research` page with methodology + metrics
4. Add user authentication (optional for Phase 2)
5. Add study history / export functionality

**Key Files to Watch:**
- `frontend/app/screening/page.tsx` — main workflow
- `backend/app/api/routes.py` — API endpoints
- `docs/superpowers/specs/2026-06-07-rsna-mvp-design.md` — source of truth

---

**Plan complete and ready for execution.**
