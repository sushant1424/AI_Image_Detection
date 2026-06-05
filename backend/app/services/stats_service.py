from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date, desc
from collections import defaultdict
from datetime import datetime

from app.models.detection import Detection, VerdictType
from app.models.user import User
from app.schemas.stats import StatsResponse, DailyActivity, ConfidenceBucket


class StatsService:
    """Service layer for aggregating detection analytics and historical charts."""

    @staticmethod
    async def get_user_stats(db: AsyncSession, user: User) -> StatsResponse:
        """Aggregates and formats all statistics for the current user's history."""
        # 1. Total counts
        total_query = select(func.count(Detection.id)).where(Detection.user_id == user.id)
        result = await db.execute(total_query)
        total_detections = result.scalar() or 0

        if total_detections == 0:
            return StatsResponse(
                total_detections=0,
                ai_generated_count=0,
                real_count=0,
                daily_activity=[],
                confidence_distribution=[
                    ConfidenceBucket(range="50-60%", count=0),
                    ConfidenceBucket(range="60-70%", count=0),
                    ConfidenceBucket(range="70-80%", count=0),
                    ConfidenceBucket(range="80-90%", count=0),
                    ConfidenceBucket(range="90-100%", count=0),
                ],
                most_active_day=None,
            )

        # AI generated count
        ai_query = select(func.count(Detection.id)).where(
            Detection.user_id == user.id, Detection.verdict == VerdictType.AI_GENERATED
        )
        ai_result = await db.execute(ai_query)
        ai_generated_count = ai_result.scalar() or 0
        real_count = total_detections - ai_generated_count

        # 2. Daily activity: Group by date
        activity_query = (
            select(cast(Detection.created_at, Date).label("day"), func.count(Detection.id))
            .where(Detection.user_id == user.id)
            .group_by("day")
            .order_by("day")
        )
        activity_result = await db.execute(activity_query)
        daily_activity_raw = activity_result.all()

        daily_activity = [
            DailyActivity(date=str(row[0]), count=row[1]) for row in daily_activity_raw
        ]

        # Most active day
        most_active_query = (
            select(cast(Detection.created_at, Date).label("day"), func.count(Detection.id).label("cnt"))
            .where(Detection.user_id == user.id)
            .group_by("day")
            .order_by(desc("cnt"))
            .limit(1)
        )
        most_active_result = await db.execute(most_active_query)
        most_active_row = most_active_result.first()
        most_active_day = str(most_active_row[0]) if most_active_row else None

        # 3. Confidence score distribution (Detections are always >= 50% / 0.5 certain)
        # Fetch all confidence scores for this user to bucket them
        scores_query = select(Detection.confidence_score).where(Detection.user_id == user.id)
        scores_result = await db.execute(scores_query)
        scores = scores_result.scalars().all()

        buckets = {
            "50-60%": 0,
            "60-70%": 0,
            "70-80%": 0,
            "80-90%": 0,
            "90-100%": 0,
        }

        for score in scores:
            pct = score * 100
            if 50 <= pct < 60:
                buckets["50-60%"] += 1
            elif 60 <= pct < 70:
                buckets["60-70%"] += 1
            elif 70 <= pct < 80:
                buckets["70-80%"] += 1
            elif 80 <= pct < 90:
                buckets["80-90%"] += 1
            elif 90 <= pct <= 100:
                buckets["90-100%"] += 1

        confidence_distribution = [
            ConfidenceBucket(range=r, count=c) for r, c in buckets.items()
        ]

        return StatsResponse(
            total_detections=total_detections,
            ai_generated_count=ai_generated_count,
            real_count=real_count,
            daily_activity=daily_activity,
            confidence_distribution=confidence_distribution,
            most_active_day=most_active_day,
        )
