"""
SmartPark Request Validation Layer
Validates JSON request schemas, email regex, vehicle registration plate formats, and datetime ranges.
"""

import re
from datetime import datetime
from typing import Dict, Any, List, Optional
from server.middleware.error_handler import ValidationException

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PLATE_REGEX = re.compile(r"^[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{0,3}[-\s]?[0-9]{4}$", re.IGNORECASE)

class RequestValidator:
    @staticmethod
    def validate_login(data: Dict[str, Any]):
        errors = {}
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email:
            errors["email"] = "Email address is required."
        elif not EMAIL_REGEX.match(email):
            errors["email"] = "Please provide a valid email format."

        if not password:
            errors["password"] = "Password is required."

        if errors:
            raise ValidationException("Invalid login credentials provided.", errors)

    @staticmethod
    def validate_signup(data: Dict[str, Any]):
        errors = {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        vehicle_plate = data.get("vehicle_plate", "").strip()

        if not name or len(name) < 2:
            errors["name"] = "Full name must be at least 2 characters long."

        if not email or not EMAIL_REGEX.match(email):
            errors["email"] = "A valid email address is required."

        if not password or len(password) < 8:
            errors["password"] = "Password must be at least 8 characters long."

        if vehicle_plate and not PLATE_REGEX.match(vehicle_plate):
            errors["vehicle_plate"] = "Invalid vehicle registration plate format (e.g. KA-01-AB-1234)."

        if errors:
            raise ValidationException("Signup validation failed.", errors)

    @staticmethod
    def validate_reservation(data: Dict[str, Any]):
        errors = {}
        if not data.get("parking_zone_id"):
            errors["parking_zone_id"] = "Target parking facility ID is required."

        duration = data.get("duration_hours")
        if duration is not None:
            try:
                dur_float = float(duration)
                if dur_float < 0.5 or dur_float > 24.0:
                    errors["duration_hours"] = "Duration must be between 30 minutes and 24 hours."
            except ValueError:
                errors["duration_hours"] = "Duration must be a numeric value in hours."

        if errors:
            raise ValidationException("Reservation parameters are invalid.", errors)
