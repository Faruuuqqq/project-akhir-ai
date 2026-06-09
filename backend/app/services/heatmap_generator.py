import io
import numpy as np
from PIL import Image
import base64
import pydicom
from scipy.ndimage import gaussian_filter
import torch
import torch.nn.functional as F

class HeatmapGenerator:
    def __init__(self, device='cpu'):
        self.device = device
    
    def create_overlay(self, file_bytes: bytes, probability: float, model=None, is_dicom=True) -> str:
        """
        Generate heatmap overlay using Grad-CAM if model available, else synthetic.
        """
        try:
            if is_dicom:
                ds = pydicom.dcmread(io.BytesIO(file_bytes))
                pixel_array = ds.pixel_array
            else:
                img = Image.open(io.BytesIO(file_bytes)).convert('L')
                pixel_array = np.array(img)
            
            # Always use Grad-CAM if model is available to visualize model focus
            if model is not None:
                heatmap = self._compute_gradcam(pixel_array, model)
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
    
    def _compute_gradcam(self, pixel_array: np.ndarray, model) -> np.ndarray:
        """
        Compute Grad-CAM heatmap using forward/backward hooks on features[8].
        """
        try:
            if pixel_array.max() > pixel_array.min():
                pixel_array = ((pixel_array - pixel_array.min()) /
                              (pixel_array.max() - pixel_array.min()) * 255).astype(np.uint8)
            else:
                pixel_array = pixel_array.astype(np.uint8)

            # Use 3-channel RGB preprocessing (matches model expectation)
            from app.services.inference import inference_service
            img = Image.fromarray(pixel_array).convert('RGB')
            input_tensor = inference_service.transform(img).unsqueeze(0).to(self.device)

            # Target layer: features[8] (final 1x1 conv + BN, right before SiLU + pool)
            target_layer = model.features[8]

            activations = None
            gradients = None

            def forward_hook(module, inp, out):
                nonlocal activations
                activations = out

            def backward_hook(module, grad_inp, grad_out):
                nonlocal gradients
                gradients = grad_out[0]

            fwd_handle = target_layer.register_forward_hook(forward_hook)
            bwd_handle = target_layer.register_full_backward_hook(backward_hook)

            model.eval()
            model.zero_grad()

            with torch.enable_grad():
                input_tensor.requires_grad = True
                output = model(input_tensor)
                prob = torch.sigmoid(output)
                prob.backward()

            fwd_handle.remove()
            bwd_handle.remove()

            if activations is None or gradients is None:
                raise RuntimeError("Failed to capture Grad-CAM activations/gradients")

            # Grad-CAM: weighted sum of activations by gradient importance
            weights = gradients.mean(dim=(2, 3), keepdim=True)
            cam = (weights * activations).sum(dim=1, keepdim=True)
            cam = F.relu(cam)

            cam = cam.squeeze().detach().cpu().numpy()
            cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-6)

            # Resize to original image dimensions
            h, w = pixel_array.shape
            heatmap_resized = Image.fromarray((cam * 255).astype(np.uint8))
            heatmap_resized = heatmap_resized.resize((w, h), Image.Resampling.BILINEAR)

            return np.array(heatmap_resized) / 255.0
        except Exception as e:
            print(f"[WARN] Grad-CAM failed: {e}. Using synthetic.")
            return self._generate_synthetic_heatmap((512, 512), 0.5)
    
    @staticmethod
    def _create_heatmap_image(heatmap: np.ndarray) -> Image.Image:
        """Create colored heatmap image from activation map (vectorized)."""
        h, w = heatmap.shape
        mask = heatmap > 0.1
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[mask, 0] = ((190 - 59) * heatmap[mask] + 59).astype(np.uint8)
        rgba[mask, 1] = ((18 - 130) * heatmap[mask] + 130).astype(np.uint8)
        rgba[mask, 2] = ((60 - 246) * heatmap[mask] + 246).astype(np.uint8)
        rgba[mask, 3] = (heatmap[mask] * 180).astype(np.uint8)
        return Image.fromarray(rgba, mode='RGBA')
    
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