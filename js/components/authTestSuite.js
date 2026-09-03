/**
 * SmartPark Automated Authentication & Access Control Test Suite
 * Programmatically validates all requirements and scenarios.
 */

import { authService } from '../data/authService.js';
import { adminService } from '../data/adminService.js';

export function runAuthTestSuite() {
  const results = [];

  function assert(testName, passed, details = '') {
    results.push({ name: testName, passed, details });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testName} ${details ? '(' + details + ')' : ''}`);
  }

  // Backup original storage to restore after test
  const originalRegistry = localStorage.getItem('smartpark_registered_users');
  const originalSession = localStorage.getItem('smartpark_auth_user');

  try {
    // TEST 1: Valid Login (TCS Account)
    const loginValid = authService.login("demo@smartpark.com", "SmartPark@123");
    assert("1. Valid Account Login", loginValid.success === true && loginValid.user.email === "demo@smartpark.com", `User: ${loginValid.user?.name}`);

    // TEST 2: Invalid Email Login
    const loginBadEmail = authService.login("nonexistent.user@random.com", "SmartPark@123");
    assert("2. Non-Existent Email Rejection", loginBadEmail.success === false, loginBadEmail.message);

    // TEST 3: Wrong Password Login
    const loginBadPass = authService.login("demo@smartpark.com", "WrongPassword123!");
    assert("3. Wrong Password Rejection", loginBadPass.success === false, loginBadPass.message);

    // TEST 4: Valid Registration (Signup)
    const testNewEmail = `test.pilot.${Date.now()}@domain.com`;
    const signupValid = authService.signup({
      name: "Pilot Tester",
      email: testNewEmail,
      password: "StrongPassword123",
      confirmPassword: "StrongPassword123",
      vehiclePlate: "KA-01-TE-7788",
      vehicleType: "Car",
      companyId: "none"
    });
    assert("4. New Account Registration", signupValid.success === true && signupValid.user.email === testNewEmail, `Registered ID: ${signupValid.user?.id}`);

    // TEST 5: Duplicate Email Signup Rejection
    const signupDuplicate = authService.signup({
      name: "Duplicate Tester",
      email: "demo@smartpark.com",
      password: "StrongPassword123",
      confirmPassword: "StrongPassword123",
      vehiclePlate: "KA-01-TE-9999",
      companyId: "none"
    });
    assert("5. Duplicate Email Signup Rejection", signupDuplicate.success === false, signupDuplicate.message);

    // TEST 6: Password Mismatch Signup Rejection
    const signupMismatch = authService.signup({
      name: "Mismatch Tester",
      email: `mismatch.${Date.now()}@domain.com`,
      password: "Password123",
      confirmPassword: "DifferentPassword456",
      vehiclePlate: "KA-01-TE-1111",
      companyId: "none"
    });
    assert("6. Password Mismatch Rejection", signupMismatch.success === false, signupMismatch.message);

    // TEST 7: Authorization Matrix - TCS Employee Access
    const tcsUser = authService.login("demo@smartpark.com", "SmartPark@123").user;
    const tcsZone = { id: "pvt-zone-01", companyId: "company-tcs", companyName: "TCS", parkingType: "EMPLOYEE", allowedCompanies: ["TCS"] };
    const infosysZone = { id: "pvt-zone-02", companyId: "company-infosys", companyName: "Infosys", parkingType: "EMPLOYEE", allowedCompanies: ["INFOSYS"] };

    const tcsCheck1 = authService.canAccessLocation(tcsZone, tcsUser);
    assert("7a. TCS User -> TCS Corporate Zone", tcsCheck1.allowed === true, tcsCheck1.message);

    const tcsCheck2 = authService.canAccessLocation(infosysZone, tcsUser);
    assert("7b. TCS User -> Infosys Corporate Zone (Denied)", tcsCheck2.allowed === false, tcsCheck2.message);

    // TEST 8: Authorization Matrix - Public Citizen Access
    const publicUser = authService.login("rahul@gmail.com", "SmartPark@123").user;
    const pubCheckHasAccess = authService.hasPrivateParkingAccess(publicUser);
    assert("8a. Public User hasPrivateParkingAccess = false", pubCheckHasAccess === false, "Public users have no corporate access");

    const pubCheckZone = authService.canAccessLocation(tcsZone, publicUser);
    assert("8b. Public User -> TCS Corporate Zone (Denied)", pubCheckZone.allowed === false, pubCheckZone.message);

    // TEST 9: Authorization Matrix - Admin Universal Clearance
    const adminUser = authService.login("admin@smartpark.com", "SmartParkAdmin@123").user;
    const adminCheckTcs = authService.canAccessLocation(tcsZone, adminUser);
    const adminCheckInf = authService.canAccessLocation(infosysZone, adminUser);
    assert("9. Admin Universal Parking Clearance", adminCheckTcs.allowed === true && adminCheckInf.allowed === true, "Admin cleared for all decks");

    // TEST 10: Role Guard - Admin vs User
    assert("10a. Admin Role Check", authService.isAdmin() === true, "admin@smartpark.com is ADMIN");
    authService.login("demo@smartpark.com", "SmartPark@123");
    assert("10b. Normal User Role Check", authService.isAdmin() === false, "demo@smartpark.com is USER");

    // TEST 11: Logout Clearance
    authService.logout();
    assert("11. Logout Session Clearance", authService.isAuthenticated() === false, "Session properly destroyed");

  } finally {
    // Restore original storage
    if (originalRegistry) localStorage.setItem('smartpark_registered_users', originalRegistry);
    if (originalSession) localStorage.setItem('smartpark_auth_user', originalSession);
    else authService.login("demo@smartpark.com", "SmartPark@123");
  }

  const allPassed = results.every(r => r.passed);
  return { allPassed, results };
}
