"""
SmartPark Database Schema & ORM Models Layer
Defines 20 relational data models supporting the entire civic & corporate mobility system.
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
import json
import uuid

class ModelBase:
    def to_dict(self) -> Dict[str, Any]:
        result = {}
        for key, value in self.__dict__.items():
            if not key.startswith('_'):
                if isinstance(value, datetime):
                    result[key] = value.isoformat()
                else:
                    result[key] = value
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        instance = cls()
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        return instance

class User(ModelBase):
    def __init__(
        self,
        id: str = "",
        name: str = "",
        email: str = "",
        password_hash: str = "",
        role: str = "USER",  # USER | ADMIN | OPERATOR
        company_id: Optional[str] = None,
        company_name: Optional[str] = None,
        employee_id: Optional[str] = None,
        company_verified: bool = False,
        phone: Optional[str] = None,
        avatar_initials: str = "U",
        status: str = "ACTIVE",  # ACTIVE | SUSPENDED | PENDING_VERIFICATION
        private_parking_access: Optional[List[str]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.id = id or f"usr-{uuid.uuid4().hex[:8]}"
        self.name = name
        self.email = email.lower().strip()
        self.password_hash = password_hash
        self.role = role
        self.company_id = company_id
        self.company_name = company_name
        self.employee_id = employee_id
        self.company_verified = company_verified
        self.phone = phone
        self.avatar_initials = avatar_initials or (name[0].upper() if name else "U")
        self.status = status
        self.private_parking_access = private_parking_access or []
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

class Company(ModelBase):
    def __init__(
        self,
        id: str = "",
        name: str = "",
        code: str = "",
        headquarters: str = "",
        description: str = "",
        domain: Optional[str] = None,
        total_employees: int = 0,
        active_parking_zones: int = 0,
        contact_email: Optional[str] = None,
        contact_phone: Optional[str] = None,
        status: str = "ACTIVE",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"comp-{uuid.uuid4().hex[:8]}"
        self.name = name
        self.code = code.upper()
        self.headquarters = headquarters
        self.description = description
        self.domain = domain
        self.total_employees = total_employees
        self.active_parking_zones = active_parking_zones
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.status = status
        self.created_at = created_at or datetime.utcnow()

class Vehicle(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        registration_plate: str = "",
        vehicle_type: str = "CAR",  # CAR | BIKE | SCOOTER | EV_CAR | TRUCK
        brand: str = "",
        model: str = "",
        color: str = "",
        is_ev: bool = False,
        fast_charge_compatible: bool = False,
        is_default: bool = False,
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"veh-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.registration_plate = registration_plate.upper().strip()
        self.vehicle_type = vehicle_type
        self.brand = brand
        self.model = model
        self.color = color
        self.is_ev = is_ev
        self.fast_charge_compatible = fast_charge_compatible
        self.is_default = is_default
        self.created_at = created_at or datetime.utcnow()

class ParkingZone(ModelBase):
    def __init__(
        self,
        id: str = "",
        zone_code: str = "",
        name: str = "",
        category: str = "PUBLIC",  # PUBLIC | PRIVATE_COMPANY | PRIVATE_RESTRICTED | VISITOR
        company_id: Optional[str] = None,
        company_name: Optional[str] = None,
        address: str = "",
        city: str = "Bengaluru",
        latitude: float = 12.9716,
        longitude: float = 77.5946,
        total_spaces: int = 100,
        available_spaces: int = 50,
        occupied_spaces: int = 50,
        reserved_spaces: int = 0,
        ev_spaces: int = 10,
        price_per_hour: float = 20.0,
        distance_km: float = 1.2,
        walking_minutes: int = 5,
        open_24x7: bool = True,
        security_guard_on_site: bool = True,
        anpr_camera_installed: bool = True,
        covered_roof: bool = True,
        rating: float = 4.8,
        total_reviews: int = 120,
        access_type: str = "ALL_USERS",  # ALL_USERS | COMPANY_EMPLOYEES | AUTHORIZED_USERS | VISITOR_APPROVAL
        allowed_companies: Optional[List[str]] = None,
        authorized_user_ids: Optional[List[str]] = None,
        status: str = "ACTIVE",
        image_url: Optional[str] = None
    ):
        self.id = id or f"zone-{uuid.uuid4().hex[:8]}"
        self.zone_code = zone_code
        self.name = name
        self.category = category
        self.company_id = company_id
        self.company_name = company_name or "—"
        self.address = address
        self.city = city
        self.latitude = latitude
        self.longitude = longitude
        self.total_spaces = total_spaces
        self.available_spaces = available_spaces
        self.occupied_spaces = occupied_spaces
        self.reserved_spaces = reserved_spaces
        self.ev_spaces = ev_spaces
        self.price_per_hour = price_per_hour
        self.distance_km = distance_km
        self.walking_minutes = walking_minutes
        self.open_24x7 = open_24x7
        self.security_guard_on_site = security_guard_on_site
        self.anpr_camera_installed = anpr_camera_installed
        self.covered_roof = covered_roof
        self.rating = rating
        self.total_reviews = total_reviews
        self.access_type = access_type
        self.allowed_companies = allowed_companies or []
        self.authorized_user_ids = authorized_user_ids or []
        self.status = status
        self.image_url = image_url

class ParkingSlot(ModelBase):
    def __init__(
        self,
        id: str = "",
        zone_id: str = "",
        slot_number: str = "A-01",
        floor_level: str = "G",  # G | B1 | B2 | 1 | 2
        slot_type: str = "STANDARD",  # STANDARD | EV_FAST_CHARGE | HANDICAPPED | VIP | RESERVED
        status: str = "AVAILABLE",  # AVAILABLE | OCCUPIED | RESERVED | MAINTENANCE | BLOCKED
        current_vehicle_plate: Optional[str] = None,
        current_reservation_id: Optional[str] = None,
        sensor_id: Optional[str] = None,
        last_status_change: Optional[datetime] = None
    ):
        self.id = id or f"slot-{uuid.uuid4().hex[:8]}"
        self.zone_id = zone_id
        self.slot_number = slot_number
        self.floor_level = floor_level
        self.slot_type = slot_type
        self.status = status
        self.current_vehicle_plate = current_vehicle_plate
        self.current_reservation_id = current_reservation_id
        self.sensor_id = sensor_id
        self.last_status_change = last_status_change or datetime.utcnow()

class ParkingAccess(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        user_email: str = "",
        parking_zone_id: str = "",
        company_id: Optional[str] = None,
        access_type: str = "EMPLOYEE",  # EMPLOYEE | VISITOR | SPECIAL_PERMIT | CONTRACTOR
        issued_by_admin_id: Optional[str] = None,
        valid_from: Optional[datetime] = None,
        valid_until: Optional[datetime] = None,
        status: str = "ACTIVE",  # ACTIVE | REVOKED | EXPIRED
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"acc-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.user_email = user_email
        self.parking_zone_id = parking_zone_id
        self.company_id = company_id
        self.access_type = access_type
        self.issued_by_admin_id = issued_by_admin_id
        self.valid_from = valid_from or datetime.utcnow()
        self.valid_until = valid_until
        self.status = status
        self.created_at = created_at or datetime.utcnow()

class Reservation(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        user_name: str = "",
        user_email: str = "",
        parking_zone_id: str = "",
        parking_zone_name: str = "",
        slot_id: Optional[str] = None,
        slot_number: str = "A-24",
        vehicle_id: Optional[str] = None,
        vehicle_plate: str = "KA-01-MJ-5890",
        vehicle_type: str = "Car",
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        duration_hours: float = 2.0,
        hourly_rate: float = 20.0,
        total_amount: float = 40.0,
        payment_status: str = "PAID",  # PENDING | PAID | REFUNDED | WAIVED
        status: str = "RESERVED",  # RESERVED | CHECKED_IN | ACTIVE | COMPLETED | CANCELLED | EXPIRED
        check_in_time: Optional[datetime] = None,
        check_out_time: Optional[datetime] = None,
        qr_pass_token: str = "",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"RES-{uuid.uuid4().hex[:6].upper()}"
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.parking_zone_id = parking_zone_id
        self.parking_zone_name = parking_zone_name
        self.slot_id = slot_id
        self.slot_number = slot_number
        self.vehicle_id = vehicle_id
        self.vehicle_plate = vehicle_plate
        self.vehicle_type = vehicle_type
        self.start_time = start_time or datetime.utcnow()
        self.end_time = end_time or datetime.utcnow()
        self.duration_hours = duration_hours
        self.hourly_rate = hourly_rate
        self.total_amount = total_amount
        self.payment_status = payment_status
        self.status = status
        self.check_in_time = check_in_time
        self.check_out_time = check_out_time
        self.qr_pass_token = qr_pass_token or f"PASS-{uuid.uuid4().hex[:12].upper()}"
        self.created_at = created_at or datetime.utcnow()

class ParkingSession(ModelBase):
    def __init__(
        self,
        id: str = "",
        reservation_id: Optional[str] = None,
        user_id: str = "",
        vehicle_plate: str = "",
        zone_id: str = "",
        slot_number: str = "",
        entry_time: Optional[datetime] = None,
        exit_time: Optional[datetime] = None,
        duration_minutes: int = 0,
        total_cost: float = 0.0,
        session_status: str = "IN_PROGRESS",  # IN_PROGRESS | COMPLETED | OVERSTAY_FLAGGED
        gate_entry_id: str = "GATE-IN-01",
        gate_exit_id: Optional[str] = None
    ):
        self.id = id or f"sess-{uuid.uuid4().hex[:8]}"
        self.reservation_id = reservation_id
        self.user_id = user_id
        self.vehicle_plate = vehicle_plate
        self.zone_id = zone_id
        self.slot_number = slot_number
        self.entry_time = entry_time or datetime.utcnow()
        self.exit_time = exit_time
        self.duration_minutes = duration_minutes
        self.total_cost = total_cost
        self.session_status = session_status
        self.gate_entry_id = gate_entry_id
        self.gate_exit_id = gate_exit_id

class ParkingPass(ModelBase):
    def __init__(
        self,
        id: str = "",
        pass_code: str = "",
        reservation_id: str = "",
        user_id: str = "",
        user_name: str = "",
        zone_id: str = "",
        zone_name: str = "",
        slot_number: str = "",
        vehicle_plate: str = "",
        valid_from: Optional[datetime] = None,
        valid_until: Optional[datetime] = None,
        is_active: bool = True,
        scan_count: int = 0,
        last_scanned_at: Optional[datetime] = None
    ):
        self.id = id or f"pass-{uuid.uuid4().hex[:8]}"
        self.pass_code = pass_code or f"SPK-{uuid.uuid4().hex[:10].upper()}"
        self.reservation_id = reservation_id
        self.user_id = user_id
        self.user_name = user_name
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.slot_number = slot_number
        self.vehicle_plate = vehicle_plate
        self.valid_from = valid_from or datetime.utcnow()
        self.valid_until = valid_until
        self.is_active = is_active
        self.scan_count = scan_count
        self.last_scanned_at = last_scanned_at

class ParkingViolation(ModelBase):
    def __init__(
        self,
        id: str = "",
        vehicle_plate: str = "",
        user_id: Optional[str] = None,
        user_name: str = "Unregistered Driver",
        user_email: Optional[str] = None,
        parking_zone_id: str = "",
        parking_zone_name: str = "",
        slot_number: Optional[str] = None,
        violation_type: str = "Unauthorized Parking",
        severity: str = "MEDIUM",  # LOW | MEDIUM | HIGH | CRITICAL
        fine_amount: float = 500.0,
        date_time: Optional[datetime] = None,
        status: str = "OPEN",  # OPEN | UNDER_REVIEW | RESOLVED | DISMISSED
        description: str = "",
        evidence_notes: str = "",
        image_evidence_url: Optional[str] = None,
        resolved_by_admin_id: Optional[str] = None,
        resolution_notes: Optional[str] = None
    ):
        self.id = id or f"V-{uuid.uuid4().hex[:6].upper()}"
        self.vehicle_plate = vehicle_plate.upper().strip()
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.parking_zone_id = parking_zone_id
        self.parking_zone_name = parking_zone_name
        self.slot_number = slot_number
        self.violation_type = violation_type
        self.severity = severity
        self.fine_amount = fine_amount
        self.date_time = date_time or datetime.utcnow()
        self.status = status
        self.description = description
        self.evidence_notes = evidence_notes
        self.image_evidence_url = image_evidence_url
        self.resolved_by_admin_id = resolved_by_admin_id
        self.resolution_notes = resolution_notes

class Sensor(ModelBase):
    def __init__(
        self,
        id: str = "",
        sensor_code: str = "SNS-101",
        sensor_type: str = "ULTRASONIC_STUD",  # ULTRASONIC_STUD | ANPR_CAMERA | GATE_BARRIER | MAGNETOMETER
        zone_id: str = "",
        slot_number: Optional[str] = None,
        battery_level_percent: int = 98,
        firmware_version: str = "v2.4.1",
        is_online: bool = True,
        last_heartbeat: Optional[datetime] = None,
        current_reading: str = "VACANT"  # VACANT | OCCUPIED | ERROR
    ):
        self.id = id or f"sns-{uuid.uuid4().hex[:8]}"
        self.sensor_code = sensor_code
        self.sensor_type = sensor_type
        self.zone_id = zone_id
        self.slot_number = slot_number
        self.battery_level_percent = battery_level_percent
        self.firmware_version = firmware_version
        self.is_online = is_online
        self.last_heartbeat = last_heartbeat or datetime.utcnow()
        self.current_reading = current_reading

class SensorEvent(ModelBase):
    def __init__(
        self,
        id: str = "",
        sensor_id: str = "",
        sensor_code: str = "",
        zone_id: str = "",
        slot_number: Optional[str] = None,
        event_type: str = "VEHICLE_ENTRY",  # VEHICLE_ENTRY | VEHICLE_EXIT | SLOT_OCCUPIED | SLOT_VACATED | OFFLINE_ALERT
        detected_plate: Optional[str] = None,
        raw_payload: Optional[Dict[str, Any]] = None,
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"evt-{uuid.uuid4().hex[:8]}"
        self.sensor_id = sensor_id
        self.sensor_code = sensor_code
        self.zone_id = zone_id
        self.slot_number = slot_number
        self.event_type = event_type
        self.detected_plate = detected_plate
        self.raw_payload = raw_payload or {}
        self.timestamp = timestamp or datetime.utcnow()

class OccupancyRecord(ModelBase):
    def __init__(
        self,
        id: str = "",
        zone_id: str = "",
        timestamp: Optional[datetime] = None,
        total_spaces: int = 100,
        occupied_spaces: int = 40,
        occupancy_rate: float = 40.0,
        day_of_week: int = 0,
        hour_of_day: int = 12
    ):
        self.id = id or f"occ-{uuid.uuid4().hex[:8]}"
        self.zone_id = zone_id
        self.timestamp = timestamp or datetime.utcnow()
        self.total_spaces = total_spaces
        self.occupied_spaces = occupied_spaces
        self.occupancy_rate = occupancy_rate
        self.day_of_week = day_of_week
        self.hour_of_day = hour_of_day

class OccupancyPrediction(ModelBase):
    def __init__(
        self,
        id: str = "",
        zone_id: str = "",
        current_occupancy: float = 55.0,
        plus_10m: float = 62.0,
        plus_20m: float = 70.0,
        plus_30m: float = 78.0,
        plus_60m: float = 88.0,
        trend: str = "RISING",  # RISING | STABLE | FALLING
        confidence_score: float = 0.94,
        peak_time_window: str = "11:00 AM — 01:30 PM",
        generated_at: Optional[datetime] = None
    ):
        self.id = id or f"pred-{uuid.uuid4().hex[:8]}"
        self.zone_id = zone_id
        self.current_occupancy = current_occupancy
        self.plus_10m = plus_10m
        self.plus_20m = plus_20m
        self.plus_30m = plus_30m
        self.plus_60m = plus_60m
        self.trend = trend
        self.confidence_score = confidence_score
        self.peak_time_window = peak_time_window
        self.generated_at = generated_at or datetime.utcnow()

class ParkingRecommendation(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        zone_id: str = "",
        zone_name: str = "",
        match_percentage: int = 94,
        reason: str = "Fastest route, guaranteed bay & lowest tariff.",
        recommended_slot: str = "A-12",
        tariff_per_hour: float = 20.0,
        distance_km: float = 1.2,
        has_ev: bool = True,
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"rec-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.match_percentage = match_percentage
        self.reason = reason
        self.recommended_slot = recommended_slot
        self.tariff_per_hour = tariff_per_hour
        self.distance_km = distance_km
        self.has_ev = has_ev
        self.created_at = created_at or datetime.utcnow()

class FavoriteParking(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        zone_id: str = "",
        zone_name: str = "",
        nickname: Optional[str] = "Workplace",
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"fav-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.nickname = nickname
        self.created_at = created_at or datetime.utcnow()

class Notification(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: str = "",
        title: str = "",
        message: str = "",
        notification_type: str = "INFO",  # INFO | SUCCESS | WARNING | VIOLATION_ALERT | EXPIRATION_ALERT
        is_read: bool = False,
        action_url: Optional[str] = None,
        created_at: Optional[datetime] = None
    ):
        self.id = id or f"notif-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.title = title
        self.message = message
        self.notification_type = notification_type
        self.is_read = is_read
        self.action_url = action_url
        self.created_at = created_at or datetime.utcnow()

class AuditLog(ModelBase):
    def __init__(
        self,
        id: str = "",
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        action: str = "",
        resource_type: str = "",
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: str = "127.0.0.1",
        timestamp: Optional[datetime] = None
    ):
        self.id = id or f"audit-{uuid.uuid4().hex[:8]}"
        self.user_id = user_id
        self.user_email = user_email or "system@smartpark.local"
        self.action = action
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.details = details or {}
        self.ip_address = ip_address
        self.timestamp = timestamp or datetime.utcnow()
