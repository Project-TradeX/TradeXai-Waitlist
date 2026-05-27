from sqlalchemy import Column, String, Boolean, Integer, DateTime, Enum, text
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime, timezone
from app.core.database import Base

class UserStatus(str, enum.Enum):
    WAITLIST = "WAITLIST"
    EARLY_ACCESS = "EARLY_ACCESS"
    ACTIVE = "ACTIVE"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    x_handle = Column(String, nullable=True)
    source = Column(String, nullable=True)
    consent = Column(Boolean, default=False)
    engagement_score = Column(Integer, default=0)
    status = Column(Enum(UserStatus), default=UserStatus.WAITLIST)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
