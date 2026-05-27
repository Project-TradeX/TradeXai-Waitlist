from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from app import schemas, crud
from app.services import NotificationService, AnalyticsService

router = APIRouter()

@router.post("/waitlist", response_model=schemas.WaitlistApplicationResponse)
def join_waitlist(application: schemas.WaitlistApplicationCreate, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(
        db, email=application.email, name=application.name, source="waitlist"
    )
    
    app_db = crud.create_waitlist_application(db, application, user_id=user.id)
    
    NotificationService.send_slack_notification(f"New waitlist signup: {application.email}")
    AnalyticsService.track_event(str(user.id), "WAITLIST_JOIN", {"score": app_db.score})
    
    return app_db

@router.post("/feedback", response_model=schemas.FeedbackResponse)
def submit_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(db, email=feedback.email, source="feedback")
    
    fb_db = crud.create_feedback(db, feedback, user_id=user.id)
    
    NotificationService.send_slack_notification(f"New feedback [{feedback.type}]: {feedback.email}")
    AnalyticsService.track_event(str(user.id), "FEEDBACK_SENT", {"type": feedback.type})
    
    return fb_db

@router.post("/contact", response_model=schemas.ContactRequestResponse)
def submit_contact_request(contact: schemas.ContactRequestCreate, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(db, email=contact.email, source="contact")
    
    contact_db = crud.create_contact_request(db, contact, user_id=user.id)
    
    NotificationService.send_slack_notification(f"New contact request [{contact.category}]: {contact.email}")
    AnalyticsService.track_event(str(user.id), "CONTACT_OPEN", {"category": contact.category})
    
    return contact_db

@router.post("/terminal", response_model=schemas.TerminalSessionResponse)
def log_terminal_session(session: schemas.TerminalSessionCreate, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(db, email=session.email, source="terminal")
    
    session_db = crud.create_terminal_session(db, session, user_id=user.id)
    AnalyticsService.track_event(str(user.id), "TERMINAL_USED", {"category": session.category})
    
    return session_db

@router.post("/newsletter", response_model=schemas.NewsletterCreate)
def subscribe_newsletter(sub: schemas.NewsletterCreate, db: Session = Depends(get_db)):
    user = crud.get_or_create_user(db, email=sub.email, source=sub.source or "newsletter")
    
    sub_db = crud.create_newsletter_subscription(db, sub, user_id=user.id)
    AnalyticsService.track_event(str(user.id), "NEWSLETTER_JOIN", {"source": sub.source})
    
    return sub

@router.get("/admin/users", response_model=List[schemas.UserResponse])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Note: In a real app, add admin authentication dependency here
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/admin/analytics")
def get_analytics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    # Note: In a real app, add admin authentication dependency here
    from app import models
    total_users = db.query(models.User).count()
    total_waitlist = db.query(models.WaitlistApplication).count()
    total_feedback = db.query(models.Feedback).count()
    
    return {
        "total_users": total_users,
        "total_waitlist": total_waitlist,
        "total_feedback": total_feedback,
    }
