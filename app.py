"""
SmartPark Platform - Production Application Entry Point
Initializes SQLite database schemas, starts the multi-threaded HTTP server, and mounts REST endpoints.
"""

import os
import sys
import socketserver
import urllib.parse
from server.server import SmartParkRequestHandler, PORT, STATIC_DIR

def run_server(port=PORT):
    server_address = ('', port)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(server_address, SmartParkRequestHandler)
    print("=================================================================")
    print(f"  🚀 SMARTPARK ENTERPRISE SERVER RUNNING ON http://localhost:{port}")
    print(f"  📁 Serving Frontend Assets & REST APIs from: {STATIC_DIR}")
    print("=================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SMARTPARK] Gracefully shutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)
