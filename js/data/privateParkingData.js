/**
 * SmartPark Private Parking Mock Data Layer
 * Clean data structures for company-reserved, visitor, and restricted parking zones.
 */

export const MOCK_USER_SESSION = {
  name: "Arjun Verma",
  email: "arjun.verma@tcs.com",
  companyId: "TCS",
  companyName: "Tata Consultancy Services",
  employeeId: "TCS-1024",
  isVerified: true,
  vehiclePlate: "KA-01-MJ-5890"
};

export const AVAILABLE_DEMO_PROFILES = [
  {
    id: "tcs_user",
    companyId: "TCS",
    companyName: "TCS (Tata Consultancy Services)",
    employeeId: "TCS-1024",
    role: "Full-Time Employee",
    isVerified: true
  },
  {
    id: "infosys_user",
    companyId: "INFOSYS",
    companyName: "Infosys Limited",
    employeeId: "INF-8492",
    role: "Associate Consultant",
    isVerified: true
  },
  {
    id: "guest_user",
    companyId: null,
    companyName: "Independent Visitor",
    employeeId: null,
    role: "External Guest",
    isVerified: false
  }
];

export const PRIVATE_PARKING_ZONES = [
  {
    id: "pvt-zone-01",
    companyId: "TCS",
    companyName: "TCS",
    name: "TCS Corporate Parking",
    parkingType: "EMPLOYEE", // EMPLOYEE | VISITOR | RESTRICTED
    typeLabel: "Employee Parking",
    address: "TCS Olympus Campus, Think Campus Road, Electronic City",
    mapX: 38,
    mapY: 28,
    latitude: 12.8450,
    longitude: 77.6600,
    totalSpaces: 120,
    availableSpaces: 72,
    pricePerHour: 15,
    distanceKm: 1.4,
    walkingMinutes: 6,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 12,
    open24x7: true,
    rating: 4.9,
    reviewsCount: 310,
    allowedCompanies: ["TCS"],
    accessRequirements: "TCS Corporate ID Card / SmartPark NFC Pass",
    accessDescription: "Reserved exclusively for verified TCS employees and authorized contractors.",
    amenities: ["ANPR Automated Gate", "Multi-Level Shaded Deck", "EV Level 3 Superchargers", "24/7 Security Patrol", "Wheelchair Accessible Bays"],
    predictedFullInMinutes: 85,
    predictionMessage: "High availability throughout office morning hours",
    forecast: {
      current: 40,
      plus10m: 45,
      plus20m: 52,
      plus30m: 58
    },
    tariff: {
      firstHour: 15,
      subsequentPerHour: 10,
      fullDayPass: 80
    }
  },
  {
    id: "pvt-zone-02",
    companyId: "INFOSYS",
    companyName: "Infosys",
    name: "Infosys Visitor Parking",
    parkingType: "VISITOR",
    typeLabel: "Visitor Parking",
    address: "Gate 2, Infosys Main Campus, Hosur Road",
    mapX: 68,
    mapY: 30,
    latitude: 12.8500,
    longitude: 77.6650,
    totalSpaces: 30,
    availableSpaces: 8,
    pricePerHour: 25,
    distanceKm: 2.1,
    walkingMinutes: 8,
    availabilityStatus: "MEDIUM",
    evCharging: true,
    evSpaces: 4,
    open24x7: false,
    rating: 4.7,
    reviewsCount: 145,
    allowedCompanies: ["*"], // Anyone with visitor approval
    accessRequirements: "Pre-approved Visitor QR Pass + Host Employee Verification",
    accessDescription: "Temporary visitor parking for registered clients, interviewees, and guests.",
    amenities: ["Visitor Welcome Desk", "EV Fast Charging", "Valet Assistance", "Shaded Covered Bays", "CCTV Monitoring"],
    predictedFullInMinutes: 22,
    predictionMessage: "Likely to reach full capacity in 22 minutes",
    forecast: {
      current: 73,
      plus10m: 80,
      plus20m: 88,
      plus30m: 95
    },
    tariff: {
      firstHour: 25,
      subsequentPerHour: 20,
      fullDayPass: 160
    }
  },
  {
    id: "pvt-zone-03",
    companyId: "INFOSYS",
    companyName: "Infosys",
    name: "Infosys Employee Multi-Deck",
    parkingType: "EMPLOYEE",
    typeLabel: "Employee Parking",
    address: "Tower 4, Infosys SEZ Campus, Electronic City Phase 1",
    mapX: 72,
    mapY: 40,
    latitude: 12.8520,
    longitude: 77.6680,
    totalSpaces: 150,
    availableSpaces: 45,
    pricePerHour: 10,
    distanceKm: 2.3,
    walkingMinutes: 9,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 16,
    open24x7: true,
    rating: 4.8,
    reviewsCount: 420,
    allowedCompanies: ["INFOSYS"],
    accessRequirements: "Infosys Employee Badge / RFID tag",
    accessDescription: "Exclusive access for Infosys badge holders.",
    amenities: ["Automated ANPR Barrier", "Covered Multi-Deck", "EV Fast Charging", "Rest Area", "Shuttle Connection"],
    predictedFullInMinutes: 65,
    predictionMessage: "Stable availability for employee badge holders",
    forecast: {
      current: 70,
      plus10m: 74,
      plus20m: 78,
      plus30m: 82
    },
    tariff: {
      firstHour: 10,
      subsequentPerHour: 10,
      fullDayPass: 60
    }
  },
  {
    id: "pvt-zone-04",
    companyId: "WIPRO",
    companyName: "Wipro",
    name: "Wipro Campus Parking",
    parkingType: "EMPLOYEE",
    typeLabel: "Employee Parking",
    address: "Sarjapur Innovation Park, Wipro Gate 1",
    mapX: 48,
    mapY: 62,
    latitude: 12.9100,
    longitude: 77.6850,
    totalSpaces: 90,
    availableSpaces: 2,
    pricePerHour: 15,
    distanceKm: 3.5,
    walkingMinutes: 14,
    availabilityStatus: "LOW",
    evCharging: false,
    evSpaces: 0,
    open24x7: true,
    rating: 4.5,
    reviewsCount: 198,
    allowedCompanies: ["WIPRO"],
    accessRequirements: "Wipro Active Employee RFID Badge",
    accessDescription: "Restricted to Wipro staff and registered corporate vehicles.",
    amenities: ["24/7 Security Desk", "Shaded Covered Bays", "CCTV 360", "Two-Wheeler Dedicated Area"],
    predictedFullInMinutes: 5,
    predictionMessage: "Critical: Lot nearly full, expect waiting line",
    forecast: {
      current: 98,
      plus10m: 100,
      plus20m: 100,
      plus30m: 100
    },
    tariff: {
      firstHour: 15,
      subsequentPerHour: 15,
      fullDayPass: 90
    }
  },
  {
    id: "pvt-zone-05",
    companyId: "TECHM",
    companyName: "Tech Mahindra",
    name: "Tech Mahindra Tech Park Deck",
    parkingType: "EMPLOYEE",
    typeLabel: "Employee Parking",
    address: "Cyber City Campus, Phase 2, Ring Road",
    mapX: 84,
    mapY: 68,
    latitude: 12.8360,
    longitude: 77.6800,
    totalSpaces: 80,
    availableSpaces: 34,
    pricePerHour: 15,
    distanceKm: 2.9,
    walkingMinutes: 11,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 8,
    open24x7: true,
    rating: 4.6,
    reviewsCount: 162,
    allowedCompanies: ["TECHM"],
    accessRequirements: "Tech Mahindra Associate ID / Corporate App QR",
    accessDescription: "Reserved for Tech Mahindra employees and verified vendors.",
    amenities: ["Covered Parking", "EV Chargers", "Security Patrol", "Smart Barrier"],
    predictedFullInMinutes: 50,
    predictionMessage: "Moderate traffic, steady occupancy expected",
    forecast: {
      current: 57,
      plus10m: 63,
      plus20m: 68,
      plus30m: 74
    },
    tariff: {
      firstHour: 15,
      subsequentPerHour: 10,
      fullDayPass: 80
    }
  },
  {
    id: "pvt-zone-06",
    companyId: "TCS",
    companyName: "TCS",
    name: "TCS Visitor & Client Bay",
    parkingType: "VISITOR",
    typeLabel: "Visitor Parking",
    address: "TCS Executive Tower, Gate 1, Think Campus",
    mapX: 42,
    mapY: 22,
    latitude: 12.8460,
    longitude: 77.6610,
    totalSpaces: 25,
    availableSpaces: 14,
    pricePerHour: 20,
    distanceKm: 1.5,
    walkingMinutes: 6,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 4,
    open24x7: false,
    rating: 4.9,
    reviewsCount: 88,
    allowedCompanies: ["*"],
    accessRequirements: "Pre-registered Visitor Pass via TCS Host",
    accessDescription: "Dedicated executive visitor slots for client delegations and guests.",
    amenities: ["VIP Valet", "EV Superchargers", "Concierge Reception", "Covered Executive Bays"],
    predictedFullInMinutes: 45,
    predictionMessage: "Ample visitor bays currently free",
    forecast: {
      current: 44,
      plus10m: 48,
      plus20m: 54,
      plus30m: 60
    },
    tariff: {
      firstHour: 20,
      subsequentPerHour: 20,
      fullDayPass: 120
    }
  },
  {
    id: "pvt-zone-07",
    companyId: "OTHER",
    companyName: "Global Tech Park",
    name: "Tech Park Restricted Facility",
    parkingType: "RESTRICTED",
    typeLabel: "Restricted Facility",
    address: "Building Alpha, SEZ High-Security Zone",
    mapX: 22,
    mapY: 58,
    latitude: 12.8400,
    longitude: 77.6520,
    totalSpaces: 40,
    availableSpaces: 9,
    pricePerHour: 30,
    distanceKm: 3.1,
    walkingMinutes: 13,
    availabilityStatus: "MEDIUM",
    evCharging: true,
    evSpaces: 4,
    open24x7: false,
    rating: 4.4,
    reviewsCount: 72,
    allowedCompanies: ["SPECIAL_AUTH"],
    accessRequirements: "High Security Clearance / Facility Manager Authorization",
    accessDescription: "Restricted facility parking. Special authorization protocol required.",
    amenities: ["Biometric Verification", "Armed Security", "Covered High-Security Bay", "EV Charging"],
    predictedFullInMinutes: 28,
    predictionMessage: "Strict authorization check active at boom gate",
    forecast: {
      current: 77,
      plus10m: 82,
      plus20m: 88,
      plus30m: 92
    },
    tariff: {
      firstHour: 30,
      subsequentPerHour: 25,
      fullDayPass: 200
    }
  }
];

export const PRIVATE_PARKING_SUMMARY = {
  accessibleParking: 6,
  availableSpaces: 184,
  companies: 8,
  visitorParking: 12
};
