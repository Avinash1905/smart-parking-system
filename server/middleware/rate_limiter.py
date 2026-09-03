"""
SmartPark API Rate Limiter Middleware
Implements in-memory sliding window rate limiting to guard public and reservation endpoints against abuse.
"""

import time
from typing import Dict, List, Tuple
from server.middleware.error_handler import SmartParkAPIException

class RateLimiter:
    def __init__(self, max_requests: int = 120, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clients: Dict[str, List[float]] = {}

    def is_allowed(self, client_ip: str) -> Tuple[bool, int]:
        now = time.time()
        timestamps = self.clients.get(client_ip, [])
        
        # Prune older than window
        valid_timestamps = [t for t in timestamps if now - t < self.window_seconds]
        
        if len(valid_timestamps) >= self.max_requests:
            self.clients[client_ip] = valid_timestamps
            remaining = 0
            return False, remaining

        valid_timestamps.append(now)
        self.clients[client_ip] = valid_timestamps
        remaining = self.max_requests - len(valid_timestamps)
        return True, remaining

    def check_rate_limit(self, client_ip: str):
        allowed, remaining = self.is_allowed(client_ip)
        if not allowed:
            raise SmartParkAPIException("API rate limit exceeded. Please wait 60 seconds.", status_code=429, error_code="RATE_LIMIT_EXCEEDED")

global_rate_limiter = RateLimiter(max_requests=120, window_seconds=60)
