/* ============================================================
   SMARTPARK ΓÇö find-parking-map.js
   Find Parking Dashboard Logic
   Vanilla JavaScript ┬╖ No frameworks
   Mock data structured for easy API replacement.
   ============================================================ */

'use strict';

/* ============================================================
   1. MOCK DATA ΓÇö Replace fetchParkingLocations() with real API
   ============================================================ */

const PARKING_LOCATIONS = [
  {
    id: 1,
    name: "City Center Parking",
    address: "Main Road, Kakinada",
    area: "City Center",
    latitude: 16.9891,
    longitude: 82.2475,
    price: 30,
    availableSpaces: 45,
    totalSpaces: 80,
    rating: 4.8,
    reviews: 312,
    type: "Car",
    covered: true,
    evCharging: true,
    accessible: true,
    security: "CCTV + Guard",
    openHours: "24/7",
    distance: 300,          // metres from centre (demo value)
    features: ["CCTV", "EV Charging", "Covered", "Accessible"]
  },
  {
    id: 2,
    name: "Central Mall Parking",
    address: "Market Road, Kakinada",
    area: "Market Road",
    latitude: 16.9910,
    longitude: 82.2500,
    price: 40,
    availableSpaces: 20,
    totalSpaces: 60,
    rating: 4.5,
    reviews: 198,
    type: "Car",
    covered: true,
    evCharging: false,
    accessible: true,
    security: "CCTV",
    openHours: "07:00 ΓÇô 22:00",
    distance: 650,
    features: ["CCTV", "Covered", "Accessible"]
  },
  {
    id: 3,
    name: "Railway Station Parking",
    address: "Station Road, Kakinada",
    area: "Station Road",
    latitude: 16.9840,
    longitude: 82.2440,
    price: 20,
    availableSpaces: 0,
    totalSpaces: 120,
    rating: 3.9,
    reviews: 87,
    type: "Car",
    covered: false,
    evCharging: false,
    accessible: true,
    security: "Guard",
    openHours: "24/7",
    distance: 900,
    features: ["Guard", "Accessible"]
  },
  {
    id: 4,
    name: "Beach Road Parking",
    address: "Beach Road, Kakinada",
    area: "Beach Road",
    latitude: 16.9760,
    longitude: 82.2550,
    price: 15,
    availableSpaces: 72,
    totalSpaces: 100,
    rating: 4.2,
    reviews: 143,
    type: "Bike",
    covered: false,
    evCharging: false,
    accessible: false,
    security: "CCTV",
    openHours: "06:00 ΓÇô 22:00",
    distance: 1200,
    features: ["CCTV", "Open Air"]
  },
  {
    id: 5,
    name: "EV Hub Charging Park",
    address: "Green City Layout, Kakinada",
    area: "Green City",
    latitude: 16.9930,
    longitude: 82.2430,
    price: 60,
    availableSpaces: 8,
    totalSpaces: 30,
    rating: 4.9,
    reviews: 56,
    type: "EV",
    covered: true,
    evCharging: true,
    accessible: true,
    security: "CCTV + Guard",
    openHours: "24/7",
    distance: 800,
    features: ["EV Charging", "CCTV", "Covered", "Accessible"]
  },
  {
    id: 6,
    name: "Airport Express Parking",
    address: "Airport Road, Kakinada",
    area: "Airport Road",
    latitude: 16.9700,
    longitude: 82.2390,
    price: 50,
    availableSpaces: 35,
    totalSpaces: 200,
    rating: 4.6,
    reviews: 421,
    type: "Car",
    covered: true,
    evCharging: true,
    accessible: true,
    security: "CCTV + Guard + Barrier",
    openHours: "24/7",
    distance: 2100,
    features: ["CCTV", "EV Charging", "Covered", "Accessible", "Barrier"]
  },
  {
    id: 7,
    name: "Old Town Bazaar Parking",
    address: "Old Town, Kakinada",
    area: "Old Town",
    latitude: 16.9870,
    longitude: 82.2610,
    price: 10,
    availableSpaces: 5,
    totalSpaces: 40,
    rating: 3.5,
    reviews: 34,
    type: "Bike",
    covered: false,
    evCharging: false,
    accessible: false,
    security: "None",
    openHours: "08:00 ΓÇô 20:00",
    distance: 1500,
    features: ["Open Air"]
  },
  {
    id: 8,
    name: "Hospital Complex Parking",
    address: "Surya Raoguda, Kakinada",
    area: "Surya Raoguda",
    latitude: 16.9820,
    longitude: 82.2480,
    price: 25,
    availableSpaces: 18,
    totalSpaces: 50,
    rating: 4.1,
    reviews: 112,
    type: "Car",
    covered: false,
    evCharging: false,
    accessible: true,
    security: "CCTV",
    openHours: "24/7",
    distance: 500,
    features: ["CCTV", "Accessible"]
  },
  {
    id: 9,
    name: "Tech Park Multi-Level",
    address: "Rajiv Nagar, Kakinada",
    area: "Rajiv Nagar",
    latitude: 17.0000,
    longitude: 82.2350,
    price: 45,
    availableSpaces: 90,
    totalSpaces: 300,
    rating: 4.7,
    reviews: 278,
    type: "Car",
    covered: true,
    evCharging: true,
    accessible: true,
    security: "CCTV + Guard + Barrier",
    openHours: "06:00 ΓÇô 22:00",
    distance: 3200,
    features: ["CCTV", "EV Charging", "Covered", "Accessible", "Barrier"]
  },
  {
    id: 10,
    name: "Civic Center Underground",
    address: "Civic Center, Kakinada",
    area: "Civic Center",
    latitude: 16.9860,
    longitude: 82.2510,
    price: 35,
    availableSpaces: 0,
    totalSpaces: 150,
    rating: 4.3,
    reviews: 189,
    type: "Car",
    covered: true,
    evCharging: true,
    accessible: true,
    security: "CCTV + Guard",
    openHours: "24/7",
    distance: 400,
    features: ["CCTV", "EV Charging", "Covered", "Accessible", "Underground"]
  },
  {
    id: 11,
    name: "Sports Complex Parking",
    address: "Sports Complex Road, Kakinada",
    area: "Sports Complex",
    latitude: 16.9780,
    longitude: 82.2300,
    price: 20,
    availableSpaces: 120,
    totalSpaces: 200,
    rating: 4.0,
    reviews: 65,
    type: "Car",
    covered: false,
    evCharging: false,
    accessible: true,
    security: "Guard",
    openHours: "06:00 ΓÇô 22:00",
    distance: 2800,
    features: ["Guard", "Accessible", "Open Air"]
  },
  {
    id: 12,
    name: "Harbour View Parking",
    address: "Port Road, Kakinada",
    area: "Port Road",
    latitude: 16.9640,
    longitude: 82.2600,
    price: 12,
    availableSpaces: 60,
    totalSpaces: 80,
    rating: 3.8,
    reviews: 29,
    type: "Bike",
    covered: false,
    evCharging: false,
    accessible: false,
    security: "CCTV",
    openHours: "06:00 ΓÇô 21:00",
    distance: 3800,
    features: ["CCTV", "Open Air"]
  }
];

/* ============================================================
   2. APP STATE
   ============================================================ */
const FPState = {
  map: null,
  markers: {},
  userMarker: null,
  userLat: null,
  userLng: null,
  selectedId: null,
  filteredData: [...PARKING_LOCATIONS],
  searchQuery: '',
  filters: {
    priceRange: 'any',
    availability: 'any',
    type: 'all',
    distance: 'any'
  },
  sort: 'recommended',
  mobileTab: 'list'   // 'map' | 'list'
};

/* ============================================================
   3. DARK MODE HELPERS
   ============================================================ */
function isDarkMode() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const btn = document.getElementById('fp-theme-btn');
  if (btn) btn.textContent = dark ? 'ΓÿÇ' : '≡ƒîÖ';
  // Update Leaflet tiles if map exists
  updateMapTileTheme(dark);
  // Persist
  try { localStorage.setItem('smartpark_theme', dark ? 'dark' : 'light'); } catch(e){}
}

function updateMapTileTheme(dark) {
  if (!FPState.map) return;
  // OpenStreetMap doesn't have a dark variant without a token,
  // so we apply a CSS filter on the map tiles for dark mode.
  const mapEl = document.getElementById('fp-leaflet-map');
  if (mapEl) {
    mapEl.style.filter = dark
      ? 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.05)'
      : '';
  }
}

function loadTheme() {
  try {
    const stored = localStorage.getItem('smartpark_theme');
    if (stored) { applyTheme(stored === 'dark'); return; }
  } catch(e){}
  // Respect system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme(true);
  }
}

/* ============================================================
   4. UTILITY HELPERS
   ============================================================ */
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getAvailabilityStatus(loc) {
  if (loc.availableSpaces === 0) return 'full';
  if (loc.availableSpaces <= Math.ceil(loc.totalSpaces * 0.2)) return 'limited';
  return 'available';
}

function getAvailabilityLabel(loc) {
  const s = getAvailabilityStatus(loc);
  if (s === 'full')    return '<span class="avail-dot avail-full" aria-label="Full"></span> Full';
  if (s === 'limited') return '<span class="avail-dot avail-limited" aria-label="Limited"></span> Limited';
  return `<span class="avail-dot avail-ok" aria-label="Available"></span> ${loc.availableSpaces} Available`;
}

function getAvailabilityBadgeClass(loc) {
  const s = getAvailabilityStatus(loc);
  if (s === 'full')    return 'status-badge badge-full';
  if (s === 'limited') return 'status-badge badge-high';
  return 'status-badge badge-available';
}

function getAvailabilityBadgeLabel(loc) {
  const s = getAvailabilityStatus(loc);
  if (s === 'full')    return '≡ƒö┤ Full';
  if (s === 'limited') return '≡ƒƒá Limited';
  return `≡ƒƒó ${loc.availableSpaces} Available`;
}

function getTypeIcon(type) {
  const map = { Car: '≡ƒÜù', Bike: '≡ƒÅì', EV: 'ΓÜí' };
  return map[type] || '≡ƒÜù';
}

function formatDistance(m) {
  return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
}

function formatStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = 'Γÿà'.repeat(full);
  if (half) s += '┬╜';
  return s;
}

function calcRecommendationScore(loc) {
  const availPct = loc.totalSpaces > 0 ? (loc.availableSpaces / loc.totalSpaces) : 0;
  const avail = availPct * 40;
  const dist  = Math.max(0, 30 - (loc.distance / 200));
  const price = Math.max(0, 15 - (loc.price / 8));
  const extras = (loc.evCharging ? 5 : 0) + (loc.covered ? 3 : 0) + (loc.accessible ? 2 : 0);
  return Math.min(100, Math.round(avail + dist + price + extras));
}

/* ============================================================
   5. SEARCH, FILTER & SORT
   ============================================================ */
function applyFiltersAndSearch() {
  const q = FPState.searchQuery.toLowerCase().trim();
  const { priceRange, availability, type, distance } = FPState.filters;

  FPState.filteredData = PARKING_LOCATIONS.filter(loc => {
    // Search
    if (q) {
      const searchable = `${loc.name} ${loc.address} ${loc.area} ${loc.type}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    // Price filter
    if (priceRange !== 'any') {
      if (priceRange === 'under20'  && loc.price >= 20)   return false;
      if (priceRange === '20to50'   && (loc.price < 20 || loc.price > 50)) return false;
      if (priceRange === '50to100'  && (loc.price < 50 || loc.price > 100)) return false;
      if (priceRange === 'over100'  && loc.price <= 100)  return false;
    }
    // Availability filter
    if (availability !== 'any') {
      const s = getAvailabilityStatus(loc);
      if (availability === 'available' && s !== 'available') return false;
      if (availability === 'limited'   && s !== 'limited')   return false;
      if (availability === 'full'      && s !== 'full')      return false;
    }
    // Type filter
    if (type !== 'all') {
      if (type === 'car'     && loc.type.toLowerCase() !== 'car')  return false;
      if (type === 'bike'    && loc.type.toLowerCase() !== 'bike') return false;
      if (type === 'ev'      && !loc.evCharging)                    return false;
      if (type === 'covered' && !loc.covered)                       return false;
      if (type === 'open'    && loc.covered)                        return false;
    }
    // Distance filter (from user location or default center)
    if (distance !== 'any') {
      const maxDist = parseInt(distance, 10); // km
      if (loc.distance > maxDist * 1000) return false;
    }
    return true;
  });

  // Sort
  sortFiltered();

  // Render
  renderParkingList();
  updateMapMarkers();
}

function sortFiltered() {
  const sort = FPState.sort;
  FPState.filteredData.sort((a, b) => {
    if (sort === 'nearest')    return a.distance - b.distance;
    if (sort === 'price')      return a.price - b.price;
    if (sort === 'available')  return b.availableSpaces - a.availableSpaces;
    if (sort === 'rating')     return b.rating - a.rating;
    // recommended (default) ΓÇö by score
    return calcRecommendationScore(b) - calcRecommendationScore(a);
  });
}

/* ============================================================
   6. PARKING LIST RENDERING
   ============================================================ */
function renderParkingList() {
  const container = document.getElementById('fp-list');
  const emptyEl   = document.getElementById('fp-empty');
  const countEl   = document.getElementById('fp-count');

  if (!container) return;

  countEl && (countEl.textContent = `${FPState.filteredData.length} Parking Location${FPState.filteredData.length !== 1 ? 's' : ''}`);

  if (FPState.filteredData.length === 0) {
    container.innerHTML = '';
    emptyEl && (emptyEl.style.display = 'block');
    return;
  }

  emptyEl && (emptyEl.style.display = 'none');

  container.innerHTML = FPState.filteredData.map(loc => renderParkingCard(loc)).join('');

  // Attach card click events
  container.querySelectorAll('.fp-parking-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      selectParking(id, 'card');
    });
  });

  // Details buttons
  container.querySelectorAll('[data-action="details"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.closest('.fp-parking-card').dataset.id, 10);
      openDetailsModal(id);
    });
  });

  // Directions buttons
  container.querySelectorAll('[data-action="directions"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.closest('.fp-parking-card').dataset.id, 10);
      openDirections(id);
    });
  });
}

function renderParkingCard(loc) {
  const avail   = getAvailabilityStatus(loc);
  const isSelected = FPState.selectedId === loc.id;
  const score   = calcRecommendationScore(loc);

  return `
  <article class="fp-parking-card${isSelected ? ' fp-card-selected' : ''}" data-id="${loc.id}" role="button" tabindex="0"
           aria-label="${escHtml(loc.name)} parking, ${loc.availableSpaces} available, Γé╣${loc.price}/hour"
           aria-pressed="${isSelected}">
    <div class="fp-card-top">
      <div class="fp-card-title-row">
        <div class="fp-card-title">${escHtml(loc.name)}</div>
        <div class="fp-card-rating" title="${loc.rating} stars">Γ¡É ${loc.rating}</div>
      </div>
      <div class="fp-card-address">≡ƒôì ${escHtml(loc.address)}</div>
    </div>

    <div class="fp-card-meta">
      <div class="fp-card-meta-item">
        <span class="fp-meta-label">Distance</span>
        <span class="fp-meta-value">${formatDistance(loc.distance)}</span>
      </div>
      <div class="fp-card-meta-item">
        <span class="fp-meta-label">Price</span>
        <span class="fp-meta-value fp-price">Γé╣${loc.price}/hr</span>
      </div>
      <div class="fp-card-meta-item">
        <span class="fp-meta-label">Availability</span>
        <span class="${getAvailabilityBadgeClass(loc)} fp-avail-badge">
          ${getAvailabilityBadgeLabel(loc)}
        </span>
      </div>
    </div>

    <div class="fp-card-progress" aria-label="Occupancy">
      <div class="fp-progress-header">
        <span class="fp-progress-label">${loc.totalSpaces - loc.availableSpaces} / ${loc.totalSpaces} occupied</span>
        <span class="fp-progress-pct">${loc.totalSpaces > 0 ? Math.round(((loc.totalSpaces - loc.availableSpaces) / loc.totalSpaces) * 100) : 0}%</span>
      </div>
      <div class="progress-bar-track" role="progressbar" aria-valuenow="${loc.totalSpaces - loc.availableSpaces}" aria-valuemax="${loc.totalSpaces}">
        <div class="progress-bar-fill ${avail === 'full' ? 'fill-full' : avail === 'limited' ? 'fill-high' : 'fill-available'}"
             style="width:${loc.totalSpaces > 0 ? Math.round(((loc.totalSpaces - loc.availableSpaces) / loc.totalSpaces) * 100) : 0}%"></div>
      </div>
    </div>

    <div class="fp-card-tags">
      <span class="tag">${getTypeIcon(loc.type)} ${loc.type}</span>
      ${loc.evCharging ? '<span class="tag">ΓÜí EV</span>' : ''}
      ${loc.covered ? '<span class="tag">≡ƒÅá Covered</span>' : '<span class="tag">ΓÿÇ Open</span>'}
      ${loc.accessible ? '<span class="tag">ΓÖ┐ Accessible</span>' : ''}
    </div>

    <div class="fp-card-actions">
      <button class="btn btn-primary btn-sm" data-action="details" aria-label="View details for ${escHtml(loc.name)}">
        View Details
      </button>
      <button class="btn btn-secondary btn-sm" data-action="directions" aria-label="Get directions to ${escHtml(loc.name)}">
        ≡ƒº¡ Directions
      </button>
    </div>
  </article>`;
}

/* ============================================================
   7. LEAFLET MAP
   ============================================================ */
function initMap() {
  if (FPState.map) return; // already initialised

  const center = [16.9891, 82.2475];
  FPState.map = L.map('fp-leaflet-map', {
    center: center,
    zoom: 14,
    zoomControl: true
  });

  // OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '┬⌐ <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(FPState.map);

  // Apply dark mode filter if needed
  updateMapTileTheme(isDarkMode());

  // Add all markers
  PARKING_LOCATIONS.forEach(loc => addMarker(loc));

  // Click on map background deselects
  FPState.map.on('click', () => {
    if (FPState.selectedId) {
      deselectAll();
    }
  });
}

function createMarkerIcon(loc, selected) {
  const avail = getAvailabilityStatus(loc);
  const colors = { available: '#22c55e', limited: '#f97316', full: '#ef4444' };
  const color = colors[avail];
  const selBorder = selected ? '3px solid #2563eb' : '2px solid white';

  return L.divIcon({
    className: '',
    html: `
      <div class="fp-marker${selected ? ' fp-marker-selected' : ''}" 
           style="border-color:${color}; --marker-color:${color};"
           role="img" aria-label="${loc.name}">
        <div class="fp-marker-price">Γé╣${loc.price}</div>
        <div class="fp-marker-spots" style="color:${color};">${avail === 'full' ? 'Full' : loc.availableSpaces + ' spots'}</div>
      </div>`,
    iconSize: [72, 44],
    iconAnchor: [36, 44],
    popupAnchor: [0, -44]
  });
}

function addMarker(loc) {
  const marker = L.marker([loc.latitude, loc.longitude], {
    icon: createMarkerIcon(loc, false),
    title: loc.name
  }).addTo(FPState.map);

  marker.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    selectParking(loc.id, 'marker');
  });

  FPState.markers[loc.id] = marker;
}

function updateMapMarkers() {
  const visibleIds = new Set(FPState.filteredData.map(l => l.id));

  PARKING_LOCATIONS.forEach(loc => {
    const marker = FPState.markers[loc.id];
    if (!marker) return;

    if (visibleIds.has(loc.id)) {
      // Show marker
      if (!FPState.map.hasLayer(marker)) FPState.map.addLayer(marker);
      const selected = FPState.selectedId === loc.id;
      marker.setIcon(createMarkerIcon(loc, selected));
    } else {
      // Hide marker
      if (FPState.map.hasLayer(marker)) FPState.map.removeLayer(marker);
    }
  });
}

function selectParking(id, source) {
  const loc = PARKING_LOCATIONS.find(l => l.id === id);
  if (!loc) return;

  FPState.selectedId = id;

  // Update markers
  updateMapMarkers();

  // Center map on selected parking
  if (source !== 'marker' || true) {
    FPState.map.setView([loc.latitude, loc.longitude], 15, { animate: true });
  }

  // Show popup on marker
  const marker = FPState.markers[id];
  if (marker) {
    marker.unbindPopup();
    marker.bindPopup(createPopupContent(loc), {
      maxWidth: 280,
      className: 'fp-popup'
    }).openPopup();
  }

  // Highlight card in list
  document.querySelectorAll('.fp-parking-card').forEach(card => {
    const isTarget = parseInt(card.dataset.id, 10) === id;
    card.classList.toggle('fp-card-selected', isTarget);
    card.setAttribute('aria-pressed', isTarget.toString());
    if (isTarget && source === 'marker') {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Switch to list tab on mobile if selected from map
  if (source === 'marker' && window.innerWidth <= 768) {
    switchMobileTab('list');
  }
}

function deselectAll() {
  FPState.selectedId = null;
  updateMapMarkers();
  document.querySelectorAll('.fp-parking-card').forEach(card => {
    card.classList.remove('fp-card-selected');
    card.setAttribute('aria-pressed', 'false');
  });
}

function createPopupContent(loc) {
  const avail = getAvailabilityStatus(loc);
  return `
    <div class="fp-popup-inner">
      <div class="fp-popup-name">${escHtml(loc.name)}</div>
      <div class="fp-popup-rating">Γ¡É ${loc.rating} ┬╖ ${loc.reviews} reviews</div>
      <div class="fp-popup-row">≡ƒôì ${formatDistance(loc.distance)} away</div>
      <div class="fp-popup-row">Γé╣${loc.price} / hour</div>
      <div class="fp-popup-row">
        <span class="${getAvailabilityBadgeClass(loc)}" style="font-size:.72rem;">
          ${getAvailabilityBadgeLabel(loc)}
        </span>
      </div>
      <div class="fp-popup-actions">
        <button class="btn btn-primary btn-sm" onclick="openDetailsModal(${loc.id})" style="width:100%;">View Details</button>
        <button class="btn btn-secondary btn-sm" onclick="openDirections(${loc.id})" style="width:100%;">≡ƒº¡ Directions</button>
      </div>
    </div>`;
}

/* ============================================================
   8. GEOLOCATION ΓÇö Use My Location
   ============================================================ */
function useMyLocation() {
  const btn = document.getElementById('fp-locate-btn');
  if (!btn) return;

  if (!navigator.geolocation) {
    showFPToast('Location Not Supported', 'Your browser does not support geolocation. Search manually.', 'warning');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'ΓÅ│ LocatingΓÇª';

  navigator.geolocation.getCurrentPosition(
    pos => {
      FPState.userLat = pos.coords.latitude;
      FPState.userLng = pos.coords.longitude;

      // Update marker
      if (FPState.userMarker) FPState.map.removeLayer(FPState.userMarker);
      FPState.userMarker = L.circleMarker([FPState.userLat, FPState.userLng], {
        radius: 10,
        fillColor: '#2563eb',
        color: '#fff',
        weight: 3,
        fillOpacity: 0.9
      }).bindTooltip('≡ƒôì You are here', { permanent: false }).addTo(FPState.map);

      FPState.map.setView([FPState.userLat, FPState.userLng], 15, { animate: true });

      // Update distances relative to user
      updateDistancesFromUser();
      applyFiltersAndSearch();

      showFPToast('Location Found', 'Showing parking near your current location.', 'success');
      btn.disabled = false;
      btn.innerHTML = '≡ƒôì Near Me';

      // Switch to map tab on mobile
      if (window.innerWidth <= 768) switchMobileTab('map');
    },
    err => {
      btn.disabled = false;
      btn.innerHTML = '≡ƒôì Use My Location';
      const msg = err.code === 1
        ? 'Location permission denied. You can still search manually.'
        : 'Unable to access your location. Please search manually.';
      showFPToast('Location Error', msg, 'warning');
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // metres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function updateDistancesFromUser() {
  if (FPState.userLat === null) return;
  PARKING_LOCATIONS.forEach(loc => {
    loc.distance = Math.round(haversineDistance(FPState.userLat, FPState.userLng, loc.latitude, loc.longitude));
  });
}

/* ============================================================
   9. DIRECTIONS
   ============================================================ */
function openDirections(id) {
  const loc = PARKING_LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  // Opens Google Maps directions in a new tab
  const dest = `${loc.latitude},${loc.longitude}`;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}&destination_place_id=${encodeURIComponent(loc.name)}`;
  window.open(url, '_blank', 'noopener');
}

// Expose globally for popup buttons
window.openDirections = openDirections;

/* ============================================================
   10. PARKING DETAILS MODAL
   ============================================================ */
function openDetailsModal(id) {
  const loc = PARKING_LOCATIONS.find(l => l.id === id);
  if (!loc) return;

  const avail = getAvailabilityStatus(loc);

  const body = `
    <div class="fp-modal-details">
      <div class="fp-modal-hero">
        <div class="fp-modal-title">${escHtml(loc.name)}</div>
        <div class="fp-modal-rating">
          <span class="fp-stars">Γ¡É ${loc.rating}</span>
          <span style="color:var(--text-muted);font-size:.82rem;">${loc.reviews} reviews</span>
        </div>
      </div>

      <div class="fp-modal-tags mb-16">
        <span class="tag">${getTypeIcon(loc.type)} ${loc.type}</span>
        ${loc.evCharging ? '<span class="tag">ΓÜí EV Charging</span>' : ''}
        ${loc.covered ? '<span class="tag">≡ƒÅá Covered</span>' : '<span class="tag">ΓÿÇ Open Air</span>'}
        ${loc.accessible ? '<span class="tag">ΓÖ┐ Accessible</span>' : ''}
      </div>

      <div class="info-row">
        <span class="ir-label">≡ƒôì Address</span>
        <span class="ir-value">${escHtml(loc.address)}</span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒòÉ Opening Hours</span>
        <span class="ir-value">${escHtml(loc.openHours)}</span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒÆ░ Price</span>
        <span class="ir-value" style="color:var(--primary);font-size:1.1rem;">Γé╣${loc.price} / hour</span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒôÅ Distance</span>
        <span class="ir-value">${formatDistance(loc.distance)}</span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒà┐ Availability</span>
        <span class="ir-value">
          <span class="${getAvailabilityBadgeClass(loc)}">${getAvailabilityBadgeLabel(loc)}</span>
        </span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒÅù Total Capacity</span>
        <span class="ir-value">${loc.totalSpaces} spaces</span>
      </div>
      <div class="info-row">
        <span class="ir-label">≡ƒöÆ Security</span>
        <span class="ir-value">${escHtml(loc.security)}</span>
      </div>

      <div class="fp-modal-occ mt-16">
        <div class="fp-progress-header mb-8">
          <span class="fp-progress-label">Occupancy</span>
          <span class="fp-progress-pct">${loc.totalSpaces > 0 ? Math.round(((loc.totalSpaces - loc.availableSpaces) / loc.totalSpaces) * 100) : 0}%</span>
        </div>
        <div class="progress-bar-track" role="progressbar">
          <div class="progress-bar-fill ${avail === 'full' ? 'fill-full' : avail === 'limited' ? 'fill-high' : 'fill-available'}"
               style="width:${loc.totalSpaces > 0 ? Math.round(((loc.totalSpaces - loc.availableSpaces) / loc.totalSpaces) * 100) : 0}%"></div>
        </div>
      </div>
    </div>`;

  const footer = `
    <button class="btn btn-secondary" onclick="openDirections(${loc.id}); closeFPModal();">≡ƒº¡ Directions</button>
    <button class="btn btn-primary" onclick="closeFPModal(); openReservationModal(${loc.id});" ${avail === 'full' ? 'disabled' : ''}>
      ≡ƒà┐ Reserve Spot
    </button>`;

  openFPModal(`${escHtml(loc.name)}`, body, footer);
}

// Expose globally for popup buttons
window.openDetailsModal = openDetailsModal;

/* ============================================================
   11. RESERVATION MODAL
   ============================================================ */
function openReservationModal(id) {
  const loc = PARKING_LOCATIONS.find(l => l.id === id);
  if (!loc) return;

  const today = new Date().toISOString().split('T')[0];
  const nowHour = new Date().getHours();
  const defaultTime = `${String(nowHour).padStart(2,'0')}:00`;

  const body = `
    <div class="fp-reservation-form">
      <div class="fp-res-parking-name">${escHtml(loc.name)}</div>
      <div class="fp-res-parking-addr" style="color:var(--text-secondary);font-size:.85rem;margin-bottom:20px;">
        ≡ƒôì ${escHtml(loc.address)}
      </div>

      <div class="form-group">
        <label class="form-label" for="res-date">Select Date</label>
        <input type="date" id="res-date" class="form-control" value="${today}" min="${today}" aria-label="Reservation date" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="res-time">Start Time</label>
          <input type="time" id="res-time" class="form-control" value="${defaultTime}" aria-label="Start time" />
        </div>
        <div class="form-group">
          <label class="form-label" for="res-duration">Duration</label>
          <select id="res-duration" class="form-control" aria-label="Duration">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="6">6 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
        </div>
      </div>

      <div class="fp-res-summary" id="fp-res-summary">
        <div class="fp-res-summary-row">
          <span>Available Spaces</span>
          <span style="color:var(--success);font-weight:700;">${loc.availableSpaces}</span>
        </div>
        <div class="fp-res-summary-row">
          <span>Rate</span>
          <span>Γé╣${loc.price} / hour</span>
        </div>
        <div class="fp-res-summary-row fp-res-total">
          <span>Estimated Total</span>
          <span id="fp-res-estimated" style="color:var(--primary);font-size:1.15rem;font-weight:800;">Γé╣${loc.price}</span>
        </div>
      </div>
    </div>`;

  const footer = `
    <button class="btn btn-secondary" onclick="closeFPModal()">Cancel</button>
    <button class="btn btn-primary" onclick="confirmReservation(${loc.id})">Γ£ô Confirm Reservation</button>`;

  openFPModal('≡ƒà┐ Reserve Parking Spot', body, footer, { size: 'md' });

  // Live price update
  setTimeout(() => {
    const durSel = document.getElementById('res-duration');
    const estEl  = document.getElementById('fp-res-estimated');
    if (durSel && estEl) {
      durSel.addEventListener('change', () => {
        estEl.textContent = `Γé╣${loc.price * parseInt(durSel.value, 10)}`;
      });
    }
  }, 100);
}

function confirmReservation(id) {
  const loc = PARKING_LOCATIONS.find(l => l.id === id);
  if (!loc) return;

  const date     = document.getElementById('res-date')?.value || 'Today';
  const time     = document.getElementById('res-time')?.value || '10:00';
  const duration = parseInt(document.getElementById('res-duration')?.value || '1', 10);
  const total    = loc.price * duration;

  // Optimistically reduce available spaces
  if (loc.availableSpaces > 0) loc.availableSpaces--;

  const resId = 'SP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);

  closeFPModal();

  // Show success modal
  const successBody = `
    <div class="reservation-success">
      <div class="success-icon" aria-hidden="true">Γ£ô</div>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);margin-bottom:8px;">
        Parking Reserved Successfully!
      </h3>
      <p style="color:var(--text-secondary);margin-bottom:16px;">
        Your parking spot has been confirmed.
      </p>
      <div class="res-id" aria-label="Reservation ID">${resId}</div>

      <div class="fp-success-details">
        <div class="info-row">
          <span class="ir-label">≡ƒôì Location</span>
          <span class="ir-value">${escHtml(loc.name)}</span>
        </div>
        <div class="info-row">
          <span class="ir-label">≡ƒôà Date</span>
          <span class="ir-value">${date}</span>
        </div>
        <div class="info-row">
          <span class="ir-label">≡ƒòÉ Start Time</span>
          <span class="ir-value">${time}</span>
        </div>
        <div class="info-row">
          <span class="ir-label">ΓÅ▒ Duration</span>
          <span class="ir-value">${duration} hour${duration !== 1 ? 's' : ''}</span>
        </div>
        <div class="info-row">
          <span class="ir-label">≡ƒÆ░ Estimated Price</span>
          <span class="ir-value" style="color:var(--primary);font-weight:800;font-size:1.1rem;">Γé╣${total}</span>
        </div>
      </div>
    </div>`;

  const successFooter = `
    <button class="btn btn-secondary" onclick="openDirections(${id}); closeFPModal();">≡ƒº¡ Get Directions</button>
    <button class="btn btn-primary" onclick="closeFPModal()">Done</button>`;

  setTimeout(() => {
    openFPModal('Reservation Confirmed', successBody, successFooter);
    // Refresh list to show updated availability
    applyFiltersAndSearch();
  }, 150);
}

/* ============================================================
   12. FP MODAL SYSTEM (self-contained, no dependency on index.html)
   ============================================================ */
function openFPModal(title, bodyHTML, footerHTML = '', options = {}) {
  const overlay = document.getElementById('fp-modal-overlay');
  const box     = document.getElementById('fp-modal-box');
  if (!overlay || !box) return;

  document.getElementById('fp-modal-title').textContent = title;
  document.getElementById('fp-modal-body').innerHTML = bodyHTML;

  const footer = document.getElementById('fp-modal-footer');
  if (footerHTML) {
    footer.innerHTML = footerHTML;
    footer.style.display = 'flex';
  } else {
    footer.style.display = 'none';
  }

  box.className = 'modal' + (options.size ? ' modal-' + options.size : '');
  overlay.classList.add('open');

  setTimeout(() => {
    const first = box.querySelector('input, select, button:not(#fp-modal-close), textarea');
    if (first) first.focus();
  }, 100);
}

function closeFPModal() {
  document.getElementById('fp-modal-overlay')?.classList.remove('open');
}

// Expose globally for modal footer buttons
window.openReservationModal = openReservationModal;
window.confirmReservation   = confirmReservation;
window.closeFPModal         = closeFPModal;

/* ============================================================
   13. TOAST NOTIFICATIONS
   ============================================================ */
function showFPToast(title, body = '', type = 'info') {
  const container = document.getElementById('fp-toast-container');
  if (!container) return;
  const iconMap = { info: 'Γä╣', success: 'Γ£ô', warning: 'ΓÜá', danger: 'Γ£ò' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || 'Γä╣'}</div>
    <div class="toast-content">
      <div class="toast-title">${escHtml(title)}</div>
      ${body ? `<div class="toast-body">${escHtml(body)}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
  }, 4500);
}

/* ============================================================
   14. MOBILE TAB SWITCHING
   ============================================================ */
function switchMobileTab(tab) {
  FPState.mobileTab = tab;
  const mapPanel  = document.getElementById('fp-map-panel');
  const listPanel = document.getElementById('fp-list-panel');
  const tabMap    = document.getElementById('tab-map');
  const tabList   = document.getElementById('tab-list');

  if (tab === 'map') {
    mapPanel  && mapPanel.classList.add('fp-mobile-active');
    listPanel && listPanel.classList.remove('fp-mobile-active');
    tabMap    && tabMap.classList.add('active');
    tabList   && tabList.classList.remove('active');
    // Trigger resize so Leaflet redraws tiles
    setTimeout(() => FPState.map && FPState.map.invalidateSize(), 50);
  } else {
    listPanel && listPanel.classList.add('fp-mobile-active');
    mapPanel  && mapPanel.classList.remove('fp-mobile-active');
    tabList   && tabList.classList.add('active');
    tabMap    && tabMap.classList.remove('active');
  }
}

/* ============================================================
   15. INITIALISATION
   ============================================================ */
function init() {
  // Theme
  loadTheme();

  // Theme toggle button
  const themeBtn = document.getElementById('fp-theme-btn');
  themeBtn && themeBtn.addEventListener('click', () => {
    applyTheme(!isDarkMode());
  });

  // Modal close
  const closeBtn    = document.getElementById('fp-modal-close');
  const modalOverlay = document.getElementById('fp-modal-overlay');
  closeBtn    && closeBtn.addEventListener('click', closeFPModal);
  modalOverlay && modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeFPModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFPModal(); });

  // Search input
  const searchInput = document.getElementById('fp-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      FPState.searchQuery = searchInput.value;
      const clearBtn = document.getElementById('fp-search-clear');
      clearBtn && (clearBtn.style.display = searchInput.value ? 'flex' : 'none');
      applyFiltersAndSearch();
    });
  }

  // Clear search
  const clearBtn = document.getElementById('fp-search-clear');
  clearBtn && clearBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    FPState.searchQuery = '';
    clearBtn.style.display = 'none';
    applyFiltersAndSearch();
  });

  // Filter chips ΓÇö Type
  document.querySelectorAll('[data-filter-type]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-type]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      FPState.filters.type = chip.dataset.filterType;
      applyFiltersAndSearch();
    });
  });

  // Price filter
  const priceFilter = document.getElementById('filter-price');
  priceFilter && priceFilter.addEventListener('change', () => {
    FPState.filters.priceRange = priceFilter.value;
    applyFiltersAndSearch();
  });

  // Availability filter
  const availFilter = document.getElementById('filter-availability');
  availFilter && availFilter.addEventListener('change', () => {
    FPState.filters.availability = availFilter.value;
    applyFiltersAndSearch();
  });

  // Distance filter
  const distFilter = document.getElementById('filter-distance');
  distFilter && distFilter.addEventListener('change', () => {
    FPState.filters.distance = distFilter.value;
    applyFiltersAndSearch();
  });

  // Sort
  const sortSelect = document.getElementById('fp-sort');
  sortSelect && sortSelect.addEventListener('change', () => {
    FPState.sort = sortSelect.value;
    applyFiltersAndSearch();
  });

  // Geolocation button
  const locBtn = document.getElementById('fp-locate-btn');
  locBtn && locBtn.addEventListener('click', useMyLocation);

  // Mobile tabs
  const tabMap  = document.getElementById('tab-map');
  const tabList = document.getElementById('tab-list');
  tabMap  && tabMap.addEventListener('click',  () => switchMobileTab('map'));
  tabList && tabList.addEventListener('click', () => switchMobileTab('list'));

  // Initial render
  applyFiltersAndSearch();

  // Init map (after a tick to ensure DOM is ready)
  setTimeout(initMap, 100);

  // Default to list on mobile
  if (window.innerWidth <= 768) {
    switchMobileTab('list');
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
