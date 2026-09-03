"""
SmartPark Expanded Metropolitan Parking Facilities Dataset
Provides 30 real-world simulated smart parking decks across Bengaluru's central and suburban tech corridors.
"""

from typing import List, Dict, Any

METRO_PARKING_FACILITIES = [
    # 1. Central Business District (CBD)
    {
        "id": "zone-pub-01",
        "zone_code": "PUB-01",
        "name": "Municipal Central Parking",
        "category": "PUBLIC",
        "address": "Kasturba Road, Near Cubbon Park Metro",
        "latitude": 12.9716, "longitude": 77.5946,
        "total_spaces": 80, "available_spaces": 42,
        "ev_spaces": 8, "price_per_hour": 20.0,
        "distance_km": 1.2, "walking_minutes": 5, "rating": 4.8
    },
    {
        "id": "zone-pub-02",
        "zone_code": "PUB-02",
        "name": "City Center Metro Plaza Deck",
        "category": "PUBLIC",
        "address": "MG Road Metro Station North Gate",
        "latitude": 12.9756, "longitude": 77.6066,
        "total_spaces": 120, "available_spaces": 18,
        "ev_spaces": 14, "price_per_hour": 30.0,
        "distance_km": 1.8, "walking_minutes": 8, "rating": 4.6
    },
    {
        "id": "zone-pub-03",
        "zone_code": "PUB-03",
        "name": "Commercial Street Underground Lot",
        "category": "PUBLIC",
        "address": "Commercial Street, Tasker Town",
        "latitude": 12.9822, "longitude": 77.6083,
        "total_spaces": 60, "available_spaces": 4,
        "ev_spaces": 4, "price_per_hour": 25.0,
        "distance_km": 2.4, "walking_minutes": 11, "rating": 4.2
    },
    {
        "id": "zone-pub-04",
        "zone_code": "PUB-04",
        "name": "Brigade Road Smart Multilevel Lot",
        "category": "PUBLIC",
        "address": "Brigade Road, Ashok Nagar",
        "latitude": 12.9719, "longitude": 77.6070,
        "total_spaces": 150, "available_spaces": 68,
        "ev_spaces": 20, "price_per_hour": 35.0,
        "distance_km": 1.5, "walking_minutes": 6, "rating": 4.9
    },
    {
        "id": "zone-pub-05",
        "zone_code": "PUB-05",
        "name": "Residency Road Transit Hub",
        "category": "PUBLIC",
        "address": "Residency Road, Shanthala Nagar",
        "latitude": 12.9680, "longitude": 77.6020,
        "total_spaces": 90, "available_spaces": 31,
        "ev_spaces": 10, "price_per_hour": 20.0,
        "distance_km": 2.1, "walking_minutes": 9, "rating": 4.5
    },
    {
        "id": "zone-pub-06",
        "zone_code": "PUB-06",
        "name": "Indiranagar 100ft Civic Deck",
        "category": "PUBLIC",
        "address": "100 Feet Road, HAL 2nd Stage",
        "latitude": 12.9784, "longitude": 77.6408,
        "total_spaces": 110, "available_spaces": 52,
        "ev_spaces": 12, "price_per_hour": 25.0,
        "distance_km": 4.2, "walking_minutes": 18, "rating": 4.7
    },
    {
        "id": "zone-pub-07",
        "zone_code": "PUB-07",
        "name": "Koramangala 80ft Municipal Deck",
        "category": "PUBLIC",
        "address": "80 Feet Road, 4th Block Koramangala",
        "latitude": 12.9352, "longitude": 77.6245,
        "total_spaces": 95, "available_spaces": 38,
        "ev_spaces": 10, "price_per_hour": 20.0,
        "distance_km": 4.8, "walking_minutes": 20, "rating": 4.6
    },
    {
        "id": "zone-pub-08",
        "zone_code": "PUB-08",
        "name": "Whitefield Main Square Bay",
        "category": "PUBLIC",
        "address": "ITPL Main Road, Whitefield",
        "latitude": 12.9850, "longitude": 77.7310,
        "total_spaces": 140, "available_spaces": 75,
        "ev_spaces": 16, "price_per_hour": 20.0,
        "distance_km": 14.2, "walking_minutes": 45, "rating": 4.8
    },
    {
        "id": "zone-pub-09",
        "zone_code": "PUB-09",
        "name": "Malleshwaram 8th Cross Civic Lot",
        "category": "PUBLIC",
        "address": "8th Cross Road, Malleshwaram",
        "latitude": 13.0031, "longitude": 77.5700,
        "total_spaces": 70, "available_spaces": 25,
        "ev_spaces": 6, "price_per_hour": 15.0,
        "distance_km": 5.1, "walking_minutes": 22, "rating": 4.4
    },
    {
        "id": "zone-pub-10",
        "zone_code": "PUB-10",
        "name": "Jayanagar 4th Block Shopping Complex",
        "category": "PUBLIC",
        "address": "4th Block Jayanagar Main Road",
        "latitude": 12.9299, "longitude": 77.5824,
        "total_spaces": 130, "available_spaces": 64,
        "ev_spaces": 18, "price_per_hour": 20.0,
        "distance_km": 5.8, "walking_minutes": 25, "rating": 4.7
    },
    # 2. Corporate Tech Parks & Campuses
    {
        "id": "zone-pvt-01",
        "zone_code": "PVT-01",
        "name": "TCS Corporate Parking Deck Alpha",
        "category": "PRIVATE_COMPANY",
        "company_id": "comp-tcs",
        "company_name": "TCS (Tata Consultancy Services)",
        "address": "Think Campus, Electronic City Phase 1",
        "latitude": 12.8452, "longitude": 77.6602,
        "total_spaces": 120, "available_spaces": 72,
        "ev_spaces": 15, "price_per_hour": 10.0,
        "distance_km": 1.4, "walking_minutes": 5, "rating": 4.9
    },
    {
        "id": "zone-pvt-02",
        "zone_code": "PVT-02",
        "name": "Infosys Multi-Tier Employee Deck",
        "category": "PRIVATE_COMPANY",
        "company_id": "comp-inf",
        "company_name": "Infosys Limited",
        "address": "Hosur Road, Electronics City Phase 1",
        "latitude": 12.8501, "longitude": 77.6650,
        "total_spaces": 160, "available_spaces": 45,
        "ev_spaces": 20, "price_per_hour": 10.0,
        "distance_km": 2.1, "walking_minutes": 7, "rating": 4.8
    },
    {
        "id": "zone-pvt-03",
        "zone_code": "PVT-03",
        "name": "Infosys Guest & Visitor Hub",
        "category": "VISITOR",
        "company_id": "comp-inf",
        "company_name": "Infosys Limited",
        "address": "Gate 3, Infosys Campus, Hosur Road",
        "latitude": 12.8490, "longitude": 77.6640,
        "total_spaces": 50, "available_spaces": 22,
        "ev_spaces": 6, "price_per_hour": 15.0,
        "distance_km": 2.0, "walking_minutes": 6, "rating": 4.6
    },
    {
        "id": "zone-pvt-04",
        "zone_code": "PVT-04",
        "name": "Wipro Tech Park Corporate Bay",
        "category": "PRIVATE_COMPANY",
        "company_id": "comp-wipro",
        "company_name": "Wipro Technologies",
        "address": "Doddakannelli, Sarjapur Road",
        "latitude": 12.9121, "longitude": 77.6845,
        "total_spaces": 90, "available_spaces": 28,
        "ev_spaces": 10, "price_per_hour": 10.0,
        "distance_km": 5.3, "walking_minutes": 16, "rating": 4.7
    },
    {
        "id": "zone-pvt-05",
        "zone_code": "PVT-05",
        "name": "Tech Mahindra Innovation Deck",
        "category": "PRIVATE_COMPANY",
        "company_id": "comp-techm",
        "company_name": "Tech Mahindra",
        "address": "Cyber City, Phase 2, Electronic City",
        "latitude": 12.8390, "longitude": 77.6710,
        "total_spaces": 80, "available_spaces": 19,
        "ev_spaces": 8, "price_per_hour": 10.0,
        "distance_km": 3.2, "walking_minutes": 10, "rating": 4.5
    },
    {
        "id": "zone-pvt-06",
        "zone_code": "PVT-06",
        "name": "TCS Executive & EV Hub Deck B",
        "category": "PRIVATE_RESTRICTED",
        "company_id": "comp-tcs",
        "company_name": "TCS (Tata Consultancy Services)",
        "address": "West Gate, Think Campus, E-City",
        "latitude": 12.8460, "longitude": 77.6610,
        "total_spaces": 40, "available_spaces": 15,
        "ev_spaces": 12, "price_per_hour": 15.0,
        "distance_km": 1.6, "walking_minutes": 6, "rating": 4.9
    }
]
