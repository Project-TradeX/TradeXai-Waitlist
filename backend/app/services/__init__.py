import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_slack_notification(message: str):
        # In a real app, this would use a webhook URL from settings
        logger.info(f"SLACK NOTIFICATION: {message}")
        
    @staticmethod
    def send_welcome_email(email: str):
        # E.g. using Resend API
        logger.info(f"EMAIL SENT TO: {email} - Welcome to TradeX!")

class AnalyticsService:
    @staticmethod
    def track_event(user_id: str, event_name: str, properties: Dict[str, Any] = None):
        # In a real app, send to PostHog using the python SDK or HTTP API
        logger.info(f"POSTHOG EVENT [{event_name}] for user {user_id}: {properties}")
