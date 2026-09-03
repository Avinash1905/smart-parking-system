/**
 * Dashboard Mock Data Layer
 * Contains user metrics, active reservations, recent parking history, and saved vehicles.
 */

export const DASHBOARD_SUMMARY_DATA = {
  availableNearbySpaces: 248,
  activeReservationsCount: 1,
  totalHoursParked: 24,
  totalSavedVehicles: 2
};

export const DASHBOARD_METRICS = {
  availableParking: 248,
  activeReservations: 1,
  parkingHoursTotal: 24,
  savedVehiclesCount: 2
};

export const DASHBOARD_SUMMARY_DATA = DASHBOARD_METRICS;

export const ACTIVE_RESERVATION = {
  id: "res-act-7890",
  passId: "SP-984210",
  parkingName: "Municipal Central Parking",
  parkingType: "PUBLIC",
  zoneCode: "Zone A",
  address: "Civic Square, Main Commercial Hub",
  date: "Today",
  timeSlot: "10:30 AM — 12:30 PM",
  duration: "2 Hours",
  parkingSlot: "A-24",
  status: "Confirmed",
  vehiclePlate: "KA-01-MJ-5890",
  vehicleModel: "Tata Nexon EV",
  totalPaid: 40,
  isQrActive: true
};

export const RECENT_PARKING_HISTORY = [
  {
    id: "hist-01",
    parkingName: "Municipal Central Parking",
    type: "Public Parking",
    date: "Today, Sep 3",
    time: "10:30 AM - 12:30 PM",
    duration: "2.0 hrs",
    amount: "₹40",
    slot: "Bay A-24",
    status: "Active / Confirmed",
    statusType: "active"
  },
  {
    id: "hist-02",
    parkingName: "TCS Corporate Parking",
    type: "Company Access",
    date: "Yesterday, Sep 2",
    time: "09:15 AM - 05:30 PM",
    duration: "8.2 hrs",
    amount: "₹30",
    slot: "Bay C-12",
    status: "Completed",
    statusType: "completed"
  },
  {
    id: "hist-03",
    parkingName: "City Center Metro Plaza",
    type: "Public Parking",
    date: "Aug 30, 2026",
    time: "02:00 PM - 05:00 PM",
    duration: "3.0 hrs",
    amount: "₹60",
    slot: "Bay B-08",
    status: "Completed",
    statusType: "completed"
  },
  {
    id: "hist-04",
    parkingName: "Indiranagar Civic Bays",
    type: "Public Parking",
    date: "Aug 27, 2026",
    time: "06:30 PM - 08:00 PM",
    duration: "1.5 hrs",
    amount: "₹30",
    slot: "Bay A-05",
    status: "Completed",
    statusType: "completed"
  }
];

export const SAVED_VEHICLES = [
  {
    id: "veh-01",
    plate: "KA-01-MJ-5890",
    model: "Tata Nexon EV (Electric)",
    type: "Car / EV",
    isPrimary: true
  },
  {
    id: "veh-02",
    plate: "KA-05-EX-9988",
    model: "Honda City (Petrol)",
    type: "Car",
    isPrimary: false
  }
];
