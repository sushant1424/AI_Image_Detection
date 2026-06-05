from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.detection import DetectionResponse, DetectionListResponse
from app.services.history_service import HistoryService

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=DetectionListResponse)
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    verdict: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve paginated detection scans for the current logged-in user."""
    items, total = await HistoryService.get_user_history(
        db, current_user, page, page_size, verdict
    )
    
    # Calculate pages count
    pages = (total + page_size - 1) // page_size if total > 0 else 0

    # Format output items to match DetectionResponse expectations
    formatted_items = [
        DetectionResponse(
            id=item.id,
            verdict=item.verdict.value,
            confidence_score=item.confidence_score,
            original_image_url=item.original_image_path,
            heatmap_image_url=item.heatmap_image_path,
            created_at=item.created_at,
        )
        for item in items
    ]

    return DetectionListResponse(
        items=formatted_items,
        total=total,
        page=page,
        pages=pages,
    )


@router.get("/{id}", response_model=DetectionResponse)
async def get_history_item(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed analysis result of a single past detection."""
    item = await HistoryService.get_detection_detail(db, current_user, id)
    return DetectionResponse(
        id=item.id,
        verdict=item.verdict.value,
        confidence_score=item.confidence_score,
        original_image_url=item.original_image_path,
        heatmap_image_url=item.heatmap_image_path,
        created_at=item.created_at,
    )


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_history_item(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Permanently delete a detection record from history and purge its files from disk."""
    await HistoryService.delete_history_item(db, current_user, id)
    return {"message": "Detection record and associated images deleted successfully"}
