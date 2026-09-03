/**
 * Private Parking Summary Stats Component
 * Displays Accessible Parking, Available Spaces, Companies, Visitor Parking
 */

export function renderPrivateSummaryStats(containerId, stats) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Accessible Parking</span>
        <div class="kpi-value">${stats.accessibleParking}</div>
        <span class="kpi-subtext" style="color: var(--status-high-text);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Direct Badge Authorization
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-emerald">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Available Spaces</span>
        <div class="kpi-value" id="kpi-pvt-available-count">${stats.availableSpaces}</div>
        <span class="kpi-subtext">
          <span class="pulse-dot" style="width:6px;height:6px;"></span>
          Real-time corporate telemetry
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-blue">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Partner Companies</span>
        <div class="kpi-value">${stats.companies}</div>
        <span class="kpi-subtext" style="color: var(--primary-600);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Tech Parks & SEZs
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-indigo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
      </div>
    </div>

    <div class="summary-kpi-card">
      <div class="kpi-info">
        <span class="kpi-label">Visitor Parking</span>
        <div class="kpi-value">${stats.visitorParking}</div>
        <span class="kpi-subtext" style="color: var(--status-med-text);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Temporary QR clearance
        </span>
      </div>
      <div class="kpi-icon-box kpi-icon-amber">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 6 12 12 16 14"/></svg>
      </div>
    </div>
  `;
}
