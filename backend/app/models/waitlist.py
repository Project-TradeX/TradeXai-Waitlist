from sqlalchemy import Column, String, Boolean, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime, timezone
from app.core.database import Base

class ExperienceLevel(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    INSTITUTIONAL = "INSTITUTIONAL"

class WaitlistApplication(Base):
    __tablename__ = "waitlist_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    experience_level = Column(Enum(ExperienceLevel), nullable=True)
    biggest_decision_problem = Column(String, nullable=True)
    current_tools = Column(String, nullable=True)
    desired_outcome = Column(String, nullable=True)
    newsletter_opt_in = Column(Boolean, default=True)
    score = Column(Integer, default=0)
    
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
