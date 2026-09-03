/**
 * SmartPark Parking Violations Service
 * Manages parking violation records, evidence, and status workflow (OPEN -> UNDER_REVIEW -> RESOLVED / DISMISSED)
 */

let VIOLATIONS_LIST = [
  {
    id: "V-1024",
    vehiclePlate: "AP39AB1234",
    userName: "Avinash Sharma",
    userEmail: "demo@smartpark.com",
    parkingLocation: "TCS Corporate Parking",
    locationId: "pvt-zone-01",
    violationType: "Unauthorized Parking",
    dateTime: "03 Sep 2026, 10:42 AM",
    status: "OPEN", // OPEN | UNDER_REVIEW | RESOLVED | DISMISSED
    description: "Vehicle parked in employee-only area without active corporate authorization RFID tag.",
    evidenceNotes: "Gate ANPR camera snapshot captured at Boom Barrier #2."
  },
  {
    id: "V-1025",
    vehiclePlate: "KA-04-MN-8890",
    userName: "Karan Patel",
    userEmail: "karan.p@example.com",
    parkingLocation: "Municipal Central Parking",
    locationId: "zone-public-01",
    violationType: "Expired Reservation",
    dateTime: "03 Sep 2026, 09:15 AM",
    status: "UNDER_REVIEW",
    description: "Vehicle overstayed reserved 2-hour slot by 1 hour 45 minutes in Bay A-14.",
    evidenceNotes: "Ultrasonic floor sensor reported occupied past booking expiration timestamp."
  },
  {
    id: "V-1026",
    vehiclePlate: "MH-12-PQ-4455",
    userName: "Rohan Gupta",
    userEmail: "rohan.g@example.com",
    parkingLocation: "Infosys Visitor Parking",
    locationId: "pvt-zone-02",
    violationType: "Wrong Parking Zone",
    dateTime: "02 Sep 2026, 04:30 PM",
    status: "OPEN",
    description: "Parked in dedicated EV fast-charging bay without actively charging vehicle.",
    evidenceNotes: "EV Charging station reported 0kW current draw for 90 minutes."
  },
  {
    id: "V-1027",
    vehiclePlate: "DL-01-AX-7722",
    userName: "Meera Sen",
    userEmail: "meera.sen@example.com",
    parkingLocation: "City Center Metro Plaza",
    locationId: "zone-public-02",
    violationType: "Blocked Parking Area",
    dateTime: "02 Sep 2026, 01:10 PM",
    status: "RESOLVED",
    description: "Vehicle partially blocked main access ramp turn.",
    evidenceNotes: "Driver notified via SMS and vehicle relocated to designated open bay."
  },
  {
    id: "V-1028",
    vehiclePlate: "KA-51-ZZ-9001",
    userName: "Vikram Malhotra",
    userEmail: "vikram.m@example.com",
    parkingLocation: "Wipro Campus Parking",
    locationId: "pvt-zone-04",
    violationType: "Invalid Parking Pass",
    dateTime: "01 Sep 2026, 11:20 AM",
    status: "DISMISSED",
    description: "Scanner failed to read expired visitor pass barcode due to screen glare.",
    evidenceNotes: "Host employee verified physical badge at security gate."
  }
];

export const VIOLATION_TYPES = [
  "Unauthorized Parking",
  "Expired Reservation",
  "Wrong Parking Zone",
  "Reserved Slot Violation",
  "Overstay",
  "Invalid Parking Pass",
  "Blocked Parking Area"
];

export const violationService = {
  getViolations(filterStatus = 'ALL') {
    if (filterStatus === 'ALL') return [...VIOLATIONS_LIST];
    return VIOLATIONS_LIST.filter(v => v.status === filterStatus);
  },

  getViolationById(id) {
    return VIOLATIONS_LIST.find(v => v.id === id) || null;
  },

  addViolation(data) {
    const nextNumber = 1029 + VIOLATIONS_LIST.length;
    const newViolation = {
      id: `V-${nextNumber}`,
      vehiclePlate: data.vehiclePlate.trim().toUpperCase(),
      userName: data.userName || "External Driver",
      userEmail: data.userEmail || "unregistered@driver.com",
      parkingLocation: data.parkingLocation || "Municipal Central Parking",
      locationId: data.locationId || "zone-public-01",
      violationType: data.violationType || "Unauthorized Parking",
      dateTime: data.dateTime || new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: "OPEN",
      description: data.description || "Violation logged by administrator.",
      evidenceNotes: data.evidenceNotes || "Manual inspection record."
    };

    VIOLATIONS_LIST.unshift(newViolation);
    window.dispatchEvent(new CustomEvent('smartpark_violations_updated'));
    return newViolation;
  },

  updateStatus(id, newStatus) {
    const violation = VIOLATIONS_LIST.find(v => v.id === id);
    if (violation) {
      violation.status = newStatus;
      window.dispatchEvent(new CustomEvent('smartpark_violations_updated'));
      return violation;
    }
    return null;
  }
};
