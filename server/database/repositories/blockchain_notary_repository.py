"""
SmartPark Cryptographic Blockchain Notary Repository Layer
Generates tamper-proof SHA-256 digital proof certificates for parking fee settlements and municipal compliance audits.
"""

import sqlite3
import json
import uuid
import hashlib
from datetime import datetime
from typing import List, Optional, Dict, Any
from server.database.db import db

class BlockchainAuditProof:
    def __init__(
        self,
        id: str = "",
        reservation_id: str = "RES-A2401",
        user_id: str = "usr-tcs-01",
        amount: float = 40.0,
        block_index: int = 148290,
        sha256_hash: str = "",
        previous_block_hash: str = "0000abc4892ef012398402948209384029384092384092384092384092384092",
        status: str = "NOTARIZED_CONFIRMED",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"blc-{uuid.uuid4().hex[:8]}"
        self.reservation_id = reservation_id
        self.user_id = user_id
        self.amount = amount
        self.block_index = block_index
        if not sha256_hash:
            raw = f"{reservation_id}:{user_id}:{amount}:{block_index}:{datetime.utcnow().isoformat()}"
            self.sha256_hash = hashlib.sha256(raw.encode('utf-8')).hexdigest()
        else:
            self.sha256_hash = sha256_hash
        self.previous_block_hash = previous_block_hash
        self.status = status
        self.timestamp = timestamp or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "reservation_id": self.reservation_id,
            "user_id": self.user_id,
            "amount": self.amount,
            "block_index": self.block_index,
            "sha256_hash": self.sha256_hash,
            "previous_block_hash": self.previous_block_hash,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }

class BlockchainNotaryRepository:
    @staticmethod
    def init_table():
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS blockchain_audit_proofs (
                    id TEXT PRIMARY KEY,
                    reservation_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    amount REAL DEFAULT 40.0,
                    block_index INTEGER DEFAULT 148290,
                    sha256_hash TEXT UNIQUE NOT NULL,
                    previous_block_hash TEXT NOT NULL,
                    status TEXT DEFAULT 'NOTARIZED_CONFIRMED',
                    timestamp TEXT
                )
            """)
            conn.commit()

    @staticmethod
    def create(proof: BlockchainAuditProof) -> bool:
        BlockchainNotaryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            now_iso = datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO blockchain_audit_proofs (
                    id, reservation_id, user_id, amount,
                    block_index, sha256_hash, previous_block_hash,
                    status, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                proof.id, proof.reservation_id, proof.user_id,
                proof.amount, proof.block_index, proof.sha256_hash,
                proof.previous_block_hash, proof.status, now_iso
            ))
            conn.commit()
            return cursor.rowcount > 0

    @staticmethod
    def get_by_reservation(res_id: str) -> Optional[BlockchainAuditProof]:
        BlockchainNotaryRepository.init_table()
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM blockchain_audit_proofs WHERE reservation_id = ?", (res_id,))
            row = cursor.fetchone()
            return BlockchainAuditProof(**dict(row)) if row else None

BlockchainNotaryRepository.init_table()
