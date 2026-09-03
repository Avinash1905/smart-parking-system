"""
SmartPark Cryptographic Audit Chain Notary
Creates tamper-proof SHA-256 blockchain-style hash blocks for sensitive enforcement actions, barrier gate overrides, and payment settlements.
"""

import hashlib
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

class AuditBlock:
    def __init__(
        self,
        index: int,
        timestamp: str,
        actor_id: str,
        actor_email: str,
        action: str,
        resource_type: str,
        resource_id: str,
        payload_data: Dict[str, Any],
        previous_hash: str
    ):
        self.index = index
        self.timestamp = timestamp
        self.actor_id = actor_id
        self.actor_email = actor_email
        self.action = action
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.payload_data = payload_data
        self.previous_hash = previous_hash
        self.hash = self.compute_hash()

    def compute_hash(self) -> str:
        raw_string = f"{self.index}:{self.timestamp}:{self.actor_id}:{self.action}:{self.resource_type}:{self.resource_id}:{json.dumps(self.payload_data, sort_keys=True)}:{self.previous_hash}"
        return hashlib.sha256(raw_string.encode("utf-8")).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "actor_id": self.actor_id,
            "actor_email": self.actor_email,
            "action": self.action,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "payload_data": self.payload_data,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }

class AuditChainNotary:
    GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
    _chain: List[AuditBlock] = []

    @classmethod
    def record_entry(
        cls,
        actor_id: str,
        actor_email: str,
        action: str,
        resource_type: str,
        resource_id: str,
        payload_data: Dict[str, Any]
    ) -> AuditBlock:
        prev_hash = cls._chain[-1].hash if cls._chain else cls.GENESIS_HASH
        idx = len(cls._chain) + 1
        block = AuditBlock(
            index=idx,
            timestamp=datetime.utcnow().isoformat(),
            actor_id=actor_id,
            actor_email=actor_email,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            payload_data=payload_data,
            previous_hash=prev_hash
        )
        cls._chain.append(block)
        return block

    @classmethod
    def verify_integrity(cls) -> Dict[str, Any]:
        """Validates all cryptographic hashes and parent pointers in the audit chain."""
        if not cls._chain:
            return {"valid": True, "total_blocks": 0, "message": "Audit chain is empty."}

        for i in range(len(cls._chain)):
            block = cls._chain[i]
            # Verify self hash
            if block.compute_hash() != block.hash:
                return {"valid": False, "corrupted_block_index": block.index, "reason": "Hash mismatch detected."}

            # Verify link to previous
            if i > 0:
                prev_block = cls._chain[i - 1]
                if block.previous_hash != prev_block.hash:
                    return {"valid": False, "corrupted_block_index": block.index, "reason": "Broken previous hash pointer."}

        return {
            "valid": True,
            "total_blocks": len(cls._chain),
            "head_hash": cls._chain[-1].hash,
            "verification_timestamp": datetime.utcnow().isoformat()
        }

    @classmethod
    def get_recent_blocks(cls, limit: int = 50) -> List[Dict[str, Any]]:
        return [b.to_dict() for b in reversed(cls._chain[-limit:])]
