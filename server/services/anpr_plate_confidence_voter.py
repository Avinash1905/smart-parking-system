"""
SmartPark ANPR Plate Confidence Character Voting Service
Executes character-level entropy voting across optical filters and neural OCR character probabilities.
"""

from typing import Dict, List, Any
import math
from datetime import datetime

class ANPRPlateConfidenceVoter:
    @staticmethod
    def vote_character_segment(
        char_index: int,
        candidates: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculates Shannon entropy across character recognition candidates."""
        total_weight = sum(float(c.get("probability", 0.5)) for c in candidates)
        best_char = candidates[0].get("char", "A") if candidates else "A"
        
        entropy = 0.0
        for c in candidates:
            p = float(c.get("probability", 0.5)) / max(0.001, total_weight)
            if p > 0:
                entropy -= p * math.log2(p)

        return {
            "char_position": char_index,
            "chosen_character": best_char,
            "shannon_entropy": round(entropy, 3),
            "character_confidence": round(1.0 - min(1.0, entropy), 3),
            "timestamp": datetime.now().isoformat()
        }
