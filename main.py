#!/usr/bin/env python3
"""
SmartPark Executable Runner
"""

from app import run_server
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port=port)
