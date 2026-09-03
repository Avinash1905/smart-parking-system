#!/usr/bin/env python3
"""
SmartPark Main Application Entrypoint
Launches the full-stack SmartPark HTTP server and API backend.
"""

import sys
import os

# Ensure UTF-8 output on Windows console
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from server.server import run_server

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 60)
    print("[SMARTPARK] Intelligent Parking & Mobility Platform")
    print(f"[SMARTPARK] Server running at http://127.0.0.1:{port}")
    print(f"[SMARTPARK] Serving web application from: {BASE_DIR}")
    print("=" * 60)
    run_server(port=port)
