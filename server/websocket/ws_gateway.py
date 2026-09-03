"""
SmartPark Real-Time WebSocket Gateway & Telemetry Streamer
Maintains persistent WebSocket/TCP connections to broadcast live slot occupancy changes,
ANPR barrier events, and instant driver notification alerts.
"""

import socket
import threading
import json
import time
from typing import Set, Dict, Any

class WebSocketGateway:
    def __init__(self, host: str = "0.0.0.0", port: int = 8086):
        self.host = host
        self.port = port
        self.clients: Set[socket.socket] = set()
        self.lock = threading.Lock()
        self.is_running = False

    def start(self):
        self.is_running = True
        thread = threading.Thread(target=self._server_loop, daemon=True)
        thread.start()
        print(f"[SMARTPARK] WebSocket Real-Time Gateway running on port {self.port}")

    def _server_loop(self):
        server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            server_sock.bind((self.host, self.port))
            server_sock.listen(10)
            while self.is_running:
                client_sock, addr = server_sock.accept()
                with self.lock:
                    self.clients.add(client_sock)
                # Send initial handshake packet
                welcome = {
                    "type": "CONNECTION_ESTABLISHED",
                    "timestamp": time.time(),
                    "server": "SmartPark Telemetry Engine v2.0"
                }
                self._send_raw(client_sock, welcome)
        except Exception as e:
            pass
        finally:
            server_sock.close()

    def _send_raw(self, sock: socket.socket, data: Dict[str, Any]):
        try:
            payload = (json.dumps(data) + "\n").encode('utf-8')
            sock.sendall(payload)
        except Exception:
            with self.lock:
                if sock in self.clients:
                    self.clients.remove(sock)

    def broadcast_event(self, event_type: str, data: Dict[str, Any]):
        packet = {
            "type": event_type,
            "timestamp": time.time(),
            "data": data
        }
        with self.lock:
            disconnected = set()
            for client in self.clients:
                try:
                    payload = (json.dumps(packet) + "\n").encode('utf-8')
                    client.sendall(payload)
                except Exception:
                    disconnected.add(client)
            self.clients -= disconnected

ws_gateway = WebSocketGateway()
