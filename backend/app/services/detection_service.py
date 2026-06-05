import os
import uuid
import shutil
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.detection import Detection, VerdictType
from app.models.user import User
from app.ml.model import predict_image
from app.ml.gradcam import generate_heatmap

settings = get_settings()


class DetectionService:
    """Service layer handling image upload processing, ML inference, and DB persistence."""

    @staticmethod
    async def process_detection(
        db: AsyncSession, file: UploadFile, user: User = None
    ) -> Detection:
        """Processes image upload, runs ML analysis, generates heatmap, and saves to DB if user is active."""
        # Ensure directories exist
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "originals"), exist_ok=True)
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "heatmaps"), exist_ok=True)

        # Generate unique filenames
        file_ext = os.path.splitext(file.filename)[1]
        if not file_ext:
            file_ext = ".jpg"  # default
        
        unique_id = str(uuid.uuid4())
        orig_filename = f"{unique_id}_original{file_ext}"
        heatmap_filename = f"{unique_id}_heatmap.jpg"  # OpenCV exports JPG heatmaps

        orig_path = os.path.join(settings.UPLOAD_DIR, "originals", orig_filename)
        heatmap_path = os.path.join(settings.UPLOAD_DIR, "heatmaps", heatmap_filename)

        # Save original file to disk
        with open(orig_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # 1. Run ML prediction (returns 0 to 1 confidence of being AI generated)
            ai_confidence = predict_image(orig_path)

            # 2. Determine verdict based on confidence threshold
            if ai_confidence >= 0.5:
                verdict = VerdictType.AI_GENERATED
                confidence = ai_confidence
            else:
                verdict = VerdictType.REAL
                # Confidence represents certainty of being REAL
                confidence = 1.0 - ai_confidence

            # 3. Generate Grad-CAM heatmap overlay
            generate_heatmap(orig_path, heatmap_path)

            # Relative paths for frontend serving
            original_url = f"/uploads/originals/{orig_filename}"
            heatmap_url = f"/uploads/heatmaps/{heatmap_filename}"

            # Create detection object
            detection = Detection(
                id=uuid.UUID(unique_id),
                user_id=user.id if user else None,
                original_image_path=original_url,
                heatmap_image_path=heatmap_url,
                verdict=verdict,
                confidence_score=confidence,
            )

            # Only save to DB if user is logged in
            if user:
                db.add(detection)
                await db.commit()
                await db.refresh(detection)

            return detection

        except Exception as e:
            # Clean up uploaded file if anything fails
            if os.path.exists(orig_path):
                os.remove(orig_path)
            if os.path.exists(heatmap_path):
                os.remove(heatmap_path)
            raise e
