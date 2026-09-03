# SmartPark Platform — RESTful API Specification (v2.0)

This document specifies the complete REST API endpoints, authorization rules, and JSON payloads for the SmartPark urban and corporate mobility platform.

---

## 1. Authentication & Identity (`/api/auth`)

### `POST /api/auth/login`
Authenticates registered user or administrator credentials and issues a secure session token.

**Request Payload:**
```json
{
  "email": "demo@smartpark.com",
  "password": "SmartPark@123",
  "rememberMe": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "jwt-8f12a9c3b4e7...",
  "user": {
    "id": "usr-tcs-01",
    "name": "Avinash Sharma",
    "email": "demo@smartpark.com",
    "role": "USER",
    "company_id": "comp-tcs",
    "company_name": "TCS (Tata Consultancy Services)",
    "employee_id": "TCS-1024",
    "company_verified": true,
    "private_parking_access": ["zone-pvt-01", "zone-pvt-06"],
    "avatar_initials": "AS"
  }
}
```

---

### `POST /api/auth/signup`
Registers a new citizen or corporate employee into the SmartPark ecosystem.

**Request Payload:**
```json
{
  "name": "Kavya Nair",
  "email": "kavya.nair@gmail.com",
  "password": "StrongPassword123",
  "phone": "+91 98765 43210",
  "vehicle_type": "Car / EV",
  "vehicle_plate": "KA-01-KV-2026",
  "company_id": "none"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "jwt-b7e192f44a10...",
  "user": {
    "id": "usr-77a9b1c2",
    "name": "Kavya Nair",
    "email": "kavya.nair@gmail.com",
    "role": "USER",
    "company_id": null,
    "company_name": null,
    "company_verified": false,
    "private_parking_access": []
  }
}
```

---

## 2. Parking Facilities (`/api/parking`)

### `GET /api/parking/public`
Retrieves live public municipal parking zones with current IoT sensor telemetry.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "zone-pub-01",
      "zone_code": "PUB-01",
      "name": "Municipal Central Parking",
      "category": "PUBLIC",
      "address": "Kasturba Road, Near Cubbon Park Metro",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "total_spaces": 80,
      "available_spaces": 42,
      "occupied_spaces": 38,
      "ev_spaces": 8,
      "price_per_hour": 20.0,
      "distance_km": 1.2,
      "walking_minutes": 5,
      "open_24x7": true,
      "rating": 4.8
    }
  ]
}
```

---

### `GET /api/parking/private`
Retrieves corporate and restricted parking facilities evaluated against user authorization.

---

### `GET /api/parking/:id/slots`
Returns the bay-level matrix (Floor G, B1, B2) with live occupancy status.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "id": "slot-mun-01",
      "zone_id": "zone-pub-01",
      "slot_number": "A-01",
      "floor_level": "G",
      "slot_type": "EV_FAST_CHARGE",
      "status": "AVAILABLE",
      "sensor_id": "sns-mun-01"
    }
  ]
}
```

---

### `GET /api/parking/:id/prediction`
Generates real-time statistical & ML arrival occupancy predictions for +10m, +20m, +30m, and +60m.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "zone_id": "zone-pub-01",
    "current_occupancy_percent": 52.5,
    "plus_10m_predicted": 58.2,
    "plus_20m_predicted": 65.4,
    "plus_30m_predicted": 72.8,
    "plus_60m_predicted": 84.1,
    "trend": "RISING",
    "confidence_score": 0.94,
    "peak_hours_window": "09:30 AM — 11:45 AM & 05:00 PM — 07:30 PM",
    "recommended_arrival_time": "Within next 20 minutes for guaranteed open bay"
  }
}
```

---

## 3. Reservations & Digital Passes (`/api/reservations`)

### `POST /api/reservations`
Reserves a guaranteed parking bay with vehicle registration and generates instant digital QR pass.

**Request Payload:**
```json
{
  "parking_zone_id": "zone-pub-01",
  "duration_hours": 2.0,
  "vehicle_plate": "KA-01-MJ-5890",
  "vehicle_type": "Car"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "reservation_id": "RES-E8910A",
  "pass_code": "SPK-99812A4B",
  "slot_number": "A-24",
  "valid_until": "2026-09-03T17:30:00Z",
  "total_amount": 40.0
}
```

---

## 4. Parking Violations & Enforcement (`/api/violations`)

### `GET /api/violations?status=OPEN`
Retrieves parking violations with severity and status.

### `POST /api/violations` (Admin)
Logs a manual or camera-detected parking breach.

### `PATCH /api/violations/:id/status` (Admin)
Applies status transition (`OPEN` → `UNDER_REVIEW` → `RESOLVED` / `DISMISSED`).

---

## 5. IoT Sensor Telemetry (`/api/sensors`)

### `POST /api/sensors/simulate`
Admin hardware simulation endpoint firing entry/exit and bay state changes.
