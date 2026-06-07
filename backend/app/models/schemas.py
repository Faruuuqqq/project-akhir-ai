from pydantic import BaseModel

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
    file_id: str  # Note: The API client sends `file_id` (snake_case)

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