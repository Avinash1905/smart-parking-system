"""
SmartPark Centralized HTTP Exception & Error Handler Middleware
Provides standardized error codes, JSON formatting, and exception classes.
"""

import json
from typing import Dict, Any, Optional

class SmartParkAPIException(Exception):
    def __init__(self, message: str, status_code: int = 400, error_code: str = "BAD_REQUEST", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": False,
            "error": {
                "code": self.error_code,
                "message": self.message,
                "status_code": self.status_code,
                "details": self.details
            }
        }

class NotFoundException(SmartParkAPIException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(f"{resource} with ID '{resource_id}' was not found.", 404, "RESOURCE_NOT_FOUND")

class UnauthorizedException(SmartParkAPIException):
    def __init__(self, message: str = "Authentication token is missing or invalid."):
        super().__init__(message, 401, "UNAUTHORIZED")

class ForbiddenException(SmartParkAPIException):
    def __init__(self, message: str = "You do not have authorization to perform this action or access this facility."):
        super().__init__(message, 403, "FORBIDDEN")

class ValidationException(SmartParkAPIException):
    def __init__(self, message: str, fields: Optional[Dict[str, str]] = None):
        super().__init__(message, 422, "VALIDATION_ERROR", {"field_errors": fields or {}})

class ConflictException(SmartParkAPIException):
    def __init__(self, message: str):
        super().__init__(message, 409, "CONFLICT")
