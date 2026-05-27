from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime, timezone
from app.core.database import Base

class ContactCategory(str, enum.Enum):
    PARTNERSHIP = "PARTNERSHIP"
    RESEARCH = "RESEARCH"
    CONSULTATION = "CONSULTATION"
    MEDIA = "MEDIA"
    GENERAL = "GENERAL"

class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    category = Column(Enum(ContactCategory), nullable=False)
    message = Column(String, nullable=False)
    preferred_contact = Column(String, nullable=True)
    status = Column(String, default="OPEN")
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
