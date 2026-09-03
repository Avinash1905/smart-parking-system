# SmartPark

SmartPark is an intelligent, full-stack municipal and enterprise parking management system. It provides real-time spot tracking, automated license plate recognition (ANPR) integrations, private corporate garage access controls, dynamic pricing calculations, machine learning occupancy forecasting, and multi-sensor IoT telemetry.

---

## Overview

Modern urban centers and enterprise facilities face severe congestion, inefficient space utilization, and lost productivity due to uncoordinated parking infrastructure. SmartPark bridges the gap by unifying public municipal parking, corporate tenant zones, EV charging bays, and automated enforcement into a single, cohesive, high-performance web platform.

SmartPark delivers:
- **Instant Spot Discovery & Reservations**: Real-time availability indicators with interactive deck maps and instant QR code passes.
- **Enterprise Access Governance**: Fine-grained role-based access control (RBAC) supporting corporate employee permits, visitor pre-clearance, and contractor escorts.
- **AI-Driven Forecasting**: Occupancy prediction algorithms that model historical traffic, day-of-week trends, and peak hour spikes.
- **IoT Hardware Simulation**: Integrated virtual sensor matrix emulating ultrasonic slot detectors, loop triggers, and ANPR cameras.

---

## Features

- **Real-Time Bay Availability**: Interactive isometric and SVG 2D deck maps with live occupied/available status indicators.
- **Public & Private Parking Portals**: Dedicated access-gated workflows for public commuters vs. authenticated corporate tenants.
- **Dynamic Pricing Engine**: Automated hourly tariffs adjusted based on demand pressure, special events, peak times, and vehicle classification (Compact, SUV, EV, Motorcycle).
- **EV Charging Infrastructure**: Dedicated bay booking, power load balancing, and battery health telemetry tracking.
- **Automated License Plate Recognition (ANPR)**: Optical gate control, permit validation, and automated barrier triggering.
- **Citation & Enforcement Engine**: Overstay detection, unauthorized parking logging, automated dispute resolution flows, and wheel-boot management.
- **Comprehensive Admin Suite**: Zone management, bay reallocation, pricing rule configuration, audit log exports, and live telemetry feeds.
- **Visitor Pre-Clearance**: Tenant-sponsored guest passes with expiring digital QR codes.

---

## Architecture

SmartPark is designed with a lightweight, modular service-oriented architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   SmartPark Web Client UI                   │
│      (HTML5 / CSS3 Design Tokens / Vanilla Modular JS)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST / WebSocket JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Gateway                      │
│                  (server/server.py / app.py)                │
└──────┬───────────────────────┼───────────────────────┬──────┘
       │                       │                       │
┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐
│ Controllers │         │ Core Engine │         │ IoT Service │
│ & REST APIs │         │ & Prediction│         │  Simulator  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
┌──────▼───────────────────────▼───────────────────────▼──────┐
│                  Service & Data Repositories                │
│                 (SQLite / In-Memory Seeders)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

- **Frontend**:
  - Semantic HTML5, CSS3 Custom Properties (Design System tokens, responsive dark theme, glassmorphism highlights).
  - Vanilla ES6+ JavaScript modules (Zero bundler friction, fast load times).
  - SVG Dynamic Vector Renderers for multi-level parking deck plans.
- **Backend & API**:
  - Python 3.9+ standard library (`http.server`, `socketserver`, `sqlite3`, `json`, `urllib`).
  - RESTful JSON API endpoints supporting standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`).
- **Database**:
  - SQLite3 with in-memory fallback and automated seed generation.
- **Testing**:
  - Pytest test runner with coverage reports.
- **Containerization**:
  - Docker multi-stage container & Docker Compose orchestration.

---

## Project Structure

```
smartpark-system/
├── app.py                      # Main production server entry point
├── main.py                     # CLI launcher & process wrapper
├── package.json                # Project manifest and task runner
├── package-lock.json           # Node lockfile
├── requirements.txt            # Python dependencies manifest
├── requirements-lock.txt       # Python pinned lockfile
├── Dockerfile                  # Production container definition
├── docker-compose.yml          # Container orchestration
├── index.html                  # Core single-page application entrypoint
├── css/                        # Design tokens, themes, layouts, responsive rules
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/                         # Frontend modular scripts
│   ├── app.js                  # Master SPA application router and controller
│   ├── components/             # Over 200 UI components, modals, and views
│   ├── services/               # Client-side API clients & state stores
│   └── data/                   # Seed fixtures & geo-coordinates
├── server/                     # Backend server & business logic
│   ├── server.py               # HTTP request dispatcher & route mappings
│   ├── controllers/            # Request handlers
│   ├── engines/                # Pricing, prediction, and allocation engines
│   ├── middleware/             # CORS, auth verification, and audit middleware
│   ├── models/                 # Database schema models
│   ├── services/               # Business service domain modules
│   └── database/               # SQLite storage connection helpers
└── tests/                      # Automated test suite
    ├── test_auth.py
    ├── test_parking.py
    ├── test_reservations.py
    └── test_prediction.py
```

---

## Installation

### Prerequisites
- Python 3.9 or higher
- Node.js 18.0 or higher (optional, for npm task runner scripts)
- Git

### Clone Repository
```bash
git clone https://github.com/Avinash1905/smart-parking-system.git
cd smart-parking-system
```

### Install Dependencies
Using Python:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Or using Node:
```bash
npm install
```

---

## Dependencies

- **Runtime**: Python standard library (`sqlite3`, `http.server`, `hashlib`, `urllib`).
- **Testing**: `pytest>=7.4.0`, `pytest-cov>=4.1.0`.
- **Utilities**: `requests>=2.31.0`, `python-dotenv>=1.0.0`, `cryptography>=41.0.0`.

All dependencies and exact versions are locked in `requirements-lock.txt` and `package-lock.json`.

---

## Environment Configuration

SmartPark runs out of the box with intelligent defaults. You may optionally configure environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Network port for the HTTP/REST server | `8000` |
| `HOST` | Host interface binding | `0.0.0.0` |
| `SMARTPARK_ENV` | Runtime environment (`development`, `production`) | `production` |
| `DB_PATH` | Path to SQLite database file | `server/database/smartpark.db` |

Create a `.env` file if custom overrides are needed:
```bash
PORT=8000
HOST=0.0.0.0
SMARTPARK_ENV=development
```

---

## Database Setup

The database initializes automatically on the first server launch. To manually initialize or reset seed data:

```bash
python -c "from server.database.init_db import init_database; init_database()"
```

This creates all required tables (Users, Zones, Slots, Reservations, Vehicles, Violations, Telemetry) and populates realistic demo data.

---

## Build

SmartPark is built as a zero-compilation modern web application:
```bash
npm run build
```
This validates all assets, stylesheets, and JavaScript module exports.

---

## Run

### Direct Python Execution
```bash
python app.py
```
Or specify a custom port:
```bash
python app.py --port 8080
```

### Direct NPM Runner
```bash
npm start
```

### Docker Execution
```bash
docker-compose up --build -d
```
Access the application by navigating to `http://localhost:8000` in any modern web browser.

---

## Development

To run the application with live reload in development mode:
```bash
npm run dev
```

Inspect code quality and syntax:
```bash
npm run lint
```

---

## Testing

Execute the test suite using `pytest`:

```bash
pytest tests/ -v
```

Run tests with code coverage analysis:
```bash
pytest tests/ --cov=server -v
```

---

## Usage

1. **Commuter Flow**:
   - Open `http://localhost:8000`.
   - Browse public parking zones on the interactive map or list view.
   - Filter by vehicle type (Car, EV, Motorcycle, Handicap ADA).
   - Select a zone and choose an available bay.
   - Confirm reservation and receive instant QR digital parking pass.

2. **Corporate & Tenant Flow**:
   - Log in using an authorized employee account.
   - Navigate to the **Private Parking** portal.
   - Access designated corporate underground bays and reserve visitor passes.

3. **Admin & Operator Flow**:
   - Switch to the **Admin Dashboard**.
   - Monitor live occupancy gauges, revenue analytics, and sensor health.
   - Issue manual gate overrides or manage violation citations.

---

## API Overview

SmartPark exposes a comprehensive RESTful JSON API:

### Parking & Zones
- `GET /api/parking/public` - Fetch all public parking zones.
- `GET /api/parking/private` - Fetch corporate and access-restricted parking zones.
- `GET /api/parking/{zone_id}` - Get zone metadata and status.
- `GET /api/parking/{zone_id}/slots` - Get real-time slot statuses for a zone.
- `GET /api/parking/{zone_id}/prediction` - Retrieve ML occupancy forecast.

### Reservations
- `POST /api/reservations/create` - Create a new parking spot reservation.
- `GET /api/reservations/active` - List active reservations for a user.
- `POST /api/reservations/cancel` - Cancel an active reservation.
- `POST /api/reservations/checkin` - Check in vehicle via ANPR/pass scan.
- `POST /api/reservations/checkout` - Check out vehicle and settle billing.

### Authentication & Users
- `POST /api/auth/login` - User authentication.
- `POST /api/auth/signup` - User registration.
- `GET /api/auth/me` - Retrieve current user profile and permits.

### Analytics & IoT Telemetry
- `GET /api/analytics/summary` - Aggregate system occupancy and revenue.
- `GET /api/sensor/status` - Live IoT sensor readings and diagnostic metrics.

---

## Admin Features

- **Live Fleet & Zone Overview**: Real-time bay occupancy metrics across municipal facilities.
- **Dynamic Tariff Configuration**: Configure base rates, peak multipliers, and EV charging premiums.
- **Enforcement & Citations**: Automated overstay tracking, license plate matching, and violation notices.
- **Audit Logs & Export**: Comprehensive CSV/JSON export of transactions, gate triggers, and system errors.

---

## Private Parking

The Private Parking module caters specifically to office buildings, residential societies, and gated campuses:
- **Badge & Plate Whitelisting**: Automated barrier opening for pre-registered employee plates.
- **Departmental Bay Allocation**: Dedicated slot ranges assigned to executive, team, or fleet vehicles.
- **Guest Pre-Registration**: Self-service invitation links allowing visitors frictionless entry.

---

## Realtime Parking

SmartPark leverages event-driven messaging to keep bay availability updated with sub-second latency:
- Real-time slot status transitions (`AVAILABLE` ➔ `RESERVED` ➔ `OCCUPIED` ➔ `MAINTENANCE`).
- Optical bay sensors update the central database instantly.
- Live SVG deck heatmaps update dynamically without page refreshes.

---

## Prediction System

The built-in prediction engine models municipal parking dynamics:
- **Historical Analysis**: Time-series trends across 24-hour cycles and 7-day patterns.
- **Weather & Event Correlation**: Ingestion of weather conditions and calendar events to forecast surges.
- **Congestion Mitigation**: Recommends nearby underutilized parking structures when target zones approach capacity.

---

## Sensor Simulator

SmartPark includes a complete IoT telemetry simulator:
- Simulates realistic vehicle entries, bay occupancy sensors, ultrasonic distance meters, and barrier state changes.
- Interactive controls allow operators to simulate peak rush hours, sensor malfunctions, and emergency lockdowns.

---

## Troubleshooting

### Port Already in Use
If port 8000 is occupied by another process:
```bash
python app.py --port 8081
```

### Database Lock Issues
If the SQLite database encounters lock contention in high concurrency:
- Ensure write operations are executed through the provided transaction context managers.
- Check permissions on `server/database/smartpark.db`.

### Static Assets Not Loading
- Confirm that the server is started from the project root directory or that `BASE_DIR` is properly resolved.
