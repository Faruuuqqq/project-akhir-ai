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
from app.lib.birads import determine_birads, generate_explanation, generate_findings
from app.models.schemas import FindingDetail

router = APIRouter()

# In-memory file cache (files deleted after analysis)
_file_cache: dict = {}

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    """Validate DICOM/PNG file and return preview."""
    try:
        # Read file
        file_bytes = await file.read()
        
        # Validate file
        validate_file(file.filename, len(file_bytes))
        
        # Parse DICOM (or PNG)
        if file.filename.lower().endswith('.dcm'):
            metadata = dicom_processor.parse_dicom(file_bytes)
            preview_url = dicom_processor.generate_preview(file_bytes)
        else:  # PNG
            import base64
            from PIL import Image
            
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

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(request: AnalyzeRequest) -> AnalysisResponse:
    """Run inference on study file and generate heatmap."""
    try:
        # Retrieve from cache
        study_data = _file_cache.get(request.file_id)
        if not study_data:
            raise HTTPException(status_code=404, detail="Study not found or session expired")
        
        # Small delay for realistic UX
        await asyncio.sleep(0.3)
        
        # Run inference
        start_time = time.time()
        result = inference_service.predict(study_data["bytes"])
        processing_time = time.time() - start_time
        
        # Generate heatmap with model for Grad-CAM
        heatmap_url = heatmap_generator.create_overlay(
            study_data["bytes"],
            result["probability"],
            model=inference_service.model
        )
        
        # Determine BI-RADS
        bi_rads = determine_birads(result["probability"])
        
        # Generate explanation
        explanation = generate_explanation(bi_rads, result["probability"])
        
        # Generate structured findings
        breast_density = study_data["metadata"].get("breastDensity", "C")
        findings_data = generate_findings(result["probability"], breast_density)
        
        # Clean up cache
        del _file_cache[request.file_id]
        
        return AnalysisResponse(
            probability=result["probability"],
            probabilityPercent=f"{result['probability']*100:.2f}%",
            biRads=bi_rads["category"],
            biRadsDescription=bi_rads["description"],
            biRadsRecommendation=bi_rads["recommendation"],
            confidence=result.get("confidence", 0.87),
            explanation=explanation,
            heatmapUrl=heatmap_url,
            processingTimeMs=int(processing_time * 1000),
            findings=[FindingDetail(**f) for f in findings_data["findings"]],
            breastComposition=findings_data["breastComposition"],
            impression=findings_data["impression"],
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@router.get("/demo", response_model=DemoResponse)
async def get_demo() -> DemoResponse:
    """Return pre-computed demo study."""
    try:
        # Load demo image and heatmap
        with open("./models/demo_sample.png", "rb") as f:
            demo_image = f.read()
        with open("./models/demo_heatmap.png", "rb") as f:
            demo_heatmap = f.read()
        
        import base64
        
        demo_prob = 0.67
        demo_birads = determine_birads(demo_prob)
        demo_explanation = generate_explanation(demo_birads, demo_prob)
        demo_findings = generate_findings(demo_prob, "C")

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
                probability=demo_prob,
                probabilityPercent="67.00%",
                biRads="BI-RADS 3",
                biRadsDescription=demo_birads["description"],
                biRadsRecommendation=demo_birads["recommendation"],
                confidence=0.91,
                explanation=demo_explanation,
                heatmapUrl=f"data:image/png;base64,{base64.b64encode(demo_heatmap).decode()}",
                processingTimeMs=234,
                findings=[FindingDetail(**f) for f in demo_findings["findings"]],
                breastComposition=demo_findings["breastComposition"],
                impression=demo_findings["impression"],
            )
        )
    except Exception as e:
        print(f"Demo error: {e}")
        raise HTTPException(status_code=500, detail="Demo unavailable")