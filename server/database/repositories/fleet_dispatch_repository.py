"""
SmartPark Fleet Vehicle Telematics & Maintenance Dispatch Repository Layer
Manages commercial fleet parking bay allocations, CAN-bus battery SoC/diagnostic telemetry, and automated maintenance technician dispatching.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class FleetDispatchNode:
    def __init__(
        self,
        id: str = "",
        fleet_code: str = "FLEET-DISPATCH-HUB-01",
        zone_id: str = "zone-pub-01",
        company_name: str = "Zepto Electric Logistics Fleet",
        active_vehicles_staged: int = 24,
        total_fleet_capacity: int = 30,
        average_battery_soc_pct: float = 88.5,
        scheduled_maintenance_due: int = 2,
        dispatch_status: str = "FLEET_STAGING_OPTIMAL",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"fdh-{uuid.uuid4().hex[:8]}"
        self.fleet_code = fleet_code
        self.zone_id = zone_id
        self.company_name = company_name
        self.active_vehicles_staged = active_vehicles_staged
        self.total_fleet_capacity = total_fleet_capacity
        self.average_battery_soc_pct = average_battery_soc_pct
        self.scheduled_maintenance_due = scheduled_maintenance_due
        self.dispatch_status = dispatch_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "fleet_code": self.fleet_code,
            "zone_id": self.zone_id,
            "company_name": self.company_name,
            "active_vehicles_staged": self.active_vehicles_staged,
            "total_fleet_capacity": self.total_fleet_capacity,
            "average_battery_soc_pct": self.average_battery_soc_pct,
            "scheduled_maintenance_due": self.scheduled_maintenance_due,
            "dispatch_status": self.dispatch_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class FleetDispatchRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS fleet_dispatch_nodes (
                    id TEXT PRIMARY KEY,
                    fleet_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    company_name TEXT NOT NULL,
                    active_vehicles_staged INTEGER DEFAULT 24,
                    total_fleet_capacity INTEGER DEFAULT 30,
                    average_battery_soc_pct REAL DEFAULT 88.5,
                    scheduled_maintenance_due INTEGER DEFAULT 2,
                    dispatch_status TEXT DEFAULT 'FLEET_STAGING_OPTIMAL',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> FleetDispatchNode:
        FleetDispatchRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM fleet_dispatch_nodes WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return FleetDispatchNode(**dict(row))
            node = FleetDispatchNode(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO fleet_dispatch_nodes (
                    id, fleet_code, zone_id, company_name,
                    active_vehicles_staged, total_fleet_capacity,
                    average_battery_soc_pct, scheduled_maintenance_due,
                    dispatch_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.fleet_code, node.zone_id, node.company_name,
                node.active_vehicles_staged, node.total_fleet_capacity,
                node.average_battery_soc_pct,
                node.scheduled_maintenance_due,
                node.dispatch_status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

FleetDispatchRepository.init_table()
