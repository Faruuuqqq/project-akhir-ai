import io
import pydicom
import numpy as np
from PIL import Image
import base64
from datetime import datetime

class DICOMProcessor:
    @staticmethod
    def _get_tag(ds, tag, default="UNKNOWN"):
        """Extract clean value from DICOM tag."""
        elem = ds.get(tag)
        if elem is None:
            return default
        val = elem.value
        if isinstance(val, pydicom.valuerep.PersonName):
            return str(val)
        if isinstance(val, bytes):
            return val.decode('utf-8', errors='replace')
        return str(val)

    @staticmethod
    def parse_dicom(file_bytes: bytes) -> dict:
        """Parse DICOM file and extract metadata."""
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            
            patient_id = DICOMProcessor._get_tag(ds, (0x0010, 0x0020))
            if patient_id == "UNKNOWN":
                patient_id = None

            study_date = DICOMProcessor._get_tag(ds, (0x0008, 0x0020), default=None)
            if study_date and len(study_date) == 8 and study_date.isdigit():
                study_date = f"{study_date[:4]}-{study_date[4:6]}-{study_date[6:8]}"

            view_type = DICOMProcessor._get_tag(ds, (0x0018, 0x5101), default=None)

            age = None
            age_str = DICOMProcessor._get_tag(ds, (0x0010, 0x1010), default=None)
            if age_str:
                try:
                    age = int(age_str.replace('Y', '').strip())
                except (ValueError, TypeError):
                    age = None

            breast_density = DICOMProcessor._get_tag(ds, (0x0062, 0x0003), default=None)

            return {
                "patientId": patient_id,
                "studyDate": study_date,
                "viewType": view_type,
                "age": age,
                "breastDensity": breast_density,
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