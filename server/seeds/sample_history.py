"""
SmartPark Historical Parking Sessions & Companies Dataset
Provides corporate client records and longitudinal session history for analytics curve fitting.
"""

from typing import List, Dict, Any

SAMPLE_COMPANIES = [
    {
        "id": "comp-tcs",
        "name": "TCS (Tata Consultancy Services)",
        "code": "TCS",
        "headquarters": "Think Campus, Electronic City Phase 1",
        "description": "Global IT services, consulting, and business solutions leader.",
        "domain": "tcs.com",
        "total_employees": 842,
        "active_parking_zones": 2
    },
    {
        "id": "comp-inf",
        "name": "Infosys Limited",
        "code": "INFOSYS",
        "headquarters": "Hosur Road, Electronics City Phase 1",
        "description": "Global leader in next-generation digital services and consulting.",
        "domain": "infosys.com",
        "total_employees": 621,
        "active_parking_zones": 2
    },
    {
        "id": "comp-wipro",
        "name": "Wipro Technologies",
        "code": "WIPRO",
        "headquarters": "Doddakannelli, Sarjapur Road Campus",
        "description": "Information technology and digital business transformation firm.",
        "domain": "wipro.com",
        "total_employees": 514,
        "active_parking_zones": 1
    },
    {
        "id": "comp-techm",
        "name": "Tech Mahindra",
        "code": "TECHM",
        "headquarters": "Cyber City Campus, Phase 2, E-City",
        "description": "Connected solutions and next-generation telecom & enterprise services.",
        "domain": "techmahindra.com",
        "total_employees": 390,
        "active_parking_zones": 1
    },
    {
        "id": "comp-ibm",
        "name": "IBM India Software Labs",
        "code": "IBM",
        "headquarters": "Embassy GolfLinks Business Park",
        "description": "Cloud computing, artificial intelligence, and enterprise cognitive software.",
        "domain": "ibm.com",
        "total_employees": 720,
        "active_parking_zones": 2
    }
]

SAMPLE_PARKING_HISTORY = [
    {
        "id": "hist-01",
        "locationName": "Municipal Central Parking",
        "dateTime": "Today, 10:30 AM",
        "vehiclePlate": "KA-01-MJ-5890",
        "durationHours": 2,
        "totalAmount": 40.0,
        "status": "ACTIVE"
    },
    {
        "id": "hist-02",
        "locationName": "TCS Corporate Deck Alpha",
        "dateTime": "Yesterday, 09:15 AM",
        "vehiclePlate": "KA-01-MJ-5890",
        "durationHours": 8.5,
        "totalAmount": 85.0,
        "status": "COMPLETED"
    },
    {
        "id": "hist-03",
        "locationName": "City Center Metro Plaza",
        "dateTime": "28 Aug 2026, 04:00 PM",
        "vehiclePlate": "KA-01-MJ-5890",
        "durationHours": 3,
        "totalAmount": 90.0,
        "status": "COMPLETED"
    },
    {
        "id": "hist-04",
        "locationName": "Brigade Road Smart Lot",
        "dateTime": "24 Aug 2026, 06:30 PM",
        "vehiclePlate": "KA-01-MJ-5890",
        "durationHours": 2.5,
        "totalAmount": 87.5,
        "status": "COMPLETED"
    },
    {
        "id": "hist-05",
        "locationName": "Commercial Street Lot",
        "dateTime": "20 Aug 2026, 02:00 PM",
        "vehiclePlate": "KA-01-MJ-5890",
        "durationHours": 1.5,
        "totalAmount": 37.5,
        "status": "COMPLETED"
    }
]
