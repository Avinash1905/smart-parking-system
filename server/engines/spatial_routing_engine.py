"""
SmartPark Spatial Routing & Wayfinding Engine
Implements A* pathfinding and topological indoor graph search for multi-level parking garages.
Calculates optimal driving trajectories from entrance gates to assigned bays.
"""

import math
import heapq
from typing import Dict, List, Tuple, Optional, Any

class Point:
    def __init__(self, x: float, y: float, floor: int = 0):
        self.x = x
        self.y = y
        self.floor = floor

    def distance_to(self, other: 'Point') -> float:
        floor_penalty = abs(self.floor - other.floor) * 25.0
        euclidean = math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)
        return euclidean + floor_penalty

    def to_dict(self) -> Dict[str, Any]:
        return {"x": round(self.x, 2), "y": round(self.y, 2), "floor": self.floor}

class WaypointNode:
    def __init__(self, node_id: str, point: Point, node_type: str = "LANE"):
        self.node_id = node_id
        self.point = point
        self.node_type = node_type  # ENTRY, EXIT, LANE, RAMP, ELEVATOR, BAY
        self.neighbors: Dict[str, float] = {}  # target_node_id -> cost

    def add_edge(self, target_id: str, cost: float):
        self.neighbors[target_id] = cost

class GarageSpatialGraph:
    def __init__(self, zone_id: str):
        self.zone_id = zone_id
        self.nodes: Dict[str, WaypointNode] = {}
        self._build_default_topology()

    def _build_default_topology(self):
        # Entry & Exit nodes
        self.add_node("ENTRY_GATE_NORTH", Point(10.0, 5.0, 0), "ENTRY")
        self.add_node("ENTRY_GATE_SOUTH", Point(10.0, 95.0, 0), "ENTRY")
        self.add_node("EXIT_GATE_WEST", Point(95.0, 50.0, 0), "EXIT")
        
        # Ramp connectors
        self.add_node("RAMP_UP_G_TO_L1", Point(50.0, 10.0, 0), "RAMP")
        self.add_node("RAMP_DN_L1_TO_G", Point(50.0, 10.0, 1), "RAMP")
        self.add_node("RAMP_UP_L1_TO_L2", Point(50.0, 90.0, 1), "RAMP")
        self.add_node("RAMP_DN_L2_TO_L1", Point(50.0, 90.0, 2), "RAMP")

        # Floor 0 (Ground) Main Avenues
        self.add_node("G_AVE_01", Point(25.0, 20.0, 0), "LANE")
        self.add_node("G_AVE_02", Point(25.0, 50.0, 0), "LANE")
        self.add_node("G_AVE_03", Point(25.0, 80.0, 0), "LANE")
        self.add_node("G_AVE_04", Point(75.0, 20.0, 0), "LANE")
        self.add_node("G_AVE_05", Point(75.0, 50.0, 0), "LANE")
        self.add_node("G_AVE_06", Point(75.0, 80.0, 0), "LANE")

        # Connect Ground Avenues
        self.connect("ENTRY_GATE_NORTH", "G_AVE_01", 16.0)
        self.connect("ENTRY_GATE_SOUTH", "G_AVE_03", 16.0)
        self.connect("G_AVE_01", "G_AVE_02", 30.0)
        self.connect("G_AVE_02", "G_AVE_03", 30.0)
        self.connect("G_AVE_01", "G_AVE_04", 50.0)
        self.connect("G_AVE_02", "G_AVE_05", 50.0)
        self.connect("G_AVE_03", "G_AVE_06", 50.0)
        self.connect("G_AVE_04", "G_AVE_05", 30.0)
        self.connect("G_AVE_05", "G_AVE_06", 30.0)
        self.connect("G_AVE_04", "RAMP_UP_G_TO_L1", 26.0)
        self.connect("G_AVE_05", "EXIT_GATE_WEST", 20.0)

        # Floor 1 (Deck 1)
        self.add_node("L1_AVE_01", Point(25.0, 20.0, 1), "LANE")
        self.add_node("L1_AVE_02", Point(75.0, 20.0, 1), "LANE")
        self.add_node("L1_AVE_03", Point(75.0, 80.0, 1), "LANE")
        self.add_node("L1_AVE_04", Point(25.0, 80.0, 1), "LANE")

        self.connect("RAMP_UP_G_TO_L1", "L1_AVE_02", 15.0)
        self.connect("L1_AVE_02", "L1_AVE_01", 50.0)
        self.connect("L1_AVE_01", "L1_AVE_04", 60.0)
        self.connect("L1_AVE_04", "L1_AVE_03", 50.0)
        self.connect("L1_AVE_03", "RAMP_UP_L1_TO_L2", 15.0)
        self.connect("L1_AVE_03", "RAMP_DN_L1_TO_G", 35.0)
        self.connect("RAMP_DN_L1_TO_G", "G_AVE_05", 22.0)

        # Floor 2 (Deck 2)
        self.add_node("L2_AVE_01", Point(25.0, 20.0, 2), "LANE")
        self.add_node("L2_AVE_02", Point(75.0, 20.0, 2), "LANE")
        self.add_node("L2_AVE_03", Point(75.0, 80.0, 2), "LANE")
        self.add_node("L2_AVE_04", Point(25.0, 80.0, 2), "LANE")

        self.connect("RAMP_UP_L1_TO_L2", "L2_AVE_03", 12.0)
        self.connect("L2_AVE_03", "L2_AVE_02", 60.0)
        self.connect("L2_AVE_02", "L2_AVE_01", 50.0)
        self.connect("L2_AVE_01", "L2_AVE_04", 60.0)
        self.connect("L2_AVE_04", "RAMP_DN_L2_TO_L1", 18.0)
        self.connect("RAMP_DN_L2_TO_L1", "L1_AVE_04", 14.0)

        # Sample Parking Bays
        for i in range(1, 21):
            floor = 0 if i <= 8 else (1 if i <= 15 else 2)
            pos_x = 15.0 if i % 2 == 1 else 85.0
            pos_y = 15.0 + (i % 8) * 9.5
            bay_id = f"BAY_{i:02d}"
            self.add_node(bay_id, Point(pos_x, pos_y, floor), "BAY")
            
            # Connect bay to nearest aisle
            lane_node = f"G_AVE_01" if floor == 0 else (f"L1_AVE_01" if floor == 1 else f"L2_AVE_01")
            self.connect(lane_node, bay_id, 10.0)

    def add_node(self, node_id: str, point: Point, node_type: str = "LANE"):
        self.nodes[node_id] = WaypointNode(node_id, point, node_type)

    def connect(self, from_id: str, to_id: str, cost: Optional[float] = None, bidirectional: bool = True):
        if from_id in self.nodes and to_id in self.nodes:
            if cost is None:
                cost = self.nodes[from_id].point.distance_to(self.nodes[to_id].point)
            self.nodes[from_id].add_edge(to_id, cost)
            if bidirectional:
                self.nodes[to_id].add_edge(from_id, cost)

    def find_shortest_path(self, start_id: str, target_id: str) -> Dict[str, Any]:
        """A* Pathfinding algorithm on the spatial graph."""
        if start_id not in self.nodes or target_id not in self.nodes:
            return {"success": False, "message": "Start or Target node not found in spatial graph"}

        start_node = self.nodes[start_id]
        target_node = self.nodes[target_id]

        open_set = []
        heapq.heappush(open_set, (0.0, start_id))
        came_from: Dict[str, str] = {}
        g_score: Dict[str, float] = {node_id: float('inf') for node_id in self.nodes}
        g_score[start_id] = 0.0

        f_score: Dict[str, float] = {node_id: float('inf') for node_id in self.nodes}
        f_score[start_id] = start_node.point.distance_to(target_node.point)

        while open_set:
            _, current = heapq.heappop(open_set)

            if current == target_id:
                # Reconstruct path
                path_nodes = [current]
                while current in came_from:
                    current = came_from[current]
                    path_nodes.append(current)
                path_nodes.reverse()

                total_distance = g_score[target_id]
                waypoints = [
                    {
                        "node_id": nid,
                        "type": self.nodes[nid].node_type,
                        **self.nodes[nid].point.to_dict()
                    }
                    for nid in path_nodes
                ]

                # Estimated driving duration (at 10 km/h indoor speed = ~2.78 m/s)
                estimated_seconds = max(15, round(total_distance / 2.78))

                return {
                    "success": True,
                    "start_node": start_id,
                    "target_node": target_id,
                    "total_distance_meters": round(total_distance, 1),
                    "estimated_seconds": estimated_seconds,
                    "turn_by_turn_waypoints": waypoints,
                    "node_count": len(path_nodes)
                }

            current_node = self.nodes[current]
            for neighbor_id, edge_cost in current_node.neighbors.items():
                tentative_g = g_score[current] + edge_cost
                if tentative_g < g_score[neighbor_id]:
                    came_from[neighbor_id] = current
                    g_score[neighbor_id] = tentative_g
                    h = self.nodes[neighbor_id].point.distance_to(target_node.point)
                    f_score[neighbor_id] = tentative_g + h
                    heapq.heappush(open_set, (f_score[neighbor_id], neighbor_id))

        return {"success": False, "message": "No valid route found between specified points"}

# Global engine registry
_graphs: Dict[str, GarageSpatialGraph] = {}

def get_spatial_graph(zone_id: str) -> GarageSpatialGraph:
    if zone_id not in _graphs:
        _graphs[zone_id] = GarageSpatialGraph(zone_id)
    return _graphs[zone_id]
