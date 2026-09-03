#!/usr/bin/env python3
"""
SmartPark Main Application Entrypoint
Launches the full-stack SmartPark HTTP server and API backend.
"""

import sys
import os

# Add root and server directory to Python module search path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, "server"))

from server.server import run_server

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 60)
    print("🚗 SMARTPARK — Intelligent Parking & Mobility Platform")
    print(f"🚀 Server running at http://127.0.0.1:{port}")
    print(f"📁 Serving static assets from: {BASE_DIR}")
    print("=" * 60)
    run_server(port=port)
