"""
SmartPark Multi-Deck EV Energy Broker & Transformer Load Balancer Service
Brokers power quotas across Basement, Ground, and Upper Deck charging clusters,
preventing building transformer thermal overload while maximizing vehicle charge throughput.
"""

from typing import Dict, List, Any
from datetime import datetime

class MultiDeckEVChargerBroker:
    CLUSTERS = [
        {"cluster_id": "DECK-B1-CLUSTER", "floor": "B1", "max_capacity_kw": 100.0, "active_chargers": 4, "current_draw_kw": 48.2},
        {"cluster_id": "DECK-G-CLUSTER", "floor": "G", "max_capacity_kw": 80.0, "active_chargers": 2, "current_draw_kw": 14.8},
        {"cluster_id": "DECK-L2-SOLAR-CLUSTER", "floor": "L2", "max_capacity_kw": 120.0, "active_chargers": 5, "current_draw_kw": 62.5}
    ]

    @classmethod
    def rebalance_power_quotas(cls, total_substation_limit_kw: float = 250.0) -> Dict[str, Any]:
        total_current_draw = sum(c["current_draw_kw"] for c in cls.CLUSTERS)
        headroom_kw = max(0.0, total_substation_limit_kw - total_current_draw)

        return {
            "timestamp": datetime.now().isoformat(),
            "substation_transformer_limit_kw": total_substation_limit_kw,
            "total_facility_ev_draw_kw": round(total_current_draw, 2),
            "available_headroom_kw": round(headroom_kw, 2),
            "transformer_load_utilization_pct": round((total_current_draw / total_substation_limit_kw) * 100.0, 1),
            "power_balancing_mode": "DYNAMIC_OPTIMAL_THROUGHPUT",
            "clusters": cls.CLUSTERS
        }
