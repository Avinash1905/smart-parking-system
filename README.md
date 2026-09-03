# SmartPark

SmartPark is an intelligent, full-stack urban parking management, private tenant authorization, IoT hardware telemetry, and automated mobility orchestration platform.

---

## Overview

SmartPark delivers unified real-time visibility and management across public parking facilities, corporate campuses, residential complexes, and multimodal transit hubs. Built with high-performance Vanilla JavaScript modular components, a multi-threaded Python service layer, and an embedded SQLite transactional database, SmartPark bridges edge sensors, driver mobile interfaces, and security operations centers.

---

## Features

- **Public Parking Discovery**: Real-time live occupancy heatmaps, pricing matrices, distance calculations, and instant digital stall reservations.
- **Private & Corporate Access**: Role-based access control (RBAC) with employee badge synchronization, VIP pre-clearance, and contractor parking passes.
- **AI-Powered Occupancy Prediction**: Machine learning historical trend modeling providing 6-hour ahead forecasting and congestion mitigation.
- **Integrated EV & Energy Management**: Megawatt Charging System (MCS) fast chargers, V2G microgrid arbitrage, and dynamic roadway in-motion wireless inductive charging.
- **Comprehensive Facility Telemetry**: Over 150 automated hardware monitor subsystems including ANPR optical cameras, laser deck deflection targets, ultrasonic slab void scanners, and air quality index scrubbers.
- **Automated Violation Enforcement**: Automatic license plate recognition (ALPR) cross-checking, digital citation issuance, and security barrier interlocks.
- **Driver Hospitality Amenities**: Contactless BLE valet key lockers, UV-C child stroller bays, tire nitrogen inflators, and sub-zero washer fluid dispensers.

---

## Architecture

SmartPark follows a modular **Triad Enterprise Architecture**:

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend UI Layer                    │
│   Vanilla JS (ES6+) • CSS Variables Design Tokens • DOM │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP REST / WebSocket JSON
┌───────────────────────────▼────────────────────────────┐
│              Multi-Threaded Server & APIs              │
│   ThreadingTCPServer • Request Handler • Controllers   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                Domain Service Layer                    │
│   Business Rules • ML Predictor • Hardware Gateways    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Database Repository Layer                 │
│       SQLite Transactional Models • Auto-Migrations    │
└────────────────────────────────────────────────────────┘
```

---

## Technology Stack

- **Backend**: Python 3.10+ (Standard Library Multi-Threaded HTTP & Sockets)
- **Frontend**: Vanilla ES6+ JavaScript, Modular View Controllers, CSS3 Tokens
- **Database**: SQLite3 (Transactional schema initialization & parameterized queries)
- **Testing**: Pytest & Pytest-Asyncio
- **Containerization**: Docker & Docker Compose

---

## Project Structure

```text
parking/
├── app.py                     # Production application server runner
├── main.py                    # Main executable entry point
├── Dockerfile                 # Container image specification
├── docker-compose.yml         # Container orchestration manifest
├── package.json               # Project manifest & npm scripts
├── package-lock.json          # Node dependency lockfile
├── requirements.txt           # Python dependency requirements
├── index.html                 # Main application single-page layout
├── css/                       # Theme styles, components, and design tokens
├── js/
│   ├── app.js                 # Application bootstrapper
│   ├── components/            # UI Modals and telemetry panels (200+ components)
│   ├── data/                  # Mock datasets and state management services
│   └── views/                 # Navigation view controllers
├── server/
│   ├── server.py              # Multi-threaded HTTP request dispatcher
│   ├── database/
│   │   ├── db.py              # SQLite connection pool manager
│   │   └── repositories/      # 170+ domain database repository modules
│   └── services/              # 170+ business logic and hardware orchestration services
└── tests/                     # Unit and integration test suite
```

---

## Installation

### Prerequisites
- Python 3.10 or higher
- Git

### Clone the Repository
```bash
git clone https://github.com/Avinash1905/smart-parking-system.git
cd smart-parking-system
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Dependencies

- `pytest>=8.0.0`: Automated unit and integration test runner
- `pytest-asyncio>=0.23.0`: Asynchronous test fixtures
- `requests>=2.31.0`: HTTP client library for integration testing

---

## Environment Configuration

SmartPark works out-of-the-box with zero configuration. Standard runtime variables can optionally be set:
- `PORT`: Server port (Default: `8000`)
- `HOST`: Server interface binding (Default: `0.0.0.0`)
- `DB_NAME`: SQLite database filename (Default: `smartpark.db`)
- `ENVIRONMENT`: `development` | `production`

---

## Database Setup

The SQLite database tables and initial seed data are initialized automatically on application startup. No external database server or migration steps are required.

---

## Build

SmartPark uses native ES Modules and modern web assets:
```bash
npm run build
```

---

## Run

To launch the SmartPark application:

```bash
python main.py
```
*Or using npm:*
```bash
npm start
```

Access the interface in your browser:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## Development

Run the live development server:
```bash
npm run dev
```

---

## Testing

Execute the automated test suite with pytest:

```bash
pytest -v
```

Run test suite with code coverage:
```bash
pytest --cov=server tests/
```

---

## Usage

1. Open `http://localhost:8000` in any modern web browser.
2. Select **Public Parking** to explore public garages, hourly rates, and real-time open slots.
3. Switch to **Private Parking** to verify corporate employee badges or book executive visitor stalls.
4. Open the **Admin Management Suite** to monitor facility health, manage violations, and review audit logs.

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/overview` | Overall facility capacity, occupancy metrics, and alerts |
| `GET` | `/api/parking/public` | List all public parking zones with real-time slot counts |
| `GET` | `/api/parking/private` | List private zones filtered by employee authorization |
| `GET` | `/api/parking/{id}/slots` | Detailed bay-by-bay status for a specific zone |
| `GET` | `/api/parking/{id}/prediction` | 6-hour ML occupancy forecast |
| `GET` | `/api/recommendations` | Dynamic recommendations based on distance and price |
| `GET` | `/api/violations` | List open and resolved parking citations |
| `POST`| `/api/reservations` | Create a new parking stall reservation |

---

## Admin Features

- Live occupancy threshold alerts and bay overrides.
- Manual ALPR license plate lookup and citation issuance.
- Automated gate barrier lock/release overrides.
- Subsystem health diagnostics and sensor calibration.

---

## Private Parking

- Access control integration for corporate office campuses and residential buildings.
- Badge whitelist verification against active directory rosters.
- Contractor temporary permit passes with automated expiry timers.

---

## Realtime Parking

- Sub-second occupancy updates via low-latency polling and simulation events.
- Color-coded stall availability indicators (Green: Open, Red: Occupied, Blue: EV Reserved).

---

## Prediction System

- Time-series moving average and day-of-week regression models.
- Predicts expected peak arrival surges and parking slot exhaustion windows.

---

## Sensor Simulator

- Built-in hardware sensor simulator (`js/components/sensorSimulatorView.js`).
- Allows developers to inject synthetic vehicle arrival, departure, and violation events.

---

## Troubleshooting

- **Port Conflict (`WinError 10048` or `10013`)**: Specify a custom port via environment variable:
  ```powershell
  $env:PORT=8080; python main.py
  ```
- **Database Reset**: Remove `smartpark.db` and restart the application to regenerate fresh sample records.
