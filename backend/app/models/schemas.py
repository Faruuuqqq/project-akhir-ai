from pydantic import BaseModel

class FindingDetail(BaseModel):
    type: str
    location: str
    side: str
    characteristics: list[str]
    sizeMm: int | None = None
    biRadsAssessment: str

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
    findings: list[FindingDetail] = []
    breastComposition: str = ""
    impression: str = ""

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