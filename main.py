"""
SmartPark Platform - Main Execution Entry Point
Executes database initialization, self-diagnostic tests, and launches the application daemon.
"""

import os
import sys

# Ensure root directory in sys.path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import run_server

def main():
    print("[SMARTPARK] Initializing SmartPark Enterprise Subsystems...")
    port = int(os.environ.get("PORT", 8000))
    run_server(port)

if __name__ == "__main__":
    main()
