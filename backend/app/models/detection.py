# ========================================
# Detection Model — SQLAlchemy ORM
# ========================================

import uuid
from datetime import datetime, timezone
import enum

from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class VerdictType(str, enum.Enum):
    """Enum for detection verdict types."""
    AI_GENERATED = "AI_GENERATED"
    REAL = "REAL"


class Detection(Base):
    """Detection result model — stores each image analysis."""

    __tablename__ = "detections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,  # nullable for guest detections
        index=True,
    )
    original_image_path = Column(String(500), nullable=False)
    heatmap_image_path = Column(String(500), nullable=True)
    verdict = Column(Enum(VerdictType), nullable=False)
    confidence_score = Column(Float, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    metadata_info = Column("metadata", JSON, nullable=True) # Avoid overriding Python reserved keywords
    feedback = Column(String(50), nullable=True) # 'thumbs_up' or 'thumbs_down'
    is_public = Column(Boolean, default=True, nullable=False)

    # Relationship to user
    user = relationship("User", back_populates="detections")

    def __repr__(self):
        return f"<Detection {self.id} verdict={self.verdict}>"
