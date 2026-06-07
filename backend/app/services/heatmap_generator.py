import io
import numpy as np
from PIL import Image
import base64
import pydicom
from scipy.ndimage import gaussian_filter

class HeatmapGenerator:
    @staticmethod
    def create_overlay(file_bytes: bytes, probability: float) -> str:
        """
        Generate heatmap overlay based on probability.
        MVP: Create synthetic heatmap with hot spot in upper outer quadrant.
        """
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = ds.pixel_array
            
            # Generate synthetic heatmap
            heatmap = HeatmapGenerator._generate_synthetic_heatmap(
                pixel_array.shape,
                probability
            )
            
            # Create colored heatmap (blue -> red gradient)
            heatmap_img = Image.new('RGBA', (heatmap.shape[1], heatmap.shape[0]))
            
            for y in range(heatmap.shape[0]):
                for x in range(heatmap.shape[1]):
                    val = heatmap[y, x]
                    if val > 0.1:  # Only color areas with some activation
                        # Color gradient: blue (0) -> red (1)
                        r = int(val * 255)
                        b = int((1 - val) * 255)
                        alpha = int(val * 180)  # Transparency based on intensity
                        heatmap_img.putpixel((x, y), (r, 0, b, alpha))
            
            # Convert to base64
            buffer = io.BytesIO()
            heatmap_img.save(buffer, format="PNG")
            buffer.seek(0)
            
            b64 = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{b64}"
        except Exception as e:
            # Fallback for non-DICOM (PNG)
            return ""
            
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
            y_start = int(h * 0.2)
            y_end = int(h * 0.5)
            x_start = int(w * 0.6)
            x_end = int(w * 0.9)
            
            heatmap[y_start:y_end, x_start:x_end] = probability
            
            # Gaussian blur for smooth transition
            heatmap = gaussian_filter(heatmap.astype(float), sigma=15)
            heatmap = heatmap / (heatmap.max() + 1e-6)
        
        return heatmap

heatmap_generator = HeatmapGenerator()