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
