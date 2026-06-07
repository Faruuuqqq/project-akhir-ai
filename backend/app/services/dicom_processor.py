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
            if len(study_date) == 8:
                study_date = f"{study_date[:4]}-{study_date[4:6]}-{study_date[6:8]}"
            
            view_type = str(ds.get((0x0018, 0x5101), "CC"))
            
            # Age from string like "055Y" -> 55
            age_str = str(ds.get((0x0010, 0x1010), "0"))
            age = int(age_str.replace('Y', '').strip() or '0')
            
            breast_density = str(ds.get((0x0062, 0x0003), "B"))
            
            return {
                "patientId": patient_id.value if hasattr(patient_id, 'value') else patient_id,
                "studyDate": study_date,
                "viewType": view_type.value if hasattr(view_type, 'value') else view_type,
                "age": age,
                "breastDensity": breast_density.value if hasattr(breast_density, 'value') else breast_density
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