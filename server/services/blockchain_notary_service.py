"""
SmartPark Blockchain Hash Notary & Audit Service
Generates cryptographic hash verification certificates for parking receipts and corporate tax logs.
"""

from typing import Dict, Any, List
from server.database.repositories.blockchain_notary_repository import BlockchainNotaryRepository, BlockchainAuditProof

class BlockchainNotaryService:
    @staticmethod
    def get_or_create_proof(res_id: str = "RES-A2401", user_id: str = "usr-tcs-01", amount: float = 40.0) -> Dict[str, Any]:
        proof = BlockchainNotaryRepository.get_by_reservation(res_id)
        if not proof:
            proof = BlockchainAuditProof(reservation_id=res_id, user_id=user_id, amount=amount)
            BlockchainNotaryRepository.create(proof)

        return {"success": True, "proof": proof.to_dict()}
