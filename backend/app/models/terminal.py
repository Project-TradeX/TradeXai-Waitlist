from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime, timezone
from app.core.database import Base

class TerminalCategory(str, enum.Enum):
    QUESTION = "QUESTION"
    PRODUCT = "PRODUCT"
    MARKET = "MARKET"
    PRICING = "PRICING"

class TerminalSession(Base):
    __tablename__ = "terminal_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    question = Column(String, nullable=False)
    response = Column(String, nullable=False)
    category = Column(Enum(TerminalCategory), nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
