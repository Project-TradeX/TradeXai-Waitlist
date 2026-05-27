from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime, timezone
from app.core.database import Base

class FeedbackType(str, enum.Enum):
    IDEA = "IDEA"
    PAIN = "PAIN"
    QUESTION = "QUESTION"
    FEATURE = "FEATURE"

class FeedbackStatus(str, enum.Enum):
    NEW = "NEW"
    REVIEWED = "REVIEWED"
    ROADMAP = "ROADMAP"
    SHIPPED = "SHIPPED"

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(Enum(FeedbackType), nullable=False)
    message = Column(String, nullable=False)
    status = Column(Enum(FeedbackStatus), default=FeedbackStatus.NEW)
    priority = Column(String, nullable=True)
    
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
