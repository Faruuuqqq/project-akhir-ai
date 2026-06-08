# RSNA Mammography AI — Deteksi Kanker Payudara Berbasis AI

Aplikasi web untuk deteksi kanker payudara dari citra mammogram menggunakan deep learning. Dibangun dengan Next.js 14 (frontend) dan FastAPI + PyTorch (backend).

## Fitur

- **Upload & Analisis Mammogram:** Unggah file DICOM atau PNG untuk analisis real-time
- **AI Probability Scoring:** Probabilitas keganasan (0–100%) dengan confidence score
- **Klasifikasi BI-RADS:** Skor BI-RADS 0–6 dengan deskripsi dan rekomendasi dalam Bahasa Indonesia
- **Heatmap Visualisasi:** Grad-CAM heatmap untuk menunjukkan area yang dianalisis
- **DICOM Viewer:** Viewer citra DICOM berbasis Canvas
- **Mode Demo:** Contoh hasil analisis tanpa perlu upload file

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | Python 3.11+, FastAPI, PyTorch |
| Model | EfficientNet-B4 (18.59M params) |
| Image Processing | pydicom, Pillow, torchvision |
| Deployment | Vercel (frontend), Railway (backend) |

## Model AI

Model menggunakan arsitektur **EfficientNet-B4** yang dimodifikasi:

- Input: 512×512 RGB (grayscale DICOM dikonversi ke 3 channel)
- 9 MBConv blocks dengan Squeeze-and-Excitation (SE)
- Custom head: `Linear(1792→512) → BatchNorm → SiLU → Dropout → Linear(512→1)`
- Output: logit → sigmoid → probabilitas keganasan
- Total parameter: **18,59 juta**

Detail arsitektur lengkap: [`backend/docs/MODEL.md`](backend/docs/MODEL.md)

## Struktur Proyek

```
project-akhir-ai/
├── frontend/               # Next.js 14 (App Router)
│   ├── app/                # Pages (/, /screening, /research, /privacy, /terms)
│   ├── components/         # UI components (UploadZone, DICOMViewer, ResultsCard, dll)
│   ├── contexts/           # ScreeningContext (state management)
│   └── lib/                # API client, types, constants, validators
├── backend/                # FastAPI
│   ├── app/
│   │   ├── main.py         # App setup, CORS, routing
│   │   ├── config.py       # Settings (MODEL_PATH, CORS_ORIGINS)
│   │   ├── api/routes.py   # Endpoints (/upload, /analyze, /demo, /health)
│   │   ├── services/
│   │   │   ├── inference.py        # Arsitektur model + inference pipeline
│   │   │   └── heatmap_generator.py # Grad-CAM heatmap
│   │   └── lib/
│   │       ├── birads.py           # Klasifikasi BI-RADS (Indonesia)
│   │       └── preprocessing.py    # Preprocessing DICOM
│   ├── models/             # Model weights (.pth files)
│   └── docs/
│       └── MODEL.md        # Dokumentasi arsitektur model
├── DESIGN.md               # Panduan desain (Clinical Pearl, Trust Teal)
├── AGENTS.md               # Instruksi untuk AI agent
└── README.md               # File ini
```

## Setup & Menjalankan

### Prasyarat

- **Frontend:** Node.js 18+
- **Backend:** Python 3.11+, PyTorch (disarankan dengan CUDA jika ada GPU)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt

# Setup environment
copy .env.example .env   # atau edit .env sesuai kebutuhan

# Jalankan server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:3000
```

### Build Frontend (Production)

```bash
cd frontend
npm run build            # Output di folder out/
```

## Environment Variables

### Backend (`.env`)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `MODEL_PATH` | `./models/model.safetensors` | Path ke model weights |
| `CORS_ORIGINS` | `http://localhost:3000` | Origin yang diizinkan (pisah dengan koma) |

### Frontend (`.env.local`)

| Variable | Deskripsi |
|----------|-----------|
| `NEXT_PUBLIC_API_BASE_URL` | URL backend (e.g., `http://localhost:8000`) |

## Catatan Model Files

Ada dua file model `.pth` di `backend/models/`:

| File | Ukuran | Deskripsi |
|------|--------|-----------|
| `mammo_ai_mvp_weights.pth` | 71.2 MB | Checkpoint asli — state_dict model dengan prefix `backbone.` |
| `mammo_ai_mvp_clean.pth` | 71.15 MB | State_dict yang sama — dibuat sebagai salinan bersih untuk development |

Keduanya memiliki 713 key state_dict yang identik. Gunakan salah satu dengan mengatur `MODEL_PATH` di `.env`. File `.env` bawaan mengarah ke `mammo_ai_mvp_clean.pth`.

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy folder out/ ke Vercel
# Set NEXT_PUBLIC_API_BASE_URL di Vercel env vars
```

### Backend → Railway

```bash
# Railway akan membaca start.sh
# Set CORS_ORIGINS di Railway env vars
# Pastikan RAM >= 512MB untuk PyTorch
```

## Lisensi

Hak cipta © 2024. Proyek tugas akhir.
