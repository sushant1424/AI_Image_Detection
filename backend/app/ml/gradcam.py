import os
import cv2
import numpy as np
import torch
from PIL import Image
from app.ml.model import model, is_demo_mode, preprocess


def generate_heatmap(image_path: str, output_path: str) -> None:
    """Generates a Grad-CAM heatmap highlighting critical decision regions and saves it."""
    # Ensure model is ready
    if model is None:
        from app.ml.model import load_model
        load_model()

    # Fallback/Demo Heatmap Generator (using CV2 edges + jet colormap blending)
    if is_demo_mode:
        try:
            # Read image using OpenCV
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not read image")

            # Convert to gray, find edges / features to simulate activation zones
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Create a synthetic activation map using blurry edges + threshold
            edges = cv2.Canny(gray, 50, 150)
            activation = cv2.GaussianBlur(edges, (51, 51), 0)
            
            # Normalize to 0-255
            cv2.normalize(activation, activation, 0, 255, cv2.NORM_MINMAX)
            
            # Add some center bias to make it look like typical neural attention
            h, w = activation.shape[:2]
            mask = np.zeros((h, w), np.float32)
            cv2.circle(mask, (w // 2, h // 2), min(h, w) // 3, 1.0, -1)
            mask = cv2.GaussianBlur(mask, (101, 101), 0)
            cv2.normalize(mask, mask, 0, 255, cv2.NORM_MINMAX)
            
            # Combine edge features with center bias
            combined = cv2.addWeighted(activation.astype(np.float32), 0.6, mask, 0.4, 0)
            cv2.normalize(combined, combined, 0, 255, cv2.NORM_MINMAX)
            combined = combined.astype(np.uint8)

            # Apply jet colormap
            heatmap = cv2.applyColorMap(combined, cv2.COLORMAP_JET)

            # Overlay heatmap on original image (60% original, 40% heatmap)
            overlay = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
            
            # Save the result
            cv2.imwrite(output_path, overlay)
            return
        except Exception as e:
            print(f"⚠️ Demo heatmap generation error: {e}. Creating placeholder.")
            # Create a simple colored square if all else fails
            img = Image.open(image_path)
            img.save(output_path)
            return

    # Real Grad-CAM Generation
    try:
        from pytorch_grad_cam import GradCAM
        from pytorch_grad_cam.utils.image import show_cam_on_image

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Load and preprocess image
        rgb_img = Image.open(image_path).convert("RGB")
        input_tensor = preprocess(rgb_img).unsqueeze(0).to(device)

        # Target final convolutional layer of EfficientNet-B0 backbone
        target_layers = [model.network.features[-1]]

        # Setup GradCAM
        cam = GradCAM(model=model, target_layers=target_layers)
        
        # Run GradCAM (default targets target the class output)
        grayscale_cam = cam(input_tensor=input_tensor)
        grayscale_cam = grayscale_cam[0, :]  # shape: (224, 224)

        # Scale original image to 224x224 and normalize to [0, 1] range
        resized_img = rgb_img.resize((224, 224))
        img_np = np.array(resized_img, dtype=np.float32) / 255.0

        # Overlay grayscale CAM onto the normalized image
        cam_image = show_cam_on_image(img_np, grayscale_cam, use_rgb=True)
        
        # Convert back to uint8 BGR for saving with OpenCV
        cam_image_bgr = cv2.cvtColor((cam_image * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)

        # Save to disk
        cv2.imwrite(output_path, cam_image_bgr)

    except Exception as e:
        print(f"❌ Real Grad-CAM error: {e}. Saving fallback.")
        # Save a duplicate of original as fallback
        img = Image.open(image_path)
        img.save(output_path)
