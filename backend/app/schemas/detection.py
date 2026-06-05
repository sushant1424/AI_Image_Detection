# ========================================
# Detection Schemas — Pydantic validation
# ========================================

from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


class DetectionResponse(BaseModel):
    """Schema for a single detection result."""
    id: UUID
    verdict: str
    confidence_score: float
    original_image_url: str
    heatmap_image_url: Optional[str] = None
    created_at: datetime
    metadata: Optional[dict] = None
    feedback: Optional[str] = None
    is_public: bool = True

    class Config:
        from_attributes = True


class DetectionListResponse(BaseModel):
    """Schema for paginated detection list."""
    items: list[DetectionResponse]
    total: int
    page: int
    pages: int


class URLDetectionRequest(BaseModel):
    """Schema for requesting image detection via a public URL."""
    url: str


class FeedbackRequest(BaseModel):
    """Schema for recording user feedback."""
    feedback: str = Field(..., pattern="^(thumbs_up|thumbs_down)$")
