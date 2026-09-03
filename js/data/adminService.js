/**
 * SmartPark Admin Service
 * State store and management API for Parking Locations and Companies
 */

import { PUBLIC_PARKING_ZONES } from './parkingZonesData.js';
import { PRIVATE_PARKING_ZONES } from './privateParkingData.js';

let ALL_PARKING_LOCATIONS = [
  ...PUBLIC_PARKING_ZONES.map(z => ({
    id: z.id,
    name: z.name,
    parkingType: "PUBLIC",
    companyId: null,
    companyName: "—",
    address: z.address,
    latitude: z.latitude,
    longitude: z.longitude,
    totalSpaces: z.totalSpaces,
    availableSpaces: z.availableSpaces,
    pricePerHour: z.pricePerHour,
    accessType: "ALL_USERS",
    authorizedUserIds: [],
    status: "ACTIVE",
    evCharging: z.evCharging,
    distanceKm: z.distanceKm,
    walkingMinutes: z.walkingMinutes
  })),
  ...PRIVATE_PARKING_ZONES.map(z => ({
    id: z.id,
    name: z.name,
    parkingType: z.parkingType === 'EMPLOYEE' ? 'PRIVATE_COMPANY' : z.parkingType === 'VISITOR' ? 'VISITOR' : 'PRIVATE_RESTRICTED',
    companyId: z.companyId === 'TCS' ? 'company-tcs' : z.companyId === 'INFOSYS' ? 'company-infosys' : z.companyId === 'WIPRO' ? 'company-wipro' : z.companyId === 'TECHM' ? 'company-techm' : 'company-other',
    companyName: z.companyName,
    address: z.address,
    latitude: z.latitude,
    longitude: z.longitude,
    totalSpaces: z.totalSpaces,
    availableSpaces: z.availableSpaces,
    pricePerHour: z.pricePerHour,
    accessType: z.parkingType === 'EMPLOYEE' ? 'COMPANY_EMPLOYEES' : z.parkingType === 'VISITOR' ? 'VISITOR_APPROVAL' : 'AUTHORIZED_USERS',
    authorizedUserIds: z.allowedCompanies ? ["user-001"] : [],
    status: "ACTIVE",
    evCharging: z.evCharging,
    distanceKm: z.distanceKm,
    walkingMinutes: z.walkingMinutes
  }))
];

let COMPANIES_LIST = [
  {
    id: "company-tcs",
    name: "TCS (Tata Consultancy Services)",
    code: "TCS",
    employeesCount: 842,
    parkingLocationsCount: 2,
    status: "ACTIVE",
    headquarters: "Think Campus, Electronic City Phase 1"
  },
  {
    id: "company-infosys",
    name: "Infosys Limited",
    code: "INFOSYS",
    employeesCount: 621,
    parkingLocationsCount: 2,
    status: "ACTIVE",
    headquarters: "Hosur Road, Electronics City"
  },
  {
    id: "company-wipro",
    name: "Wipro Technologies",
    code: "WIPRO",
    employeesCount: 514,
    parkingLocationsCount: 1,
    status: "ACTIVE",
    headquarters: "Sarjapur Road Campus"
  },
  {
    id: "company-techm",
    name: "Tech Mahindra",
    code: "TECHM",
    employeesCount: 390,
    parkingLocationsCount: 1,
    status: "ACTIVE",
    headquarters: "Cyber City Campus, Phase 2"
  },
  {
    id: "company-other",
    name: "Global Tech Park SEZ",
    code: "OTHER",
    employeesCount: 210,
    parkingLocationsCount: 1,
    status: "ACTIVE",
    headquarters: "Building Alpha, Tech Corridor"
  }
];

export const adminService = {
  getOverviewMetrics() {
    const total = ALL_PARKING_LOCATIONS.length;
    const publicCount = ALL_PARKING_LOCATIONS.filter(l => l.parkingType === 'PUBLIC').length;
    const privateCount = total - publicCount;
    const totalAvailable = ALL_PARKING_LOCATIONS.reduce((acc, l) => acc + l.availableSpaces, 0);

    return {
      totalLocations: total,
      publicLocations: publicCount,
      privateLocations: privateCount,
      availableSpaces: totalAvailable,
      activeViolations: 17
    };
  },

  getAllLocations() {
    return [...ALL_PARKING_LOCATIONS];
  },

  getLocationById(id) {
    return ALL_PARKING_LOCATIONS.find(l => l.id === id) || null;
  },

  addLocation(locationData) {
    const newId = `loc-${Date.now().toString(36)}`;
    const newLocation = {
      id: newId,
      name: locationData.name,
      parkingType: locationData.parkingType,
      companyId: locationData.parkingType === 'PUBLIC' ? null : locationData.companyId,
      companyName: locationData.parkingType === 'PUBLIC' ? '—' : locationData.companyName,
      address: locationData.address || "Main Urban Hub",
      latitude: parseFloat(locationData.latitude) || 12.9716,
      longitude: parseFloat(locationData.longitude) || 77.5946,
      totalSpaces: parseInt(locationData.totalSpaces, 10) || 50,
      availableSpaces: parseInt(locationData.availableSpaces, 10) || 25,
      pricePerHour: parseInt(locationData.pricePerHour, 10) || 20,
      accessType: locationData.accessType || "COMPANY_EMPLOYEES",
      authorizedUserIds: locationData.authorizedUserIds || [],
      status: locationData.status || "ACTIVE",
      evCharging: locationData.evCharging || false,
      distanceKm: 1.5,
      walkingMinutes: 6
    };

    ALL_PARKING_LOCATIONS.unshift(newLocation);
    window.dispatchEvent(new CustomEvent('smartpark_locations_updated'));
    return newLocation;
  },

  toggleLocationStatus(id) {
    const loc = ALL_PARKING_LOCATIONS.find(l => l.id === id);
    if (loc) {
      loc.status = loc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      window.dispatchEvent(new CustomEvent('smartpark_locations_updated'));
      return loc;
    }
    return null;
  },

  getCompanies() {
    return [...COMPANIES_LIST];
  },

  addCompany(companyData) {
    const newCompany = {
      id: `company-${Date.now().toString(36)}`,
      name: companyData.name,
      code: companyData.code.toUpperCase(),
      employeesCount: parseInt(companyData.employeesCount, 10) || 0,
      parkingLocationsCount: 0,
      status: "ACTIVE",
      headquarters: companyData.headquarters || "Tech Park Center"
    };

    COMPANIES_LIST.push(newCompany);
    window.dispatchEvent(new CustomEvent('smartpark_companies_updated'));
    return newCompany;
  },

  toggleCompanyStatus(id) {
    const comp = COMPANIES_LIST.find(c => c.id === id);
    if (comp) {
      comp.status = comp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      window.dispatchEvent(new CustomEvent('smartpark_companies_updated'));
      return comp;
    }
    return null;
  }
};
