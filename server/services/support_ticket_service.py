"""
SmartPark Support Ticket & Driver Helpdesk Service Layer
Handles ticket submission, barrier intercom escalation, and support workflows.
"""

from typing import Dict, Any, List, Optional
from server.database.repositories.support_ticket_repository import SupportTicketRepository, SupportTicket
from server.database.repositories.notification_repository import NotificationRepository
from server.models.schema import Notification

class SupportTicketService:
    @staticmethod
    def create_ticket(data: Dict[str, Any], user: Dict[str, Any]) -> Dict[str, Any]:
        ticket = SupportTicket(
            user_id=user["id"],
            user_name=user.get("name", "Driver"),
            user_email=user.get("email", ""),
            subject=data["subject"],
            category=data.get("category", "GATE_BARRIER_ISSUE"),
            priority=data.get("priority", "HIGH"),
            description=data["description"],
            status="OPEN"
        )
        SupportTicketRepository.create(ticket)

        NotificationRepository.create(Notification(
            user_id=user["id"],
            title="Support Request Received",
            message=f"Ticket #{ticket.id} logged. A parking operations engineer is reviewing your request.",
            notification_type="INFO",
            action_url="#/dashboard"
        ))

        return {"success": True, "ticket_id": ticket.id, "data": ticket.to_dict()}

    @staticmethod
    def list_tickets(status: Optional[str] = None) -> List[Dict[str, Any]]:
        tickets = SupportTicketRepository.list_all(status=status)
        return [t.to_dict() for t in tickets]
