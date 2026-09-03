/**
 * Private Parking Search & Filter Component
 * Handles company filtering, parking type dropdown, location input, and quick access chips
 */

export function initPrivateSearchFilter(containerId, onFilterChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(Math.ceil(now.getMinutes() / 15) * 15 % 60).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  container.innerHTML = `
    <div class="search-box-card">
      <div class="search-grid" style="grid-template-columns: 2fr 1.3fr 1.1fr 1fr 1fr auto;">
        <!-- Location Input -->
        <div class="input-group">
          <label class="input-label" for="search-pvt-location">Location / Campus</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <input type="text" id="search-pvt-location" class="input-control input-with-icon" placeholder="Search private parking near a location..." />
          </div>
        </div>

        <!-- Company Dropdown -->
        <div class="input-group">
          <label class="input-label" for="search-company-select">Company / Org</label>
          <select id="search-company-select" class="input-control">
            <option value="ALL">All Companies</option>
            <option value="TCS">TCS</option>
            <option value="INFOSYS">Infosys</option>
            <option value="WIPRO">Wipro</option>
            <option value="TECHM">Tech Mahindra</option>
            <option value="OTHER">Other / Tech Parks</option>
          </select>
        </div>

        <!-- Parking Type Dropdown -->
        <div class="input-group">
          <label class="input-label" for="search-type-select">Parking Type</label>
          <select id="search-type-select" class="input-control">
            <option value="ALL">All Types</option>
            <option value="EMPLOYEE">Employee Only</option>
            <option value="VISITOR">Visitor Parking</option>
            <option value="RESTRICTED">Restricted</option>
          </select>
        </div>

        <!-- Date Input -->
        <div class="input-group">
          <label class="input-label" for="search-pvt-date">Date</label>
          <input type="date" id="search-pvt-date" class="input-control" value="${todayStr}" />
        </div>

        <!-- Time Input -->
        <div class="input-group">
          <label class="input-label" for="search-pvt-time">Time</label>
          <input type="time" id="search-pvt-time" class="input-control" value="${timeStr}" />
        </div>

        <!-- Search Button -->
        <button type="button" id="btn-pvt-search-trigger" class="btn btn-primary" style="height: 44px; margin-bottom: 2px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Search
        </button>
      </div>

      <!-- Quick Filter Chips & Sort -->
      <div class="filter-toolbar">
        <div class="filter-chips">
          <button class="filter-chip active" data-pvt-filter="all">All Private Facilities</button>
          <button class="filter-chip" data-pvt-filter="authorized">✓ Authorized to Me</button>
          <button class="filter-chip" data-pvt-filter="visitor">Visitor Access Required</button>
          <button class="filter-chip" data-pvt-filter="nearest">Nearest (<2 km)</button>
          <button class="filter-chip" data-pvt-filter="ev-charging">EV Fast Charging</button>
        </div>

        <div class="sort-group">
          <span class="sort-label">Sort by:</span>
          <select id="pvt-sort-select" class="sort-select">
            <option value="distance">Distance (Nearest First)</option>
            <option value="availability">Availability (Most Spaces)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="rating">Rating (Highest)</option>
          </select>
        </div>
      </div>
    </div>
  `;

  const state = {
    query: '',
    company: 'ALL',
    parkingType: 'ALL',
    activeFilter: 'all',
    sortBy: 'distance'
  };

  // Location input
  document.getElementById('search-pvt-location').addEventListener('input', (e) => {
    state.query = e.target.value.trim().toLowerCase();
    onFilterChange(state);
  });

  // Company select
  document.getElementById('search-company-select').addEventListener('change', (e) => {
    state.company = e.target.value;
    onFilterChange(state);
  });

  // Parking type select
  document.getElementById('search-type-select').addEventListener('change', (e) => {
    state.parkingType = e.target.value;
    onFilterChange(state);
  });

  // Filter chips
  const filterChips = container.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeFilter = chip.getAttribute('data-pvt-filter');
      onFilterChange(state);
    });
  });

  // Sort select
  document.getElementById('pvt-sort-select').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    onFilterChange(state);
  });

  // Search button
  document.getElementById('btn-pvt-search-trigger').addEventListener('click', () => {
    onFilterChange(state);
  });
}
