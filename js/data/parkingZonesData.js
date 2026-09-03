/**
 * SmartPark Public Parking Mock Data Layer
 * Clean data structures ready to be plugged into REST / GraphQL APIs.
 */

export const PUBLIC_PARKING_ZONES = [
  {
    id: "zone-public-01",
    name: "Municipal Central Parking",
    type: "PUBLIC",
    zoneCode: "Zone A",
    address: "Civic Square, Main Commercial Hub",
    mapX: 32, // Percentage on vector map
    mapY: 42,
    latitude: 12.9716,
    longitude: 77.5946,
    totalSpaces: 80,
    availableSpaces: 42,
    pricePerHour: 20,
    distanceKm: 1.2,
    walkingMinutes: 5,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 6,
    open24x7: true,
    rating: 4.8,
    reviewsCount: 142,
    amenities: ["CCTV Surveillance", "Covered Parking", "EV Fast Charging", "Wheelchair Accessible", "Automated Boom Barrier", "24/7 Security"],
    predictedFullInMinutes: 75,
    predictionMessage: "High availability for the next 45 minutes",
    forecast: {
      current: 48, // % occupied
      plus10m: 54,
      plus20m: 62,
      plus30m: 68
    },
    tariff: {
      firstHour: 20,
      subsequentPerHour: 20,
      fullDayPass: 150
    }
  },
  {
    id: "zone-public-02",
    name: "City Center Metro Plaza",
    type: "PUBLIC",
    zoneCode: "Zone B",
    address: "Metro Junction, Exit Gate 3",
    mapX: 58,
    mapY: 34,
    latitude: 12.9750,
    longitude: 77.6010,
    totalSpaces: 60,
    availableSpaces: 12,
    pricePerHour: 30,
    distanceKm: 0.8,
    walkingMinutes: 3,
    availabilityStatus: "MEDIUM",
    evCharging: true,
    evSpaces: 4,
    open24x7: true,
    rating: 4.6,
    reviewsCount: 98,
    amenities: ["Metro Direct Link", "Covered Bays", "EV Superchargers", "Digital Payment Only", "Valet Assistance"],
    predictedFullInMinutes: 18,
    predictionMessage: "Likely to become full in 18 minutes",
    forecast: {
      current: 80,
      plus10m: 86,
      plus20m: 94,
      plus30m: 98
    },
    tariff: {
      firstHour: 30,
      subsequentPerHour: 25,
      fullDayPass: 200
    }
  },
  {
    id: "zone-public-03",
    name: "Brigade Road Public Lot",
    type: "PUBLIC",
    zoneCode: "Zone C",
    address: "Opp. Rex Heritage Mall, Brigade Road",
    mapX: 45,
    mapY: 65,
    latitude: 12.9720,
    longitude: 77.6070,
    totalSpaces: 50,
    availableSpaces: 4,
    pricePerHour: 35,
    distanceKm: 1.5,
    walkingMinutes: 7,
    availabilityStatus: "LOW",
    evCharging: false,
    evSpaces: 0,
    open24x7: false,
    rating: 4.3,
    reviewsCount: 76,
    amenities: ["CCTV Surveillance", "Security Guard", "Two-Wheeler Dedicated Area", "UPI/Card Enabled"],
    predictedFullInMinutes: 8,
    predictionMessage: "Critical: Almost full, expect delays",
    forecast: {
      current: 92,
      plus10m: 96,
      plus20m: 100,
      plus30m: 100
    },
    tariff: {
      firstHour: 35,
      subsequentPerHour: 30,
      fullDayPass: 250
    }
  },
  {
    id: "zone-public-04",
    name: "MG Road Civic Parking",
    type: "PUBLIC",
    zoneCode: "Zone A",
    address: "Near Trinity Circle, MG Boulevard",
    mapX: 74,
    mapY: 52,
    latitude: 12.9735,
    longitude: 77.6180,
    totalSpaces: 110,
    availableSpaces: 68,
    pricePerHour: 25,
    distanceKm: 2.1,
    walkingMinutes: 9,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 8,
    open24x7: true,
    rating: 4.7,
    reviewsCount: 210,
    amenities: ["Multi-level Structure", "EV Fast Charging", "Restrooms", "Car Wash Facility", "Elevators", "24/7 CCTV"],
    predictedFullInMinutes: 120,
    predictionMessage: "High capacity available throughout the afternoon",
    forecast: {
      current: 38,
      plus10m: 42,
      plus20m: 46,
      plus30m: 51
    },
    tariff: {
      firstHour: 25,
      subsequentPerHour: 20,
      fullDayPass: 180
    }
  },
  {
    id: "zone-public-05",
    name: "Indiranagar Civic Bays",
    type: "PUBLIC",
    zoneCode: "Zone B",
    address: "100ft Road, 12th Main Corner",
    mapX: 82,
    mapY: 28,
    latitude: 12.9780,
    longitude: 77.6400,
    totalSpaces: 45,
    availableSpaces: 19,
    pricePerHour: 20,
    distanceKm: 3.4,
    walkingMinutes: 14,
    availabilityStatus: "MEDIUM",
    evCharging: true,
    evSpaces: 2,
    open24x7: false,
    rating: 4.5,
    reviewsCount: 65,
    amenities: ["Shaded Parking", "EV Level 2 Charger", "Security Patrol", "Smart Barrier"],
    predictedFullInMinutes: 35,
    predictionMessage: "Moderate traffic, steady occupancy expected",
    forecast: {
      current: 58,
      plus10m: 65,
      plus20m: 72,
      plus30m: 79
    },
    tariff: {
      firstHour: 20,
      subsequentPerHour: 20,
      fullDayPass: 140
    }
  },
  {
    id: "zone-public-06",
    name: "Victoria Terminal Public Deck",
    type: "PUBLIC",
    zoneCode: "Zone A",
    address: "Railway Station West Gate, Platform 1",
    mapX: 20,
    mapY: 25,
    latitude: 12.9770,
    longitude: 77.5720,
    totalSpaces: 120,
    availableSpaces: 55,
    pricePerHour: 15,
    distanceKm: 2.8,
    walkingMinutes: 12,
    availabilityStatus: "HIGH",
    evCharging: false,
    evSpaces: 0,
    open24x7: true,
    rating: 4.4,
    reviewsCount: 188,
    amenities: ["24/7 Access", "Luggage Carts", "Covered Roof Deck", "CCTV 360", "Security Guard"],
    predictedFullInMinutes: 90,
    predictionMessage: "Steady turnover, good availability",
    forecast: {
      current: 54,
      plus10m: 58,
      plus20m: 63,
      plus30m: 67
    },
    tariff: {
      firstHour: 15,
      subsequentPerHour: 15,
      fullDayPass: 120
    }
  },
  {
    id: "zone-public-07",
    name: "Koramangala Public Parkade",
    type: "PUBLIC",
    zoneCode: "Zone C",
    address: "80 Feet Road, 4th Block",
    mapX: 62,
    mapY: 78,
    latitude: 12.9352,
    longitude: 77.6245,
    totalSpaces: 75,
    availableSpaces: 8,
    pricePerHour: 30,
    distanceKm: 4.2,
    walkingMinutes: 18,
    availabilityStatus: "LOW",
    evCharging: true,
    evSpaces: 4,
    open24x7: true,
    rating: 4.6,
    reviewsCount: 114,
    amenities: ["EV Fast Charging", "Valet Available", "Multi-Level", "Wheelchair Friendly", "ANPR Cameras"],
    predictedFullInMinutes: 14,
    predictionMessage: "High evening rush expected in 15 mins",
    forecast: {
      current: 89,
      plus10m: 94,
      plus20m: 98,
      plus30m: 100
    },
    tariff: {
      firstHour: 30,
      subsequentPerHour: 25,
      fullDayPass: 220
    }
  },
  {
    id: "zone-public-08",
    name: "Town Hall Civic Grounds",
    type: "PUBLIC",
    zoneCode: "Zone B",
    address: "JC Road, Near Silver Jubilee Park",
    mapX: 28,
    mapY: 72,
    latitude: 12.9630,
    longitude: 77.5850,
    totalSpaces: 90,
    availableSpaces: 40,
    pricePerHour: 20,
    distanceKm: 1.9,
    walkingMinutes: 8,
    availabilityStatus: "HIGH",
    evCharging: true,
    evSpaces: 4,
    open24x7: false,
    rating: 4.4,
    reviewsCount: 82,
    amenities: ["Open & Shaded Areas", "EV Charging", "Security Desk", "Spacious Bus/Car bays"],
    predictedFullInMinutes: 60,
    predictionMessage: "Ample open bays available",
    forecast: {
      current: 55,
      plus10m: 60,
      plus20m: 66,
      plus30m: 71
    },
    tariff: {
      firstHour: 20,
      subsequentPerHour: 20,
      fullDayPass: 160
    }
  }
];

export const PUBLIC_PARKING_SUMMARY = {
  totalAvailableSpaces: 248,
  totalPublicZones: 12,
  currentlyOccupiedPercent: 67,
  activeParkingAreas: 8
};
