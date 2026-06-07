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
