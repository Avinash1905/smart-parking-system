"""
SmartPark Live Telemetry Background Streamer
Simulates urban traffic fluctuations, periodic slot occupancy flips, and barrier telemetry.
"""

import time
import random
import threading
from server.websocket.ws_gateway import ws_gateway

class LiveTelemetryStreamer:
    def __init__(self, interval_seconds: int = 5):
        self.interval = interval_seconds
        self.running = False

    def start(self):
        self.running = True
        t = threading.Thread(target=self._stream_loop, daemon=True)
        t.start()

    def _stream_loop(self):
        zones = ["zone-pub-01", "zone-pub-02", "zone-pvt-01", "zone-pvt-02"]
        while self.running:
            time.sleep(self.interval)
            target_zone = random.choice(zones)
            event_type = random.choice(["OCCUPANCY_UPDATE", "SLOT_STATE_CHANGE", "SENSOR_HEARTBEAT"])
            
            payload = {
                "zone_id": target_zone,
                "sensor_stud_id": f"sns-{random.randint(10, 99)}",
                "delta_spaces": random.choice([-1, 1]),
                "current_reading": random.choice(["AVAILABLE", "OCCUPIED"]),
                "battery_voltage": round(3.6 + (random.random() * 0.4), 2),
                "timestamp": time.time()
            }
            ws_gateway.broadcast_event(event_type, payload)

telemetry_streamer = LiveTelemetryStreamer()
