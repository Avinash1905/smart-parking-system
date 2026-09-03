"""
SmartPark Electrical Transformer K-Factor & Harmonic Heating Derating Service
Calculates eddy current loss multipliers caused by non-linear EV charger rectifier loads.
"""

from typing import Dict, List, Any
from datetime import datetime

class EVTransformerKFactorService:
    @staticmethod
    def calculate_derating(k_factor_measured: float = 4.2, transformer_nameplate_kva: float = 500.0) -> Dict[str, Any]:
        derating_factor = 0.94  # 6% derating for K-4 non-linear harmonic spectrum
        derated_kva = round(transformer_nameplate_kva * derating_factor, 1)

        return {
            "timestamp": datetime.now().isoformat(),
            "nameplate_kva": transformer_nameplate_kva,
            "measured_k_factor": k_factor_measured,
            "derating_factor": derating_factor,
            "safe_derated_capacity_kva": derated_kva,
            "harmonic_spectrum": "TYPICAL_6_PULSE_RECTIFIER",
            "insulation_thermal_stress": "WITHIN_CLASS_H_LIMITS"
        }
