/**
 * User Dashboard View Component
 * Renders dynamic greeting, KPI summary, active reservation pass card,
 * live available parking grid with bay picker, recommendation, and recent history.
 */

import { DASHBOARD_SUMMARY_DATA, RECENT_PARKING_HISTORY } from '../data/dashboardData.js';
import { PUBLIC_PARKING_ZONES } from '../data/parkingZonesData.js';
import { openSlotGridModal } from './slotGridModal.js';
import { openVehicleGarageModal } from './vehicleGarageModal.js';
import { showToast } from './toast.js';

export function renderDashboardView(
  containerId, 
  currentUser, 
  onNavigate, 
  onViewPublicDetails, 
  onReservePublic, 
  onLogout
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const hour = new Date().getHours();
  let timeGreeting = "Good Morning";
  if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon";
  else if (hour >= 17) timeGreeting = "Good Evening";

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Driver';
  const availableFeatured = PUBLIC_PARKING_ZONES.slice(0, 3);

  container.innerHTML = `
    <!-- 1. Header Row: Greeting, Status Chip & Quick Actions -->
    <section class="dashboard-header-row">
      <div class="user-greeting-box">
        <h1 class="user-greeting-title">
          ${timeGreeting}, ${firstName} 👋
        </h1>
        <p class="user-greeting-sub">
          Here is your real-time parking telemetry, active digital passes, and instant bay availability.
        </p>
      </div>

      <div class="dash-quick-actions">
        <button type="button" class="btn btn-secondary" id="dash-btn-my-vehicles">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 17h14v-5l-2-4H7l-2 4v5z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
          My Vehicles
        </button>
        <button type="button" class="btn btn-primary" id="dash-btn-find-parking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explore Parking
        </button>
      </div>
    </section>

    <!-- 2. Overview Metric KPI Cards -->
    <section class="dash-metrics-grid">
      <div class="dash-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Available City Parking</span>
          <div class="kpi-value">${DASHBOARD_SUMMARY_DATA.availableNearbySpaces}</div>
          <span class="kpi-subtext" style="color: var(--status-high-text);">● Live sensor feed active</span>
        </div>
        <div class="kpi-icon-box kpi-icon-indigo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
        </div>
      </div>

      <div class="dash-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Active Reservation</span>
          <div class="kpi-value">${DASHBOARD_SUMMARY_DATA.activeReservationsCount}</div>
          <span class="kpi-subtext" style="color: var(--primary-600);">Pass valid today</span>
        </div>
        <div class="kpi-icon-box kpi-icon-emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>

      <div class="dash-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Parking Hours</span>
          <div class="kpi-value">${DASHBOARD_SUMMARY_DATA.totalHoursParked}h</div>
          <span class="kpi-subtext">This month</span>
        </div>
        <div class="kpi-icon-box kpi-icon-blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>

      <div class="dash-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Saved Vehicles</span>
          <div class="kpi-value">${DASHBOARD_SUMMARY_DATA.savedVehiclesCount}</div>
          <span class="kpi-subtext">${currentUser?.vehiclePlate || 'KA-01-MJ-5890'} (Primary)</span>
        </div>
        <div class="kpi-icon-box kpi-icon-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>
    </section>

    <!-- 3. Active Reservation Pass Card -->
    <section class="active-res-card">
      <div class="active-res-header">
        <div>
          <span class="active-res-badge">Active Booking</span>
          <h2 class="active-res-title">Municipal Central Parking</h2>
          <span class="active-res-subtitle">Kasturba Road • Slot A-24 • Today 10:30 AM — 12:30 PM</span>
        </div>
        <div class="time-countdown-box">
          <div class="time-num">01h 45m</div>
          <div class="time-label">Remaining Duration</div>
        </div>
      </div>

      <div class="active-res-meta-row">
        <div class="res-meta-item">
          <span class="res-meta-label">VEHICLE</span>
          <span class="res-meta-value">${currentUser?.vehiclePlate || 'KA-01-MJ-5890'}</span>
        </div>
        <div class="res-meta-item">
          <span class="res-meta-label">ASSIGNED BAY</span>
          <span class="res-meta-value" style="color: var(--primary-600);">Floor G • Bay A-24</span>
        </div>
        <div class="res-meta-item">
          <span class="res-meta-label">TARIFF BILLED</span>
          <span class="res-meta-value">₹40.00 (Paid)</span>
        </div>
        <div class="res-meta-item">
          <span class="res-meta-label">BARRIER STATUS</span>
          <span class="res-meta-value" style="color: var(--status-high-text);">QR Auto-Clearance Ready</span>
        </div>
      </div>

      <div class="active-res-actions">
        <button type="button" class="btn btn-primary" id="btn-dash-view-pass">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          View Parking Pass (QR)
        </button>
        <button type="button" class="btn btn-secondary" id="btn-dash-directions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Navigate to Slot
        </button>
      </div>
    </section>

    <!-- 4. Smart Recommendation Callout Banner -->
    <section class="dash-recommendation-box">
      <div>
        <div class="rec-match-badge">94% Recommended Match</div>
        <h3 class="rec-title">Municipal Central Parking (Slot A-12 Recommended)</h3>
        <p class="rec-desc">42 spaces available • 1.2 km away • Predicted availability: High • Tariff: ₹20/hr</p>
      </div>
      <button type="button" class="btn btn-primary" id="btn-rec-reserve-fast" style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);">
        Reserve Recommended Bay →
      </button>
    </section>

    <!-- 5. Available Parking Section Grid -->
    <section style="margin-bottom: 36px;">
      <div class="available-parking-header">
        <div>
          <h2 class="available-parking-title">Live Available Parking</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">Vacant bays ready for instant reservation near your destination</p>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-dash-view-all-public">
          View All 8 Zones →
        </button>
      </div>

      <div class="dash-available-grid">
        ${availableFeatured.map(zone => {
          const occPct = Math.round(((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100);
          return `
            <div class="parking-card">
              <div class="card-top-row">
                <div class="card-badges">
                  <span class="badge badge-public">${zone.zoneCode}</span>
                  ${zone.evCharging ? `<span class="badge badge-ev">⚡ EV</span>` : ''}
                </div>
                <div class="status-indicator status-high">
                  <span class="status-dot"></span>
                  Available
                </div>
              </div>

              <h3 class="zone-name">${zone.name}</h3>
              <p class="zone-address">${zone.address}</p>

              <div class="availability-stat-row">
                <div class="spaces-count">${zone.availableSpaces} <span class="spaces-ratio">/ ${zone.totalSpaces} spaces</span></div>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${occPct}% Full</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar progress-high" style="width: ${100 - occPct}%;"></div>
              </div>

              <div class="card-meta-grid">
                <div class="meta-item">
                  <span class="meta-label">Distance</span>
                  <span class="meta-val">${zone.distanceKm} km</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Walk</span>
                  <span class="meta-val">~${zone.walkingMinutes} min</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Tariff</span>
                  <span class="meta-val" style="color: var(--primary-600);">₹${zone.pricePerHour}/h</span>
                </div>
              </div>

              <div class="card-actions-row">
                <button type="button" class="btn btn-secondary btn-sm btn-dash-bay-picker" data-id="${zone.id}" style="flex: 1;">
                  Pick Bay
                </button>
                <button type="button" class="btn btn-primary btn-sm btn-dash-reserve-zone" data-id="${zone.id}" style="flex: 1.2;">
                  Reserve Bay
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- 6. Recent Parking History Table -->
    <section class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">Recent Parking History</h3>
        <span style="font-size: 0.8125rem; color: var(--text-muted);">Last 30 Days</span>
      </div>

      <div style="overflow-x: auto;">
        <table class="history-table">
          <thead>
            <tr>
              <th>Parking Location</th>
              <th>Date & Time</th>
              <th>Vehicle</th>
              <th>Duration</th>
              <th>Tariff</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${RECENT_PARKING_HISTORY.map(item => `
              <tr>
                <td><strong>${item.locationName}</strong></td>
                <td>${item.dateTime}</td>
                <td><span style="font-family: monospace; font-weight: 700;">${item.vehiclePlate}</span></td>
                <td>${item.durationHours} hrs</td>
                <td>₹${item.totalAmount}</td>
                <td>
                  <span class="history-status-badge ${item.status === 'ACTIVE' ? 'badge-status-active' : 'badge-status-inactive'}">
                    ${item.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

  // Attach Listeners
  document.getElementById('dash-btn-find-parking').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('dash-btn-my-vehicles').addEventListener('click', () => openVehicleGarageModal());
  document.getElementById('btn-dash-view-all-public').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('btn-rec-reserve-fast').addEventListener('click', () => onReservePublic('zone-pub-01'));
  document.getElementById('btn-dash-view-pass').addEventListener('click', () => onReservePublic('zone-pub-01'));
  document.getElementById('btn-dash-directions').addEventListener('click', () => {
    showToast("Navigating to Municipal Central Parking, Slot A-24...", "info");
  });

  // Bay Picker Modal
  container.querySelectorAll('.btn-dash-bay-picker').forEach(btn => {
    btn.addEventListener('click', () => {
      const zId = btn.getAttribute('data-id');
      const z = PUBLIC_PARKING_ZONES.find(p => p.id === zId);
      if (z) {
        openSlotGridModal(z, (slot) => {
          showToast(`Selected Slot ${slot}! Proceeding to reservation...`, 'success');
          onReservePublic(zId);
        });
      }
    });
  });

  // Reserve buttons
  container.querySelectorAll('.btn-dash-reserve-zone').forEach(btn => {
    btn.addEventListener('click', () => {
      const zId = btn.getAttribute('data-id');
      onReservePublic(zId);
    });
  });
}
