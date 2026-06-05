from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_optional_user
from app.models.user import User
from app.models.detection import Detection
from app.schemas.detection import DetectionResponse, URLDetectionRequest, FeedbackRequest
from app.services.detection_service import DetectionService

router = APIRouter(tags=["Detection"])


@router.post("/detect", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def detect_image(
    file: UploadFile = File(...),
    user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload an image to detect if it is real or AI-generated."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image format (JPEG, PNG, WEBP)",
        )

    try:
        detection = await DetectionService.process_detection(db, file, user)
        return _format_response(detection)
    except Exception as e:
        print(f"❌ Error during image detection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the image: {str(e)}",
        )


@router.post("/detect-url", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def detect_image_url(
    payload: URLDetectionRequest,
    user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Fetch an image from a public URL and run detection."""
    url = payload.url.strip()
    if not url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL must start with http:// or https://",
        )

    try:
        detection = await DetectionService.process_detection_url(db, url, user)
        return _format_response(detection)
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Error during URL detection: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while downloading or analyzing the image: {str(e)}",
        )


@router.get("/public-feed", response_model=list[DetectionResponse])
async def get_public_feed(db: AsyncSession = Depends(get_db)):
    """Retrieve 10 most recent public scans for the home feed."""
    result = await db.execute(
        select(Detection)
        .where(Detection.is_public == True)
        .order_by(Detection.created_at.desc())
        .limit(10)
    )
    detections = result.scalars().all()
    return [_format_response(det) for det in detections]


@router.get("/public-detect/{id}", response_model=DetectionResponse)
async def get_public_detect_item(id: UUID, db: AsyncSession = Depends(get_db)):
    """Retrieve a single scan result publicly via its ID (for public sharing)."""
    result = await db.execute(
        select(Detection).where(Detection.id == id)
    )
    detection = result.scalar_one_or_none()
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )
    return _format_response(detection)


@router.put("/public-detect/{id}/feedback", response_model=DetectionResponse)
async def update_detection_feedback(
    id: UUID,
    payload: FeedbackRequest,
    db: AsyncSession = Depends(get_db)
):
    """Record user feedback (thumbs up / thumbs down) for a scan."""
    result = await db.execute(
        select(Detection).where(Detection.id == id)
    )
    detection = result.scalar_one_or_none()
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )
    
    detection.feedback = payload.feedback
    await db.commit()
    await db.refresh(detection)
    return _format_response(detection)


def _format_response(detection) -> DetectionResponse:
    return DetectionResponse(
        id=detection.id,
        verdict=detection.verdict.value,
        confidence_score=detection.confidence_score,
        original_image_url=detection.original_image_path,
        heatmap_image_url=detection.heatmap_image_path,
        created_at=detection.created_at,
        metadata=detection.metadata_info,
        feedback=detection.feedback,
        is_public=detection.is_public,
    )
