/**
 * Summary Stats Component
 * Displays key metrics: Available Spaces, Total Public Zones, Occupancy Rate, Active Areas
 */

export function renderSummaryStats(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Available Spaces</span>
        <div class="kpi-value" id="kpi-available-count">${stats.totalAvailableSpaces}</div>
        <span class="kpi-subtext">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          Real-time network live
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-emerald">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Public Parking Zones</span>
        <div class="kpi-value">${stats.totalPublicZones}</div>
        <span class="kpi-subtext" style="color: var(--primary-600)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          Municipal & Civic Lots
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-blue">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Currently Occupied</span>
        <div class="kpi-value">${stats.currentlyOccupiedPercent}%</div>
        <span class="kpi-subtext" style="color: var(--status-med-text)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Moderate city-wide traffic
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-amber">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Active Parking Areas</span>
        <div class="kpi-value">${stats.activeParkingAreas}</div>
        <span class="kpi-subtext">
          <span class="pulse-dot" style="width:6px;height:6px;"></span>
          100% sensors online
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-indigo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      </div>
    </div>
  `;
}
