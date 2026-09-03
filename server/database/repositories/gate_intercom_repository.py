"""
SmartPark Gate SIP VoIP High-Definition Intercom & Remote Barrier Assistance Repository Layer
Manages Session Initiation Protocol (SIP) VoIP intercom terminals, G.722 wideband audio codecs, 1080p SIP video streams, and remote security barrier dispatch.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class GateIntercomStation:
    def __init__(
        self,
        id: str = "",
        station_code: str = "SIP-INTERCOM-ENTRY-01",
        zone_id: str = "zone-pub-01",
        floor_level: str = "Ground Inbound Entry Boom Barrier",
        sip_extension_number: str = "1001",
        sip_registration_status: str = "SIP_REGISTERED_ONLINE",
        audio_codec: str = "G722_WIDEBAND_HD",
        video_stream_resolution: str = "1080P_H264_30FPS",
        calls_handled_today: int = 14,
        intercom_call_state: str = "IDLE_STANDBY",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"gis-{uuid.uuid4().hex[:8]}"
        self.station_code = station_code
        self.zone_id = zone_id
        self.floor_level = floor_level
        self.sip_extension_number = sip_extension_number
        self.sip_registration_status = sip_registration_status
        self.audio_codec = audio_codec
        self.video_stream_resolution = video_stream_resolution
        self.calls_handled_today = calls_handled_today
        self.intercom_call_state = intercom_call_state
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "station_code": self.station_code,
            "zone_id": self.zone_id,
            "floor_level": self.floor_level,
            "sip_extension_number": self.sip_extension_number,
            "sip_registration_status": self.sip_registration_status,
            "audio_codec": self.audio_codec,
            "video_stream_resolution": self.video_stream_resolution,
            "calls_handled_today": self.calls_handled_today,
            "intercom_call_state": self.intercom_call_state,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class GateIntercomRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS gate_intercom_stations (
                    id TEXT PRIMARY KEY,
                    station_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    floor_level TEXT NOT NULL,
                    sip_extension_number TEXT DEFAULT '1001',
                    sip_registration_status TEXT DEFAULT 'SIP_REGISTERED_ONLINE',
                    audio_codec TEXT DEFAULT 'G722_WIDEBAND_HD',
                    video_stream_resolution TEXT DEFAULT '1080P_H264_30FPS',
                    calls_handled_today INTEGER DEFAULT 14,
                    intercom_call_state TEXT DEFAULT 'IDLE_STANDBY',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> GateIntercomStation:
        GateIntercomRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM gate_intercom_stations WHERE zone_id = ? ORDER BY timestamp DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return GateIntercomStation(**dict(row))
            station = GateIntercomStation(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO gate_intercom_stations (
                    id, station_code, zone_id, floor_level,
                    sip_extension_number, sip_registration_status,
                    audio_codec, video_stream_resolution,
                    calls_handled_today, intercom_call_state, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                station.id, station.station_code, station.zone_id,
                station.floor_level, station.sip_extension_number,
                station.sip_registration_status, station.audio_codec,
                station.video_stream_resolution,
                station.calls_handled_today,
                station.intercom_call_state,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return station

GateIntercomRepository.init_table()
