"""
SmartPark Database Engine & Seed Data Generator
Provides high-performance persistent storage, indexing, and rich pre-populated seed data.
"""

import sqlite3
import os
import json
from datetime import datetime, timedelta
from server.models.schema import (
    User, Company, Vehicle, ParkingZone, ParkingSlot, ParkingAccess,
    Reservation, ParkingSession, ParkingPass, ParkingViolation,
    Sensor, SensorEvent, OccupancyRecord, OccupancyPrediction,
    ParkingRecommendation, FavoriteParking, Notification, AuditLog
)

DB_PATH = os.path.join(os.path.dirname(__file__), "smartpark.db")

class DatabaseEngine:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Users Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    role TEXT DEFAULT 'USER',
                    company_id TEXT,
                    company_name TEXT,
                    employee_id TEXT,
                    company_verified INTEGER DEFAULT 0,
                    phone TEXT,
                    avatar_initials TEXT DEFAULT 'U',
                    status TEXT DEFAULT 'ACTIVE',
                    private_parking_access TEXT,
                    created_at TEXT,
                    updated_at TEXT
                )
            """)

            # 2. Companies Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS companies (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    code TEXT UNIQUE NOT NULL,
                    headquarters TEXT,
                    description TEXT,
                    domain TEXT,
                    total_employees INTEGER DEFAULT 0,
                    active_parking_zones INTEGER DEFAULT 0,
                    contact_email TEXT,
                    contact_phone TEXT,
                    status TEXT DEFAULT 'ACTIVE',
                    created_at TEXT
                )
            """)

            # 3. Vehicles Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS vehicles (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    registration_plate TEXT NOT NULL,
                    vehicle_type TEXT DEFAULT 'CAR',
                    brand TEXT,
                    model TEXT,
                    color TEXT,
                    is_ev INTEGER DEFAULT 0,
                    fast_charge_compatible INTEGER DEFAULT 0,
                    is_default INTEGER DEFAULT 0,
                    created_at TEXT,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )
            """)

            # 4. Parking Zones Table (29 Columns)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parking_zones (
                    id TEXT PRIMARY KEY,
                    zone_code TEXT NOT NULL,
                    name TEXT NOT NULL,
                    category TEXT DEFAULT 'PUBLIC',
                    company_id TEXT,
                    company_name TEXT,
                    address TEXT NOT NULL,
                    city TEXT DEFAULT 'Bengaluru',
                    latitude REAL,
                    longitude REAL,
                    total_spaces INTEGER NOT NULL,
                    available_spaces INTEGER NOT NULL,
                    occupied_spaces INTEGER DEFAULT 0,
                    reserved_spaces INTEGER DEFAULT 0,
                    ev_spaces INTEGER DEFAULT 0,
                    price_per_hour REAL DEFAULT 20.0,
                    distance_km REAL DEFAULT 1.0,
                    walking_minutes INTEGER DEFAULT 5,
                    open_24x7 INTEGER DEFAULT 1,
                    security_guard_on_site INTEGER DEFAULT 1,
                    anpr_camera_installed INTEGER DEFAULT 1,
                    covered_roof INTEGER DEFAULT 1,
                    rating REAL DEFAULT 4.8,
                    total_reviews INTEGER DEFAULT 0,
                    access_type TEXT DEFAULT 'ALL_USERS',
                    allowed_companies TEXT,
                    authorized_user_ids TEXT,
                    status TEXT DEFAULT 'ACTIVE',
                    image_url TEXT
                )
            """)

            # 5. Parking Slots Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parking_slots (
                    id TEXT PRIMARY KEY,
                    zone_id TEXT NOT NULL,
                    slot_number TEXT NOT NULL,
                    floor_level TEXT DEFAULT 'G',
                    slot_type TEXT DEFAULT 'STANDARD',
                    status TEXT DEFAULT 'AVAILABLE',
                    current_vehicle_plate TEXT,
                    current_reservation_id TEXT,
                    sensor_id TEXT,
                    last_status_change TEXT,
                    FOREIGN KEY(zone_id) REFERENCES parking_zones(id)
                )
            """)

            # 6. Reservations Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS reservations (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    user_name TEXT,
                    user_email TEXT,
                    parking_zone_id TEXT NOT NULL,
                    parking_zone_name TEXT,
                    slot_id TEXT,
                    slot_number TEXT,
                    vehicle_id TEXT,
                    vehicle_plate TEXT,
                    vehicle_type TEXT,
                    start_time TEXT,
                    end_time TEXT,
                    duration_hours REAL DEFAULT 2.0,
                    hourly_rate REAL DEFAULT 20.0,
                    total_amount REAL DEFAULT 40.0,
                    payment_status TEXT DEFAULT 'PAID',
                    status TEXT DEFAULT 'RESERVED',
                    check_in_time TEXT,
                    check_out_time TEXT,
                    qr_pass_token TEXT,
                    created_at TEXT
                )
            """)

            # 7. Parking Passes Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parking_passes (
                    id TEXT PRIMARY KEY,
                    pass_code TEXT UNIQUE NOT NULL,
                    reservation_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    user_name TEXT,
                    zone_id TEXT,
                    zone_name TEXT,
                    slot_number TEXT,
                    vehicle_plate TEXT,
                    valid_from TEXT,
                    valid_until TEXT,
                    is_active INTEGER DEFAULT 1,
                    scan_count INTEGER DEFAULT 0,
                    last_scanned_at TEXT
                )
            """)

            # 8. Parking Violations Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parking_violations (
                    id TEXT PRIMARY KEY,
                    vehicle_plate TEXT NOT NULL,
                    user_id TEXT,
                    user_name TEXT DEFAULT 'Unregistered Driver',
                    user_email TEXT,
                    parking_zone_id TEXT NOT NULL,
                    parking_zone_name TEXT,
                    slot_number TEXT,
                    violation_type TEXT NOT NULL,
                    severity TEXT DEFAULT 'MEDIUM',
                    fine_amount REAL DEFAULT 500.0,
                    date_time TEXT,
                    status TEXT DEFAULT 'OPEN',
                    description TEXT,
                    evidence_notes TEXT,
                    image_evidence_url TEXT,
                    resolved_by_admin_id TEXT,
                    resolution_notes TEXT
                )
            """)

            # 9. Sensors Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sensors (
                    id TEXT PRIMARY KEY,
                    sensor_code TEXT UNIQUE NOT NULL,
                    sensor_type TEXT DEFAULT 'ULTRASONIC_STUD',
                    zone_id TEXT NOT NULL,
                    slot_number TEXT,
                    battery_level_percent INTEGER DEFAULT 100,
                    firmware_version TEXT DEFAULT 'v2.4.1',
                    is_online INTEGER DEFAULT 1,
                    last_heartbeat TEXT,
                    current_reading TEXT DEFAULT 'VACANT'
                )
            """)

            # 10. Sensor Events Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sensor_events (
                    id TEXT PRIMARY KEY,
                    sensor_id TEXT NOT NULL,
                    sensor_code TEXT,
                    zone_id TEXT NOT NULL,
                    slot_number TEXT,
                    event_type TEXT NOT NULL,
                    detected_plate TEXT,
                    raw_payload TEXT,
                    timestamp TEXT
                )
            """)

            # 11. Occupancy Records Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS occupancy_records (
                    id TEXT PRIMARY KEY,
                    zone_id TEXT NOT NULL,
                    timestamp TEXT,
                    total_spaces INTEGER,
                    occupied_spaces INTEGER,
                    occupancy_rate REAL,
                    day_of_week INTEGER,
                    hour_of_day INTEGER
                )
            """)

            # 12. Notifications Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    message TEXT NOT NULL,
                    notification_type TEXT DEFAULT 'INFO',
                    is_read INTEGER DEFAULT 0,
                    action_url TEXT,
                    created_at TEXT
                )
            """)

            # 13. Favorites Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS favorites (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    zone_id TEXT NOT NULL,
                    zone_name TEXT,
                    nickname TEXT,
                    created_at TEXT
                )
            """)

            # 14. Audit Logs Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    user_email TEXT,
                    action TEXT NOT NULL,
                    resource_type TEXT NOT NULL,
                    resource_id TEXT,
                    details TEXT,
                    ip_address TEXT DEFAULT '127.0.0.1',
                    timestamp TEXT
                )
            """)

            conn.commit()

        self._seed_initial_data()

    def _seed_initial_data(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            if cursor.fetchone()[0] > 0:
                return

            now = datetime.utcnow()
            now_iso = now.isoformat()

            # 1. Seed Users
            users = [
                ("usr-tcs-01", "Avinash Sharma", "demo@smartpark.com", "SmartPark@123", "USER", "comp-tcs", "TCS (Tata Consultancy Services)", "TCS-1024", 1, "+91 9876543210", "AS", "ACTIVE", json.dumps(["zone-pvt-01", "zone-pvt-06"]), now_iso, now_iso),
                ("usr-inf-02", "Neha Rao", "neha@infosys.com", "SmartPark@123", "USER", "comp-inf", "Infosys Limited", "INF-8492", 1, "+91 9876543211", "NR", "ACTIVE", json.dumps(["zone-pvt-02", "zone-pvt-03"]), now_iso, now_iso),
                ("usr-pub-03", "Rahul Mehta", "rahul@gmail.com", "SmartPark@123", "USER", None, None, None, 0, "+91 9876543212", "RM", "ACTIVE", json.dumps([]), now_iso, now_iso),
                ("adm-001", "SmartPark Administrator", "admin@smartpark.com", "SmartParkAdmin@123", "ADMIN", "comp-spk", "SmartPark Central Admin", "ADM-001", 1, "+91 9876543299", "AD", "ACTIVE", json.dumps(["*"]), now_iso, now_iso),
            ]
            cursor.executemany("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", users)

            # 2. Seed Companies
            companies = [
                ("comp-tcs", "TCS (Tata Consultancy Services)", "TCS", "Think Campus, Electronic City Phase 1", "Global IT services and consulting enterprise.", "tcs.com", 842, 2, "admin@tcs.com", "+91 80 6725 0000", "ACTIVE", now_iso),
                ("comp-inf", "Infosys Limited", "INFOSYS", "Hosur Road, Electronics City", "Global leader in next-generation digital services.", "infosys.com", 621, 2, "facilities@infosys.com", "+91 80 2852 0261", "ACTIVE", now_iso),
                ("comp-wipro", "Wipro Technologies", "WIPRO", "Sarjapur Road Campus", "Information technology and business consulting firm.", "wipro.com", 514, 1, "security@wipro.com", "+91 80 2844 0011", "ACTIVE", now_iso),
                ("comp-techm", "Tech Mahindra", "TECHM", "Cyber City Campus, Phase 2", "Connected solutions and digital transformation.", "techmahindra.com", 390, 1, "admin@techmahindra.com", "+91 80 4024 1000", "ACTIVE", now_iso),
            ]
            cursor.executemany("INSERT INTO companies VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", companies)

            # 3. Seed Vehicles
            vehicles = [
                ("veh-01", "usr-tcs-01", "KA-01-MJ-5890", "EV_CAR", "Tata", "Nexon EV", "Teal Blue", 1, 1, 1, now_iso),
                ("veh-02", "usr-inf-02", "KA-51-AB-7711", "CAR", "Hyundai", "Creta", "Polar White", 0, 0, 1, now_iso),
                ("veh-03", "usr-pub-03", "KA-05-EX-9988", "CAR", "Honda", "City", "Modern Steel", 0, 0, 1, now_iso),
                ("veh-04", "adm-001", "KA-01-AD-0001", "EV_CAR", "Tesla", "Model 3", "Midnight Silver", 1, 1, 1, now_iso),
            ]
            cursor.executemany("INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?,?,?,?)", vehicles)

            # 4. Seed Parking Zones (29 columns per zone)
            zones = [
                # Public Zones
                ("zone-pub-01", "PUB-01", "Municipal Central Parking", "PUBLIC", None, "—", "Kasturba Road, Near Cubbon Park Metro", "Bengaluru", 12.9716, 77.5946, 80, 42, 38, 0, 8, 20.0, 1.2, 5, 1, 1, 1, 1, 4.8, 128, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-02", "PUB-02", "City Center Metro Plaza Deck", "PUBLIC", None, "—", "MG Road Metro Station North Gate", "Bengaluru", 12.9756, 77.6066, 120, 18, 102, 0, 14, 30.0, 1.8, 8, 1, 1, 1, 1, 4.6, 94, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-03", "PUB-03", "Commercial Street Underground Lot", "PUBLIC", None, "—", "Commercial Street, Tasker Town", "Bengaluru", 12.9822, 77.6083, 60, 4, 56, 0, 4, 25.0, 2.4, 11, 0, 1, 1, 1, 4.2, 210, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-04", "PUB-04", "Brigade Road Smart Multilevel Lot", "PUBLIC", None, "—", "Brigade Road, Ashok Nagar", "Bengaluru", 12.9719, 77.6070, 150, 68, 82, 0, 20, 35.0, 1.5, 6, 1, 1, 1, 1, 4.9, 312, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-05", "PUB-05", "Residency Road Transit Hub", "PUBLIC", None, "—", "Residency Road, Shanthala Nagar", "Bengaluru", 12.9680, 77.6020, 90, 31, 59, 0, 10, 20.0, 2.1, 9, 1, 1, 1, 1, 4.5, 87, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-06", "PUB-06", "Indiranagar 100ft Civic Deck", "PUBLIC", None, "—", "100 Feet Road, HAL 2nd Stage", "Bengaluru", 12.9784, 77.6408, 110, 52, 58, 0, 12, 25.0, 4.2, 18, 1, 1, 1, 1, 4.7, 145, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-07", "PUB-07", "Koramangala 80ft Municipal Deck", "PUBLIC", None, "—", "80 Feet Road, 4th Block Koramangala", "Bengaluru", 12.9352, 77.6245, 95, 38, 57, 0, 10, 20.0, 4.8, 20, 1, 1, 1, 1, 4.6, 108, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                ("zone-pub-08", "PUB-08", "Whitefield Main Square Bay", "PUBLIC", None, "—", "ITPL Main Road, Whitefield", "Bengaluru", 12.9850, 77.7310, 140, 75, 65, 0, 16, 20.0, 14.2, 45, 1, 1, 1, 1, 4.8, 160, "ALL_USERS", json.dumps([]), json.dumps([]), "ACTIVE", None),
                # Private Zones
                ("zone-pvt-01", "PVT-01", "TCS Corporate Parking Deck Alpha", "PRIVATE_COMPANY", "comp-tcs", "TCS (Tata Consultancy Services)", "Think Campus, Electronic City Phase 1", "Bengaluru", 12.8452, 77.6602, 120, 72, 48, 0, 15, 10.0, 1.4, 5, 1, 1, 1, 1, 4.9, 320, "COMPANY_EMPLOYEES", json.dumps(["TCS"]), json.dumps(["usr-tcs-01"]), "ACTIVE", None),
                ("zone-pvt-02", "PVT-02", "Infosys Multi-Tier Employee Deck", "PRIVATE_COMPANY", "comp-inf", "Infosys Limited", "Hosur Road, Electronics City Phase 1", "Bengaluru", 12.8501, 77.6650, 160, 45, 115, 0, 20, 10.0, 2.1, 7, 1, 1, 1, 1, 4.8, 280, "COMPANY_EMPLOYEES", json.dumps(["INFOSYS"]), json.dumps(["usr-inf-02"]), "ACTIVE", None),
                ("zone-pvt-03", "PVT-03", "Infosys Guest & Visitor Hub", "VISITOR", "comp-inf", "Infosys Limited", "Gate 3, Infosys Campus, Hosur Road", "Bengaluru", 12.8490, 77.6640, 50, 22, 28, 0, 6, 15.0, 2.0, 6, 0, 1, 1, 1, 4.6, 95, "VISITOR_APPROVAL", json.dumps(["INFOSYS"]), json.dumps([]), "ACTIVE", None),
                ("zone-pvt-04", "PVT-04", "Wipro Tech Park Corporate Bay", "PRIVATE_COMPANY", "comp-wipro", "Wipro Technologies", "Doddakannelli, Sarjapur Road", "Bengaluru", 12.9121, 77.6845, 90, 28, 62, 0, 10, 10.0, 5.3, 16, 1, 1, 1, 1, 4.7, 190, "COMPANY_EMPLOYEES", json.dumps(["WIPRO"]), json.dumps([]), "ACTIVE", None),
                ("zone-pvt-05", "PVT-05", "Tech Mahindra Innovation Deck", "PRIVATE_COMPANY", "comp-techm", "Tech Mahindra", "Cyber City, Phase 2, Electronic City", "Bengaluru", 12.8390, 77.6710, 80, 19, 61, 0, 8, 10.0, 3.2, 10, 1, 1, 1, 1, 4.5, 110, "COMPANY_EMPLOYEES", json.dumps(["TECHM"]), json.dumps([]), "ACTIVE", None),
                ("zone-pvt-06", "PVT-06", "TCS Executive & EV Hub Deck B", "PRIVATE_RESTRICTED", "comp-tcs", "TCS (Tata Consultancy Services)", "West Gate, Think Campus, E-City", "Bengaluru", 12.8460, 77.6610, 40, 15, 25, 0, 12, 15.0, 1.6, 6, 1, 1, 1, 1, 4.9, 85, "AUTHORIZED_USERS", json.dumps(["TCS"]), json.dumps(["usr-tcs-01", "adm-001"]), "ACTIVE", None),
            ]
            cursor.executemany("INSERT INTO parking_zones VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", zones)

            # 5. Seed Slots for TCS Deck & Municipal Central
            slots = []
            for i in range(1, 31):
                slot_num = f"A-{i:02d}"
                st = "OCCUPIED" if i <= 12 else "AVAILABLE"
                slot_type = "EV_FAST_CHARGE" if i <= 6 else "STANDARD"
                slots.append((f"slot-tcs-{i:02d}", "zone-pvt-01", slot_num, "G", slot_type, st, None, None, f"sns-tcs-{i:02d}", now_iso))

            for i in range(1, 31):
                slot_num = f"M-{i:02d}"
                st = "OCCUPIED" if i <= 14 else ("RESERVED" if i == 24 else "AVAILABLE")
                slot_type = "EV_FAST_CHARGE" if i <= 4 else "STANDARD"
                cur_res = "RES-A2401" if i == 24 else None
                slots.append((f"slot-mun-{i:02d}", "zone-pub-01", slot_num, "G", slot_type, st, None, cur_res, f"sns-mun-{i:02d}", now_iso))

            cursor.executemany("INSERT INTO parking_slots VALUES (?,?,?,?,?,?,?,?,?,?)", slots)

            # 6. Seed Active Reservation & Pass
            cursor.execute("""
                INSERT INTO reservations VALUES (
                    'RES-A2401', 'usr-tcs-01', 'Avinash Sharma', 'demo@smartpark.com',
                    'zone-pub-01', 'Municipal Central Parking', 'slot-mun-24', 'M-24',
                    'veh-01', 'KA-01-MJ-5890', 'Car',
                    ?, ?, 2.0, 20.0, 40.0, 'PAID', 'RESERVED',
                    NULL, NULL, 'PASS-M24-9982', ?
                )
            """, ((now - timedelta(minutes=15)).isoformat(), (now + timedelta(hours=2)).isoformat(), now_iso))

            cursor.execute("""
                INSERT INTO parking_passes VALUES (
                    'pass-001', 'PASS-M24-9982', 'RES-A2401', 'usr-tcs-01', 'Avinash Sharma',
                    'zone-pub-01', 'Municipal Central Parking', 'M-24', 'KA-01-MJ-5890',
                    ?, ?, 1, 0, NULL
                )
            """, (now_iso, (now + timedelta(hours=2)).isoformat()))

            # 7. Seed Violations
            violations = [
                ("V-1024", "AP39AB1234", "usr-tcs-01", "Avinash Sharma", "demo@smartpark.com", "zone-pvt-01", "TCS Corporate Parking Deck Alpha", "A-04", "Unauthorized Parking", "HIGH", 500.0, (now - timedelta(hours=2)).isoformat(), "OPEN", "Vehicle parked in corporate bay without valid RFID tag.", "Gate ANPR camera snapshot captured at Boom Barrier #2.", None, None, None),
                ("V-1025", "KA-04-MN-8890", None, "Karan Patel", "karan.p@example.com", "zone-pub-01", "Municipal Central Parking", "M-14", "Expired Reservation", "MEDIUM", 300.0, (now - timedelta(hours=4)).isoformat(), "UNDER_REVIEW", "Vehicle overstayed reserved slot by 1 hour 45 minutes in Bay M-14.", "Floor sensor detected presence past expiration.", None, None, None),
                ("V-1026", "MH-12-PQ-4455", None, "Rohan Gupta", "rohan.g@example.com", "zone-pvt-02", "Infosys Multi-Tier Employee Deck", "B-08", "Wrong Parking Zone", "MEDIUM", 400.0, (now - timedelta(days=1)).isoformat(), "OPEN", "Parked in dedicated EV fast-charging bay without actively charging.", "EV station reported 0kW current draw for 90 minutes.", None, None, None),
                ("V-1027", "DL-01-AX-7722", None, "Meera Sen", "meera.sen@example.com", "zone-pub-02", "City Center Metro Plaza Deck", "C-02", "Blocked Parking Area", "LOW", 250.0, (now - timedelta(days=2)).isoformat(), "RESOLVED", "Vehicle partially blocked main access ramp.", "Driver notified and relocated to open bay.", None, "adm-001", "Resolved via driver repositioning"),
                ("V-1028", "KA-51-ZZ-9001", None, "Vikram Malhotra", "vikram.m@example.com", "zone-pvt-04", "Wipro Tech Park Corporate Bay", "W-01", "Invalid Parking Pass", "LOW", 200.0, (now - timedelta(days=3)).isoformat(), "DISMISSED", "Scanner failed to read barcode due to phone glare.", "Host employee confirmed manual visitor clearance.", None, "adm-001", "Verified valid guest badge"),
            ]
            cursor.executemany("INSERT INTO parking_violations VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", violations)

            # 8. Seed Notifications
            notifications = [
                ("notif-01", "usr-tcs-01", "Reservation Confirmed", "Your slot M-24 at Municipal Central Parking is booked for 2 hours.", "SUCCESS", 0, "#/dashboard", now_iso),
                ("notif-02", "usr-tcs-01", "Corporate Access Active", "TCS Corporate Parking Deck Alpha access is verified for KA-01-MJ-5890.", "INFO", 1, "#/parking/private", (now - timedelta(days=1)).isoformat()),
                ("notif-03", "usr-tcs-01", "Parking Violation Flagged", "Notice V-1024 recorded at TCS Corporate Parking Deck Alpha.", "VIOLATION_ALERT", 0, "#/dashboard", (now - timedelta(hours=2)).isoformat()),
            ]
            cursor.executemany("INSERT INTO notifications VALUES (?,?,?,?,?,?,?,?)", notifications)

            # 9. Seed Audit Logs
            audit_logs = [
                ("aud-01", "adm-001", "admin@smartpark.com", "PARKING_ZONE_CREATED", "ParkingZone", "zone-pub-01", json.dumps({"name": "Municipal Central Parking"}), "127.0.0.1", (now - timedelta(days=5)).isoformat()),
                ("aud-02", "usr-tcs-01", "demo@smartpark.com", "USER_LOGIN_SUCCESS", "User", "usr-tcs-01", json.dumps({"role": "USER"}), "127.0.0.1", (now - timedelta(hours=1)).isoformat()),
                ("aud-03", "adm-001", "admin@smartpark.com", "VIOLATION_UPDATED", "ParkingViolation", "V-1027", json.dumps({"new_status": "RESOLVED"}), "127.0.0.1", (now - timedelta(days=2)).isoformat()),
            ]
            cursor.executemany("INSERT INTO audit_logs VALUES (?,?,?,?,?,?,?,?,?)", audit_logs)

            conn.commit()

db = DatabaseEngine()
