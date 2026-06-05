from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_optional_user
from app.models.user import User
from app.schemas.detection import DetectionResponse
from app.services.detection_service import DetectionService

router = APIRouter(tags=["Detection"])


@router.post("/detect", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def detect_image(
    file: UploadFile = File(...),
    user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload an image to detect if it is real or AI-generated.
    Saves record to history if user is authenticated; guest users can scan anonymously.
    """
    # Verify file content type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image format (JPEG, PNG, WEBP)",
        )

    try:
        detection = await DetectionService.process_detection(db, file, user)
        
        # Build URL mappings matching schemas/detection.py expectations
        return DetectionResponse(
            id=detection.id,
            verdict=detection.verdict.value,
            confidence_score=detection.confidence_score,
            original_image_url=detection.original_image_path,
            heatmap_image_url=detection.heatmap_image_path,
            created_at=detection.created_at,
        )
    except Exception as e:
        print(f"❌ Error during image detection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the image: {str(e)}",
        )
