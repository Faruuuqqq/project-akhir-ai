# RSNA Mammography AI - Breast Cancer Detection

An AI-powered web application for early breast cancer detection from mammogram images using deep learning. Built with Next.js 14 (Frontend) and FastAPI + PyTorch (Backend).

## Authors
- **Dzikri Fakhry** (140810240056)
- **Achmad Faruq Mahdison** (140810240080)
- **Fardan Fadhilah Andicha Putra** (140810240084)

## Features

- **Upload & Analysis:** Upload DICOM or PNG mammogram files for real-time analysis.
- **AI Probability Scoring:** Malignancy probability (0-100%) with a calculated confidence score.
- **BI-RADS Classification:** Maps AI predictions to BI-RADS categories (1-5) with detailed clinical recommendations in Indonesian.
- **Explainable AI (Grad-CAM):** Automatically generates a heatmap overlay highlighting the exact tissue areas the AI focused on.
- **DICOM Viewer:** Canvas-based medical imaging viewer.
- **Local History:** Saves previous screening results securely in browser local storage (Zero-Data Retention policy).
- **Clinical Demo Mode:** Test the pipeline immediately with a pre-configured sample image.

## Tech Stack

| Layer | Technologies |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Python 3.11+, FastAPI, PyTorch |
| **Model** | EfficientNet-B4 (18.59M parameters) |
| **Processing** | pydicom, Pillow, SciPy, torchvision |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

## AI Architecture

The underlying model is a customized **EfficientNet-B4**:

- **Input:** 512x512 RGB (grayscale DICOM converted to 3-channel).
- **Structure:** 9 MBConv blocks equipped with Squeeze-and-Excitation (SE) attention mechanisms.
- **Custom Head:** `Linear(1792 → 512) → BatchNorm → SiLU → Dropout → Linear(512 → 1)`
- **Output:** Logit → Sigmoid → Malignancy Probability.
- **Total Parameters:** 18.59 Million.

## Project Structure

```text
project-akhir-ai/
├── frontend/               # Next.js 14 (App Router)
│   ├── app/                # Pages (/, /screening, /history, /research, /faq, etc.)
│   ├── components/         # UI components (UploadZone, DICOMViewer, ResultsCard, etc.)
│   ├── contexts/           # ScreeningContext (React State Management)
│   └── lib/                # API client, types, constants, validators
├── backend/                # FastAPI
│   ├── app/
│   │   ├── main.py         # App setup, CORS, routing
│   │   ├── config.py       # Pydantic Settings (MODEL_PATH, CORS_ORIGINS)
│   │   ├── api/routes.py   # API Endpoints (/upload, /analyze, /demo, /health)
│   │   ├── services/
│   │   │   ├── inference.py        # PyTorch Model Architecture & Inference
│   │   │   └── heatmap_generator.py # Grad-CAM implementation (forward/backward hooks)
│   │   └── lib/
│   │       ├── birads.py           # BI-RADS clinical mapping
│   │       └── dicom_processor.py  # DICOM metadata extraction
│   └── models/             # PyTorch Model weights (.pth)
├── docs/                   # Mermaid architecture diagrams
├── DESIGN.md               # UI/UX Design System Guidelines
└── README.md               # This file
```

## Local Setup & Development

### Prerequisites

- **Frontend:** Node.js 18+
- **Backend:** Python 3.11+ (CUDA-enabled PyTorch recommended if GPU is available)

### Backend Setup

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
source venv/bin/activate # Linux/macOS
venv\Scripts\activate    # Windows

# Install Dependencies
pip install -r requirements.txt

# Setup Environment Variables
cp .env.example .env

# Run Server (Available at http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Setup Environment Variables
cp .env.example .env.local

# Run Development Server (Available at http://localhost:3000)
npm run dev
```

## Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|----------|---------|-----------|
| `MODEL_PATH` | `./models/mammo_ai_mvp_clean.pth` | Path to the PyTorch weights |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed frontend origins (comma-separated) |

### Frontend (`.env.local`)

| Variable | Description |
|----------|-----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL (e.g., `http://localhost:8000`) |

## Deployment

### Frontend ➔ Vercel

```bash
cd frontend
npm run build
```
Deploy the repository to Vercel and ensure `NEXT_PUBLIC_API_BASE_URL` is set in the Vercel Environment Variables pointing to your Railway backend URL.

### Backend ➔ Railway

Connect your repository to Railway. It will automatically detect Python and use `start.sh`.
- Set `CORS_ORIGINS` in Railway env vars to your Vercel URL (e.g., `https://mammo-ai.vercel.app`).
- **Note:** PyTorch requires at least 512MB RAM. Ensure your Railway service plan supports this.

## Disclaimer & License

**Clinical Decision Support Use Only.** This application is developed as an academic final project and is NOT a substitute for professional medical diagnosis. All AI findings must be validated by certified radiologists.

Copyright © 2026. All rights reserved.
