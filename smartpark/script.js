/* ============================================================
   SMARTPARK ΓÇö script.js
   Smart Parking Management & Prediction System
   Vanilla JavaScript ΓÇö No frameworks
   ============================================================ */

'use strict';

/* ============================================================
   1. MOCK DATA LAYER
   Structured for easy API replacement later.
   ============================================================ */

const DEFAULT_DATA = {

  users: [
    {
      id: 'u1',
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex@smartpark.demo',
      password: 'demo1234',
      phone: '+91 98765 43210',
      role: 'user',
      joined: '2026-01-15',
      status: 'active',
      vehicles: ['v1','v2'],
      reservations: ['r1']
    },
    {
      id: 'u2',
      firstName: 'Admin',
      lastName: 'SmartPark',
      email: 'admin@smartpark.demo',
      password: 'admin1234',
      phone: '+91 99900 00001',
      role: 'admin',
      joined: '2025-08-01',
      status: 'active',
      vehicles: [],
      reservations: []
    },
    {
      id: 'u3',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya@example.com',
      password: 'pass1234',
      phone: '+91 87654 32109',
      role: 'user',
      joined: '2026-03-20',
      status: 'active',
      vehicles: ['v3'],
      reservations: ['r2']
    },
    {
      id: 'u4',
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul@example.com',
      password: 'pass1234',
      phone: '+91 76543 21098',
      role: 'user',
      joined: '2026-05-10',
      status: 'inactive',
      vehicles: [],
      reservations: []
    }
  ],

  parkingZones: [
    {
      id: 'A',
      name: 'Zone A',
      capacity: 200,
      occupied: 184,
      available: 16,
      location: 'North Entrance',
      distance: 450,
      walkTime: 6,
      price: 30,
      evCharging: false,
      accessible: true,
      covered: false,
      status: 'active',
      openHours: '24/7',
      security: 'CCTV + Guard',
      lat: 17.385, lng: 78.486
    },
    {
      id: 'B',
      name: 'Zone B',
      capacity: 250,
      occupied: 168,
      available: 82,
      location: 'East Wing',
      distance: 320,
      walkTime: 4,
      price: 25,
      evCharging: true,
      accessible: true,
      covered: true,
      status: 'active',
      openHours: '06:00 - 22:00',
      security: 'CCTV',
      lat: 17.387, lng: 78.488
    },
    {
      id: 'C',
      name: 'Zone C',
      capacity: 110,
      occupied: 38,
      available: 72,
      location: 'South Block',
      distance: 240,
      walkTime: 3,
      price: 20,
      evCharging: true,
      accessible: true,
      covered: true,
      status: 'active',
      openHours: '24/7',
      security: 'CCTV + Guard',
      lat: 17.383, lng: 78.485
    },
    {
      id: 'D',
      name: 'Zone D',
      capacity: 180,
      occupied: 146,
      available: 34,
      location: 'West Gate',
      distance: 580,
      walkTime: 8,
      price: 15,
      evCharging: false,
      accessible: false,
      covered: false,
      status: 'active',
      openHours: '07:00 - 21:00',
      security: 'CCTV',
      lat: 17.384, lng: 78.482
    },
    {
      id: 'E',
      name: 'Zone E',
      capacity: 110,
      occupied: 110,
      available: 0,
      location: 'Central Plaza',
      distance: 150,
      walkTime: 2,
      price: 40,
      evCharging: true,
      accessible: true,
      covered: true,
      status: 'full',
      openHours: '24/7',
      security: 'CCTV + Guard + Barrier',
      lat: 17.386, lng: 78.486
    }
  ],

  vehicles: [
    { id: 'v1', userId: 'u1', plate: 'AP 39 XX 1234', make: 'Toyota', model: 'Camry', type: 'car', color: 'White', ev: false, primary: true },
    { id: 'v2', userId: 'u1', plate: 'AP 39 YY 5678', make: 'Honda', model: 'CB Shine', type: 'bike', color: 'Black', ev: false, primary: false },
    { id: 'v3', userId: 'u3', plate: 'TS 09 AB 9999', make: 'Tata', model: 'Nexon EV', type: 'ev', color: 'Blue', ev: true, primary: true }
  ],

  reservations: [
    {
      id: 'r1',
      resId: 'SP-2026-00421',
      userId: 'u1',
      zoneId: 'C',
      slot: 'C-42',
      vehicle: 'AP 39 XX 1234',
      entryTime: '10:30',
      exitTime: '12:30',
      date: '2026-09-03',
      status: 'active',
      createdAt: '2026-09-03T09:00:00'
    },
    {
      id: 'r2',
      resId: 'SP-2026-00388',
      userId: 'u3',
      zoneId: 'B',
      slot: 'B-17',
      vehicle: 'TS 09 AB 9999',
      entryTime: '09:00',
      exitTime: '11:00',
      date: '2026-09-02',
      status: 'completed',
      createdAt: '2026-09-02T08:30:00'
    },
    {
      id: 'r3',
      resId: 'SP-2026-00310',
      userId: 'u1',
      zoneId: 'A',
      slot: 'A-05',
      vehicle: 'AP 39 XX 1234',
      entryTime: '10:00',
      exitTime: '13:00',
      date: '2026-08-28',
      status: 'completed',
      createdAt: '2026-08-28T09:45:00'
    },
    {
      id: 'r4',
      resId: 'SP-2026-00290',
      userId: 'u1',
      zoneId: 'B',
      slot: 'B-22',
      vehicle: 'AP 39 XX 1234',
      entryTime: '09:42',
      exitTime: '11:36',
      date: '2026-09-02',
      status: 'completed',
      createdAt: '2026-09-02T09:20:00'
    }
  ],

  notifications: [
    { id: 'n1', userId: 'u1', type: 'availability', icon: 'ΓÜá', iconType: 'warning', title: 'Zone A is almost full', body: 'Zone A has only 16 spaces remaining (92% occupied). Consider alternative zones.', time: '5 minutes ago', read: false },
    { id: 'n2', userId: 'u1', type: 'reservation', icon: 'Γ£ô', iconType: 'success', title: 'Reservation confirmed', body: 'Your parking reservation at Zone C, Slot C-42 is confirmed for 10:30 AM today.', time: '20 minutes ago', read: false },
    { id: 'n3', userId: 'u1', type: 'expiry', icon: '≡ƒà┐', iconType: 'info', title: 'Parking expires in 15 minutes', body: 'Your parking at Zone C, Slot C-42 expires at 12:30 PM. Please return to your vehicle.', time: '2 hours ago', read: true },
    { id: 'n4', userId: 'u1', type: 'prediction', icon: '≡ƒñû', iconType: 'info', title: 'Occupancy forecast update', body: 'Zone A predicted to reach 96% occupancy by 11:00 AM based on historical patterns.', time: '3 hours ago', read: true },
    { id: 'n5', userId: 'u1', type: 'system', icon: '≡ƒöö', iconType: 'info', title: 'Welcome to SmartPark!', body: 'Your account is set up. Start by adding your vehicle and finding a parking spot.', time: '2 days ago', read: true }
  ],

  violations: [
    { id: 'viol1', vehicle: 'AP39XX1234', userId: 'u1', zone: 'A', slot: 'A-12', type: 'Wrong Slot', time: '09:15 AM', date: '2026-09-03', status: 'open', note: '' },
    { id: 'viol2', vehicle: 'AP39YY5678', userId: 'u1', zone: 'B', slot: 'B-07', type: 'Expired Reservation', time: '11:42 AM', date: '2026-09-02', status: 'resolved', note: 'Vehicle moved after notice' },
    { id: 'viol3', vehicle: 'TS09AB9999', userId: 'u3', zone: 'C', slot: 'C-33', type: 'No EV Charging', time: '02:30 PM', date: '2026-09-01', status: 'open', note: '' },
    { id: 'viol4', vehicle: 'MH12AB3456', userId: null, zone: 'D', slot: 'D-18', type: 'Unauthorized', time: '08:00 AM', date: '2026-08-30', status: 'resolved', note: 'Towed' }
  ],

  sensorAlerts: [
    { id: 'sa1', severity: 'critical', title: 'Zone A occupancy above 95%', body: 'Immediate action required. Zone A has exceeded 95% capacity threshold.', time: '2 min ago', acknowledged: false },
    { id: 'sa2', severity: 'warning', title: 'Sensor A-23 offline', body: 'Sensor A-23 in Zone A has not reported data in the last 10 minutes.', time: '15 min ago', acknowledged: false },
    { id: 'sa3', severity: 'info', title: 'Zone C maintenance scheduled', body: 'Zone C Block 3 will be closed for maintenance on September 5, 2026 from 2ΓÇô5 PM.', time: '1 hour ago', acknowledged: true },
    { id: 'sa4', severity: 'warning', title: 'Zone D low availability warning', body: 'Zone D availability dropped below 20%. Consider opening overflow parking.', time: '2 hours ago', acknowledged: false }
  ],

  parkingHistory: [
    { zone: 'C', slot: 'C-42', entryTime: '10:21 AM', exitTime: '12:14 PM', date: 'Today', dateKey: '2026-09-03', duration: '1h 53m', cost: 38, status: 'completed' },
    { zone: 'B', slot: 'B-22', entryTime: '09:42 AM', exitTime: '11:36 AM', date: 'Yesterday', dateKey: '2026-09-02', duration: '1h 54m', cost: 48, status: 'completed' },
    { zone: 'A', slot: 'A-05', entryTime: '10:02 AM', exitTime: '01:12 PM', date: 'Aug 28', dateKey: '2026-08-28', duration: '3h 10m', cost: 95, status: 'completed' },
    { zone: 'C', slot: 'C-18', entryTime: '02:15 PM', exitTime: '04:00 PM', date: 'Aug 25', dateKey: '2026-08-25', duration: '1h 45m', cost: 35, status: 'completed' },
    { zone: 'B', slot: 'B-07', entryTime: '08:30 AM', exitTime: '10:30 AM', date: 'Aug 22', dateKey: '2026-08-22', duration: '2h', cost: 50, status: 'completed' }
  ],

  predictionData: {
    A: {
      current: 92,
      points: [72, 81, 91, 96, 94, 88, 80],
      labels: ['Now', '30m', '1h', '1.5h', '2h', '2.5h', '3h'],
      peakTime: '10:30 AM',
      peakOcc: '96%',
      confidence: '87%',
      alert: 'ΓÜá Zone A is likely to become full within 90 minutes.'
    },
    B: {
      current: 67,
      points: [67, 72, 78, 80, 74, 66, 58],
      labels: ['Now', '30m', '1h', '1.5h', '2h', '2.5h', '3h'],
      peakTime: '11:00 AM',
      peakOcc: '80%',
      confidence: '82%',
      alert: '≡ƒƒí Zone B will reach moderate-high occupancy.'
    },
    C: {
      current: 35,
      points: [35, 52, 68, 74, 70, 60, 48],
      labels: ['Now', '30m', '1h', '1.5h', '2h', '2.5h', '3h'],
      peakTime: '11:30 AM',
      peakOcc: '74%',
      confidence: '91%',
      alert: '≡ƒƒó Zone C is expected to remain manageable through the day.'
    },
    D: {
      current: 81,
      points: [81, 85, 89, 92, 88, 82, 76],
      labels: ['Now', '30m', '1h', '1.5h', '2h', '2.5h', '3h'],
      peakTime: '11:15 AM',
      peakOcc: '92%',
      confidence: '79%',
      alert: 'ΓÜá Zone D approaching high occupancy ΓÇö consider Zone C as alternative.'
    },
    E: {
      current: 100,
      points: [100, 100, 100, 98, 95, 88, 80],
      labels: ['Now', '30m', '1h', '1.5h', '2h', '2.5h', '3h'],
      peakTime: 'Now',
      peakOcc: '100%',
      confidence: '99%',
      alert: '≡ƒö┤ Zone E is FULL. Vehicles diverted to Zone C.'
    }
  }
};

/* ============================================================
   2. APP STATE
   ============================================================ */
const AppState = {
  currentUser: null,
  currentView: 'user-dashboard',
  currentNavMode: 'user',   // 'user' | 'admin'
  theme: 'light',
  data: null,               // Loaded from localStorage or defaults
  liveUpdateInterval: null,
  resStep: 1,
  resData: {},              // In-progress reservation
  autoRefresh: true,
  charts: {}                // Active Chart instances (canvas refs)
};

/* ============================================================
   3. LOCAL STORAGE HELPERS
   ============================================================ */
const LS_KEY = 'smartpark_data';
const LS_USER_KEY = 'smartpark_session';

function saveData() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(AppState.data)); } catch(e) {}
}

function loadData() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep clone
}

function saveSession(user) {
  try { localStorage.setItem(LS_USER_KEY, JSON.stringify({ id: user.id, role: user.role })); } catch(e) {}
}

function loadSession() {
  try {
    const s = localStorage.getItem(LS_USER_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}

function clearSession() {
  try { localStorage.removeItem(LS_USER_KEY); } catch(e) {}
}

/* ============================================================
   4. SERVICE FUNCTIONS (API-ready stubs)
   Replace the body of each function with real API calls.
   ============================================================ */

/** @returns {Promise<Array>} */
async function fetchParkingZones() {
  return AppState.data.parkingZones;
}

/** @returns {Promise<Array>} available slots for a zone */
async function getAvailableSlots(zoneId) {
  const zone = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone) return [];
  const slots = [];
  const letters = ['A','B','C','D','E'];
  const prefix = zoneId;
  let occupied = zone.occupied;
  for (let i = 1; i <= zone.capacity; i++) {
    const status = occupied > 0
      ? (Math.random() < (zone.occupied / zone.capacity) ? 'occupied' : 'available')
      : 'available';
    if (status === 'occupied') occupied--;
    slots.push({ id: `${prefix}-${String(i).padStart(2,'0')}`, status });
  }
  return slots;
}

/** @returns {Promise<Object>} */
async function createReservation(data) {
  const id = 'r' + Date.now();
  const resId = 'SP-' + new Date().getFullYear() + '-' + String(AppState.data.reservations.length + 400).padStart(5,'0');
  const reservation = { id, resId, ...data, status: 'active', createdAt: new Date().toISOString() };
  AppState.data.reservations.push(reservation);
  // Update zone availability
  const zone = AppState.data.parkingZones.find(z => z.id === data.zoneId);
  if (zone && zone.available > 0) { zone.occupied++; zone.available--; }
  // Update user reservations list
  const user = AppState.data.users.find(u => u.id === data.userId);
  if (user) user.reservations.push(id);
  saveData();
  return reservation;
}

/** @returns {Promise<boolean>} */
async function cancelReservation(reservationId) {
  const res = AppState.data.reservations.find(r => r.id === reservationId);
  if (!res) return false;
  res.status = 'cancelled';
  const zone = AppState.data.parkingZones.find(z => z.id === res.zoneId);
  if (zone) { zone.occupied = Math.max(0, zone.occupied - 1); zone.available++; }
  saveData();
  return true;
}

/** @returns {Promise<Object>} prediction for zone */
async function fetchPredictions(zoneId) {
  return AppState.data.predictionData[zoneId] || AppState.data.predictionData['A'];
}

/** @returns {Promise<Array>} all notifications for current user */
async function fetchNotifications(userId) {
  return AppState.data.notifications.filter(n => n.userId === userId);
}

/** Simulates a sensor entry event */
function simulateSensorEntry(zoneId) {
  const zone = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone || zone.available <= 0) return false;
  zone.occupied = Math.min(zone.capacity, zone.occupied + 1);
  zone.available = Math.max(0, zone.available - 1);
  zone.status = zone.available === 0 ? 'full' : 'active';
  saveData();
  updateLiveDashboardMetrics();
  return true;
}

/** Simulates a sensor exit event */
function simulateSensorExit(zoneId) {
  const zone = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone || zone.occupied <= 0) return false;
  zone.occupied = Math.max(0, zone.occupied - 1);
  zone.available = Math.min(zone.capacity, zone.available + 1);
  zone.status = 'active';
  saveData();
  updateLiveDashboardMetrics();
  return true;
}

/** Updates occupancy randomly (simulates live data) */
function updateOccupancy() {
  AppState.data.parkingZones.forEach(zone => {
    const delta = Math.floor(Math.random() * 5) - 2;
    zone.occupied = Math.max(0, Math.min(zone.capacity, zone.occupied + delta));
    zone.available = zone.capacity - zone.occupied;
    if (zone.available === 0) zone.status = 'full';
    else if (zone.status === 'full') zone.status = 'active';
  });
  saveData();
  updateLiveDashboardMetrics();
}

/** Adds a notification for the current user */
function addNotification(notif) {
  if (!AppState.currentUser) return;
  const n = {
    id: 'n' + Date.now(),
    userId: AppState.currentUser.id,
    ...notif,
    time: 'Just now',
    read: false
  };
  AppState.data.notifications.unshift(n);
  saveData();
  updateNotifBadge();
  // Show toast
  showToast(notif.title, notif.body || '', notif.iconType || 'info');
}

/* ============================================================
   5. UTILITY HELPERS
   ============================================================ */
function getOccupancyPct(zone) {
  return zone.capacity > 0 ? Math.round((zone.occupied / zone.capacity) * 100) : 0;
}

function getOccupancyStatus(pct) {
  if (pct >= 95) return 'full';
  if (pct >= 80) return 'high';
  if (pct >= 50) return 'moderate';
  return 'available';
}

function getOccupancyStatusLabel(pct) {
  const s = getOccupancyStatus(pct);
  const map = { full: '≡ƒö┤ Nearly Full', high: '≡ƒƒá High', moderate: '≡ƒƒí Moderate', available: '≡ƒƒó Available' };
  return map[s];
}

function getOccupancyEmoji(pct) {
  if (pct >= 95) return '≡ƒö┤';
  if (pct >= 80) return '≡ƒƒá';
  if (pct >= 50) return '≡ƒƒí';
  return '≡ƒƒó';
}

function getOccupancyFillClass(pct) {
  if (pct >= 95) return 'fill-full';
  if (pct >= 80) return 'fill-high';
  if (pct >= 50) return 'fill-moderate';
  return 'fill-available';
}

function getStatusBadgeClass(status) {
  const map = {
    active: 'badge-active', pending: 'badge-pending', cancelled: 'badge-cancelled',
    completed: 'badge-completed', open: 'badge-open', resolved: 'badge-resolved',
    full: 'badge-full', available: 'badge-available', moderate: 'badge-moderate',
    high: 'badge-high', inactive: 'badge-cancelled'
  };
  return 'status-badge ' + (map[status] || 'badge-active');
}

function getStatusLabel(status) {
  const map = {
    active: 'Γ£ô Active', pending: 'ΓÅ│ Pending', cancelled: 'Γ£ò Cancelled',
    completed: 'Γ£ô Completed', open: 'ΓÜá Open', resolved: 'Γ£ô Resolved',
    full: '≡ƒö┤ Full', available: '≡ƒƒó Available', moderate: '≡ƒƒí Moderate',
    high: '≡ƒƒá High', inactive: 'Γ£ò Inactive'
  };
  return map[status] || status;
}

function getVehicleIcon(type) {
  const map = { car: '≡ƒÜù', bike: '≡ƒÅì', ev: 'ΓÜí', truck: '≡ƒÜ¢' };
  return map[type] || '≡ƒÜù';
}

function formatDistance(meters) {
  return meters >= 1000 ? (meters / 1000).toFixed(1) + 'km' : meters + 'm';
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: 'ΓÿÇ' };
  if (h < 17) return { text: 'Good afternoon', emoji: '≡ƒîñ' };
  return { text: 'Good evening', emoji: '≡ƒîÖ' };
}

function calcRecommendationScore(zone) {
  const pct = getOccupancyPct(zone);
  const availability = (1 - pct / 100) * 50;
  const distancePts = Math.max(0, 30 - (zone.distance / 20));
  const extras = (zone.evCharging ? 5 : 0) + (zone.accessible ? 3 : 0) + (zone.covered ? 5 : 0);
  return Math.min(100, Math.round(availability + distancePts + extras));
}

/** Simple HTML escape */
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   6. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(title, body = '', type = 'info') {
  const container = document.getElementById('toast-container');
  const iconMap = { info: 'Γä╣', success: 'Γ£ô', warning: 'ΓÜá', danger: 'Γ£ò' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || 'Γä╣'}</div>
    <div class="toast-content">
      <div class="toast-title">${escHtml(title)}</div>
      ${body ? `<div class="toast-body">${escHtml(body)}</div>` : ''}
    </div>
  `;
  container.appendChild(toast);
  // Animate in
  requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
  }, 4500);
}

/* ============================================================
   7. MODAL SYSTEM
   ============================================================ */
function openModal(title, bodyHTML, footerHTML = '', options = {}) {
  const overlay = document.getElementById('modal-overlay');
  const box     = document.getElementById('modal-box');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  const footer = document.getElementById('modal-footer');
  if (footerHTML) {
    footer.innerHTML = footerHTML;
    footer.style.display = 'flex';
  } else {
    footer.style.display = 'none';
  }
  // Size
  box.className = 'modal' + (options.size ? ' modal-' + options.size : '');
  overlay.classList.add('open');
  // Focus first focusable element
  setTimeout(() => {
    const first = box.querySelector('input, select, button:not(#modal-close-btn), textarea');
    if (first) first.focus();
  }, 100);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('modal-close-btn').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// Keyboard: Escape closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   8. ROUTING / VIEW NAVIGATION
   ============================================================ */
function navigateTo(viewId) {
  // Deactivate all views
  document.querySelectorAll('#page-content .view').forEach(v => v.classList.remove('active'));
  // Activate target view
  const target = document.getElementById('view-' + viewId);
  if (!target) { console.warn('View not found:', viewId); return; }
  target.classList.add('active');
  AppState.currentView = viewId;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  // Update header title
  const titles = {
    'user-dashboard': '≡ƒÅá Dashboard',
    'find-parking': '≡ƒöì Find Parking',
    'live-map': '≡ƒù║ Live Map',
    'reservations': '≡ƒôà Reservations',
    'vehicles': '≡ƒÜù Vehicles',
    'parking-history': '≡ƒôï Parking History',
    'notifications': '≡ƒöö Notifications',
    'profile': '≡ƒæñ Profile',
    'admin-dashboard': '≡ƒôè Admin Dashboard',
    'admin-zones': '≡ƒà┐ Parking Zones',
    'admin-occupancy': '≡ƒôí Live Occupancy',
    'admin-reservations': '≡ƒôà All Reservations',
    'admin-users': '≡ƒæÑ Users',
    'admin-violations': 'ΓÜá Violations',
    'admin-alerts': '≡ƒöö Alerts',
    'admin-analytics': '≡ƒôê Analytics',
    'admin-predictions': '≡ƒñû Predictions',
    'admin-sensor': '≡ƒ¢░ Sensor Simulator',
    'admin-settings': 'ΓÜÖ Settings'
  };
  document.getElementById('header-title').textContent = titles[viewId] || 'SmartPark';

  // Auto-switch nav mode based on view
  if (viewId.startsWith('admin-')) {
    if (AppState.currentNavMode !== 'admin') switchNavMode('admin', false);
  } else {
    if (AppState.currentNavMode !== 'user') switchNavMode('user', false);
  }

  // Render view content
  renderView(viewId);

  // Close mobile sidebar
  closeMobileSidebar();
}

function renderView(viewId) {
  switch (viewId) {
    case 'user-dashboard':     renderUserDashboard(); break;
    case 'find-parking':       renderFindParking(); break;
    case 'live-map':           renderLiveMap(); break;
    case 'reservations':       renderReservations(); break;
    case 'vehicles':           renderVehicles(); break;
    case 'parking-history':    renderParkingHistory(); break;
    case 'notifications':      renderNotifications(); break;
    case 'profile':            renderProfile(); break;
    case 'admin-dashboard':    renderAdminDashboard(); break;
    case 'admin-zones':        renderAdminZones(); break;
    case 'admin-occupancy':    renderAdminOccupancy(); break;
    case 'admin-reservations': renderAdminReservations(); break;
    case 'admin-users':        renderAdminUsers(); break;
    case 'admin-violations':   renderAdminViolations(); break;
    case 'admin-alerts':       renderAdminAlerts(); break;
    case 'admin-analytics':    renderAdminAnalytics(); break;
    case 'admin-predictions':  renderAdminPredictions(); break;
    case 'admin-sensor':       renderAdminSensor(); break;
    case 'admin-settings':     renderAdminSettings(); break;
  }
}

/* ============================================================
   9. SIDEBAR & MOBILE NAVIGATION
   ============================================================ */
function switchNavMode(mode, navigate = true) {
  AppState.currentNavMode = mode;
  document.getElementById('user-nav').style.display   = mode === 'user'  ? 'block' : 'none';
  document.getElementById('admin-nav').style.display  = mode === 'admin' ? 'block' : 'none';
  document.getElementById('user-view-btn').classList.toggle('active', mode === 'user');
  document.getElementById('admin-view-btn').classList.toggle('active', mode === 'admin');
  document.getElementById('user-view-btn').setAttribute('aria-pressed', mode === 'user');
  document.getElementById('admin-view-btn').setAttribute('aria-pressed', mode === 'admin');
  if (navigate) {
    if (mode === 'admin') navigateTo('admin-dashboard');
    else navigateTo('user-dashboard');
  }
}

function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'true');
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'false');
}

/* ============================================================
   10. AUTHENTICATION
   ============================================================ */
function showView(id) {
  document.querySelectorAll('#landing-page, #login-page, #register-page, #app-shell').forEach(el => {
    el.style.display = 'none';
    el.classList.remove('active');
  });
  const el = document.getElementById(id);
  if (el) { el.style.display = ''; el.classList.add('active'); }
}

function loginUser(email, password) {
  const user = AppState.data.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  AppState.currentUser = user;
  saveSession(user);
  return user;
}

function logoutUser() {
  AppState.currentUser = null;
  clearSession();
  // Stop live updates
  if (AppState.liveUpdateInterval) clearInterval(AppState.liveUpdateInterval);
  showView('landing-page');
  showToast('Logged out', 'You have been logged out successfully.', 'info');
}

function enterApp(user) {
  // Populate header avatar
  document.getElementById('avatar-btn').textContent = user.firstName[0].toUpperCase();
  document.getElementById('avatar-btn').setAttribute('aria-label', user.firstName + ' ' + user.lastName + ' ΓÇö menu');
  // If admin, switch to admin mode
  if (user.role === 'admin') switchNavMode('admin', false);
  else switchNavMode('user', false);

  showView('app-shell');
  document.getElementById('app-shell').style.display = 'flex';

  navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
  updateNotifBadge();
  startLiveUpdates();
}

function startLiveUpdates() {
  if (AppState.liveUpdateInterval) clearInterval(AppState.liveUpdateInterval);
  AppState.liveUpdateInterval = setInterval(() => {
    if (!AppState.autoRefresh) return;
    updateOccupancy();
    // Re-render live views
    if (AppState.currentView === 'user-dashboard') renderUserDashboard();
    if (AppState.currentView === 'admin-occupancy') renderAdminOccupancy();
    if (AppState.currentView === 'admin-dashboard') renderAdminDashboard();
    // Update last-updated time
    const el = document.getElementById('occ-last-updated');
    if (el) el.textContent = 'Last updated: Just now';
  }, 8000);
}

/* ============================================================
   11. UPDATE SHARED METRICS
   ============================================================ */
function updateLiveDashboardMetrics() {
  const total = AppState.data.parkingZones.reduce((s, z) => s + z.occupied, 0);
  const avail = AppState.data.parkingZones.reduce((s, z) => s + z.available, 0);
  safeSet('dash-available', avail);
  safeSet('dash-occupied', total);
  safeSet('admin-occupied', total);
  safeSet('admin-available', avail);

  // Live zone list re-render if visible
  if (AppState.currentView === 'user-dashboard') {
    renderZoneList('dashboard-zone-list');
  }
  if (AppState.currentView === 'admin-occupancy') {
    renderLiveOccBars();
  }
}

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateNotifBadge() {
  if (!AppState.currentUser) return;
  const unread = AppState.data.notifications.filter(
    n => n.userId === AppState.currentUser.id && !n.read
  ).length;
  const badge = document.getElementById('notif-badge');
  const dot   = document.getElementById('header-notif-dot');
  if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'flex' : 'none'; }
  if (dot)   { dot.style.display = unread > 0 ? 'block' : 'none'; }
  safeSet('dash-alerts', unread);
}

/* ============================================================
   12. HERO GRID ANIMATION
   ============================================================ */
function initHeroGrid() {
  const grid = document.getElementById('hero-grid');
  if (!grid) return;
  const statuses = ['av','av','av','mo','fu','av','av','hi','av','mo','av','av','fu','av','av','mo','av','av','hi','av'];
  const labels = ['A01','A02','A03','A04','A05','B01','B02','B03','B04','B05','C01','C02','C03','C04','C05','D01','D02','D03','D04','D05'];
  grid.innerHTML = labels.map((l, i) =>
    `<div class="slot-visual ${statuses[i]}">${l}</div>`
  ).join('');
  // Animate some slots
  setInterval(() => {
    const slots = grid.querySelectorAll('.slot-visual');
    const idx = Math.floor(Math.random() * slots.length);
    const allStatus = ['av','av','av','mo','fu','hi'];
    slots[idx].className = 'slot-visual ' + allStatus[Math.floor(Math.random() * allStatus.length)];
  }, 1200);
}

/** Animate number counters on landing page */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || (target >= 100 ? '+' : '%'));
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

/* ============================================================
   13. RENDER: USER DASHBOARD
   ============================================================ */
function renderUserDashboard() {
  const g = getGreeting();
  safeSet('greeting-text', g.text);
  safeSet('greeting-name', AppState.currentUser ? AppState.currentUser.firstName : 'User');
  const emoji = document.getElementById('greeting-emoji');
  if (emoji) emoji.textContent = g.emoji + ' ';

  updateLiveDashboardMetrics();
  renderZoneList('dashboard-zone-list');
  renderRecentActivity();

  // Reservation count for current user
  if (AppState.currentUser) {
    const myRes = AppState.data.reservations.filter(
      r => r.userId === AppState.currentUser.id && r.status === 'active'
    ).length;
    safeSet('dash-reservations', myRes);
  }
}

function renderZoneList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const zones = AppState.data.parkingZones;
  container.innerHTML = zones.map(zone => {
    const pct = getOccupancyPct(zone);
    const status = getOccupancyStatus(pct);
    const emoji = getOccupancyEmoji(pct);
    const fillClass = getOccupancyFillClass(pct);
    return `
    <div class="zone-item">
      <div class="zone-item-header">
        <div class="zone-item-name">
          <span class="status-dot ${status}"></span>
          ${escHtml(zone.name)}
        </div>
        <div class="zone-item-meta">
          <span>${escHtml(zone.available)} free</span>
          <span class="zone-pct ${status === 'full' ? 'status-full' : status === 'high' ? 'status-high' : status === 'moderate' ? 'status-moderate' : 'status-available'}">${emoji} ${pct}%</span>
        </div>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${fillClass}" style="width:${pct}%;" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${zone.name} occupancy"></div>
      </div>
    </div>`;
  }).join('');
}

function renderRecentActivity() {
  const container = document.getElementById('dashboard-recent-activity');
  if (!container) return;
  const items = AppState.data.parkingHistory.slice(0, 3);
  if (!items.length) {
    container.innerHTML = '<div class="empty-state" style="padding:24px;"><div class="empty-icon">≡ƒôï</div><p>No parking history yet.</p></div>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="history-item" style="border-radius:0;margin:0;border-left:none;border-right:none;border-top:none;">
      <div class="history-zone-badge">${escHtml(item.zone)}</div>
      <div class="history-info">
        <div class="history-zone">Zone ${escHtml(item.zone)}, Slot ${escHtml(item.slot)}</div>
        <div class="history-time">${escHtml(item.date)} ┬╖ ${escHtml(item.entryTime)} ΓåÆ ${escHtml(item.exitTime)}</div>
      </div>
      <div class="history-duration">${escHtml(item.duration)}</div>
      <span class="${getStatusBadgeClass(item.status)}">${getStatusLabel(item.status)}</span>
    </div>
  `).join('');
}

/* ============================================================
   14. RENDER: FIND PARKING
   ============================================================ */
function renderFindParking(query = '', filter = 'all') {
  const container = document.getElementById('parking-results');
  const empty     = document.getElementById('parking-empty');
  if (!container) return;

  let zones = [...AppState.data.parkingZones];

  // Text search
  if (query) {
    zones = zones.filter(z =>
      z.name.toLowerCase().includes(query.toLowerCase()) ||
      z.location.toLowerCase().includes(query.toLowerCase()) ||
      z.id.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Chip filter
  if (filter === 'available') zones = zones.filter(z => getOccupancyPct(z) < 50);
  if (filter === 'moderate')  zones = zones.filter(z => { const p = getOccupancyPct(z); return p >= 50 && p < 80; });
  if (filter === 'ev')        zones = zones.filter(z => z.evCharging);
  if (filter === 'accessible') zones = zones.filter(z => z.accessible);
  if (filter === 'covered')   zones = zones.filter(z => z.covered);

  // Distance filter
  const distFilter = document.getElementById('filter-distance');
  if (distFilter && distFilter.value) {
    zones = zones.filter(z => z.distance <= parseInt(distFilter.value));
  }

  // Sort
  const sortEl = document.getElementById('filter-sort');
  const sort = sortEl ? sortEl.value : 'score';
  if (sort === 'distance')     zones.sort((a, b) => a.distance - b.distance);
  if (sort === 'availability') zones.sort((a, b) => b.available - a.available);
  if (sort === 'price')        zones.sort((a, b) => a.price - b.price);
  if (sort === 'score')        zones.sort((a, b) => calcRecommendationScore(b) - calcRecommendationScore(a));

  if (!zones.length) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  container.innerHTML = zones.map(zone => {
    const pct   = getOccupancyPct(zone);
    const pred  = Math.min(100, pct + Math.round(pct * 0.2));
    const stat  = getOccupancyStatus(pct);
    const score = calcRecommendationScore(zone);
    const emoji = getOccupancyEmoji(pct);
    const fillClass = getOccupancyFillClass(pct);
    const isTop = score >= 80;
    return `
    <div class="parking-result-card" role="article">
      <div class="prc-header">
        <div>
          <div class="prc-name">${isTop ? 'Γ¡É ' : ''}${escHtml(zone.name)}</div>
          <span class="${getStatusBadgeClass(stat)}">${emoji} ${zone.available} spaces available</span>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.1rem;font-weight:800;color:var(--primary);">Γé╣${zone.price}<span style="font-size:.7rem;font-weight:400;color:var(--text-secondary);">/hr</span></div>
          <div style="font-size:.7rem;color:var(--text-muted);">Score: ${score}/100</div>
        </div>
      </div>
      <div class="prc-meta">
        <span>≡ƒôì ${formatDistance(zone.distance)}</span>
        <span>≡ƒÜ╢ ${zone.walkTime} min walk</span>
        ${zone.evCharging ? '<span>ΓÜí EV</span>' : ''}
        ${zone.accessible ? '<span>ΓÖ┐ Accessible</span>' : ''}
        ${zone.covered ? '<span>≡ƒÅá Covered</span>' : ''}
      </div>
      <div class="prc-occupancy">
        <div class="prc-occ-label">
          <span>Current: ${pct}%</span>
          <span style="color:var(--text-muted);">Predicted in 30m: ${pred}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill ${fillClass}" style="width:${pct}%;"></div>
        </div>
      </div>
      <div class="prc-actions">
        <button class="btn btn-outline btn-sm flex-1" onclick="showZoneDetails('${zone.id}')">Γä╣ View Details</button>
        <button class="btn btn-primary btn-sm flex-1" onclick="startReservationForZone('${zone.id}')">≡ƒôà Reserve</button>
      </div>
    </div>`;
  }).join('');
}

/* ============================================================
   15. RENDER: LIVE MAP
   ============================================================ */
function renderLiveMap() {
  const mapArea = document.getElementById('map-area');
  if (!mapArea) return;

  const zones = AppState.data.parkingZones;
  mapArea.innerHTML = zones.map(zone => {
    const pct = getOccupancyPct(zone);
    // Generate slot grid
    const slots = [];
    let occupiedCount = zone.occupied;
    for (let i = 1; i <= Math.min(zone.capacity, 30); i++) {
      const isOcc = occupiedCount > 0 && (Math.random() < (zone.occupied / zone.capacity));
      if (isOcc) occupiedCount = Math.max(0, occupiedCount - 1);
      const slotId = zone.id + String(i).padStart(2,'0');
      const status = zone.status === 'full' ? 'occupied' :
                     isOcc ? 'occupied' :
                     Math.random() < 0.15 ? 'moderate' : 'available';
      slots.push(`<div class="slot-cell ${status}" title="${slotId}" onclick="selectSlotOnMap('${zone.id}','${slotId}')">${slotId}</div>`);
    }
    if (zone.capacity > 30) {
      slots.push(`<div class="slot-cell" style="background:var(--bg-page);border:1px dashed var(--border);color:var(--text-muted);font-size:.65rem;">+${zone.capacity-30} more</div>`);
    }
    const emoji = getOccupancyEmoji(pct);
    return `
    <div class="parking-lot">
      <div class="parking-lot-header">
        <div class="status-dot ${getOccupancyStatus(pct)}"></div>
        <h3 onclick="showZoneInfo('${zone.id}')" style="cursor:pointer;">${escHtml(zone.name)} ${emoji}</h3>
        <span class="lot-stats-inline">${zone.available} available / ${zone.capacity} total</span>
        <button class="btn btn-outline btn-sm" onclick="showZoneInfo('${zone.id}')">View Zone</button>
      </div>
      <div class="slots-grid">${slots.join('')}</div>
    </div>`;
  }).join('');
}

function showZoneInfo(zoneId) {
  const zone = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone) return;
  const pct  = getOccupancyPct(zone);
  const pred = Math.min(100, pct + Math.round(pct * 0.17));
  const nameEl = document.getElementById('zone-info-name');
  const bodyEl = document.getElementById('zone-info-body');
  if (!nameEl || !bodyEl) return;
  nameEl.textContent = zone.name;
  bodyEl.innerHTML = `
    <div class="info-row"><span class="ir-label">Total Capacity</span><span class="ir-value">${zone.capacity}</span></div>
    <div class="info-row"><span class="ir-label">Available</span><span class="ir-value" style="color:var(--success);">${zone.available}</span></div>
    <div class="info-row"><span class="ir-label">Occupied</span><span class="ir-value" style="color:var(--danger);">${zone.occupied}</span></div>
    <div class="info-row">
      <span class="ir-label">Occupancy</span>
      <span class="ir-value">${pct}%</span>
    </div>
    <div class="progress-bar-track mb-12" style="margin-top:4px;">
      <div class="progress-bar-fill ${getOccupancyFillClass(pct)}" style="width:${pct}%;"></div>
    </div>
    <div class="info-row"><span class="ir-label">Predicted (30m)</span><span class="ir-value">${pred}%</span></div>
    <div class="info-row"><span class="ir-label">Distance</span><span class="ir-value">${formatDistance(zone.distance)}</span></div>
    <div class="info-row"><span class="ir-label">Walking Time</span><span class="ir-value">${zone.walkTime} min</span></div>
    <div class="info-row"><span class="ir-label">Price</span><span class="ir-value">Γé╣${zone.price}/hr</span></div>
    <div class="info-row"><span class="ir-label">EV Charging</span><span class="ir-value">${zone.evCharging ? 'Γ£ô Yes' : 'Γ£ò No'}</span></div>
    <div class="info-row"><span class="ir-label">Accessible</span><span class="ir-value">${zone.accessible ? 'Γ£ô Yes' : 'Γ£ò No'}</span></div>
    <div class="info-row"><span class="ir-label">Hours</span><span class="ir-value">${zone.openHours}</span></div>
    <div class="info-row"><span class="ir-label">Security</span><span class="ir-value">${zone.security}</span></div>
    <button class="btn btn-primary btn-block mt-16" onclick="startReservationForZone('${zone.id}')">≡ƒôà Reserve Parking</button>
  `;
}

function selectSlotOnMap(zoneId, slotId) {
  showZoneInfo(zoneId);
  // Highlight selected slot
  document.querySelectorAll('.slot-cell.selected').forEach(s => s.classList.remove('selected'));
  const slot = document.querySelector(`.slot-cell[title="${slotId}"]`);
  if (slot) slot.classList.add('selected');
}

/* ============================================================
   16. ZONE DETAILS MODAL
   ============================================================ */
function showZoneDetails(zoneId) {
  const zone = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone) return;
  const pct  = getOccupancyPct(zone);
  const pred = Math.min(100, pct + Math.round(pct * 0.17));
  const fillClass = getOccupancyFillClass(pct);
  openModal(`${zone.name} ΓÇö Details`, `
    <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
      <div style="flex:1;min-width:180px;">
        <div class="info-row"><span class="ir-label">Location</span><span class="ir-value">${escHtml(zone.location)}</span></div>
        <div class="info-row"><span class="ir-label">Total Capacity</span><span class="ir-value">${zone.capacity}</span></div>
        <div class="info-row"><span class="ir-label">Available</span><span class="ir-value" style="color:var(--success);">${zone.available}</span></div>
        <div class="info-row"><span class="ir-label">Occupied</span><span class="ir-value" style="color:var(--danger);">${zone.occupied}</span></div>
        <div class="info-row"><span class="ir-label">Price</span><span class="ir-value">Γé╣${zone.price}/hr</span></div>
        <div class="info-row"><span class="ir-label">Distance</span><span class="ir-value">${formatDistance(zone.distance)}</span></div>
        <div class="info-row"><span class="ir-label">Walking Time</span><span class="ir-value">${zone.walkTime} min</span></div>
      </div>
      <div style="flex:1;min-width:180px;">
        <div class="info-row"><span class="ir-label">EV Charging</span><span class="ir-value">${zone.evCharging ? 'ΓÜí Yes' : 'Γ£ò No'}</span></div>
        <div class="info-row"><span class="ir-label">Accessible</span><span class="ir-value">${zone.accessible ? 'ΓÖ┐ Yes' : 'Γ£ò No'}</span></div>
        <div class="info-row"><span class="ir-label">Covered</span><span class="ir-value">${zone.covered ? '≡ƒÅá Yes' : 'Γ£ò No'}</span></div>
        <div class="info-row"><span class="ir-label">Hours</span><span class="ir-value">${zone.openHours}</span></div>
        <div class="info-row"><span class="ir-label">Security</span><span class="ir-value">${zone.security}</span></div>
        <div class="info-row"><span class="ir-label">Status</span><span class="${getStatusBadgeClass(zone.status)}">${getStatusLabel(zone.status)}</span></div>
      </div>
    </div>
    <div class="mb-12">
      <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--text-secondary);margin-bottom:5px;">
        <span>Current Occupancy: ${pct}%</span>
        <span>Predicted in 30m: ${pred}%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${fillClass}" style="width:${pct}%;"></div>
      </div>
    </div>
    <div style="background:var(--bg-page);padding:12px;border-radius:var(--radius-sm);font-size:.82rem;color:var(--text-secondary);">
      <strong>Recommendation Score:</strong> ${calcRecommendationScore(zone)}/100
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Close</button>
   <button class="btn btn-primary" onclick="closeModal();startReservationForZone('${zone.id}')">≡ƒôà Reserve Now</button>`
  );
}

/* ============================================================
   17. RENDER: RESERVATIONS (USER)
   ============================================================ */
let activeResZone = null;

function renderReservations() {
  const container = document.getElementById('reservations-list');
  if (!container) return;
  const myRes = AppState.data.reservations.filter(
    r => r.userId === (AppState.currentUser ? AppState.currentUser.id : null)
  );
  if (!myRes.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">≡ƒôà</div><h3>No reservations yet</h3><p>Create your first parking reservation to get started.</p><button class="btn btn-primary" id="empty-new-res-btn">+ New Reservation</button></div>`;
    document.getElementById('empty-new-res-btn')?.addEventListener('click', openNewReservation);
    return;
  }
  container.innerHTML = myRes.map(res => {
    return `
    <div class="card mb-16">
      <div class="card-body">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="font-size:1.2rem;font-weight:800;color:var(--text-primary);">Zone ${escHtml(res.zoneId)} ΓÇö Slot ${escHtml(res.slot)}</div>
              <span class="${getStatusBadgeClass(res.status)}">${getStatusLabel(res.status)}</span>
            </div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:.85rem;color:var(--text-secondary);">
              <span>≡ƒôà ${escHtml(res.date)}</span>
              <span>ΓÅ░ ${escHtml(res.entryTime)} ΓÇô ${escHtml(res.exitTime)}</span>
              <span>≡ƒÜù ${escHtml(res.vehicle)}</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:.8rem;color:var(--text-muted);margin-top:6px;">${escHtml(res.resId)}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0;">
            ${res.status === 'active' ? `
              <button class="btn btn-outline btn-sm" onclick="showQRPass('${res.id}')">≡ƒô▒ QR Pass</button>
              <button class="btn btn-danger btn-sm" onclick="handleCancelReservation('${res.id}')">Γ£ò Cancel</button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openNewReservation() {
  document.getElementById('reservation-creator').style.display = 'block';
  AppState.resStep = 1;
  AppState.resData = {};
  updateReservationStep();
  // Scroll to stepper
  document.getElementById('reservation-creator').scrollIntoView({ behavior: 'smooth' });
}

function updateReservationStep() {
  const step = AppState.resStep;
  // Update step indicators
  for (let i = 1; i <= 4; i++) {
    const circle = document.getElementById(`step-c-${i}`);
    const label  = document.getElementById(`step-l-${i}`);
    if (i < step)  { circle.className = 'step-circle done';  label.className = 'step-label done'; circle.textContent = 'Γ£ô'; }
    else if (i === step) { circle.className = 'step-circle active'; label.className = 'step-label active'; circle.textContent = i; }
    else           { circle.className = 'step-circle';        label.className = 'step-label';       circle.textContent = i; }
    // Connectors
    if (i < 4) {
      const con = document.getElementById(`step-con-${i}`);
      if (con) con.className = 'step-connector' + (i < step ? ' done' : '');
    }
  }
  const content  = document.getElementById('reservation-step-content');
  const backBtn  = document.getElementById('res-back-btn');
  const nextBtn  = document.getElementById('res-next-btn');

  backBtn.style.display = step > 1 && step < 5 ? 'inline-flex' : 'none';

  if (step === 1) {
    // Select Zone
    nextBtn.textContent = 'Next ΓåÆ';
    const zones = AppState.data.parkingZones.filter(z => z.available > 0);
    content.innerHTML = `
    <h4 style="margin-bottom:14px;font-size:.95rem;color:var(--text-secondary);">Step 1: Select a Parking Zone</h4>
    <div class="parking-results-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));">
    ${zones.map(z => {
      const pct = getOccupancyPct(z);
      const score = calcRecommendationScore(z);
      const selected = AppState.resData.zoneId === z.id;
      return `<div class="parking-result-card ${selected ? 'selected' : ''}" style="${selected ? 'border-color:var(--primary);background:var(--primary-soft);' : ''}" onclick="selectResZone('${z.id}',this)">
        <div class="prc-name">${z.id === AppState.data.parkingZones.sort((a,b)=>calcRecommendationScore(b)-calcRecommendationScore(a))[0].id ? 'Γ¡É ' : ''}${escHtml(z.name)}</div>
        <div class="prc-meta"><span>${escHtml(z.available)} available</span><span>${formatDistance(z.distance)}</span></div>
        <div style="font-size:.8rem;margin-top:4px;">Score: <strong>${score}/100</strong> ┬╖ Γé╣${z.price}/hr</div>
      </div>`;
    }).join('')}
    </div>`;
  } else if (step === 2) {
    // Date & Time
    nextBtn.textContent = 'Next ΓåÆ';
    const today = new Date().toISOString().split('T')[0];
    content.innerHTML = `
    <h4 style="margin-bottom:14px;font-size:.95rem;color:var(--text-secondary);">Step 2: Select Date & Time</h4>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="res-date">Date</label>
        <input type="date" id="res-date" class="form-control" min="${today}" value="${AppState.resData.date || today}" />
      </div>
      <div class="form-group">
        <label class="form-label">Duration</label>
        <select class="form-control" id="res-duration">
          <option value="1">1 Hour</option>
          <option value="2" selected>2 Hours</option>
          <option value="3">3 Hours</option>
          <option value="4">4 Hours</option>
          <option value="6">6 Hours</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="res-entry">Entry Time</label>
      <input type="time" id="res-entry" class="form-control" value="${AppState.resData.entryTime || '10:00'}" />
    </div>`;
  } else if (step === 3) {
    // Vehicle
    nextBtn.textContent = 'Next ΓåÆ';
    const myVehicles = AppState.data.vehicles.filter(
      v => !AppState.currentUser || v.userId === AppState.currentUser.id
    );
    content.innerHTML = `
    <h4 style="margin-bottom:14px;font-size:.95rem;color:var(--text-secondary);">Step 3: Select Vehicle</h4>
    ${myVehicles.length ? `
    <div class="vehicle-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));">
    ${myVehicles.map(v => {
      const sel = AppState.resData.vehicle === v.plate;
      return `<div class="vehicle-card ${sel ? 'primary' : ''}" style="${sel ? '' : ''}" onclick="selectResVehicle('${v.plate}', this)">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="font-size:1.8rem;">${getVehicleIcon(v.type)}</div>
          <div>
            <div class="vehicle-plate">${escHtml(v.plate)}</div>
            <div class="vehicle-meta">${escHtml(v.make)} ${escHtml(v.model)}</div>
          </div>
        </div>
        ${v.primary ? '<span class="primary-badge">Γ¡É Primary</span>' : ''}
      </div>`;
    }).join('')}
    </div>` : `<div class="empty-state"><div class="empty-icon">≡ƒÜù</div><p>No vehicles added. <a href="#" onclick="navigateTo('vehicles');closeModal();" style="color:var(--primary);">Add a vehicle first.</a></p></div>`}
    `;
    // Pre-select primary
    if (!AppState.resData.vehicle) {
      const primary = myVehicles.find(v => v.primary) || myVehicles[0];
      if (primary) AppState.resData.vehicle = primary.plate;
    }
  } else if (step === 4) {
    // Confirm
    nextBtn.textContent = 'Γ£ô Confirm Reservation';
    const zone = AppState.data.parkingZones.find(z => z.id === AppState.resData.zoneId);
    const dur  = parseInt(AppState.resData.duration || 2);
    const [h, m] = (AppState.resData.entryTime || '10:00').split(':').map(Number);
    const exitH = h + dur;
    const exitTime = `${String(exitH).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    content.innerHTML = `
    <h4 style="margin-bottom:14px;font-size:.95rem;color:var(--text-secondary);">Step 4: Confirm Reservation</h4>
    <div class="card" style="margin-bottom:0;">
      <div class="card-body">
        <div class="info-row"><span class="ir-label">Zone</span><span class="ir-value">${zone ? escHtml(zone.name) : AppState.resData.zoneId}</span></div>
        <div class="info-row"><span class="ir-label">Date</span><span class="ir-value">${escHtml(AppState.resData.date || new Date().toISOString().split('T')[0])}</span></div>
        <div class="info-row"><span class="ir-label">Entry Time</span><span class="ir-value">${escHtml(AppState.resData.entryTime || '10:00')}</span></div>
        <div class="info-row"><span class="ir-label">Exit Time</span><span class="ir-value">${escHtml(exitTime)}</span></div>
        <div class="info-row"><span class="ir-label">Duration</span><span class="ir-value">${dur} hour${dur > 1 ? 's' : ''}</span></div>
        <div class="info-row"><span class="ir-label">Vehicle</span><span class="ir-value">${escHtml(AppState.resData.vehicle || 'N/A')}</span></div>
        <div class="info-row"><span class="ir-label">Estimated Cost</span><span class="ir-value" style="color:var(--primary);">Γé╣${zone ? zone.price * dur : 0}</span></div>
      </div>
    </div>`;
    AppState.resData.exitTime = exitTime;
  } else if (step === 5) {
    // Success
    nextBtn.style.display = 'none';
    backBtn.style.display  = 'none';
    document.getElementById('res-cancel-btn').textContent = 'Close';
    const res = AppState.resData.lastCreated;
    content.innerHTML = `
    <div class="reservation-success">
      <div class="success-icon">Γ£ô</div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:8px;">PARKING RESERVED!</h2>
      <p style="color:var(--text-secondary);margin-bottom:16px;">Your parking spot has been successfully reserved.</p>
      <div class="info-row"><span class="ir-label">Zone</span><span class="ir-value">Zone ${escHtml(res.zoneId)}</span></div>
      <div class="info-row"><span class="ir-label">Slot</span><span class="ir-value">${escHtml(res.slot)}</span></div>
      <div class="info-row"><span class="ir-label">Time</span><span class="ir-value">${escHtml(res.entryTime)} ΓÇô ${escHtml(res.exitTime)}</span></div>
      <div class="res-id">${escHtml(res.resId)}</div>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="showQRPass('${res.id}')">≡ƒô▒ View QR Pass</button>
        <button class="btn btn-outline" onclick="closeReservationCreator()">Done</button>
      </div>
    </div>`;
  }
}

function selectResZone(zoneId, el) {
  AppState.resData.zoneId = zoneId;
  document.querySelectorAll('#reservation-step-content .parking-result-card').forEach(c => {
    c.style.borderColor = '';
    c.style.background = '';
  });
  if (el) {
    el.style.borderColor = 'var(--primary)';
    el.style.background = 'var(--primary-soft)';
  }
}

function selectResVehicle(plate, el) {
  AppState.resData.vehicle = plate;
  document.querySelectorAll('#reservation-step-content .vehicle-card').forEach(c => {
    c.style.borderColor = '';
  });
  if (el) el.style.borderColor = 'var(--primary)';
}

function closeReservationCreator() {
  document.getElementById('reservation-creator').style.display = 'none';
  renderReservations();
}

async function handleNextReservationStep() {
  const step = AppState.resStep;
  // Validate step
  if (step === 1 && !AppState.resData.zoneId) {
    showToast('Select a zone', 'Please select a parking zone to continue.', 'warning'); return;
  }
  if (step === 2) {
    const dateEl = document.getElementById('res-date');
    const entryEl = document.getElementById('res-entry');
    const durEl   = document.getElementById('res-duration');
    AppState.resData.date       = dateEl ? dateEl.value : new Date().toISOString().split('T')[0];
    AppState.resData.entryTime  = entryEl ? entryEl.value : '10:00';
    AppState.resData.duration   = durEl ? durEl.value : '2';
  }
  if (step === 3 && !AppState.resData.vehicle) {
    showToast('Select a vehicle', 'Please select a vehicle to continue.', 'warning'); return;
  }
  if (step === 4) {
    // Actually create the reservation
    const zone = AppState.data.parkingZones.find(z => z.id === AppState.resData.zoneId);
    const slotNum = Math.floor(Math.random() * (zone ? zone.available : 10)) + 1;
    const slot = AppState.resData.zoneId + '-' + String(slotNum).padStart(2,'0');
    const res = await createReservation({
      userId: AppState.currentUser ? AppState.currentUser.id : 'u1',
      zoneId: AppState.resData.zoneId,
      slot,
      vehicle: AppState.resData.vehicle,
      entryTime: AppState.resData.entryTime,
      exitTime: AppState.resData.exitTime,
      date: AppState.resData.date
    });
    AppState.resData.lastCreated = res;
    addNotification({ type: 'reservation', icon: 'Γ£ô', iconType: 'success', title: 'Reservation confirmed!', body: `Zone ${res.zoneId}, Slot ${res.slot} reserved for ${res.entryTime}ΓÇô${res.exitTime}` });
    AppState.resStep = 5;
    updateReservationStep();
    return;
  }
  AppState.resStep++;
  updateReservationStep();
}

async function handleCancelReservation(resId) {
  if (!confirm('Are you sure you want to cancel this reservation?')) return;
  const ok = await cancelReservation(resId);
  if (ok) {
    showToast('Reservation cancelled', 'Your reservation has been cancelled.', 'warning');
    renderReservations();
  }
}

function showQRPass(resId) {
  const res = AppState.data.reservations.find(r => r.id === resId);
  if (!res) return;
  openModal('≡ƒô▒ QR Parking Pass', `
    <div class="qr-pass">
      <div style="font-size:1.1rem;font-weight:800;color:var(--primary);margin-bottom:4px;">SMARTPARK</div>
      <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:16px;">Digital Parking Pass</div>
      <div class="qr-code-box">
        <svg class="qr-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="QR Code">
          <!-- QR pattern simulation -->
          <rect width="100" height="100" fill="${document.documentElement.getAttribute('data-theme')==='dark'?'#1f2937':'#f9fafb'}"/>
          <!-- Position detection patterns -->
          <rect x="8" y="8" width="22" height="22" rx="2" fill="none" stroke="var(--text-primary)" stroke-width="3"/>
          <rect x="12" y="12" width="14" height="14" rx="1" fill="var(--text-primary)"/>
          <rect x="70" y="8" width="22" height="22" rx="2" fill="none" stroke="var(--text-primary)" stroke-width="3"/>
          <rect x="74" y="12" width="14" height="14" rx="1" fill="var(--text-primary)"/>
          <rect x="8" y="70" width="22" height="22" rx="2" fill="none" stroke="var(--text-primary)" stroke-width="3"/>
          <rect x="12" y="74" width="14" height="14" rx="1" fill="var(--text-primary)"/>
          <!-- Data modules (simulated) -->
          <rect x="38" y="8" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="44" y="8" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="50" y="8" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="14" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="50" y="14" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="56" y="14" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="62" y="8" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="62" y="14" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="44" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="50" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="56" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="62" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="56" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="44" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="62" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="56" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="38" y="62" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="44" y="62" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="50" y="62" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="56" y="62" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="62" y="62" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="76" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="88" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="76" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="88" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="8" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="14" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="20" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="26" y="38" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="8" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="20" y="44" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="8" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="14" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="26" y="50" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="8" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="20" y="56" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="70" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="76" y="70" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="70" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="88" y="70" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="76" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="76" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="88" y="76" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="70" y="82" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="76" y="82" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="82" y="88" width="4" height="4" fill="var(--text-primary)"/>
          <rect x="88" y="82" width="4" height="4" fill="var(--text-primary)"/>
        </svg>
      </div>
      <div class="qr-pass-info">
        <p>Zone</p><p class="qr-val">Zone ${escHtml(res.zoneId)}</p>
        <p>Slot</p><p class="qr-val">${escHtml(res.slot)}</p>
        <p>Entry</p><p class="qr-val">${escHtml(res.entryTime)}</p>
        <p>Exit</p><p class="qr-val">${escHtml(res.exitTime)}</p>
        <p>Date</p><p class="qr-val">${escHtml(res.date)}</p>
        <p>ID</p><p class="qr-val" style="font-family:var(--font-mono);font-size:.85rem;">${escHtml(res.resId)}</p>
      </div>
      <span class="qr-status-badge">ΓùÅ ${escHtml(res.status.toUpperCase())}</span>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Close</button>${res.status==='active'?`<button class="btn btn-danger btn-sm" onclick="closeModal();handleCancelReservation('${res.id}')">Γ£ò Cancel Reservation</button>`:''}`,
  { size: 'sm' });
}

function startReservationForZone(zoneId) {
  navigateTo('reservations');
  AppState.resData = { zoneId };
  AppState.resStep = 2; // Skip zone selection since we came from a specific zone
  document.getElementById('reservation-creator').style.display = 'block';
  updateReservationStep();
}

/* ============================================================
   18. RENDER: VEHICLES
   ============================================================ */
function renderVehicles() {
  const grid = document.getElementById('vehicle-grid');
  if (!grid) return;
  const myVehicles = AppState.data.vehicles.filter(
    v => !AppState.currentUser || v.userId === AppState.currentUser.id
  );
  if (!myVehicles.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon">≡ƒÜù</div><h3>No vehicles added</h3><p>Add your first vehicle to use SmartPark reservations.</p></div>`;
    return;
  }
  grid.innerHTML = myVehicles.map(v => `
    <div class="vehicle-card ${v.primary ? 'primary' : ''}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;">
        <div style="font-size:2.2rem;">${getVehicleIcon(v.type)}</div>
        ${v.primary ? '<span class="primary-badge">Γ¡É Primary</span>' : ''}
      </div>
      <div class="vehicle-plate">${escHtml(v.plate)}</div>
      <div class="vehicle-meta">${escHtml(v.make)} ${escHtml(v.model)} ┬╖ ${v.type.charAt(0).toUpperCase()+v.type.slice(1)}${v.ev ? ' ΓÜí EV' : ''}</div>
      <div class="d-flex gap-8">
        ${!v.primary ? `<button class="btn btn-outline btn-sm" onclick="setPrimaryVehicle('${v.id}')">Set Primary</button>` : ''}
        <button class="btn btn-ghost btn-sm" onclick="editVehicle('${v.id}')">Γ£Å Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteVehicle('${v.id}')">≡ƒùæ</button>
      </div>
    </div>
  `).join('');
}

function openAddVehicleModal() {
  openModal('Add Vehicle', `
    <div class="form-group">
      <label class="form-label" for="v-plate">License Plate</label>
      <input type="text" id="v-plate" class="form-control" placeholder="e.g. AP 39 XX 1234" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="v-make">Make</label>
        <input type="text" id="v-make" class="form-control" placeholder="Toyota" />
      </div>
      <div class="form-group">
        <label class="form-label" for="v-model">Model</label>
        <input type="text" id="v-model" class="form-control" placeholder="Camry" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="v-type">Vehicle Type</label>
        <select class="form-control" id="v-type">
          <option value="car">≡ƒÜù Car</option>
          <option value="bike">≡ƒÅì Motorcycle</option>
          <option value="ev">ΓÜí EV</option>
          <option value="truck">≡ƒÜ¢ Truck/SUV</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="v-color">Color</label>
        <input type="text" id="v-color" class="form-control" placeholder="White" />
      </div>
    </div>
    <label class="form-check">
      <input type="checkbox" id="v-primary" /> Set as Primary Vehicle
    </label>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="saveVehicle()">Save Vehicle</button>`
  );
}

function saveVehicle() {
  const plate = document.getElementById('v-plate').value.trim();
  const make  = document.getElementById('v-make').value.trim();
  const model = document.getElementById('v-model').value.trim();
  const type  = document.getElementById('v-type').value;
  const color = document.getElementById('v-color').value.trim();
  const primary = document.getElementById('v-primary').checked;
  if (!plate || !make || !model) { showToast('Fill all fields', 'Please fill in plate, make and model.', 'warning'); return; }
  if (primary) AppState.data.vehicles.forEach(v => { if (v.userId === AppState.currentUser?.id) v.primary = false; });
  const id = 'v' + Date.now();
  AppState.data.vehicles.push({
    id, userId: AppState.currentUser ? AppState.currentUser.id : 'u1',
    plate, make, model, type, color, ev: type === 'ev', primary
  });
  if (AppState.currentUser) {
    const user = AppState.data.users.find(u => u.id === AppState.currentUser.id);
    if (user) user.vehicles.push(id);
  }
  saveData();
  closeModal();
  renderVehicles();
  showToast('Vehicle added', `${make} ${model} added successfully.`, 'success');
}

function editVehicle(vehicleId) {
  const v = AppState.data.vehicles.find(v => v.id === vehicleId);
  if (!v) return;
  openModal('Edit Vehicle', `
    <div class="form-group">
      <label class="form-label" for="ev-plate">License Plate</label>
      <input type="text" id="ev-plate" class="form-control" value="${escHtml(v.plate)}" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="ev-make">Make</label>
        <input type="text" id="ev-make" class="form-control" value="${escHtml(v.make)}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="ev-model">Model</label>
        <input type="text" id="ev-model" class="form-control" value="${escHtml(v.model)}" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="ev-type">Type</label>
        <select class="form-control" id="ev-type">
          <option value="car" ${v.type==='car'?'selected':''}>≡ƒÜù Car</option>
          <option value="bike" ${v.type==='bike'?'selected':''}>≡ƒÅì Motorcycle</option>
          <option value="ev" ${v.type==='ev'?'selected':''}>ΓÜí EV</option>
          <option value="truck" ${v.type==='truck'?'selected':''}>≡ƒÜ¢ Truck/SUV</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ev-color">Color</label>
        <input type="text" id="ev-color" class="form-control" value="${escHtml(v.color)}" />
      </div>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="updateVehicle('${vehicleId}')">Update Vehicle</button>`
  );
}

function updateVehicle(vehicleId) {
  const v = AppState.data.vehicles.find(v => v.id === vehicleId);
  if (!v) return;
  v.plate = document.getElementById('ev-plate').value.trim() || v.plate;
  v.make  = document.getElementById('ev-make').value.trim()  || v.make;
  v.model = document.getElementById('ev-model').value.trim() || v.model;
  v.type  = document.getElementById('ev-type').value;
  v.color = document.getElementById('ev-color').value.trim();
  v.ev    = v.type === 'ev';
  saveData();
  closeModal();
  renderVehicles();
  showToast('Vehicle updated', `${v.make} ${v.model} updated.`, 'success');
}

function deleteVehicle(vehicleId) {
  if (!confirm('Delete this vehicle?')) return;
  const idx = AppState.data.vehicles.findIndex(v => v.id === vehicleId);
  if (idx === -1) return;
  AppState.data.vehicles.splice(idx, 1);
  saveData();
  renderVehicles();
  showToast('Vehicle deleted', 'Vehicle removed from your account.', 'warning');
}

function setPrimaryVehicle(vehicleId) {
  AppState.data.vehicles.forEach(v => {
    if (v.userId === (AppState.currentUser?.id || 'u1')) v.primary = v.id === vehicleId;
  });
  saveData();
  renderVehicles();
  showToast('Primary vehicle set', 'Primary vehicle updated.', 'success');
}

/* ============================================================
   19. RENDER: PARKING HISTORY
   ============================================================ */
function renderParkingHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  // Populate zone filter
  const zoneFilter = document.getElementById('history-zone-filter');
  if (zoneFilter && zoneFilter.options.length === 1) {
    AppState.data.parkingZones.forEach(z => {
      const opt = document.createElement('option');
      opt.value = z.id;
      opt.textContent = z.name;
      zoneFilter.appendChild(opt);
    });
  }

  const searchQuery = (document.getElementById('history-search')?.value || '').toLowerCase();
  const zoneVal     = document.getElementById('history-zone-filter')?.value || '';
  const statusVal   = document.getElementById('history-status-filter')?.value || '';

  let items = [...AppState.data.parkingHistory];
  if (searchQuery) items = items.filter(i => i.zone.toLowerCase().includes(searchQuery) || i.slot.toLowerCase().includes(searchQuery));
  if (zoneVal)     items = items.filter(i => i.zone === zoneVal);
  if (statusVal)   items = items.filter(i => i.status === statusVal);

  if (!items.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">≡ƒôï</div><h3>No history found</h3><p>Try clearing your filters.</p></div>`;
    return;
  }

  // Group by date
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  container.innerHTML = Object.entries(grouped).map(([date, entries]) => `
    <div class="history-date-group">
      <div class="history-date-label">${escHtml(date)}</div>
      ${entries.map(item => `
      <div class="history-item">
        <div class="history-zone-badge">${escHtml(item.zone)}</div>
        <div class="history-info">
          <div class="history-zone">Zone ${escHtml(item.zone)}, Slot ${escHtml(item.slot)}</div>
          <div class="history-time">${escHtml(item.entryTime)} ΓåÆ ${escHtml(item.exitTime)}</div>
        </div>
        <div>
          <div class="history-duration">${escHtml(item.duration)}</div>
          <div style="font-size:.75rem;color:var(--text-muted);text-align:right;">Γé╣${item.cost}</div>
        </div>
        <span class="${getStatusBadgeClass(item.status)}">${getStatusLabel(item.status)}</span>
      </div>`).join('')}
    </div>`).join('');
}

/* ============================================================
   20. RENDER: NOTIFICATIONS
   ============================================================ */
function renderNotifications(filter = 'all') {
  const container = document.getElementById('notifications-list');
  if (!container) return;
  let notifs = AppState.data.notifications.filter(
    n => n.userId === (AppState.currentUser ? AppState.currentUser.id : 'u1')
  );
  if (filter !== 'all') notifs = notifs.filter(n => n.type === filter);
  if (!notifs.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">≡ƒöö</div><h3>No notifications</h3><p>You're all caught up!</p></div>`;
    return;
  }
  container.innerHTML = notifs.map(n => `
    <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="markNotifRead('${n.id}')">
      <div class="notif-icon-wrap ${n.iconType || 'info'}">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${escHtml(n.title)}</div>
        <div class="notif-body">${escHtml(n.body)}</div>
        <div class="notif-time">${escHtml(n.time)}</div>
      </div>
      ${!n.read ? '<div class="notif-unread-dot"></div>' : ''}
    </div>`).join('');
}

function markNotifRead(notifId) {
  const n = AppState.data.notifications.find(n => n.id === notifId);
  if (n) { n.read = true; saveData(); }
  updateNotifBadge();
  renderNotifications(AppState.currentNotifFilter || 'all');
}

function markAllNotifRead() {
  AppState.data.notifications.forEach(n => {
    if (n.userId === AppState.currentUser?.id) n.read = true;
  });
  saveData();
  updateNotifBadge();
  renderNotifications('all');
  showToast('All read', 'All notifications marked as read.', 'success');
}

/* ============================================================
   21. RENDER: PROFILE
   ============================================================ */
function renderProfile() {
  if (!AppState.currentUser) return;
  const u = AppState.currentUser;
  safeSet('profile-name', u.firstName + ' ' + u.lastName);
  safeSet('profile-email', u.email);
  safeSet('profile-role', u.role === 'admin' ? '≡ƒ¢í Administrator' : '≡ƒÜù Driver');
  const avatarEl = document.getElementById('profile-avatar');
  if (avatarEl) avatarEl.textContent = u.firstName[0].toUpperCase();

  const infoBody = document.getElementById('profile-info-body');
  if (infoBody) {
    infoBody.innerHTML = `
      <div class="info-row"><span class="ir-label">First Name</span><span class="ir-value">${escHtml(u.firstName)}</span></div>
      <div class="info-row"><span class="ir-label">Last Name</span><span class="ir-value">${escHtml(u.lastName)}</span></div>
      <div class="info-row"><span class="ir-label">Email</span><span class="ir-value">${escHtml(u.email)}</span></div>
      <div class="info-row"><span class="ir-label">Phone</span><span class="ir-value">${escHtml(u.phone || 'Not set')}</span></div>
      <div class="info-row"><span class="ir-label">Member Since</span><span class="ir-value">${escHtml(u.joined || '2026')}</span></div>
      <div class="info-row"><span class="ir-label">Account Status</span><span class="${getStatusBadgeClass(u.status)}">${getStatusLabel(u.status)}</span></div>`;
  }

  const statsBody = document.getElementById('profile-stats-body');
  const myRes  = AppState.data.reservations.filter(r => r.userId === u.id).length;
  const myVeh  = AppState.data.vehicles.filter(v => v.userId === u.id).length;
  const myHist = AppState.data.parkingHistory.length;
  if (statsBody) {
    statsBody.innerHTML = `
      <div class="info-row"><span class="ir-label">Total Reservations</span><span class="ir-value">${myRes}</span></div>
      <div class="info-row"><span class="ir-label">Active Reservations</span><span class="ir-value">${AppState.data.reservations.filter(r=>r.userId===u.id&&r.status==='active').length}</span></div>
      <div class="info-row"><span class="ir-label">Registered Vehicles</span><span class="ir-value">${myVeh}</span></div>
      <div class="info-row"><span class="ir-label">Parking Sessions</span><span class="ir-value">${myHist}</span></div>
      <div class="info-row"><span class="ir-label">Role</span><span class="ir-value">${u.role === 'admin' ? '≡ƒ¢í Administrator' : '≡ƒÜù Driver'}</span></div>`;
  }
}

function openEditProfileModal() {
  const u = AppState.currentUser;
  if (!u) return;
  openModal('Edit Profile', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="ep-fname">First Name</label>
        <input type="text" id="ep-fname" class="form-control" value="${escHtml(u.firstName)}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="ep-lname">Last Name</label>
        <input type="text" id="ep-lname" class="form-control" value="${escHtml(u.lastName)}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="ep-phone">Phone</label>
      <input type="tel" id="ep-phone" class="form-control" value="${escHtml(u.phone || '')}" />
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="saveProfile()">Save Changes</button>`
  );
}

function saveProfile() {
  const u = AppState.currentUser;
  if (!u) return;
  const fname = document.getElementById('ep-fname').value.trim();
  const lname = document.getElementById('ep-lname').value.trim();
  const phone = document.getElementById('ep-phone').value.trim();
  if (!fname || !lname) { showToast('Fill all fields', '', 'warning'); return; }
  u.firstName = fname; u.lastName = lname; u.phone = phone;
  // Update in data array
  const dataUser = AppState.data.users.find(du => du.id === u.id);
  if (dataUser) { dataUser.firstName = fname; dataUser.lastName = lname; dataUser.phone = phone; }
  saveData();
  closeModal();
  renderProfile();
  document.getElementById('avatar-btn').textContent = fname[0].toUpperCase();
  showToast('Profile updated', 'Your profile has been updated.', 'success');
}

/* ============================================================
   22. ADMIN VIEWS
   ============================================================ */

/* ---- Admin Dashboard ---- */
function renderAdminDashboard() {
  safeSet('admin-occupied', AppState.data.parkingZones.reduce((s,z)=>s+z.occupied,0));
  safeSet('admin-available', AppState.data.parkingZones.reduce((s,z)=>s+z.available,0));
  safeSet('admin-res-count', AppState.data.reservations.length);

  // Zone performance
  const perfEl = document.getElementById('admin-zone-performance');
  if (perfEl) {
    perfEl.innerHTML = AppState.data.parkingZones.map(z => {
      const pct = getOccupancyPct(z);
      return `<div class="zone-item" style="margin-bottom:14px;">
        <div class="zone-item-header">
          <div class="zone-item-name"><span class="status-dot ${getOccupancyStatus(pct)}"></span>${z.name}</div>
          <div class="zone-item-meta"><span>${z.available} free</span><span class="zone-pct">${getOccupancyEmoji(pct)} ${pct}%</span></div>
        </div>
        <div class="progress-bar-track"><div class="progress-bar-fill ${getOccupancyFillClass(pct)}" style="width:${pct}%;"></div></div>
      </div>`;
    }).join('');
  }

  // Mini violations table
  const tbody = document.getElementById('admin-violations-tbody-mini');
  if (tbody) {
    tbody.innerHTML = AppState.data.violations.slice(0, 5).map(v => `
      <tr>
        <td><span style="font-family:var(--font-mono);font-size:.8rem;">${escHtml(v.vehicle)}</span></td>
        <td>Zone ${escHtml(v.zone)}</td>
        <td>${escHtml(v.type)}</td>
        <td style="color:var(--text-muted);font-size:.8rem;">${escHtml(v.time)}</td>
        <td><span class="${getStatusBadgeClass(v.status)}">${getStatusLabel(v.status)}</span></td>
      </tr>`).join('');
  }

  // Draw occupancy trend chart
  drawLineChart('admin-occ-chart', {
    labels: ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','Now'],
    datasets: [{ label: 'Occupancy %', data: [12,28,45,61,72,81,76,69,72], color: '#2563eb' }]
  });
}

/* ---- Admin Zones ---- */
function renderAdminZones(search = '') {
  const tbody = document.getElementById('zones-table-body');
  if (!tbody) return;
  let zones = AppState.data.parkingZones;
  if (search) zones = zones.filter(z => z.name.toLowerCase().includes(search.toLowerCase()) || z.location.toLowerCase().includes(search.toLowerCase()));
  tbody.innerHTML = zones.map(z => {
    const pct = getOccupancyPct(z);
    const fill = getOccupancyFillClass(pct);
    return `<tr>
      <td><strong>Zone ${escHtml(z.id)}</strong><div style="font-size:.75rem;color:var(--text-muted);">${escHtml(z.location)}</div></td>
      <td>${z.capacity}</td>
      <td>${z.occupied}</td>
      <td style="color:var(--success);">${z.available}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-bar-track" style="width:80px;"><div class="progress-bar-fill ${fill}" style="width:${pct}%;"></div></div>
          <span style="font-weight:600;">${pct}%</span>
        </div>
      </td>
      <td>${z.evCharging ? 'ΓÜí Yes' : 'ΓÇö'}</td>
      <td><span class="${getStatusBadgeClass(z.status)}">${getStatusLabel(z.status)}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-ghost btn-sm" onclick="showZoneDetails('${z.id}')">≡ƒæü</button>
          <button class="btn btn-ghost btn-sm" onclick="openEditZoneModal('${z.id}')">Γ£Å</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="confirmDeleteZone('${z.id}')">≡ƒùæ</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function openCreateZoneModal() {
  openModal('Create Parking Zone', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="nz-id">Zone ID</label>
        <input type="text" id="nz-id" class="form-control" placeholder="F" maxlength="2" />
      </div>
      <div class="form-group">
        <label class="form-label" for="nz-capacity">Capacity</label>
        <input type="number" id="nz-capacity" class="form-control" placeholder="100" min="1" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="nz-location">Location</label>
      <input type="text" id="nz-location" class="form-control" placeholder="e.g. North Block" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="nz-distance">Distance (m)</label>
        <input type="number" id="nz-distance" class="form-control" placeholder="300" min="0" />
      </div>
      <div class="form-group">
        <label class="form-label" for="nz-price">Price (Γé╣/hr)</label>
        <input type="number" id="nz-price" class="form-control" placeholder="25" min="0" />
      </div>
    </div>
    <div class="d-flex gap-16" style="flex-wrap:wrap;">
      <label class="form-check"><input type="checkbox" id="nz-ev"> ΓÜí EV Charging</label>
      <label class="form-check"><input type="checkbox" id="nz-accessible"> ΓÖ┐ Accessible</label>
      <label class="form-check"><input type="checkbox" id="nz-covered"> ≡ƒÅá Covered</label>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="createZone()">Create Zone</button>`
  );
}

function createZone() {
  const id       = document.getElementById('nz-id').value.toUpperCase().trim();
  const capacity = parseInt(document.getElementById('nz-capacity').value) || 0;
  const location = document.getElementById('nz-location').value.trim();
  const distance = parseInt(document.getElementById('nz-distance').value) || 300;
  const price    = parseInt(document.getElementById('nz-price').value) || 25;
  if (!id || capacity < 1 || !location) { showToast('Fill required fields', '', 'warning'); return; }
  if (AppState.data.parkingZones.find(z => z.id === id)) { showToast('Zone exists', `Zone ${id} already exists.`, 'warning'); return; }
  const newZone = {
    id, name: 'Zone ' + id, capacity, occupied: 0, available: capacity,
    location, distance, walkTime: Math.ceil(distance / 80), price,
    evCharging: document.getElementById('nz-ev').checked,
    accessible: document.getElementById('nz-accessible').checked,
    covered: document.getElementById('nz-covered').checked,
    status: 'active', openHours: '24/7', security: 'CCTV',
    lat: 17.385 + Math.random() * 0.01, lng: 78.486 + Math.random() * 0.01
  };
  AppState.data.parkingZones.push(newZone);
  AppState.data.predictionData[id] = {
    current: 0, points: [0,5,12,18,22,18,10], labels: ['Now','30m','1h','1.5h','2h','2.5h','3h'],
    peakTime: '12:00 PM', peakOcc: '22%', confidence: '75%', alert: '≡ƒƒó New zone ΓÇö historical data accumulating.'
  };
  saveData();
  closeModal();
  renderAdminZones();
  showToast('Zone created', `Zone ${id} has been created.`, 'success');
}

function openEditZoneModal(zoneId) {
  const z = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!z) return;
  openModal(`Edit Zone ${zoneId}`, `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="ez-capacity">Capacity</label>
        <input type="number" id="ez-capacity" class="form-control" value="${z.capacity}" />
      </div>
      <div class="form-group">
        <label class="form-label" for="ez-price">Price (Γé╣/hr)</label>
        <input type="number" id="ez-price" class="form-control" value="${z.price}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="ez-location">Location</label>
      <input type="text" id="ez-location" class="form-control" value="${escHtml(z.location)}" />
    </div>
    <div class="form-group">
      <label class="form-label" for="ez-status">Status</label>
      <select class="form-control" id="ez-status">
        <option value="active" ${z.status==='active'?'selected':''}>Active</option>
        <option value="closed" ${z.status==='closed'?'selected':''}>Closed</option>
        <option value="maintenance" ${z.status==='maintenance'?'selected':''}>Maintenance</option>
      </select>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="updateZone('${zoneId}')">Save Changes</button>`
  );
}

function updateZone(zoneId) {
  const z = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!z) return;
  const cap = parseInt(document.getElementById('ez-capacity').value);
  if (cap >= 1) { z.capacity = cap; z.occupied = Math.min(z.occupied, cap); z.available = cap - z.occupied; }
  z.price    = parseInt(document.getElementById('ez-price').value) || z.price;
  z.location = document.getElementById('ez-location').value.trim() || z.location;
  z.status   = document.getElementById('ez-status').value;
  saveData();
  closeModal();
  renderAdminZones();
  showToast('Zone updated', `Zone ${zoneId} updated.`, 'success');
}

function confirmDeleteZone(zoneId) {
  if (!confirm(`Are you sure you want to delete Zone ${zoneId}?`)) return;
  AppState.data.parkingZones = AppState.data.parkingZones.filter(z => z.id !== zoneId);
  saveData();
  renderAdminZones();
  showToast('Zone deleted', `Zone ${zoneId} removed.`, 'warning');
}

/* ---- Admin Live Occupancy ---- */
function renderAdminOccupancy() {
  renderLiveOccBars();
  renderHotspotAnalysis();
  drawZoneBarChart('occ-bar-chart');
}

function renderLiveOccBars() {
  const container = document.getElementById('live-occ-bars');
  if (!container) return;
  container.innerHTML = AppState.data.parkingZones.map(z => {
    const pct = getOccupancyPct(z);
    const fill = getOccupancyFillClass(pct);
    const barColor = pct >= 95 ? '#ef4444' : pct >= 80 ? '#f97316' : pct >= 50 ? '#eab308' : '#22c55e';
    return `<div class="occ-bar-row">
      <div class="occ-zone-name">${escHtml(z.name)}</div>
      <div class="occ-bar-track">
        <div class="occ-bar-fill" style="width:${pct}%;background:${barColor};">${z.name} ${pct}%</div>
      </div>
      <div class="occ-pct" style="color:${barColor};">${pct}%</div>
      <div class="occ-detail">${z.occupied}/${z.capacity}</div>
    </div>`;
  }).join('');
}

function renderHotspotAnalysis() {
  const el = document.getElementById('hotspot-analysis');
  if (!el) return;
  const sorted = [...AppState.data.parkingZones].sort((a,b) => getOccupancyPct(b) - getOccupancyPct(a));
  el.innerHTML = sorted.map((z, i) => {
    const pct = getOccupancyPct(z);
    return `<div class="info-row">
      <span class="ir-label">${i === 0 ? '≡ƒöÑ' : i === 1 ? 'ΓÜá' : '≡ƒôè'} ${escHtml(z.name)}</span>
      <span class="ir-value" style="color:${pct>=80?'var(--danger)':pct>=50?'var(--warning)':'var(--success)'};">${pct}%</span>
    </div>`;
  }).join('');
}

/* ---- Admin Reservations ---- */
function renderAdminReservations(search = '', status = '') {
  const tbody = document.getElementById('admin-res-table-body');
  if (!tbody) return;
  let res = [...AppState.data.reservations];
  if (search) res = res.filter(r => r.resId.toLowerCase().includes(search) || r.vehicle.toLowerCase().includes(search) || r.zoneId.toLowerCase().includes(search));
  if (status) res = res.filter(r => r.status === status);
  tbody.innerHTML = res.map(r => {
    const user = AppState.data.users.find(u => u.id === r.userId);
    return `<tr>
      <td><span style="font-family:var(--font-mono);font-size:.8rem;">${escHtml(r.resId)}</span></td>
      <td>${user ? escHtml(user.firstName + ' ' + user.lastName) : 'N/A'}</td>
      <td>Zone ${escHtml(r.zoneId)}</td>
      <td>${escHtml(r.slot)}</td>
      <td>${escHtml(r.entryTime)}</td>
      <td>${escHtml(r.exitTime)}</td>
      <td style="font-family:var(--font-mono);font-size:.8rem;">${escHtml(r.vehicle)}</td>
      <td><span class="${getStatusBadgeClass(r.status)}">${getStatusLabel(r.status)}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-ghost btn-sm" onclick="showQRPass('${r.id}')">≡ƒô▒</button>
          ${r.status==='active'?`<button class="btn btn-danger btn-sm" onclick="handleCancelReservation('${r.id}');renderAdminReservations()">Γ£ò</button>`:''}
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted);">No reservations found</td></tr>';
}

/* ---- Admin Users ---- */
function renderAdminUsers(search = '') {
  const tbody = document.getElementById('admin-users-table-body');
  if (!tbody) return;
  let users = AppState.data.users;
  if (search) users = users.filter(u => (u.firstName+' '+u.lastName).toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  tbody.innerHTML = users.map(u => {
    const vehCount = AppState.data.vehicles.filter(v => v.userId === u.id).length;
    const resCount = AppState.data.reservations.filter(r => r.userId === u.id).length;
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;flex-shrink:0;">${u.firstName[0]}</div>
          <div><div style="font-weight:600;">${escHtml(u.firstName + ' ' + u.lastName)}</div><div style="font-size:.75rem;color:var(--text-muted);">${u.role}</div></div>
        </div>
      </td>
      <td>${escHtml(u.email)}</td>
      <td>${escHtml(u.phone || 'ΓÇö')}</td>
      <td>${vehCount}</td>
      <td>${resCount}</td>
      <td style="font-size:.8rem;color:var(--text-muted);">${escHtml(u.joined || 'ΓÇö')}</td>
      <td><span class="${getStatusBadgeClass(u.status)}">${getStatusLabel(u.status)}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-ghost btn-sm" onclick="toggleUserStatus('${u.id}')">${u.status==='active'?'ΓÅ╕ Deactivate':'Γû╢ Activate'}</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function toggleUserStatus(userId) {
  const u = AppState.data.users.find(u => u.id === userId);
  if (!u) return;
  u.status = u.status === 'active' ? 'inactive' : 'active';
  saveData();
  renderAdminUsers(document.getElementById('admin-users-search')?.value || '');
  showToast('User status updated', `${u.firstName} is now ${u.status}.`, 'info');
}

/* ---- Admin Violations ---- */
function renderAdminViolations(search = '', status = '') {
  const tbody = document.getElementById('violations-table-body');
  if (!tbody) return;
  let viols = [...AppState.data.violations];
  if (search) viols = viols.filter(v => v.vehicle.toLowerCase().includes(search) || v.zone.toLowerCase().includes(search) || v.type.toLowerCase().includes(search));
  if (status) viols = viols.filter(v => v.status === status);
  tbody.innerHTML = viols.map(v => `
    <tr>
      <td><span style="font-family:var(--font-mono);font-size:.8rem;">${escHtml(v.vehicle)}</span></td>
      <td>Zone ${escHtml(v.zone)}</td>
      <td>${escHtml(v.slot)}</td>
      <td>${escHtml(v.type)}</td>
      <td style="font-size:.8rem;color:var(--text-muted);">${escHtml(v.time)}, ${escHtml(v.date)}</td>
      <td><span class="${getStatusBadgeClass(v.status)}">${getStatusLabel(v.status)}</span></td>
      <td>
        <div class="table-actions">
          ${v.status==='open'?`<button class="btn btn-success btn-sm" onclick="resolveViolation('${v.id}')">Γ£ô Resolve</button>`:''}
          <button class="btn btn-ghost btn-sm" onclick="addViolationNote('${v.id}')">≡ƒô¥ Note</button>
        </div>
      </td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No violations found</td></tr>';
}

function resolveViolation(violId) {
  const v = AppState.data.violations.find(v => v.id === violId);
  if (v) { v.status = 'resolved'; saveData(); renderAdminViolations(); showToast('Resolved', 'Violation marked as resolved.', 'success'); }
}

function addViolationNote(violId) {
  openModal('Add Note', `
    <div class="form-group">
      <label class="form-label" for="viol-note">Note</label>
      <textarea id="viol-note" class="form-control" rows="3" placeholder="Enter note..."></textarea>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="saveViolationNote('${violId}')">Save Note</button>`
  );
}

function saveViolationNote(violId) {
  const note = document.getElementById('viol-note').value.trim();
  const v = AppState.data.violations.find(v => v.id === violId);
  if (v && note) { v.note = note; saveData(); }
  closeModal();
  showToast('Note saved', 'Note added to violation.', 'success');
}

function openAddViolationModal() {
  openModal('Add Violation', `
    <div class="form-group">
      <label class="form-label" for="av-vehicle">Vehicle Plate</label>
      <input type="text" id="av-vehicle" class="form-control" placeholder="AP39XX1234" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="av-zone">Zone</label>
        <select class="form-control" id="av-zone">
          ${AppState.data.parkingZones.map(z=>`<option value="${z.id}">${z.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="av-slot">Slot</label>
        <input type="text" id="av-slot" class="form-control" placeholder="A-12" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="av-type">Violation Type</label>
      <select class="form-control" id="av-type">
        <option>Wrong Slot</option>
        <option>Expired Reservation</option>
        <option>No EV Charging</option>
        <option>Unauthorized</option>
        <option>Double Parking</option>
      </select>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="saveViolation()">Add Violation</button>`
  );
}

function saveViolation() {
  const vehicle = document.getElementById('av-vehicle').value.trim();
  const zone    = document.getElementById('av-zone').value;
  const slot    = document.getElementById('av-slot').value.trim();
  const type    = document.getElementById('av-type').value;
  if (!vehicle) { showToast('Enter vehicle plate', '', 'warning'); return; }
  AppState.data.violations.push({
    id: 'viol' + Date.now(), vehicle, userId: null, zone, slot: slot || zone + '-??',
    type, time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}),
    date: new Date().toISOString().split('T')[0], status: 'open', note: ''
  });
  saveData();
  closeModal();
  renderAdminViolations();
  showToast('Violation added', `${type} violation recorded.`, 'warning');
}

/* ---- Admin Alerts ---- */
function renderAdminAlerts() {
  const container = document.getElementById('alerts-list');
  if (!container) return;
  if (!AppState.data.sensorAlerts.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">≡ƒöö</div><h3>No alerts</h3><p>All systems are operating normally.</p></div>`;
    return;
  }
  container.innerHTML = AppState.data.sensorAlerts.map(a => `
    <div class="alert-item ${a.severity}" style="${a.acknowledged?'opacity:.6':''}">
      <div class="alert-icon">${a.severity==='critical'?'≡ƒö┤':a.severity==='warning'?'≡ƒƒá':'≡ƒö╡'}</div>
      <div class="alert-content">
        <div class="alert-title">
          <span class="alert-severity severity-${a.severity}">${a.severity.toUpperCase()}</span>
          ${escHtml(a.title)}
        </div>
        <div class="alert-body">${escHtml(a.body)}</div>
        <div style="font-size:.75rem;color:var(--text-muted);margin-top:5px;">${escHtml(a.time)}</div>
      </div>
      <div class="alert-actions">
        ${!a.acknowledged?`<button class="btn btn-outline btn-sm" onclick="acknowledgeAlert('${a.id}')">Γ£ô Ack</button>`:'<span style="font-size:.75rem;color:var(--success);">Acknowledged</span>'}
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteAlert('${a.id}')">≡ƒùæ</button>
      </div>
    </div>`).join('');
}

function acknowledgeAlert(alertId) {
  const a = AppState.data.sensorAlerts.find(a => a.id === alertId);
  if (a) { a.acknowledged = true; saveData(); renderAdminAlerts(); showToast('Alert acknowledged', a.title, 'info'); }
}

function deleteAlert(alertId) {
  AppState.data.sensorAlerts = AppState.data.sensorAlerts.filter(a => a.id !== alertId);
  saveData();
  renderAdminAlerts();
}

function openCreateAlertModal() {
  openModal('Create Alert', `
    <div class="form-group">
      <label class="form-label" for="ca-severity">Severity</label>
      <select class="form-control" id="ca-severity">
        <option value="critical">≡ƒö┤ Critical</option>
        <option value="warning" selected>≡ƒƒá Warning</option>
        <option value="info">≡ƒö╡ Info</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" for="ca-title">Title</label>
      <input type="text" id="ca-title" class="form-control" placeholder="Alert title..." />
    </div>
    <div class="form-group">
      <label class="form-label" for="ca-body">Description</label>
      <textarea id="ca-body" class="form-control" rows="3" placeholder="Alert details..."></textarea>
    </div>
  `,
  `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
   <button class="btn btn-primary" onclick="createAlert()">Create Alert</button>`
  );
}

function createAlert() {
  const sev   = document.getElementById('ca-severity').value;
  const title = document.getElementById('ca-title').value.trim();
  const body  = document.getElementById('ca-body').value.trim();
  if (!title) { showToast('Enter a title', '', 'warning'); return; }
  AppState.data.sensorAlerts.unshift({ id: 'sa'+Date.now(), severity: sev, title, body, time: 'Just now', acknowledged: false });
  saveData();
  closeModal();
  renderAdminAlerts();
  showToast('Alert created', title, sev === 'critical' ? 'danger' : sev === 'warning' ? 'warning' : 'info');
}

/* ---- Admin Analytics ---- */
function renderAdminAnalytics() {
  const range = document.getElementById('analytics-range')?.value || 'week';
  drawAnalyticsDailyChart(range);
  drawAnalyticsZoneDonut();
  drawAnalyticsPeakChart();
  drawAnalyticsWeeklyChart();
  renderAnalyticsDuration();
}

function renderAnalyticsDuration() {
  const el = document.getElementById('analytics-duration-body');
  if (!el) return;
  el.innerHTML = `
    <div class="info-row"><span class="ir-label">Average Duration</span><span class="ir-value fw-700">2h 04m</span></div>
    <div class="info-row"><span class="ir-label">Shortest</span><span class="ir-value">28 min</span></div>
    <div class="info-row"><span class="ir-label">Longest</span><span class="ir-value">6h 12m</span></div>
    <div class="info-row"><span class="ir-label">Most common</span><span class="ir-value">1ΓÇô2 hrs</span></div>
    <div class="info-row"><span class="ir-label">Peak Day</span><span class="ir-value">Wednesday</span></div>
    <div class="info-row"><span class="ir-label">Peak Hour</span><span class="ir-value">10:00 AM</span></div>
  `;
}

/* ---- Admin Predictions ---- */
function renderAdminPredictions() {
  const zoneId = document.getElementById('pred-zone-select')?.value || 'A';
  runPredictionForZone(zoneId);
  renderPredictionZoneCards();
}

async function runPredictionForZone(zoneId) {
  const pred = await fetchPredictions(zoneId);
  document.getElementById('pred-chart-title').textContent = `Zone ${zoneId} ΓÇö Occupancy Prediction`;
  safeSet('pred-peak-time', pred.peakTime);
  safeSet('pred-peak-occ', pred.peakOcc);
  safeSet('pred-confidence', pred.confidence);
  drawPredictionChart('prediction-chart', pred);
}

function renderPredictionZoneCards() {
  const container = document.getElementById('pred-zone-cards');
  if (!container) return;
  container.innerHTML = AppState.data.parkingZones.map(z => {
    const pred = AppState.data.predictionData[z.id];
    if (!pred) return '';
    const pct = getOccupancyPct(z);
    return `
    <div class="parking-result-card">
      <div class="prc-header">
        <div class="prc-name">${escHtml(z.name)}</div>
        <span class="${getStatusBadgeClass(getOccupancyStatus(pct))}">${getOccupancyEmoji(pct)} ${pct}%</span>
      </div>
      <div style="margin-bottom:10px;font-size:.82rem;color:var(--text-secondary);">
        ${escHtml(pred.alert)}
      </div>
      <div class="info-row" style="padding:6px 0;"><span class="ir-label">Peak Time</span><span class="ir-value">${pred.peakTime}</span></div>
      <div class="info-row" style="padding:6px 0;"><span class="ir-label">Peak Occ</span><span class="ir-value">${pred.peakOcc}</span></div>
      <div class="info-row" style="padding:6px 0;"><span class="ir-label">Confidence</span><span class="ir-value">${pred.confidence}</span></div>
      <button class="btn btn-outline btn-sm btn-block mt-12" onclick="document.getElementById('pred-zone-select').value='${z.id}';runPredictionForZone('${z.id}')">View Full Prediction</button>
    </div>`;
  }).join('');
}

/* ---- Admin Sensor Simulator ---- */
function renderAdminSensor() {
  const zoneId  = document.getElementById('sim-zone-select')?.value || 'A';
  const zone    = AppState.data.parkingZones.find(z => z.id === zoneId);
  if (!zone) return;

  safeSet('sim-zone-label', zoneId);
  const pct = getOccupancyPct(zone);
  safeSet('sim-gauge-pct', pct + '%');
  safeSet('sim-occupied', zone.occupied);
  safeSet('sim-capacity', zone.capacity);

  // Color gauge
  const gauge = document.getElementById('sim-gauge');
  if (gauge) {
    const c = pct >= 90 ? '#ef4444' : pct >= 75 ? '#f97316' : pct >= 50 ? '#eab308' : '#22c55e';
    gauge.style.borderColor = c;
  }

  // Render individual sensor panels
  renderSensorPanels(zone);
}

function renderSensorPanels(zone) {
  const grid = document.getElementById('sensor-panels-grid');
  if (!grid) return;
  const sensors = ['01','02','03','04'].map(num => ({
    id: `${zone.id}-${num}`,
    name: `Sensor ${zone.id}-${num}`,
    online: Math.random() > 0.15,
    readings: Math.floor(Math.random() * zone.capacity / 4)
  }));

  grid.innerHTML = sensors.map(s => `
    <div class="sensor-panel">
      <div class="sensor-header">
        <div style="font-size:.82rem;font-weight:700;">${s.name}</div>
        <div class="sensor-status ${s.online?'online':'offline'}">
          <div class="sensor-online-dot ${s.online?'online':'offline'}"></div>
          ${s.online ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>
      <div class="sensor-body" style="padding:12px;">
        <div style="text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);">${s.readings}</div>
          <div style="font-size:.72rem;color:var(--text-muted);">Vehicles detected</div>
        </div>
      </div>
    </div>`).join('');
}

function appendSensorLog(msg, type = 'normal') {
  const log = document.getElementById('sim-log');
  if (!log) return;
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const cls  = type === 'warn' ? 'log-warn' : '';
  log.innerHTML += `<div><span class="log-time">[${time}]</span> <span class="${cls}">${escHtml(msg)}</span></div>`;
  log.scrollTop = log.scrollHeight;
  // Keep log trim
  const lines = log.querySelectorAll('div');
  if (lines.length > 30) lines[0].remove();
}

/* ---- Admin Settings ---- */
function renderAdminSettings() {
  const darkToggle = document.getElementById('settings-dark-toggle');
  if (darkToggle) darkToggle.checked = AppState.theme === 'dark';
}

/* ============================================================
   23. CHARTS (Canvas-based, pure JS ΓÇö no external libs)
   ============================================================ */
function getChartColors() {
  const isDark = AppState.theme === 'dark';
  return {
    grid:    isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)',
    text:    isDark ? '#9ca3af' : '#6b7280',
    bg:      isDark ? '#111827' : '#ffffff'
  };
}

/** Draw a line chart on a canvas */
function drawLineChart(canvasId, { labels, datasets }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = parseInt(canvas.getAttribute('height')) || 200;
  canvas.width  = W;
  canvas.height = H;
  const col = getChartColors();

  const pad = { top: 16, right: 16, bottom: 32, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  // Grid & labels
  const maxVal = 100;
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + chartH - (i / gridLines) * chartH;
    ctx.beginPath();
    ctx.strokeStyle = col.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col.text;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridLines) * maxVal) + '%', pad.left - 6, y + 4);
  }

  datasets.forEach(ds => {
    const data = ds.data;
    const step = chartW / (data.length - 1);

    // Fill area
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, ds.color + '33');
    grad.addColorStop(1, ds.color + '00');
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + chartH - (data[0] / maxVal) * chartH);
    data.forEach((v, i) => ctx.lineTo(pad.left + i * step, pad.top + chartH - (v / maxVal) * chartH));
    ctx.lineTo(pad.left + (data.length - 1) * step, pad.top + chartH);
    ctx.lineTo(pad.left, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    data.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top + chartH - (v / maxVal) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top + chartH - (v / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });

  // X labels
  ctx.fillStyle = col.text;
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  const step = chartW / (labels.length - 1);
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + i * step, H - 8);
  });
}

/** Bar chart */
function drawBarChart(canvasId, { labels, data, colors }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = parseInt(canvas.getAttribute('height')) || 200;
  canvas.width = W; canvas.height = H;
  const col = getChartColors();
  const pad = { top: 16, right: 16, bottom: 40, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);
  const maxVal = Math.max(...data, 100);
  const barW   = (chartW / labels.length) * 0.6;
  const barGap = chartW / labels.length;

  // Grid
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + chartH - (i / 5) * chartH;
    ctx.beginPath(); ctx.strokeStyle = col.grid; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = col.text; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / 5) * maxVal) + '%', pad.left - 5, y + 4);
  }

  data.forEach((v, i) => {
    const x = pad.left + i * barGap + (barGap - barW) / 2;
    const barH = (v / maxVal) * chartH;
    const y = pad.top + chartH - barH;
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = colors ? colors[i % colors.length] : '#2563eb';
    ctx.fill();

    // Value label
    ctx.fillStyle = col.text; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(v + '%', x + barW / 2, y - 5);

    // X label
    ctx.fillStyle = col.text; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 8);
  });
}

/** Donut chart */
function drawDonutChart(canvasId, { labels, data, colors }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.offsetWidth, parseInt(canvas.getAttribute('height'))) || 200;
  canvas.width = size; canvas.height = size;
  const cx = size / 2, cy = size / 2, r = size * 0.38, innerR = size * 0.24;
  const total = data.reduce((s, v) => s + v, 0);
  let startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, size, size);
  data.forEach((v, i) => {
    const angle = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    startAngle += angle;
  });
  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = getChartColors().bg;
  ctx.fill();
  // Center label
  ctx.fillStyle = getChartColors().text;
  ctx.font = `bold ${Math.round(size * 0.08)}px Inter,sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Zones', cx, cy);
}

function drawZoneBarChart(canvasId) {
  const zones = AppState.data.parkingZones;
  drawBarChart(canvasId, {
    labels: zones.map(z => z.name),
    data:   zones.map(z => getOccupancyPct(z)),
    colors: zones.map(z => {
      const p = getOccupancyPct(z);
      return p>=90?'#ef4444':p>=75?'#f97316':p>=50?'#eab308':'#22c55e';
    })
  });
}

function drawAnalyticsDailyChart(range) {
  const labelsMap = {
    today: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
    week:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    month: ['Wk1','Wk2','Wk3','Wk4'],
    year:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  };
  const dataMap = {
    today: [5,8,12,22,48,71,82,76,68,74,62,38],
    week:  [68,72,81,75,88,61,45],
    month: [70,74,80,76],
    year:  [45,50,60,72,78,82,80,76,72,68,60,55]
  };
  drawLineChart('analytics-daily-chart', {
    labels: labelsMap[range] || labelsMap.week,
    datasets: [{ label: 'Occupancy %', data: dataMap[range] || dataMap.week, color: '#2563eb' }]
  });
}

function drawAnalyticsZoneDonut() {
  const zones = AppState.data.parkingZones;
  drawDonutChart('analytics-zone-chart', {
    labels: zones.map(z => z.name),
    data:   zones.map(z => z.capacity),
    colors: ['#2563eb','#06b6d4','#22c55e','#f97316','#7c3aed']
  });
}

function drawAnalyticsPeakChart() {
  const hours = ['06','07','08','09','10','11','12','13','14','15','16','17','18'];
  const data  = [18,32,55,72,84,91,88,82,75,70,66,60,48];
  drawBarChart('analytics-peak-chart', {
    labels: hours.map(h => h + ':00'),
    data,
    colors: data.map(v => v>=80?'#ef4444':v>=60?'#f97316':v>=40?'#eab308':'#22c55e')
  });
}

function drawAnalyticsWeeklyChart() {
  drawLineChart('analytics-weekly-chart', {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label: 'Reservations', data: [42,58,62,55,70,48,32], color: '#2563eb' }
    ]
  });
}

function drawPredictionChart(canvasId, pred) {
  drawLineChart(canvasId, {
    labels: pred.labels,
    datasets: [{
      label: 'Predicted Occupancy',
      data: pred.points,
      color: pred.current >= 80 ? '#ef4444' : pred.current >= 50 ? '#f97316' : '#22c55e'
    }]
  });
}

/* ============================================================
   24. DARK / LIGHT MODE
   ============================================================ */
function setTheme(theme) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.textContent = theme === 'dark' ? 'ΓÿÇ' : '≡ƒîÖ';
  const settingsToggle = document.getElementById('settings-dark-toggle');
  if (settingsToggle) settingsToggle.checked = theme === 'dark';
  localStorage.setItem('smartpark_theme', theme);
  // Redraw charts
  if (AppState.currentView) {
    setTimeout(() => { if (AppState.currentView) renderView(AppState.currentView); }, 100);
  }
}

function toggleTheme() {
  setTheme(AppState.theme === 'light' ? 'dark' : 'light');
}

/* ============================================================
   25. EVENT LISTENERS
   ============================================================ */
function attachEventListeners() {

  // --- Landing Page ---
  document.getElementById('landing-login-btn').addEventListener('click', () => showView('login-page'));
  document.getElementById('landing-signup-btn').addEventListener('click', () => showView('register-page'));
  document.getElementById('hero-find-btn').addEventListener('click', () => { showView('login-page'); });
  document.getElementById('hero-dashboard-btn').addEventListener('click', () => { showView('login-page'); });
  document.getElementById('cta-signup-btn').addEventListener('click', () => showView('register-page'));
  document.getElementById('cta-login-btn').addEventListener('click', () => showView('login-page'));

  // --- Auth ---
  document.getElementById('goto-register').addEventListener('click', () => showView('register-page'));
  document.getElementById('goto-login').addEventListener('click', () => showView('login-page'));

  document.getElementById('demo-user-btn').addEventListener('click', () => {
    document.getElementById('login-email').value = 'alex@smartpark.demo';
    document.getElementById('login-password').value = 'demo1234';
  });

  document.getElementById('demo-admin-btn').addEventListener('click', () => {
    document.getElementById('login-email').value = 'admin@smartpark.demo';
    document.getElementById('login-password').value = 'admin1234';
  });

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;
    const user  = loginUser(email, pass);
    const errEl = document.getElementById('login-error');
    const errMsg = document.getElementById('login-error-msg');
    if (!user) {
      errEl.style.display = 'block';
      errMsg.textContent = 'Invalid email or password. Try demo credentials.';
      return;
    }
    errEl.style.display = 'none';
    enterApp(user);
    showToast('Welcome back!', `Hello ${user.firstName}!`, 'success');
  });

  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fname  = document.getElementById('reg-fname').value.trim();
    const lname  = document.getElementById('reg-lname').value.trim();
    const email  = document.getElementById('reg-email').value.trim();
    const phone  = document.getElementById('reg-phone').value.trim();
    const pass   = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const errEl  = document.getElementById('register-error');

    if (!fname || !lname || !email || !pass) { errEl.style.display='block'; errEl.textContent='Please fill all required fields.'; return; }
    if (pass.length < 8) { errEl.style.display='block'; errEl.textContent='Password must be at least 8 characters.'; return; }
    if (pass !== confirm) { errEl.style.display='block'; errEl.textContent='Passwords do not match.'; return; }
    if (AppState.data.users.find(u => u.email.toLowerCase() === email.toLowerCase())) { errEl.style.display='block'; errEl.textContent='Email already registered.'; return; }

    const newUser = {
      id: 'u' + Date.now(), firstName: fname, lastName: lname, email, phone, password: pass,
      role: 'user', joined: new Date().toISOString().split('T')[0], status: 'active', vehicles: [], reservations: []
    };
    AppState.data.users.push(newUser);
    saveData();
    errEl.style.display = 'none';
    enterApp(newUser);
    showToast('Account created!', `Welcome to SmartPark, ${fname}!`, 'success');
  });

  // --- Sidebar View Toggle ---
  document.getElementById('user-view-btn').addEventListener('click', () => switchNavMode('user'));
  document.getElementById('admin-view-btn').addEventListener('click', () => switchNavMode('admin'));

  // --- Nav Items ---
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });

  // --- Dropdown nav items ---
  document.querySelectorAll('.dropdown-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });

  // --- Logout ---
  document.getElementById('logout-btn').addEventListener('click', logoutUser);
  document.getElementById('dropdown-logout').addEventListener('click', logoutUser);

  // --- Hamburger (mobile) ---
  document.getElementById('hamburger-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);

  // --- Theme Toggle ---
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // --- Header Notification button ---
  document.getElementById('header-notif-btn').addEventListener('click', () => navigateTo('notifications'));

  // --- Avatar dropdown ---
  document.getElementById('avatar-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = document.getElementById('user-dropdown');
    dd.classList.toggle('open');
    document.getElementById('avatar-btn').setAttribute('aria-expanded', dd.classList.contains('open'));
  });
  document.addEventListener('click', () => {
    document.getElementById('user-dropdown').classList.remove('open');
  });

  // --- Find Parking: Search & Filters ---
  const searchInput = document.getElementById('parking-search-input');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        renderFindParking(searchInput.value, AppState.currentParkingFilter || 'all');
      }, 280);
    });
  }

  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip[data-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.currentParkingFilter = chip.dataset.filter;
      renderFindParking(document.getElementById('parking-search-input')?.value || '', chip.dataset.filter);
    });
  });

  ['filter-distance', 'filter-vehicle', 'filter-sort'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => renderFindParking(document.getElementById('parking-search-input')?.value || '', AppState.currentParkingFilter || 'all'));
  });

  document.getElementById('clear-search-btn')?.addEventListener('click', () => {
    const si = document.getElementById('parking-search-input');
    if (si) si.value = '';
    AppState.currentParkingFilter = 'all';
    document.querySelectorAll('.filter-chip[data-filter]').forEach(c => c.classList.toggle('active', c.dataset.filter==='all'));
    renderFindParking();
  });

  // --- Reservations ---
  document.getElementById('new-reservation-btn').addEventListener('click', openNewReservation);
  document.getElementById('res-next-btn').addEventListener('click', handleNextReservationStep);
  document.getElementById('res-back-btn').addEventListener('click', () => {
    if (AppState.resStep > 1) { AppState.resStep--; updateReservationStep(); }
  });
  document.getElementById('res-cancel-btn').addEventListener('click', closeReservationCreator);

  // --- Vehicles ---
  document.getElementById('add-vehicle-btn').addEventListener('click', openAddVehicleModal);

  // --- History filters ---
  ['history-search','history-zone-filter','history-status-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderParkingHistory);
  });

  // --- Notifications ---
  document.getElementById('mark-all-read-btn').addEventListener('click', markAllNotifRead);

  document.querySelectorAll('[data-notif-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-notif-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.currentNotifFilter = btn.dataset.notifFilter;
      renderNotifications(btn.dataset.notifFilter);
    });
  });

  // --- Profile ---
  document.getElementById('edit-profile-btn').addEventListener('click', openEditProfileModal);

  // --- Dashboard: Park Here ---
  document.getElementById('dash-park-here-btn').addEventListener('click', () => startReservationForZone('C'));

  // ---- ADMIN ----

  // Zones
  document.getElementById('create-zone-btn').addEventListener('click', openCreateZoneModal);
  const zonesSearch = document.getElementById('zones-search');
  if (zonesSearch) zonesSearch.addEventListener('input', () => renderAdminZones(zonesSearch.value));

  // Admin Reservations search
  const adminResSearch = document.getElementById('admin-res-search');
  const adminResStatus = document.getElementById('admin-res-status-filter');
  if (adminResSearch) adminResSearch.addEventListener('input', () => renderAdminReservations(adminResSearch.value, adminResStatus?.value || ''));
  if (adminResStatus) adminResStatus.addEventListener('change', () => renderAdminReservations(adminResSearch?.value || '', adminResStatus.value));

  // Admin Users search
  const adminUsersSearch = document.getElementById('admin-users-search');
  if (adminUsersSearch) adminUsersSearch.addEventListener('input', () => renderAdminUsers(adminUsersSearch.value));

  // Violations
  document.getElementById('add-violation-btn').addEventListener('click', openAddViolationModal);
  const violSearch = document.getElementById('violations-search');
  const violStatus = document.getElementById('violations-status-filter');
  if (violSearch) violSearch.addEventListener('input', () => renderAdminViolations(violSearch.value, violStatus?.value || ''));
  if (violStatus) violStatus.addEventListener('change', () => renderAdminViolations(violSearch?.value || '', violStatus.value));

  // Alerts
  document.getElementById('create-alert-btn').addEventListener('click', openCreateAlertModal);

  // Analytics range
  const analyticsRange = document.getElementById('analytics-range');
  if (analyticsRange) analyticsRange.addEventListener('change', renderAdminAnalytics);

  // Predictions
  document.getElementById('run-prediction-btn').addEventListener('click', () => {
    const zoneId = document.getElementById('pred-zone-select').value;
    runPredictionForZone(zoneId);
    showToast('Prediction updated', `Running ML forecast for Zone ${zoneId}`, 'info');
  });
  document.getElementById('pred-zone-select').addEventListener('change', () => {
    runPredictionForZone(document.getElementById('pred-zone-select').value);
  });

  // Sensor Simulator
  document.getElementById('sim-zone-select').addEventListener('change', () => {
    renderAdminSensor();
    appendSensorLog(`Zone changed to Zone ${document.getElementById('sim-zone-select').value}`);
  });

  document.getElementById('sim-entry-btn').addEventListener('click', () => {
    const zoneId = document.getElementById('sim-zone-select').value;
    const ok = simulateSensorEntry(zoneId);
    if (ok) {
      appendSensorLog(`[ENTRY] Vehicle entered Zone ${zoneId}`, 'normal');
      renderAdminSensor();
      showToast('Vehicle entered', `Zone ${zoneId} occupancy updated.`, 'info');
    } else {
      appendSensorLog(`[WARN] Zone ${zoneId} is FULL ΓÇö entry blocked!`, 'warn');
      showToast('Zone full!', `Zone ${zoneId} has no available spaces.`, 'warning');
    }
  });

  document.getElementById('sim-exit-btn').addEventListener('click', () => {
    const zoneId = document.getElementById('sim-zone-select').value;
    const ok = simulateSensorExit(zoneId);
    if (ok) {
      appendSensorLog(`[EXIT] Vehicle exited Zone ${zoneId}`);
      renderAdminSensor();
      showToast('Vehicle exited', `Zone ${zoneId} has a new available space.`, 'success');
    }
  });

  document.getElementById('sim-random-btn').addEventListener('click', () => {
    const zoneId = document.getElementById('sim-zone-select').value;
    const count  = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (Math.random() > 0.4) simulateSensorEntry(zoneId);
        else simulateSensorExit(zoneId);
      }, i * 200);
    }
    setTimeout(() => {
      renderAdminSensor();
      appendSensorLog(`[RANDOM] Generated ${count} sensor events for Zone ${zoneId}`);
      showToast('Random data generated', `${count} sensor events simulated.`, 'info');
    }, count * 200 + 100);
  });

  // Settings ΓÇö dark mode toggle
  document.getElementById('settings-dark-toggle').addEventListener('change', (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  });

  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (!confirm('Reset all demo data to defaults? This cannot be undone.')) return;
    AppState.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
    renderView(AppState.currentView);
    showToast('Data reset', 'All demo data restored to defaults.', 'info');
  });

  // Auto-refresh toggle
  document.getElementById('settings-autorefresh-toggle')?.addEventListener('change', (e) => {
    AppState.autoRefresh = e.target.checked;
  });
}

/* ============================================================
   26. INIT
   ============================================================ */
function init() {
  // Load data
  AppState.data = loadData();

  // Load theme
  const savedTheme = localStorage.getItem('smartpark_theme') || 'light';
  setTheme(savedTheme);

  // Build hero grid animation
  initHeroGrid();

  // Attach all event listeners
  attachEventListeners();

  // Check existing session
  const session = loadSession();
  if (session) {
    const user = AppState.data.users.find(u => u.id === session.id);
    if (user) {
      AppState.currentUser = user;
      enterApp(user);
      return;
    }
  }

  // Show landing page
  showView('landing-page');

  // Animate hero counters after a short delay
  setTimeout(animateCounters, 400);
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   27. WINDOW RESIZE ΓÇö Redraw charts on resize
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (AppState.currentView) renderView(AppState.currentView);
  }, 300);
});

/* ============================================================
   28. GLOBAL FUNCTIONS (called from inline HTML onclick)
   Expose to window scope so onclick attributes can call them.
   ============================================================ */
window.showZoneDetails        = showZoneDetails;
window.showZoneInfo           = showZoneInfo;
window.selectSlotOnMap        = selectSlotOnMap;
window.startReservationForZone = startReservationForZone;
window.handleCancelReservation = handleCancelReservation;
window.showQRPass             = showQRPass;
window.closeReservationCreator = closeReservationCreator;
window.selectResZone          = selectResZone;
window.selectResVehicle       = selectResVehicle;
window.saveVehicle            = saveVehicle;
window.editVehicle            = editVehicle;
window.updateVehicle          = updateVehicle;
window.deleteVehicle          = deleteVehicle;
window.setPrimaryVehicle      = setPrimaryVehicle;
window.openEditZoneModal      = openEditZoneModal;
window.updateZone             = updateZone;
window.confirmDeleteZone      = confirmDeleteZone;
window.createZone             = createZone;
window.openAddViolationModal  = openAddViolationModal;
window.saveViolation          = saveViolation;
window.resolveViolation       = resolveViolation;
window.addViolationNote       = addViolationNote;
window.saveViolationNote      = saveViolationNote;
window.acknowledgeAlert       = acknowledgeAlert;
window.deleteAlert            = deleteAlert;
window.createAlert            = createAlert;
window.markNotifRead          = markNotifRead;
window.navigateTo             = navigateTo;
window.closeModal             = closeModal;
window.saveProfile            = saveProfile;
window.toggleUserStatus       = toggleUserStatus;
window.runPredictionForZone   = runPredictionForZone;
