"""
SmartPark Solar Irradiance & Rooftop Photovoltaic Forecast Repository Layer
Manages rooftop pyranometer solar flux (W/m²), ambient UV index, and hourly green energy generation forecasts.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class SolarForecastTelemetry:
    def __init__(
        self,
        id: str = "",
        station_code: str = "SOLAR-MET-DECK-01",
        zone_id: str = "zone-pub-01",
        solar_irradiance_w_m2: float = 842.5,
        uv_index: float = 7.4,
        ambient_temperature_celsius: float = 28.6,
        predicted_daily_kwh: float = 380.0,
        current_instant_generation_kw: float = 48.2,
        status: str = "PEAK_INSOLATION",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"sol-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.solar_irradiance_w_m2 = solar_irradiance_w_m2
        self.uv_index = uv_index
        self.ambient_temperature_celsius = ambient_temperature_celsius
        self.predicted_daily_kwh = predicted_daily_kwh
        self.current_instant_generation_kw = current_instant_generation_kw
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "solar_irradiance_w_m2": self.solar_irradiance_w_m2,
            "uv_index": self.uv_index,
            "ambient_temperature_celsius": self.ambient_temperature_celsius,
            "predicted_daily_kwh": self.predicted_daily_kwh,
            "current_instant_generation_kw": self.current_instant_generation_kw,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class SolarForecastRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS solar_forecast_telemetries (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    solar_irradiance_w_m2 REAL DEFAULT 842.5,
                    uv_index REAL DEFAULT 7.4,
                    ambient_temperature_celsius REAL DEFAULT 28.6,
                    predicted_daily_kwh REAL DEFAULT 380.0,
                    current_instant_generation_kw REAL DEFAULT 48.2,
                    status TEXT DEFAULT 'PEAK_INSOLATION',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> SolarForecastTelemetry:
        SolarForecastRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM solar_forecast_telemetries WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return SolarForecastTelemetry(**dict(row))
            node = SolarForecastTelemetry(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO solar_forecast_telemetries (
                    id, station_code, zone_id, solar_irradiance_w_m2,
                    uv_index, ambient_temperature_celsius,
                    predicted_daily_kwh, current_instant_generation_kw,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                node.id, node.station_code, node.zone_id,
                node.solar_irradiance_w_m2, node.uv_index,
                node.ambient_temperature_celsius,
                node.predicted_daily_kwh,
                node.current_instant_generation_kw,
                node.status, datetime.utcnow().isoformat()
            ))
            conn.commit()
            return node

SolarForecastRepository.init_table()
