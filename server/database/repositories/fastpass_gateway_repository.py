"""
SmartPark NETC FastTag RFID Barrier Reader Gateway Repository Layer
Manages 865-868MHz EPC Gen 2 UHF RFID transceiver antennas, 100ms high-speed vehicle pass processing, and automatic barrier relay pulses.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FastpassGatewayNode:
    def __init__(
        self,
        id: str = "",
        gateway_code: str = "FASTPASS-UHF-PORTAL-01",
        zone_id: str = "zone-pub-01",
        ingress_lane: str = "Express Ingress Lane 01 (RFID Automated)",
        transponder_frequency_mhz: float = 866.5,
        last_scanned_tag_epc: str = "EPC-9902-8819-2041-KA01",
        rfid_read_latency_ms: float = 48.0,      # Barrier opens < 100ms
        antenna_rssi_dbm: float = -52.0,
        gateway_operational_state: str = "RFID_TRANSCEIVER_ONLINE",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fpg-{uuid.uuid4().hex[:8]}"
        self.gateway_code = gateway_code
        self.zone_id = zone_id
        self.ingress_lane = ingress_lane
        self.transponder_frequency_mhz = transponder_frequency_mhz
        self.last_scanned_tag_epc = last_scanned_tag_epc
        self.rfid_read_latency_ms = rfid_read_latency_ms
        self.antenna_rssi_dbm = antenna_rssi_dbm
        self.gateway_operational_state = gateway_operational_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "gateway_code": self.gateway_code,
            "zone_id": self.zone_id,
            "ingress_lane": self.ingress_lane,
            "transponder_frequency_mhz": self.transponder_frequency_mhz,
            "last_scanned_tag_epc": self.last_scanned_tag_epc,
            "rfid_read_latency_ms": self.rfid_read_latency_ms,
            "antenna_rssi_dbm": self.antenna_rssi_dbm,
            "gateway_operational_state": self.gateway_operational_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FastpassGatewayRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fastpass_gateway_nodes (
                    id TEXT PRIMARY KEY,
                    gateway_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    ingress_lane TEXT NOT NULL,
                    transponder_frequency_mhz REAL DEFAULT 866.5,
                    last_scanned_tag_epc TEXT DEFAULT 'EPC-9902-8819-2041-KA01',
                    rfid_read_latency_ms REAL DEFAULT 48.0,
                    antenna_rssi_dbm REAL DEFAULT -52.0,
                    gateway_operational_state TEXT DEFAULT 'RFID_TRANSCEIVER_ONLINE',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FastpassGatewayNode:
        FastpassGatewayRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fastpass_gateway_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FastpassGatewayNode(**dict(row))
            node = FastpassGatewayNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO fastpass_gateway_nodes (
                    id, gateway_code, zone_id, ingress_lane,
                    transponder_frequency_mhz, last_scanned_tag_epc,
                    rfid_read_latency_ms, antenna_rssi_dbm,
                    gateway_operational_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.gateway_code, node.zone_id,
                node.ingress_lane, node.transponder_frequency_mhz,
                node.last_scanned_tag_epc,
                node.rfid_read_latency_ms,
                node.antenna_rssi_dbm,
                node.gateway_operational_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FastpassGatewayRepository.init_table()
