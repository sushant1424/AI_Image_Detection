import os
import uuid
import shutil
import urllib.request
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.detection import Detection, VerdictType
from app.models.user import User
from app.ml.model import predict_image
from app.ml.gradcam import generate_heatmap

settings = get_settings()

class DetectionService:
    """Service layer handling image upload, URL analysis, ML inference, and DB persistence."""

    @staticmethod
    async def process_detection(db: AsyncSession, file: UploadFile, user: User = None) -> Detection:
        """Processes image upload, runs ML analysis, and saves to DB."""
        # Ensure directories exist
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "originals"), exist_ok=True)
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "heatmaps"), exist_ok=True)

        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_id = str(uuid.uuid4())
        orig_filename = f"{unique_id}_original{file_ext}"
        heatmap_filename = f"{unique_id}_heatmap.jpg"

        orig_path = os.path.join(settings.UPLOAD_DIR, "originals", orig_filename)
        heatmap_path = os.path.join(settings.UPLOAD_DIR, "heatmaps", heatmap_filename)

        with open(orig_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return await DetectionService._analyze_and_save(
            db, orig_path, orig_filename, heatmap_path, heatmap_filename, unique_id, user
        )

    @staticmethod
    async def process_detection_url(db: AsyncSession, url: str, user: User = None) -> Detection:
        """Downloads image from a URL, runs ML analysis, and saves to DB."""
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "originals"), exist_ok=True)
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "heatmaps"), exist_ok=True)

        unique_id = str(uuid.uuid4())
        orig_filename = f"{unique_id}_original.jpg"
        heatmap_filename = f"{unique_id}_heatmap.jpg"

        orig_path = os.path.join(settings.UPLOAD_DIR, "originals", orig_filename)
        heatmap_path = os.path.join(settings.UPLOAD_DIR, "heatmaps", heatmap_filename)

        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                content_type = response.info().get_content_type()
                if not content_type.startswith("image/"):
                    raise HTTPException(status_code=400, detail="URL does not point to a valid image.")
                with open(orig_path, "wb") as f:
                    f.write(response.read())
        except Exception as e:
            if os.path.exists(orig_path):
                os.remove(orig_path)
            raise HTTPException(status_code=400, detail=f"Failed to download image: {str(e)}")

        return await DetectionService._analyze_and_save(
            db, orig_path, orig_filename, heatmap_path, heatmap_filename, unique_id, user
        )

    @staticmethod
    async def _analyze_and_save(
        db: AsyncSession, orig_path: str, orig_filename: str,
        heatmap_path: str, heatmap_filename: str, unique_id: str, user: User = None
    ) -> Detection:
        # Extract metadata
        img_metadata = {}
        try:
            from PIL import Image
            from PIL.ExifTags import TAGS
            with Image.open(orig_path) as img:
                img_metadata["format"] = img.format
                img_metadata["width"] = img.size[0]
                img_metadata["height"] = img.size[1]
                img_metadata["mode"] = img.mode
                if os.path.exists(orig_path):
                    img_metadata["size_kb"] = round(os.path.getsize(orig_path) / 1024, 2)
                
                exif_data = img.getexif()
                if exif_data:
                    exif_dict = {}
                    for tag_id, val in exif_data.items():
                        tag_name = TAGS.get(tag_id, tag_id)
                        if isinstance(val, bytes):
                            try:
                                val = val.decode("utf-8", errors="ignore")
                            except Exception:
                                val = str(val)
                        exif_dict[str(tag_name)] = str(val)
                    img_metadata["exif"] = exif_dict
        except Exception as e:
            print(f"⚠️ Metadata extraction error: {e}")

        try:
            ai_confidence = predict_image(orig_path)
            if ai_confidence >= 0.5:
                verdict = VerdictType.AI_GENERATED
                confidence = ai_confidence
            else:
                verdict = VerdictType.REAL
                confidence = 1.0 - ai_confidence

            generate_heatmap(orig_path, heatmap_path)

            original_url = f"/uploads/originals/{orig_filename}"
            heatmap_url = f"/uploads/heatmaps/{heatmap_filename}"

            detection = Detection(
                id=uuid.UUID(unique_id),
                user_id=user.id if user else None,
                original_image_path=original_url,
                heatmap_image_path=heatmap_url,
                verdict=verdict,
                confidence_score=confidence,
                metadata_info=img_metadata,
                is_public=True
            )

            if user:
                db.add(detection)
                await db.commit()
                await db.refresh(detection)

            return detection

        except Exception as e:
            if os.path.exists(orig_path):
                os.remove(orig_path)
            if os.path.exists(heatmap_path):
                os.remove(heatmap_path)
            raise e
