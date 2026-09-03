/**
 * Search & Filter Bar Component
 * Manages search query, date/time pickers, vehicle type selection, filter chips, and sorting
 */

export function initSearchFilterBar(containerId, onFilterChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(Math.ceil(now.getMinutes() / 15) * 15 % 60).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  container.innerHTML = `
    <div class="search-box-card">
      <div class="search-grid">
        <!-- Location Input -->
        <div class="input-group">
          <label class="input-label" for="search-location">Destination Location</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <input type="text" id="search-location" class="input-control input-with-icon" placeholder="Search parking near a location, metro, or landmark..." />
          </div>
        </div>

        <!-- Date Input -->
        <div class="input-group">
          <label class="input-label" for="search-date">Parking Date</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <input type="date" id="search-date" class="input-control input-with-icon" value="${todayStr}" />
          </div>
        </div>

        <!-- Time Input -->
        <div class="input-group">
          <label class="input-label" for="search-time">Arrival Time</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <input type="time" id="search-time" class="input-control input-with-icon" value="${timeStr}" />
          </div>
        </div>

        <!-- Vehicle Type Selector -->
        <div class="input-group">
          <label class="input-label">Vehicle Type</label>
          <div class="vehicle-selector" id="vehicle-type-selector">
            <button type="button" class="vehicle-btn active" data-type="car">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
              Car
            </button>
            <button type="button" class="vehicle-btn" data-type="bike">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>
              Bike
            </button>
            <button type="button" class="vehicle-btn" data-type="ev">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              EV
            </button>
          </div>
        </div>

        <!-- Search Action Button -->
        <button type="button" id="btn-search-trigger" class="btn btn-primary" style="height: 44px; margin-bottom: 2px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Find Parking
        </button>
      </div>

      <!-- Secondary Filter Toolbar -->
      <div class="filter-toolbar">
        <div class="filter-chips">
          <button class="filter-chip active" data-filter="all">All Public Zones</button>
          <button class="filter-chip" data-filter="available-now">Available Now (>10 spots)</button>
          <button class="filter-chip" data-filter="nearest">Nearest (<2 km)</button>
          <button class="filter-chip" data-filter="lowest-price">Lowest Price (≤ ₹20/hr)</button>
          <button class="filter-chip" data-filter="ev-charging">EV Fast Charging</button>
          <button class="filter-chip" data-filter="open-24x7">Open 24/7</button>
        </div>

        <div class="sort-group">
          <span class="sort-label">Sort by:</span>
          <select id="sort-select" class="sort-select">
            <option value="distance">Distance (Nearest First)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="availability">Availability (Most Spaces)</option>
            <option value="rating">Rating (Highest)</option>
          </select>
        </div>
      </div>
    </div>
  `;

  // State
  const state = {
    query: '',
    date: todayStr,
    time: timeStr,
    vehicleType: 'car',
    activeFilter: 'all',
    sortBy: 'distance'
  };

  // Location search input
  const locationInput = document.getElementById('search-location');
  locationInput.addEventListener('input', (e) => {
    state.query = e.target.value.trim().toLowerCase();
    onFilterChange(state);
  });

  // Date and Time inputs
  document.getElementById('search-date').addEventListener('change', (e) => {
    state.date = e.target.value;
    onFilterChange(state);
  });
  document.getElementById('search-time').addEventListener('change', (e) => {
    state.time = e.target.value;
    onFilterChange(state);
  });

  // Vehicle type buttons
  const vehicleBtns = container.querySelectorAll('.vehicle-btn');
  vehicleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vehicleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.vehicleType = btn.getAttribute('data-type');
      onFilterChange(state);
    });
  });

  // Quick filter chips
  const filterChips = container.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeFilter = chip.getAttribute('data-filter');
      onFilterChange(state);
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    onFilterChange(state);
  });

  // Search button
  document.getElementById('btn-search-trigger').addEventListener('click', () => {
    onFilterChange(state);
  });
}
