/**
 * SmartPark Centralized Authentication & Authorization Service
 * Manages registered users directory, user sessions, registration validation, and authorization decisions.
 */

// Initial Seed Users in the Persistent Registry
const INITIAL_USERS = [
  {
    id: "usr-tcs-01",
    name: "Avinash Sharma",
    email: "demo@smartpark.com",
    password: "SmartPark@123",
    role: "USER",
    companyId: "company-tcs",
    companyName: "TCS (Tata Consultancy Services)",
    employeeId: "TCS-1024",
    companyVerified: true,
    privateParkingAccess: ["pvt-zone-01", "pvt-zone-06"],
    vehicles: [
      { id: "v-01", plate: "KA-01-MJ-5890", type: "Car / EV", model: "Tata Nexon EV", isPrimary: true }
    ],
    createdAt: "2025-01-15T09:00:00Z"
  },
  {
    id: "usr-inf-02",
    name: "Neha Rao",
    email: "neha@infosys.com",
    password: "SmartPark@123",
    role: "USER",
    companyId: "company-infosys",
    companyName: "Infosys Limited",
    employeeId: "INF-8492",
    companyVerified: true,
    privateParkingAccess: ["pvt-zone-02", "pvt-zone-03"],
    vehicles: [
      { id: "v-02", plate: "KA-51-AB-7711", type: "Car", model: "Hyundai Creta", isPrimary: true }
    ],
    createdAt: "2025-02-10T11:30:00Z"
  },
  {
    id: "usr-pub-03",
    name: "Rahul Mehta",
    email: "rahul@gmail.com",
    password: "SmartPark@123",
    role: "USER",
    companyId: null,
    companyName: null,
    employeeId: null,
    companyVerified: false,
    privateParkingAccess: [],
    vehicles: [
      { id: "v-03", plate: "KA-05-EX-9988", type: "Car", model: "Honda City", isPrimary: true }
    ],
    createdAt: "2025-03-01T14:15:00Z"
  },
  {
    id: "adm-001",
    name: "SmartPark Administrator",
    email: "admin@smartpark.com",
    password: "SmartParkAdmin@123",
    role: "ADMIN",
    companyId: "company-smartpark",
    companyName: "SmartPark Central Admin",
    employeeId: "ADM-9001",
    companyVerified: true,
    privateParkingAccess: ["*"], // Admin wildcard
    vehicles: [
      { id: "v-adm", plate: "KA-01-AD-0001", type: "Car / EV", model: "Tesla Model 3", isPrimary: true }
    ],
    createdAt: "2024-12-01T08:00:00Z"
  }
];

const REGISTRY_STORAGE_KEY = 'smartpark_registered_users';
const SESSION_STORAGE_KEY = 'smartpark_auth_user';

function getRegisteredUsers() {
  const stored = localStorage.getItem(REGISTRY_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing user registry:", e);
    }
  }
  // Initialize with seed users
  localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  return [...INITIAL_USERS];
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  getSeedPresets() {
    return [
      {
        label: "TCS Employee",
        email: "demo@smartpark.com",
        password: "SmartPark@123",
        badge: "TCS Verified",
        badgeClass: "badge-company-tcs"
      },
      {
        label: "Infosys Employee",
        email: "neha@infosys.com",
        password: "SmartPark@123",
        badge: "Infosys Verified",
        badgeClass: "badge-company-infosys"
      },
      {
        label: "Public Citizen",
        email: "rahul@gmail.com",
        password: "SmartPark@123",
        badge: "No Company Access",
        badgeClass: "badge-public"
      },
      {
        label: "System Admin",
        email: "admin@smartpark.com",
        password: "SmartParkAdmin@123",
        badge: "Admin Access",
        badgeClass: "badge-type-restricted"
      }
    ];
  },

  getCurrentUser() {
    const sessionUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionUser) {
      try { return JSON.parse(sessionUser); } catch (e) {}
    }
    const localUser = localStorage.getItem(SESSION_STORAGE_KEY);
    if (localUser) {
      try { return JSON.parse(localUser); } catch (e) {}
    }
    return null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'ADMIN';
  },

  /**
   * Checks if user has any private parking authorization
   */
  hasPrivateParkingAccess(user = null) {
    const targetUser = user || this.getCurrentUser();
    if (!targetUser) return false;
    if (targetUser.role === 'ADMIN') return true;
    if (targetUser.companyVerified && targetUser.companyId) return true;
    if (targetUser.privateParkingAccess && targetUser.privateParkingAccess.length > 0) return true;
    return false;
  },

  /**
   * Central authorization decision for a specific parking facility
   */
  canAccessLocation(location, user = null) {
    const targetUser = user || this.getCurrentUser();
    if (!targetUser) {
      return { allowed: false, reason: "AUTHENTICATION_REQUIRED", message: "Please sign in to view access details." };
    }

    // Public Parking is always accessible
    if (location.parkingType === 'PUBLIC' || location.type === 'PUBLIC') {
      return { allowed: true, reason: "PUBLIC_FACILITY", message: "Open public parking bay." };
    }

    // Admin has universal clearance
    if (targetUser.role === 'ADMIN') {
      return { allowed: true, reason: "ADMIN_OVERRIDE", message: "Master Administrator clearance active." };
    }

    // Explicit User ID Whitelist (Case 4)
    if (location.authorizedUserIds && location.authorizedUserIds.includes(targetUser.id)) {
      return { allowed: true, reason: "EXPLICIT_USER_CLEARANCE", message: "Individual access clearance granted." };
    }

    // Explicit Location ID in user's access list (Case 4 / Section 15)
    if (targetUser.privateParkingAccess && targetUser.privateParkingAccess.includes(location.id)) {
      return { allowed: true, reason: "PERMITTED_LOCATION", message: "Verified facility permit." };
    }

    // Visitor Parking: allows requesting temporary access
    if (location.parkingType === 'VISITOR' || location.type === 'VISITOR') {
      return { allowed: true, reason: "VISITOR_PERMIT_REQUIRED", isVisitor: true, message: "Temporary visitor pass required." };
    }

    // Company-Based Authorization (Case 1)
    if (targetUser.companyVerified && targetUser.companyId && location.companyId) {
      const uComp = targetUser.companyId.toLowerCase().replace('company-', '');
      const lComp = location.companyId.toLowerCase().replace('company-', '');
      if (uComp === lComp || (location.allowedCompanies && location.allowedCompanies.map(c => c.toLowerCase()).includes(uComp))) {
        return { allowed: true, reason: "COMPANY_EMPLOYEE_VERIFIED", message: `Authorized for verified ${targetUser.companyName || 'corporate'} employees.` };
      }
    }

    // Unaffiliated User without company (Case 3)
    if (!targetUser.companyId) {
      return { allowed: false, reason: "NO_COMPANY_AFFILIATION", message: "Restricted corporate facility. You do not have an active company parking permit." };
    }

    // Company Mismatch (Case 2)
    return { allowed: false, reason: "COMPANY_MISMATCH", message: `Restricted to authorized ${location.companyName || 'corporate'} employees only.` };
  },

  login(email, password, rememberMe = true) {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: "No account found with this email address. Please check or create an account." };
    }

    if (user.password !== password) {
      return { success: false, message: "Invalid password. Please check your credentials and try again." };
    }

    // Create session (strip password from session payload)
    const sessionData = { ...user };
    delete sessionData.password;

    if (rememberMe) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }

    window.dispatchEvent(new CustomEvent('smartpark_auth_changed', { detail: { user: sessionData, isAuthenticated: true } }));
    return { success: true, user: sessionData };
  },

  signup(formData) {
    const users = getRegisteredUsers();
    const cleanEmail = formData.email.trim().toLowerCase();

    // Validation 1: Duplicate Email
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, field: "email", message: "An account with this email address already exists. Please login instead." };
    }

    // Validation 2: Required Name
    if (!formData.name || formData.name.trim().length < 2) {
      return { success: false, field: "name", message: "Please enter your full name (minimum 2 characters)." };
    }

    // Validation 3: Password Strength
    if (!formData.password || formData.password.length < 8) {
      return { success: false, field: "password", message: "Password must be at least 8 characters long." };
    }

    // Validation 4: Password Confirmation
    if (formData.password !== formData.confirmPassword) {
      return { success: false, field: "confirmPassword", message: "Passwords do not match." };
    }

    // Validation 5: Vehicle Number
    const cleanPlate = formData.vehiclePlate ? formData.vehiclePlate.trim().toUpperCase() : "KA-01-AB-1001";

    const newUserId = `usr-${Date.now().toString(36)}`;
    const hasCompany = formData.companyId && formData.companyId !== 'none';

    // Map company details
    let companyName = null;
    let privateAccess = [];
    if (hasCompany) {
      if (formData.companyId === 'company-tcs') {
        companyName = "TCS (Tata Consultancy Services)";
        privateAccess = ["pvt-zone-01", "pvt-zone-06"];
      } else if (formData.companyId === 'company-infosys') {
        companyName = "Infosys Limited";
        privateAccess = ["pvt-zone-02", "pvt-zone-03"];
      } else if (formData.companyId === 'company-wipro') {
        companyName = "Wipro Technologies";
        privateAccess = ["pvt-zone-04"];
      } else if (formData.companyId === 'company-techm') {
        companyName = "Tech Mahindra";
        privateAccess = ["pvt-zone-05"];
      } else {
        companyName = formData.companyName || "Corporate Partner";
        privateAccess = ["pvt-zone-07"];
      }
    }

    const newUser = {
      id: newUserId,
      name: formData.name.trim(),
      email: cleanEmail,
      password: formData.password,
      role: "USER",
      companyId: hasCompany ? formData.companyId : null,
      companyName: companyName,
      employeeId: hasCompany ? (formData.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`) : null,
      companyVerified: hasCompany,
      privateParkingAccess: privateAccess,
      vehicles: [
        {
          id: `veh-${Date.now()}`,
          plate: cleanPlate,
          type: formData.vehicleType || "Car",
          model: formData.vehicleModel || `${formData.vehicleType || 'Vehicle'} (Standard)`,
          isPrimary: true
        }
      ],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    // Auto-login newly registered user
    const sessionData = { ...newUser };
    delete sessionData.password;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    window.dispatchEvent(new CustomEvent('smartpark_auth_changed', { detail: { user: sessionData, isAuthenticated: true } }));

    return { success: true, user: sessionData };
  },

  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('smartpark_auth_changed', { detail: { user: null, isAuthenticated: false } }));
  }
};
