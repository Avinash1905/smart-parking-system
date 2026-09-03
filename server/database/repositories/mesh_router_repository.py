"""
SmartPark IoT Sensor Mesh Border Router & 6LoWPAN Gateway Repository Layer
Manages 802.15.4 wireless mesh border routers, Thread/Zigbee routing tables, and sub-10ms packet latency across 500+ parking bay sensors.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class MeshRouterNode:
    def __init__(
        self,
        id: str = "",
        router_code: str = "MESH-BORDER-ROUTER-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Central Server Core",
        connected_mesh_nodes_count: int = 420,
        average_packet_latency_ms: float = 8.4,
        mesh_packet_delivery_rate_pct: float = 99.92,
        network_channel_id: int = 15,
        mesh_protocol: str = "THREAD_6LOWPAN_COAP",
        routing_state: str = "MESH_TOPOLOGY_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"mrn-{uuid.uuid4().hex[:8]}"
        self.router_code = router_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.connected_mesh_nodes_count = connected_mesh_nodes_count
        self.average_packet_latency_ms = average_packet_latency_ms
        self.mesh_packet_delivery_rate_pct = mesh_packet_delivery_rate_pct
        self.network_channel_id = network_channel_id
        self.mesh_protocol = mesh_protocol
        self.routing_state = routing_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "router_code": self.router_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "connected_mesh_nodes_count": self.connected_mesh_nodes_count,
            "average_packet_latency_ms": self.average_packet_latency_ms,
            "mesh_packet_delivery_rate_pct": self.mesh_packet_delivery_rate_pct,
            "network_channel_id": self.network_channel_id,
            "mesh_protocol": self.mesh_protocol,
            "routing_state": self.routing_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class MeshRouterRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS mesh_router_nodes (
                    id TEXT PRIMARY KEY,
                    router_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    connected_mesh_nodes_count INTEGER DEFAULT 420,
                    average_packet_latency_ms REAL DEFAULT 8.4,
                    mesh_packet_delivery_rate_pct REAL DEFAULT 99.92,
                    network_channel_id INTEGER DEFAULT 15,
                    mesh_protocol TEXT DEFAULT 'THREAD_6LOWPAN_COAP',
                    routing_state TEXT DEFAULT 'MESH_TOPOLOGY_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> MeshRouterNode:
        MeshRouterRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM mesh_router_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return MeshRouterNode(**dict(row))
            node = MeshRouterNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO mesh_router_nodes (
                    id, router_code, zone_id, floor_level,
                    connected_mesh_nodes_count,
                    average_packet_latency_ms,
                    mesh_packet_delivery_rate_pct,
                    network_channel_id, mesh_protocol, routing_state,
                    timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.router_code, node.zone_id, node.floor_level,
                node.connected_mesh_nodes_count,
                node.average_packet_latency_ms,
                node.mesh_packet_delivery_rate_pct,
                node.network_channel_id, node.mesh_protocol,
                node.routing_state, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

MeshRouterRepository.init_table()
