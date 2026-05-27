from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Any
import uuid

from app import models, schemas

# --- Users ---
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_or_create_user(db: Session, email: str, **kwargs) -> models.User:
    user = get_user_by_email(db, email=email)
    if not user:
        user_data = schemas.UserCreate(email=email, **kwargs)
        user = create_user(db, user=user_data)
    else:
        # Update user fields if provided and not set
        changed = False
        for k, v in kwargs.items():
            if v is not None and getattr(user, k) != v:
                setattr(user, k, v)
                changed = True
        if changed:
            db.commit()
            db.refresh(user)
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

# --- Waitlist ---
def create_waitlist_application(db: Session, application: schemas.WaitlistApplicationCreate, user_id: uuid.UUID) -> models.WaitlistApplication:
    app_data = application.model_dump(exclude={"email", "name"})
    db_app = models.WaitlistApplication(**app_data, user_id=user_id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

# --- Feedback ---
def create_feedback(db: Session, feedback: schemas.FeedbackCreate, user_id: uuid.UUID) -> models.Feedback:
    fb_data = feedback.model_dump(exclude={"email"})
    db_fb = models.Feedback(**fb_data, user_id=user_id)
    db.add(db_fb)
    db.commit()
    db.refresh(db_fb)
    return db_fb

# --- Contact ---
def create_contact_request(db: Session, contact: schemas.ContactRequestCreate, user_id: uuid.UUID) -> models.ContactRequest:
    contact_data = contact.model_dump(exclude={"email"})
    db_contact = models.ContactRequest(**contact_data, user_id=user_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# --- Terminal Sessions ---
def create_terminal_session(db: Session, session: schemas.TerminalSessionCreate, user_id: uuid.UUID) -> models.TerminalSession:
    session_data = session.model_dump(exclude={"email"})
    db_session = models.TerminalSession(**session_data, user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# --- Newsletter ---
def create_newsletter_subscription(db: Session, sub: schemas.NewsletterCreate, user_id: uuid.UUID) -> models.NewsletterSubscriber:
    db_sub = db.query(models.NewsletterSubscriber).filter(models.NewsletterSubscriber.user_id == user_id).first()
    if db_sub:
        db_sub.subscribed = True
        db.commit()
        db.refresh(db_sub)
        return db_sub
        
    sub_data = sub.model_dump(exclude={"email"})
    db_sub = models.NewsletterSubscriber(**sub_data, user_id=user_id)
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

# --- Events ---
def create_event(db: Session, event: schemas.EventCreate, user_id: Optional[uuid.UUID] = None) -> models.Event:
    event_data = event.model_dump(exclude={"email"})
    db_event = models.Event(**event_data, user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
