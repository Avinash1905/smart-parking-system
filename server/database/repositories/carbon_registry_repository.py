"""
SmartPark Carbon Credit Registry & Verified Carbon Standard (VCS) Repository Layer
Manages verified greenhouse gas emission offsets, EV charging kWh CO2 avoidance, and blockchain notarized green carbon certificates.
"""

import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class CarbonCreditCertificate:
    def __init__(
        self,
        id: str = "",
        certificate_code: str = "VCS-CARBON-8842",
        zone_id: str = "zone-pub-01",
        metric_tons_co2_offset: float = 142.8,
        solar_kwh_generated: float = 48200.0,
        ev_green_charging_kwh: float = 89400.0,
        verified_carbon_standard_id: str = "VCS-PROJ-99214",
        blockchain_ledger_tx_hash: str = "0x89f2a410b0d3e57199bc4c0128e469b20721490218ab2",
        status: str = "CREDIT_MINTED_ACTIVE",
        issued_date: Optional[datetime] = None
    ):
        self.id = id or f"vcs-{uuid.uuid4().hex[:8]}"
        self.certificate_code = certificate_code
        self.zone_id = zone_id
        self.metric_tons_co2_offset = metric_tons_co2_offset
        self.solar_kwh_generated = solar_kwh_generated
        self.ev_green_charging_kwh = ev_green_charging_kwh
        self.verified_carbon_standard_id = verified_carbon_standard_id
        self.blockchain_ledger_tx_hash = blockchain_ledger_tx_hash
        self.status = status
        self.issued_date = issued_date or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "certificate_code": self.certificate_code,
            "zone_id": self.zone_id,
            "metric_tons_co2_offset": self.metric_tons_co2_offset,
            "solar_kwh_generated": self.solar_kwh_generated,
            "ev_green_charging_kwh": self.ev_green_charging_kwh,
            "verified_carbon_standard_id": self.verified_carbon_standard_id,
            "blockchain_ledger_tx_hash": self.blockchain_ledger_tx_hash,
            "status": self.status,
            "issued_date": self.issued_date.isoformat() if isinstance(self.issued_date, datetime) else self.issued_date
        }

class CarbonRegistryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS carbon_credit_certificates (
                    id TEXT PRIMARY KEY,
                    certificate_code TEXT UNIQUE NOT NULL,
                    zone_id TEXT NOT NULL,
                    metric_tons_co2_offset REAL DEFAULT 142.8,
                    solar_kwh_generated REAL DEFAULT 48200.0,
                    ev_green_charging_kwh REAL DEFAULT 89400.0,
                    verified_carbon_standard_id TEXT NOT NULL,
                    blockchain_ledger_tx_hash TEXT NOT NULL,
                    status TEXT DEFAULT 'CREDIT_MINTED_ACTIVE',
                    issued_date TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def get_latest(zone_id: str = "zone-pub-01") -> CarbonCreditCertificate:
        CarbonRegistryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM carbon_credit_certificates WHERE zone_id = ? ORDER BY issued_date DESC LIMIT 1", (zone_id,))
            row = cursor.fetchone()
            if row:
                return CarbonCreditCertificate(**dict(row))
            cert = CarbonCreditCertificate(zone_id=zone_id)
            cursor.execute("""
                INSERT INTO carbon_credit_certificates (
                    id, certificate_code, zone_id,
                    metric_tons_co2_offset, solar_kwh_generated,
                    ev_green_charging_kwh, verified_carbon_standard_id,
                    blockchain_ledger_tx_hash, status, issued_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                cert.id, cert.certificate_code, cert.zone_id,
                cert.metric_tons_co2_offset,
                cert.solar_kwh_generated,
                cert.ev_green_charging_kwh,
                cert.verified_carbon_standard_id,
                cert.blockchain_ledger_tx_hash, cert.status,
                datetime.utcnow().isoformat()
            ))
            conn.commit()
            return cert

CarbonRegistryRepository.init_table()
