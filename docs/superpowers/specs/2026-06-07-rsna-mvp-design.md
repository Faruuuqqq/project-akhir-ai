# RSNA Mammography AI — MVP Design Specification
**Date:** June 7, 2026  
**Version:** 1.0  
**Status:** Approved for Implementation  

---

## 1. System Overview

**RSNA Mammography AI** is a microservices-based web application where:
- **Frontend** (Next.js 14) runs on Vercel and handles UI, user interactions, and result visualization
- **Backend** (FastAPI) runs independently (Railway/Render) and handles DICOM validation, inference, and heatmap generation

The MVP focuses on achieving a clean, ethically-sound workflow where users can upload mammogram files, receive AI-assisted probability predictions, and view results with clinical-grade presentation.

### Key Design Decision: Microservices (Approach 2)
- **Why:** Allows backend to scale independently, supports model swapping without frontend changes, production-ready from day one
- **Tradeoff:** Slightly more infrastructure overhead, but justified by deployment flexibility

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          VERCEL (Frontend)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App Router                                   │   │
│  │  ├─ / (Landing Page)                                    │   │
│  │  ├─ /screening (Upload + Results Workspace)            │   │
│  │  ├─ /api/proxy/ (optional request forwarding)          │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────────┘
                   │ HTTPS REST API
                   │ (CORS enabled)
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RAILWAY/RENDER (Backend)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI                                                 │   │
│  │  ├─ POST /api/upload (validate DICOM, return preview)  │   │
│  │  ├─ POST /api/analyze (run inference, return results)  │   │
│  │  ├─ GET /api/demo (return pre-computed sample)         │   │
│  │  ├─ GET /api/health (status check)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services                                                │   │
│  │  ├─ dicom_processor.py (pydicom handling)              │   │
│  │  ├─ inference.py (model loading, predictions)          │   │
│  │  ├─ heatmap_generator.py (overlay creation)            │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Models (In-Memory Storage for MVP)                     │   │
│  │  ├─ ./models/model.safetensors (when ready)            │   │
│  │  ├─ ./models/demo_sample.npy (pre-computed heatmap)   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

Data Flow:
1. User uploads file → Frontend sends to /api/upload
2. Backend validates, returns preview + metadata
3. User clicks Analyze → Frontend sends to /api/analyze
4. Backend runs inference (simulated in MVP), generates heatmap
5. Backend returns probability + BI-RADS + heatmap
6. Frontend displays results with animated overlay
```

---

## 3. Frontend Structure (Next.js App Router)

### Directory Layout
```
frontend/
├── app/
│   ├── layout.tsx (root layout, providers)
│   ├── page.tsx (/ landing page)
│   ├── screening/
│   │   ├── page.tsx (/screening main workspace)
│   │   ├── layout.tsx (screening-specific layout)
│   ├── api/
│   │   ├── health/route.ts (status endpoint)
│   └── error.tsx (global error boundary)
├── components/
│   ├── ConsentModal.tsx (informed consent, localStorage)
│   ├── UploadZone.tsx (drag-drop file input)
│   ├── DICOMViewer.tsx (image display container)
│   ├── ScanningAnimation.tsx (vertical scanning line overlay)
│   ├── HeatmapOverlay.tsx (animated heatmap canvas)
│   ├── MetadataCard.tsx (patient info display)
│   ├── ResultsCard.tsx (probability + BI-RADS + interpretation)
│   ├── MedicalDisclaimer.tsx (reusable disclaimer)
│   ├── LoadingSpinner.tsx (optional, minimal)
│   └── ErrorBoundary.tsx (catch errors, display fallback)
├── hooks/
│   ├── useScreening.ts (main state logic + API calls)
│   ├── useLocalStorage.ts (consent persistence)
│   ├── useApiClient.ts (axios/fetch wrapper with timeout)
├── contexts/
│   ├── ScreeningContext.tsx (shared state)
├── lib/
│   ├── api.ts (API endpoints, fetch logic)
│   ├── validators.ts (file validation, error messages)
│   ├── constants.ts (colors, sizes, timeouts)
│   ├── types.ts (TypeScript interfaces)
├── styles/
│   ├── globals.css (Tailwind + custom SVG backgrounds)
│   ├── dicom-viewer.css (dark DICOM container styling)
├── public/
│   ├── demo-sample.png (placeholder demo image)
│   ├── svg/ (contour lines, icons)
├── .env.local (development API base URL)
├── next.config.js
├── tailwind.config.js (DESIGN.md colors/typography)
├── tsconfig.json
└── package.json
```

### Key Files Breakdown

#### `app/page.tsx` (Landing Page)
```
- Hero section with "AI-Powered Breast Cancer Detection"
- One paragraph: value proposition
- WHO statistic for credibility
- Two CTAs: "Try the Workspace" (primary) + "View Research" (secondary link)
- SVG contour background (mammogram tissue lines)
- Footer with medical disclaimer
- Fully responsive (mobile-first)
```

#### `app/screening/page.tsx` (Main Workspace)
```
- Two-column layout (image left, results right)
- Empty state: upload zone + "Try Demo" button
- After upload: image viewer + metadata card
- During analysis: scanning animation plays
- After analysis: results display with animated heatmap
- Conditional rendering based on state
```

#### `components/ConsentModal.tsx`
```
- Modal that appears once per session (localStorage check)
- Three mandatory checkboxes
- "I Understand, Continue" button (disabled until all checked)
- localStorage: { consentGiven: true, timestamp: Date.now() }
- Closes on approval, doesn't re-appear until cache cleared
```

#### `hooks/useScreening.ts` (Core Logic)
```
- State: currentStudy, analysisResult, loading, error, consentGiven
- Methods:
  - uploadFile(file): calls /api/upload, handles errors
  - analyzeStudy(fileId): calls /api/analyze with delay simulation
  - loadDemo(): calls /api/demo
  - resetWorkflow(): clears state, returns to empty state
- Error handling: user-friendly messages for each scenario
```

#### `lib/api.ts`
```
- Base URL from NEXT_PUBLIC_API_BASE_URL
- Axios instance with:
  - 30-second timeout
  - Custom error handler
  - CORS-aware headers
- Exported methods:
  - uploadDICOM(file)
  - analyzeDICOM(fileId)
  - getDemoStudy()
```

---

## 4. Frontend Components (Detailed)

### ConsentModal
**Props:** None (reads/writes to localStorage)  
**Behavior:**
- Shows on first /screening visit only
- Three checkboxes: all must be checked
- Button disabled until all checked
- localStorage entry: `consentGiven: true`
- Does NOT re-appear unless localStorage cleared

**UI:**
```
┌────────────────────────────────────┐
│ Before You Begin — Important       │
├────────────────────────────────────┤
│ This application is a research     │
│ and educational tool...            │
│                                    │
│ ☐ I understand this is not...    │
│ ☐ I agree that results...        │
│ ☐ I will not rely...             │
│                                    │
│ [Cancel]  [I Understand, Continue] │
└────────────────────────────────────┘
```

### UploadZone
**Props:** `onFileSelected: (file) => void`  
**Behavior:**
- Drag-drop area with dashed border
- Light teal background on drag-over
- File input (click to browse)
- Shows "Try Demo" button below
- Validates file type & size before parent callback
- Privacy notice at bottom

**UI (Empty State):**
```
┌──────────────────────────────────┐
│ 🖼️  Drop .dcm or .png here      │
│     or click to browse            │
│                                  │
│ Images processed in-memory,      │
│ automatically deleted.            │
│                                  │
│ [Try Demo]                       │
└──────────────────────────────────┘
```

### DICOMViewer
**Props:** `previewUrl: string, isLoading: boolean`  
**Behavior:**
- Displays DICOM preview (base64 encoded PNG)
- MRI Black background (#121417)
- Centered image
- Shows ScanningAnimation overlay during loading
- Shows HeatmapOverlay after results ready

**UI:**
```
┌──────────────────────────────────┐
│ [MRI Black Background]           │
│       [DICOM Image]              │
│       (centered)                 │
└──────────────────────────────────┘
```

### ScanningAnimation
**Props:** `isActive: boolean`  
**Behavior:**
- Vertical line that moves top-to-bottom over image
- Animation duration: 2-3 seconds (matches backend delay)
- Uses Framer Motion for smooth motion
- Text: "AI is analyzing tissue density..."
- Loops until `isActive = false`

**Tech:**
- `motion.div` from Framer Motion
- CSS keyframes or `animate` property
- Z-index above image, semi-transparent

### HeatmapOverlay
**Props:** `heatmapUrl: string, isVisible: boolean`  
**Behavior:**
- Canvas element overlaid on DICOM image
- Fades in smoothly (1.5s duration) when isVisible = true
- Low opacity (40-60%) to not obscure underlying image
- Color gradient: cool → warm (blue → red)
- Animated on entrance using Framer Motion `fadeIn`

**Tech:**
- HTML Canvas or SVG overlay
- Framer Motion: `initial={{ opacity: 0 }}` → `animate={{ opacity: 0.5 }}`

### MetadataCard
**Props:** `metadata: PatientMetadata`  
**Behavior:**
- Displays patient info in a grid or list
- Fields: ID, Date, View Type, Age, Breast Density
- Labels in uppercase Slate color
- Values in Charcoal
- 16px radius, subtle shadow

**UI:**
```
Patient ID        PAT-10459
Study Date        2024-01-15
View Type         Craniocaudal (CC)
Age               52 years
Breast Density    B (Scattered)
```

### ResultsCard
**Props:** `analysis: AnalysisResult`  
**Behavior:**
- Shows probability score (large, 64px)
- Color-coded: Calm Blue (<50%) or Muted Rose (>50%)
- Confidence bar below score
- BI-RADS section with recommendation
- Interpretation box with explanation
- Medical disclaimer always visible

**UI (High-Risk Example):**
```
┌─────────────────────────────────────┐
│ AI Probability of Malignancy        │
│                                     │
│     82.00%                         │
│     ████████████████░░░░            │ 87% confidence
│                                     │
│ BI-RADS 4: Suspicious               │
│ Recommend further workup with       │
│ ultrasound or MRI                   │
│                                     │
│ What This Means:                    │
│ The model detected irregular tissue │
│ density in the upper outer quadrant │
│ consistent with mass-like findings. │
│ This warrants further clinical      │
│ evaluation.                         │
│                                     │
│ ⚠️ MEDICAL DISCLAIMER               │
│ This analysis is NOT a clinical     │
│ diagnosis. Consult a radiologist.   │
└─────────────────────────────────────┘
```

### MedicalDisclaimer
**Props:** None  
**Behavior:**
- Always visible on results page (not hidden)
- Warm Amber left border (4px solid #D97706)
- Italic text, smaller font (12px)
- Reusable component (can be used in landing + results)

**Text:**
```
⚠️ MEDICAL DISCLAIMER
This analysis is based on artificial intelligence and is NOT a 
clinical diagnosis. AI probability does not confirm or rule out cancer. 
Always consult a qualified radiologist for official diagnosis and 
treatment decisions.
```

---

## 5. Backend Structure (FastAPI)

### Directory Layout
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py (FastAPI app initialization, CORS)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py (endpoint definitions)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── dicom_processor.py (DICOM parsing, validation)
│   │   ├── inference.py (model loading, prediction)
│   │   ├── heatmap_generator.py (heatmap overlay creation)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── schemas.py (Pydantic request/response models)
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── file_validator.py (MIME type, size checks)
│   │   ├── error_handler.py (custom exceptions)
│   │   ├── logger.py (structured logging)
│   ├── config.py (settings, environment variables)
├── models/ (directory for model files)
│   ├── model.safetensors (when ready)
│   └── demo_sample.npy (pre-computed sample heatmap)
├── requirements.txt (dependencies)
├── .env (environment variables)
├── .env.example (template)
├── main.py (entry point for uvicorn)
└── Dockerfile (for deployment)
```

### Main FastAPI App (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.config import settings

app = FastAPI(title="RSNA Mammography AI", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
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

### Endpoint 1: `POST /api/upload`

**Purpose:** Validate DICOM/PNG file and return preview

**Implementation:**
```python
@router.post("/api/upload")
async def upload_file(file: UploadFile) -> UploadResponse:
    """
    Validate DICOM/PNG file, extract metadata, return preview.
    """
    try:
        # 1. Validate file type (MIME, extension)
        validate_file(file)
        
        # 2. Read file into memory
        file_bytes = await file.read()
        
        # 3. Parse DICOM (or PNG if image)
        if file.filename.endswith('.dcm'):
            metadata = dicom_processor.parse_dicom(file_bytes)
            preview_url = dicom_processor.generate_preview(file_bytes)
        else:  # PNG
            metadata = dicom_processor.parse_png_metadata(file_bytes)
            preview_url = f"data:image/png;base64,{base64.b64encode(file_bytes)}"
        
        # 4. Generate unique fileId
        file_id = f"study_{uuid4()}"
        
        # 5. Store in temporary in-memory cache (will be deleted after analysis)
        _file_cache[file_id] = {
            "bytes": file_bytes,
            "metadata": metadata,
            "timestamp": datetime.now()
        }
        
        return UploadResponse(
            fileId=file_id,
            previewUrl=preview_url,
            metadata=metadata
        )
    
    except InvalidFileError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Endpoint 2: `POST /api/analyze`

**Purpose:** Run inference and generate heatmap

**Implementation:**
```python
@router.post("/api/analyze")
async def analyze_file(request: AnalyzeRequest) -> AnalysisResponse:
    """
    Run inference on study file, generate heatmap, return results.
    For MVP: Simulate inference with 2-3 second delay.
    """
    try:
        # 1. Retrieve file from cache
        study_data = _file_cache.get(request.fileId)
        if not study_data:
            raise HTTPException(status_code=404, detail="Study not found")
        
        # 2. Simulate inference delay (MVP)
        await asyncio.sleep(random.uniform(2.0, 3.0))
        
        # 3. Call inference service (mock or real)
        start_time = time.time()
        result = inference_service.predict(study_data["bytes"])
        processing_time = time.time() - start_time
        
        # 4. Generate heatmap
        heatmap_url = heatmap_generator.create_overlay(
            study_data["bytes"],
            result["probability"]
        )
        
        # 5. Determine BI-RADS category
        bi_rads = determine_birads(result["probability"])
        
        # 6. Generate explanation
        explanation = generate_explanation(bi_rads, result["probability"])
        
        # 7. Clean up cached file
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
    
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")
```

### Endpoint 3: `GET /api/demo`

**Purpose:** Return pre-computed demo study

**Implementation:**
```python
@router.get("/api/demo")
async def get_demo_study() -> DemoResponse:
    """
    Return pre-loaded demo study with pre-computed results.
    """
    try:
        # Load demo image from ./models/demo_sample.png
        demo_image = open("./models/demo_sample.png", "rb").read()
        demo_heatmap = open("./models/demo_heatmap.png", "rb").read()
        
        return DemoResponse(
            fileId="demo_sample_001",
            previewUrl=f"data:image/png;base64,{base64.b64encode(demo_image)}",
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
                heatmapUrl=f"data:image/png;base64,{base64.b64encode(demo_heatmap)}",
                processingTimeMs=234
            )
        )
    except Exception as e:
        logger.error(f"Demo loading failed: {e}")
        raise HTTPException(status_code=500, detail="Demo unavailable")
```

### Service: `dicom_processor.py`

```python
import pydicom
import numpy as np
from PIL import Image
import base64

class DICOMProcessor:
    @staticmethod
    def parse_dicom(file_bytes: bytes) -> dict:
        """Parse DICOM file, extract metadata."""
        ds = pydicom.dcmread(io.BytesIO(file_bytes))
        return {
            "patientId": str(ds.get(0x0010, 0x0020, "UNKNOWN")),
            "studyDate": str(ds.get(0x0008, 0x0020, "2024-01-01")),
            "viewType": str(ds.get(0x0018, 0x5101, "CC")),
            "age": int(str(ds.get(0x0010, 0x1010, "0")).replace("Y", "")),
            "breastDensity": str(ds.get(0x0062, 0x0003, "B"))  # DICOM breast density tag
        }
    
    @staticmethod
    def generate_preview(file_bytes: bytes) -> str:
        """Convert DICOM to PNG preview, return base64."""
        ds = pydicom.dcmread(io.BytesIO(file_bytes))
        pixel_array = ds.pixel_array
        
        # Normalize to 0-255
        pixel_array = ((pixel_array - pixel_array.min()) / 
                      (pixel_array.max() - pixel_array.min()) * 255).astype(np.uint8)
        
        # Convert to PIL Image
        img = Image.fromarray(pixel_array)
        
        # Resize to reasonable dimensions (e.g., 512x512)
        img.thumbnail((512, 512), Image.Resampling.LANCZOS)
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        
        return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
```

### Service: `inference.py` (Mock Implementation for MVP)

```python
import asyncio
import random
import numpy as np

class InferenceService:
    def __init__(self, model_path: str = None):
        """
        Initialize model (mock for MVP, real when model ready).
        """
        self.model_path = model_path
        self.model = None
        
        if model_path and os.path.exists(model_path):
            # Load real model (safetensors)
            from safetensors.torch import load_file
            self.model = load_file(model_path)
        else:
            logger.warning("Model not found. Using mock predictions.")
    
    def predict(self, file_bytes: bytes) -> dict:
        """
        Run inference on DICOM file.
        MVP: Return mock prediction with realistic distribution.
        """
        if self.model is None:
            # Mock prediction (realistic distribution)
            probability = random.gauss(0.45, 0.25)  # Mean 0.45, std 0.25
            probability = max(0.01, min(0.99, probability))  # Clamp to 0-1
            
            return {
                "probability": probability,
                "confidence": random.uniform(0.78, 0.95)
            }
        else:
            # Real inference (when model ready)
            # 1. Preprocess file_bytes
            # 2. Run through model
            # 3. Return probability
            pass

inference_service = InferenceService(model_path=os.getenv("MODEL_PATH"))
```

### Service: `heatmap_generator.py`

```python
import numpy as np
from PIL import Image
import base64
import io

class HeatmapGenerator:
    @staticmethod
    def create_overlay(file_bytes: bytes, probability: float) -> str:
        """
        Generate heatmap overlay based on probability.
        MVP: Create synthetic heatmap (random hot spots).
        Real: Use Grad-CAM or attention maps from model.
        """
        # Load original DICOM as image
        ds = pydicom.dcmread(io.BytesIO(file_bytes))
        pixel_array = ds.pixel_array
        
        # Normalize image
        pixel_array = ((pixel_array - pixel_array.min()) / 
                      (pixel_array.max() - pixel_array.min())).astype(np.float32)
        
        # Generate heatmap (synthetic for MVP)
        heatmap = HeatmapGenerator._generate_synthetic_heatmap(
            pixel_array.shape, 
            probability
        )
        
        # Convert to PIL Image (color map: cool → warm)
        heatmap_img = Image.fromarray((heatmap * 255).astype(np.uint8), mode='L')
        heatmap_colored = Image.new('RGBA', heatmap_img.size)
        
        # Apply colormap (blue → red gradient)
        for x in range(heatmap_img.size[0]):
            for y in range(heatmap_img.size[1]):
                val = heatmap_img.getpixel((x, y)) / 255.0
                r = int(val * 255)
                b = int((1 - val) * 255)
                heatmap_colored.putpixel((x, y), (r, 0, b, int(val * 128)))
        
        # Convert to base64
        buffer = io.BytesIO()
        heatmap_colored.save(buffer, format="PNG")
        buffer.seek(0)
        
        return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
    
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
            y_start, y_end = int(h * 0.2), int(h * 0.5)
            x_start, x_end = int(w * 0.6), int(w * 0.9)
            
            heatmap[y_start:y_end, x_start:x_end] = probability
            
            # Gaussian blur for smooth transition
            from scipy.ndimage import gaussian_filter
            heatmap = gaussian_filter(heatmap, sigma=15)
        
        return heatmap / heatmap.max() if heatmap.max() > 0 else heatmap
```

### Pydantic Models (`models/schemas.py`)

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
```

### Configuration (`config.py`)

```python
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    FASTAPI_ENV: str = os.getenv("FASTAPI_ENV", "development")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models/model.safetensors")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "52428800"))  # 50MB
    INFERENCE_TIMEOUT: int = int(os.getenv("INFERENCE_TIMEOUT", "30"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
```

---

## 6. State Management (Frontend)

### `contexts/ScreeningContext.tsx`

```typescript
import React, { createContext, useState } from 'react';

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
}

export const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStudy, setCurrentStudy] = useState({
    fileId: null,
    previewUrl: null,
    metadata: null,
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  
  // ... implementation
  
  return (
    <ScreeningContext.Provider value={{ ... }}>
      {children}
    </ScreeningContext.Provider>
  );
};
```

---

## 7. Deployment Configuration

### Frontend (Vercel)

**Environment Variables (.env.production):**
```
NEXT_PUBLIC_API_BASE_URL=https://rsna-api-backend.railway.app
```

**Deployment Steps:**
1. Connect GitHub repo to Vercel
2. Set env vars in Vercel dashboard
3. Deploy on push to `main` branch

### Backend (Railway)

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Environment Variables (.env):**
```
FASTAPI_ENV=production
MODEL_PATH=./models/model.safetensors
CORS_ORIGINS=https://rsna-ai.vercel.app
MAX_FILE_SIZE=52428800
INFERENCE_TIMEOUT=30
LOG_LEVEL=INFO
```

**Deployment Steps:**
1. Connect GitHub repo to Railway
2. Set env vars in Railway dashboard
3. Deploy on push to `main` branch

---

## 8. Error Handling Matrix

| Scenario | HTTP Status | Frontend Message | Backend Action |
|----------|------------|------------------|----------------|
| Invalid DICOM file | 400 | "File must be a valid DICOM format. Check the file and try again." | Log error, return error JSON |
| File too large (>50MB) | 413 | "File exceeds 50MB limit. Please compress and try again." | Reject, no processing |
| Network timeout | 504 | "Connection lost. Backend may be starting up. Try demo or refresh." | N/A |
| Model not ready | 500 | "Analysis service unavailable. Try demo first." | Return graceful error |
| Unexpected error | 500 | "An unexpected error occurred. Please refresh and try again." | Log full error stack |
| File not found (stale fileId) | 404 | "Session expired. Please upload file again." | Return 404 |

---

## 9. Testing Strategy

### Frontend Testing (Jest + React Testing Library)

```
tests/
├── components/
│   ├── ConsentModal.test.tsx
│   ├── UploadZone.test.tsx
│   ├── ResultsCard.test.tsx
├── hooks/
│   ├── useScreening.test.ts
│   ├── useLocalStorage.test.ts
├── lib/
│   ├── validators.test.ts
│   ├── api.test.ts
```

**Example Test:**
```typescript
describe('ConsentModal', () => {
  test('does not show if localStorage has consentGiven=true', () => {
    localStorage.setItem('consentGiven', 'true');
    render(<ConsentModal />);
    expect(screen.queryByText('Before You Begin')).not.toBeInTheDocument();
  });
  
  test('enables Continue button only when all checkboxes checked', () => {
    render(<ConsentModal />);
    const button = screen.getByRole('button', { name: /Continue/i });
    
    expect(button).toBeDisabled();
    
    screen.getAllByRole('checkbox').forEach(cb => {
      fireEvent.click(cb);
    });
    
    expect(button).toBeEnabled();
  });
});
```

### Backend Testing (pytest)

```
tests/
├── test_endpoints.py
├── test_dicom_processor.py
├── test_inference.py
├── test_heatmap_generator.py
```

**Example Test:**
```python
@pytest.mark.asyncio
async def test_upload_valid_dicom():
    client = TestClient(app)
    with open("tests/fixtures/sample.dcm", "rb") as f:
        response = client.post("/api/upload", files={"file": f})
    
    assert response.status_code == 200
    data = response.json()
    assert "fileId" in data
    assert "previewUrl" in data
    assert data["metadata"]["patientId"] == "PAT-001"
```

---

## 10. Success Criteria (MVP Completion Checklist)

- ✅ User lands on `/` and sees landing page with clear CTAs
- ✅ User navigates to `/screening`, sees informed consent modal
- ✅ User accepts consent, modal doesn't reappear (localStorage works)
- ✅ User can drag-drop .dcm/.png file into upload zone
- ✅ Frontend validates file (size, type) and sends to backend
- ✅ Backend validates DICOM, returns preview + metadata
- ✅ Image loads in DICOM viewer (MRI Black background)
- ✅ User clicks "Analyze", scanning animation plays (2-3 sec)
- ✅ Backend returns results with probability, BI-RADS, explanation, heatmap
- ✅ Heatmap overlays on image with fade-in animation
- ✅ Results display with color-coded probability (Calm Blue <50%, Muted Rose >50%)
- ✅ Medical disclaimer visible below results (always above fold)
- ✅ User can click "Scan New Image" to upload another file
- ✅ User can click "Try Demo" to see pre-computed sample results
- ✅ All error messages are user-friendly and actionable
- ✅ No console errors or 404s in Vercel/Railway logs
- ✅ Mobile-responsive: works on phone, tablet, desktop
- ✅ API contract matches spec (request/response schemas)
- ✅ Timeout handling: requests >30 sec show "Connection lost" message
- ✅ Both services deployed and accessible via public URLs

---

## 11. Notes for Implementation

1. **DICOM Handling:** Use `pydicom` for parsing; generate PNG preview for web display
2. **Model Integration:** When real model ready, replace mock inference logic in `inference_service.predict()`—API contract unchanged
3. **In-Memory Storage:** Files cached in `_file_cache` dict, auto-deleted after analysis (no persistent DB needed for MVP)
4. **Heatmap Generation:** Use synthetic heatmaps for MVP; when model ready, integrate Grad-CAM or model's attention output
5. **CORS:** Backend must allow Vercel domain (e.g., `https://rsna-ai.vercel.app`)
6. **Environment Variables:** Use `.env` files locally; set in Vercel/Railway dashboards for production

---

## 12. Future Enhancements (Post-MVP)

- Real safetensors model loading and inference
- `/research` page with methodology, metrics, BI-RADS explanations
- Study history (localStorage for MVP, PostgreSQL later)
- Batch upload (multiple studies at once)
- Export results to PDF
- User authentication + role-based access
- WebSocket for real-time progress updates
- Model versioning and A/B testing
- HIPAA compliance audit trail

---

**End of Specification**
