/**
 * User Dashboard View Component
 * Renders the user control center with Overview KPIs, Active Reservation pass,
 * Available Parking cards, Smart Recommendation, and Recent History.
 */

import { DASHBOARD_METRICS, ACTIVE_RESERVATION, RECENT_PARKING_HISTORY } from '../data/dashboardData.js';
import { PUBLIC_PARKING_ZONES } from '../data/parkingZonesData.js';
import { PRIVATE_PARKING_ZONES } from '../data/privateParkingData.js';

export function renderDashboardView(
  containerId, 
  currentUser, 
  onNavigate, 
  onViewDetails, 
  onReserve, 
  onLogout
) {
  const container = document.getElementById(containerId);
  if (!container || !currentUser) return;

  const firstName = currentUser.name.split(' ')[0];
  const greetingHour = new Date().getHours();
  let timeGreeting = "Good Morning";
  if (greetingHour >= 12 && greetingHour < 17) timeGreeting = "Good Afternoon";
  else if (greetingHour >= 17) timeGreeting = "Good Evening";

  // Curate available parking sample (2 public + 1 corporate)
  const availableSample = [
    PUBLIC_PARKING_ZONES[0],
    PUBLIC_PARKING_ZONES[1],
    PRIVATE_PARKING_ZONES[0]
  ];

  container.innerHTML = `
    <!-- 1. Dashboard Welcome Header -->
    <section class="dashboard-header">
      <div>
        <h1 class="dashboard-greeting">${timeGreeting}, ${firstName} 👋</h1>
        <p class="dashboard-subtext">Find the best parking spot for your destination with real-time sensor intelligence.</p>
      </div>

      <div class="dashboard-header-actions">
        <button type="button" class="btn btn-primary" id="dash-btn-find-parking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Find Parking
        </button>
        <button type="button" class="btn btn-secondary" id="dash-btn-logout" title="Sign out of SmartPark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </section>

    <!-- 2. Quick Actions Bar -->
    <div class="dashboard-quick-actions">
      <button type="button" class="quick-action-chip" data-target="#/parking/public">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
        Public Parking
      </button>
      <button type="button" class="quick-action-chip" data-target="#/parking/private">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Corporate & Private
      </button>
      <button type="button" class="quick-action-chip" id="dash-quick-active-pass">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Active Pass
      </button>
      <button type="button" class="quick-action-chip" id="dash-quick-history">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Parking History
      </button>
    </div>

    <!-- 3. Parking Overview Summary KPIs -->
    <section class="summary-section">
      <div class="summary-grid">
        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Available Parking</span>
            <div class="kpi-value">${DASHBOARD_METRICS.availableParking}</div>
            <span class="kpi-subtext">
              <span class="pulse-dot" style="width:6px;height:6px;"></span>
              Real-time city bays
            </span>
          </div>
          <div class="kpi-icon-box kpi-icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Active Reservation</span>
            <div class="kpi-value">${DASHBOARD_METRICS.activeReservations}</div>
            <span class="kpi-subtext" style="color: var(--status-high-text);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Slot ${ACTIVE_RESERVATION.parkingSlot} Confirmed
            </span>
          </div>
          <div class="kpi-icon-box kpi-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Parking Hours</span>
            <div class="kpi-value">${DASHBOARD_METRICS.parkingHoursTotal}h</div>
            <span class="kpi-subtext" style="color: var(--primary-600);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              This Month
            </span>
          </div>
          <div class="kpi-icon-box kpi-icon-indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Saved Vehicles</span>
            <div class="kpi-value">${DASHBOARD_METRICS.savedVehiclesCount}</div>
            <span class="kpi-subtext" style="color: var(--status-med-text);">
              Primary: ${currentUser.vehiclePlate || 'KA-01-MJ-5890'}
            </span>
          </div>
          <div class="kpi-icon-box kpi-icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Active Reservation Card Section -->
    <section class="active-res-section">
      <div class="active-res-card">
        <div class="active-res-info">
          <div class="active-res-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--status-high-text); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
              Your Active Reservation
            </div>
            <h3 class="active-res-title">${ACTIVE_RESERVATION.parkingName}</h3>
            <div class="active-res-meta">
              <div class="active-res-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>${ACTIVE_RESERVATION.date}, ${ACTIVE_RESERVATION.timeSlot}</span>
              </div>
              <div class="active-res-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                <span>Slot: <strong>${ACTIVE_RESERVATION.parkingSlot}</strong></span>
              </div>
              <div class="active-res-meta-item">
                <span class="status-indicator status-high" style="font-size: 0.72rem; padding: 2px 8px;">
                  <span class="status-dot"></span>
                  ${ACTIVE_RESERVATION.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="btn-view-active-pass">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          View Parking Pass
        </button>
      </div>
    </section>

    <!-- 5. Smart Recommendation Section -->
    <section style="margin-bottom: 36px;">
      <div class="smart-recommendation-box smart-rec-authorized">
        <div class="rec-left-content">
          <span class="rec-badge-tag rec-badge-auth">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Smart Recommendation • 94% Match
          </span>
          <h3 class="rec-title">Municipal Central Parking</h3>
          <p class="rec-desc">
            42 spaces available • 1.2 km away (~5 min walk). Predicted to remain available for the next 30 minutes.
          </p>
        </div>
        <div class="rec-action-wrapper">
          <button type="button" class="btn btn-primary" id="btn-dash-rec-reserve">
            Reserve Parking
          </button>
        </div>
      </div>
    </section>

    <!-- 6. Available Parking Section -->
    <section class="dash-available-section">
      <div class="section-title-row">
        <h2 class="section-main-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-600);"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          Available Parking
        </h2>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-view-all-parking">
          View All Parking Zones →
        </button>
      </div>

      <div class="dash-parking-grid">
        ${availableSample.map(zone => {
          const occupancyPercent = Math.round(((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100);
          const isHigh = zone.availabilityStatus === 'HIGH';

          return `
            <div class="parking-card" style="cursor: default;">
              <div class="card-top-row">
                <div class="card-badges">
                  <span class="badge ${zone.companyName ? 'badge-company badge-company-tcs' : 'badge-public'}">
                    ${zone.companyName ? zone.companyName + ' Corporate' : 'Public Parking'}
                  </span>
                </div>
                <div class="status-indicator ${isHigh ? 'status-high' : 'status-med'}">
                  <span class="status-dot"></span>
                  ${isHigh ? 'Available' : 'Limited'}
                </div>
              </div>

              <h3 class="zone-name" style="font-size: 1.1rem;">${zone.name}</h3>
              <p class="zone-address">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${zone.address}
              </p>

              <div class="availability-stat-row">
                <div class="spaces-count">${zone.availableSpaces} <span class="spaces-ratio">/ ${zone.totalSpaces} spaces</span></div>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${occupancyPercent}%</span>
              </div>
              <div class="progress-track" style="margin-bottom: 12px;">
                <div class="progress-bar ${isHigh ? 'progress-high' : 'progress-med'}" style="width: ${100 - occupancyPercent}%;"></div>
              </div>

              <div class="card-meta-grid" style="margin-bottom: 14px;">
                <div class="meta-item">
                  <span class="meta-label">Distance</span>
                  <span class="meta-val">${zone.distanceKm} km</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Walk</span>
                  <span class="meta-val">~${zone.walkingMinutes} min</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Rate</span>
                  <span class="meta-val" style="color: var(--primary-600);">₹${zone.pricePerHour}/h</span>
                </div>
              </div>

              <div class="card-actions-row">
                <button type="button" class="btn btn-secondary btn-sm dash-btn-details" data-id="${zone.id}" style="flex: 1;">
                  View Details
                </button>
                <button type="button" class="btn btn-primary btn-sm dash-btn-reserve" data-id="${zone.id}" style="flex: 1;">
                  Reserve
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- 7. Recent Parking History -->
    <section class="history-section" id="section-history">
      <div class="section-title-row">
        <h2 class="section-main-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-600);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Recent Parking History
        </h2>
      </div>

      <div class="history-table-card">
        <table class="history-table">
          <thead>
            <tr>
              <th>Parking Location</th>
              <th>Type</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${RECENT_PARKING_HISTORY.map(item => `
              <tr>
                <td><strong>${item.parkingName}</strong></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${item.type}</span></td>
                <td>${item.date} <div style="font-size: 0.75rem; color: var(--text-muted);">${item.time}</div></td>
                <td>${item.duration}</td>
                <td><strong style="color: var(--primary-600);">${item.amount}</strong></td>
                <td>
                  <span class="history-status-badge ${item.statusType}">
                    ${item.statusType === 'active' ? '● Active' : '✓ Completed'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

  // Attach Event Handlers
  document.getElementById('dash-btn-find-parking').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('dash-btn-logout').addEventListener('click', onLogout);
  document.getElementById('btn-view-all-parking').addEventListener('click', () => onNavigate('#/parking/public'));

  // Quick Action Chips
  container.querySelectorAll('.quick-action-chip[data-target]').forEach(chip => {
    chip.addEventListener('click', () => {
      const target = chip.getAttribute('data-target');
      onNavigate(target);
    });
  });

  const historyChip = document.getElementById('dash-quick-history');
  if (historyChip) {
    historyChip.addEventListener('click', () => {
      document.getElementById('section-history').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Active Pass Modal Trigger
  const activePassBtn = document.getElementById('btn-view-active-pass');
  const quickActivePass = document.getElementById('dash-quick-active-pass');
  const showActivePassModal = () => {
    const zone = PUBLIC_PARKING_ZONES[0];
    onReserve(zone.id);
  };
  if (activePassBtn) activePassBtn.addEventListener('click', showActivePassModal);
  if (quickActivePass) quickActivePass.addEventListener('click', showActivePassModal);

  // Recommendation Reserve button
  const recReserveBtn = document.getElementById('btn-dash-rec-reserve');
  if (recReserveBtn) {
    recReserveBtn.addEventListener('click', () => onReserve(PUBLIC_PARKING_ZONES[0].id));
  }

  // Sample card buttons
  container.querySelectorAll('.dash-btn-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneId = btn.getAttribute('data-id');
      onViewDetails(zoneId);
    });
  });

  container.querySelectorAll('.dash-btn-reserve').forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneId = btn.getAttribute('data-id');
      onReserve(zoneId);
    });
  });
}
