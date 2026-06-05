# ========================================
# Models Package Init
# ========================================

from app.models.user import User
from app.models.detection import Detection, VerdictType

__all__ = ["User", "Detection", "VerdictType"]
