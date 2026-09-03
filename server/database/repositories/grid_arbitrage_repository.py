"""
SmartPark Smart Grid Demand-Response & Peak Shaving Repository Layer
Manages dynamic EV charging throttle signals during utility grid stress and Vehicle-to-Grid (V2G) discharge credits.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GridDemandResponseEvent:
    def __init__(
        self,
        id: str = "",
        grid_event_code: str = "BESCOM-DR-2026-08",
        utility_provider: str = "BESCOM (Bangalore Electricity Supply)",
        grid_curtailment_target_kw: float = 120.0,
        actual_load_curtailed_kw: float = 114.5,
        v2g_feed_in_active: bool = True,
        financial_rebate_earned_inr: float = 3450.0,
        event_status: str = "COMPLETED_SETTLED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"dr-{uuid.uuid4().hex[:8]}"
        self.grid_event_code = grid_event_code
        self.utility_provider = utility_provider
        self.grid_curtailment_target_kw = grid_curtailment_target_kw
        self.actual_load_curtailed_kw = actual_load_curtailed_kw
        self.v2g_feed_in_active = v2g_feed_in_active
        self.financial_rebate_earned_inr = financial_rebate_earned_inr
        self.event_status = event_status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "grid_event_code": self.grid_event_code,
            "utility_provider": self.utility_provider,
            "grid_curtailment_target_kw": self.grid_curtailment_target_kw,
            "actual_load_curtailed_kw": self.actual_load_curtailed_kw,
            "v2g_feed_in_active": self.v2g_feed_in_active,
            "financial_rebate_earned_inr": self.financial_rebate_earned_inr,
            "event_status": self.event_status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GridArbitrageRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS grid_demand_response_events (
                    id TEXT PRIMARY KEY,
                    grid_event_code TEXT UNIQUE NOT NULL,
                    utility_provider TEXT NOT NULL,
                    grid_curtailment_target_kw REAL DEFAULT 120.0,
                    actual_load_curtailed_kw REAL DEFAULT 114.5,
                    v2g_feed_in_active INTEGER DEFAULT 1,
                    financial_rebate_earned_inr REAL DEFAULT 3450.0,
                    event_status TEXT DEFAULT 'COMPLETED_SETTLED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest() -> GridDemandResponseEvent:
        GridArbitrageRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM grid_demand_response_events ORDER BY timestamp DESC LIMIT 1")
            row = cursor.fetchone()
            if row:
                d = dict(row)
                d["v2g_feed_in_active"] = bool(d["v2g_feed_in_active"])
                return GridDemandResponseEvent(**d)
            evt = GridDemandResponseEvent()
            cursor.execute("""
                INSERT INTO grid_demand_response_events (
                    id, grid_event_code, utility_provider,
                    grid_curtailment_target_kw, actual_load_curtailed_kw,
                    v2g_feed_in_active, financial_rebate_earned_inr,
                    event_status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                evt.id, evt.grid_event_code, evt.utility_provider,
                evt.grid_curtailment_target_kw, evt.actual_load_curtailed_kw,
                1 if evt.v2g_feed_in_active else 0,
                evt.financial_rebate_earned_inr, evt.event_status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return evt

GridArbitrageRepository.init_table()
