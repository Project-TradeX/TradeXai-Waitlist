from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, List, Dict, Any
from app.models.user import UserStatus
from app.models.waitlist import ExperienceLevel
from app.models.feedback import FeedbackType, FeedbackStatus
from app.models.contact import ContactCategory
from app.models.terminal import TerminalCategory

# --- Base Models (for ORM mapping) ---
class OrmBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# --- Users ---
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    x_handle: Optional[str] = None
    source: Optional[str] = None
    consent: bool = False

class UserCreate(UserBase):
    pass

class UserResponse(UserBase, OrmBase):
    id: UUID
    status: UserStatus
    engagement_score: int
    created_at: datetime

# --- Waitlist ---
class WaitlistApplicationCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    experience_level: Optional[ExperienceLevel] = None
    biggest_decision_problem: Optional[str] = None
    current_tools: Optional[str] = None
    desired_outcome: Optional[str] = None
    newsletter_opt_in: bool = True

class WaitlistApplicationResponse(OrmBase):
    id: UUID
    user_id: UUID
    score: int
    submitted_at: datetime

# --- Feedback ---
class FeedbackCreate(BaseModel):
    email: EmailStr
    type: FeedbackType
    message: str
    priority: Optional[str] = None

class FeedbackResponse(OrmBase):
    id: UUID
    user_id: UUID
    type: FeedbackType
    message: str
    status: FeedbackStatus
    submitted_at: datetime

# --- Contact ---
class ContactRequestCreate(BaseModel):
    email: EmailStr
    category: ContactCategory
    message: str
    preferred_contact: Optional[str] = None

class ContactRequestResponse(OrmBase):
    id: UUID
    user_id: UUID
    category: ContactCategory
    status: str
    created_at: datetime

# --- Terminal ---
class TerminalSessionCreate(BaseModel):
    email: EmailStr
    session_id: str
    question: str
    response: str
    category: TerminalCategory

class TerminalSessionResponse(OrmBase):
    id: UUID
    user_id: UUID
    category: TerminalCategory
    created_at: datetime

# --- Newsletter ---
class NewsletterCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = None

# --- Events ---
class EventCreate(BaseModel):
    email: Optional[EmailStr] = None  # Optional because some events might be truly anonymous
    event: str
    metadata_: Optional[Dict[str, Any]] = Field(default=None, alias="metadata")
