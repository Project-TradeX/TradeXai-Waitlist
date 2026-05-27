import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app import crud, schemas
from app.models.waitlist import ExperienceLevel
from app.models.feedback import FeedbackType
from app.models.contact import ContactCategory
from app.models.terminal import TerminalCategory

def seed_data():
    db = SessionLocal()
    try:
        print("Seeding Users and Data...")
        
        # Seed 1: Waitlist User
        wl_user = schemas.WaitlistApplicationCreate(
            email="founder@startup.com",
            name="Alice Founder",
            experience_level=ExperienceLevel.INTERMEDIATE,
            biggest_decision_problem="Pricing my SaaS",
            current_tools="Excel, Gut feeling",
            desired_outcome="Data-driven pricing model",
            newsletter_opt_in=True
        )
        # Assuming we don't have the user ID yet, the router handles get_or_create, so we mimic it
        user1 = crud.get_or_create_user(db, email=wl_user.email, name=wl_user.name, source="waitlist")
        crud.create_waitlist_application(db, wl_user, user_id=user1.id)
        
        # Seed 2: Feedback User
        fb_data = schemas.FeedbackCreate(
            email="beta.tester@dev.com",
            type=FeedbackType.IDEA,
            message="Add a dark mode to the terminal, it would be awesome.",
            priority="LOW"
        )
        user2 = crud.get_or_create_user(db, email=fb_data.email, source="feedback")
        crud.create_feedback(db, fb_data, user_id=user2.id)

        # Seed 3: Terminal Session
        term_data = schemas.TerminalSessionCreate(
            email="analyst@hedgefund.com",
            session_id="sess_12345",
            question="What is the historical correlation between AAPL and MSFT?",
            response="The 5-year historical correlation between AAPL and MSFT is 0.76, indicating a strong positive relationship.",
            category=TerminalCategory.MARKET
        )
        user3 = crud.get_or_create_user(db, email=term_data.email, source="terminal")
        crud.create_terminal_session(db, term_data, user_id=user3.id)

        print("Seed data successfully added!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
