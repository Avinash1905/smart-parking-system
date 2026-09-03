# SmartPark — Intelligent Parking System

SmartPark is an IoT-powered urban parking management platform designed for frictionless spot reservation, automated plate recognition, and contactless payments.

## Features

- **Driver Hub**: Real-time slot availability, EV charging spots, and digital wallet integration.
- **Login & Authentication**: Role-based access control (`admin`, `user`, `staff`) with password visibility toggle, client-side validation, and demo credential prefillers.
- **Facility Operations Console**: Real-time ANPR gate telemetry and barrier controls.
- **Theme**: High-contrast Dark Navy Theme (`#080F1C` / `#111827` / `#2563EB` / `#38BDF8`).

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## Demo Credentials

| Role | Username | Password | Target Route |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | `/admin/dashboard` |
| **User / Driver** | `user` | `user123` | `/user/dashboard` |
| **Staff Officer** | `staff` | `staff123` | `/staff/dashboard` |
