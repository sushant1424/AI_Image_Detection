# ========================================
# Stats Schemas — Pydantic validation
# ========================================

from pydantic import BaseModel
from typing import Optional


class DailyActivity(BaseModel):
    """Single day activity data point."""
    date: str
    count: int


class ConfidenceBucket(BaseModel):
    """Confidence score distribution bucket."""
    range: str
    count: int


class StatsResponse(BaseModel):
    """Schema for user statistics dashboard."""
    total_detections: int
    ai_generated_count: int
    real_count: int
    daily_activity: list[DailyActivity]
    confidence_distribution: list[ConfidenceBucket]
    most_active_day: Optional[str] = None
