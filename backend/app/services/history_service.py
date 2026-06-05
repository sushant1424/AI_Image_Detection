import os
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from fastapi import HTTPException, status

from app.models.detection import Detection, VerdictType
from app.models.user import User


class HistoryService:
    """Service layer for fetching, paginating, and deleting user detection history."""

    @staticmethod
    async def get_user_history(
        db: AsyncSession,
        user: User,
        page: int = 1,
        page_size: int = 10,
        verdict: str = None,
    ) -> tuple[list[Detection], int]:
        """Fetches a paginated list of detections for the current user, optionally filtered by verdict."""
        # Calculate offset
        offset = (page - 1) * page_size

        # Base query for user's detections
        query = select(Detection).where(Detection.user_id == user.id)

        # Apply verdict filter if provided
        if verdict:
            try:
                verdict_enum = VerdictType(verdict)
                query = query.where(Detection.verdict == verdict_enum)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid verdict filter: {verdict}",
                )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        # Order by newest first, and apply pagination
        query = query.order_by(desc(Detection.created_at)).offset(offset).limit(page_size)
        result = await db.execute(query)
        items = result.scalars().all()

        return items, total

    @staticmethod
    async def get_detection_detail(
        db: AsyncSession, user: User, detection_id: UUID
    ) -> Detection:
        """Retrieves a single detection details after validating ownership."""
        query = select(Detection).where(
            Detection.id == detection_id, Detection.user_id == user.id
        )
        result = await db.execute(query)
        detection = result.scalar_one_or_none()

        if not detection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Detection record not found or access denied",
            )
        return detection

    @staticmethod
    async def delete_history_item(
        db: AsyncSession, user: User, detection_id: UUID
    ) -> None:
        """Deletes a detection record and its associated image files from disk."""
        detection = await HistoryService.get_detection_detail(db, user, detection_id)

        # Delete image files from disk
        # We need to construct absolute or project paths from database relative paths
        # Relative URLs look like: /uploads/originals/uuid_original.jpg
        # We assume they match settings.UPLOAD_DIR structure
        for path_attr in ["original_image_path", "heatmap_image_path"]:
            rel_path = getattr(detection, path_attr, None)
            if rel_path:
                # Strip leading slash if present to make it path relative
                cleaned_path = rel_path.lstrip("/")
                if os.path.exists(cleaned_path):
                    try:
                        os.remove(cleaned_path)
                    except Exception as e:
                        print(f"⚠️ Failed to delete file {cleaned_path}: {e}")

        # Delete from DB
        await db.delete(detection)
        await db.commit()
