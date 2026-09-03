/**
 * Public Parking Zone Cards Renderer
 * Renders parking card items with real-time occupancy and authentication gate on reserve actions.
 */

import { authService } from '../data/authService.js';
import { showToast } from './toast.js';

export function renderLoadingState(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="card" style="padding: 40px 20px; text-align: center;">
      <div class="loading-spinner" style="width: 36px; height: 36px; border: 3px solid rgba(79,70,229,0.2); border-top-color: var(--primary-600); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px;"></div>
      <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Loading Parking Zones...</h3>
      <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 340px; margin: 0 auto;">Connecting to municipal IoT telemetry gateway and real-time bay sensors.</p>
    </div>
  `;
}

export function renderErrorState(containerId, onRetry) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="card" style="padding: 40px 20px; text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 8px;">⚠️</div>
      <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--status-low-text); margin-bottom: 4px;">Unable to Load Parking Zones</h3>
      <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 360px; margin: 0 auto 16px;">Failed to synchronize with the sensor gateway. Please check your connection and retry.</p>
      <button type="button" class="btn btn-primary btn-sm" id="btn-retry-parking-load">
        ↻ Retry Sensor Sync
      </button>
    </div>
  `;
  document.getElementById('btn-retry-parking-load')?.addEventListener('click', () => {
    if (onRetry) onRetry();
  });
}

export function renderParkingList(containerId, zones, selectedZoneId, onSelectZone, onViewDetails, onReserve) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (zones.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 40px 20px; text-align: center;">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No Parking Zones Found</h3>
        <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 320px; margin: 0 auto;">Try adjusting your search query, vehicle type, or active filters.</p>
      </div>
    `;
    return;
  }

  const isUserLoggedIn = authService.isAuthenticated();

  const cardsHtml = zones.map(zone => {
    const isSelected = zone.id === selectedZoneId;
    const occupancyPercent = Math.round(((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100);

    let statusClass = 'status-high';
    let statusText = 'Available';
    let progressClass = 'progress-high';

    if (zone.availabilityStatus === 'MEDIUM') {
      statusClass = 'status-med';
      statusText = 'Limited';
      progressClass = 'progress-med';
    } else if (zone.availabilityStatus === 'LOW') {
      statusClass = 'status-low';
      statusText = 'Almost Full';
      progressClass = 'progress-low';
    }

    return `
      <div class="parking-card ${isSelected ? 'selected' : ''}" data-id="${zone.id}">
        <!-- Top Row: Zone Code, EV badge, Live Status -->
        <div class="card-top-row">
          <div class="card-badges">
            <span class="badge badge-public">${zone.zoneCode}</span>
            ${zone.evCharging ? `
              <span class="badge badge-ev">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                EV Fast Charging
              </span>
            ` : ''}
            ${zone.open24x7 ? `<span class="badge badge-public" style="background: rgba(16, 185, 129, 0.1); color: var(--status-high-text);">24/7 Open</span>` : ''}
          </div>

          <div class="status-indicator ${statusClass}">
            <span class="status-dot"></span>
            ${statusText}
          </div>
        </div>

        <!-- Zone Name & Address -->
        <h3 class="zone-name">${zone.name}</h3>
        <p class="zone-address">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${zone.address}
        </p>

        <!-- Availability Meter -->
        <div class="availability-stat-row">
          <div class="spaces-count">${zone.availableSpaces} <span class="spaces-ratio">/ ${zone.totalSpaces} spaces</span></div>
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">${occupancyPercent}% Occupied</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar ${progressClass}" style="width: ${100 - occupancyPercent}%;"></div>
        </div>

        <!-- Meta Details: Distance, Walk, Tariff -->
        <div class="card-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Distance</span>
            <span class="meta-val">${zone.distanceKm} km away</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Walk Time</span>
            <span class="meta-val">~${zone.walkingMinutes} min walk</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Tariff</span>
            <span class="meta-val" style="color: var(--primary-600);">₹${zone.pricePerHour}/hour</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions-row">
          <button type="button" class="btn btn-secondary btn-sm btn-action-details" data-id="${zone.id}">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm btn-action-reserve" data-id="${zone.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Reserve Bay
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml;

  // Click card to select
  container.querySelectorAll('.parking-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const zoneId = card.getAttribute('data-id');
      onSelectZone(zoneId);
    });
  });

  // Details button
  container.querySelectorAll('.btn-action-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const zoneId = btn.getAttribute('data-id');
      onViewDetails(zoneId);
    });
  });

  // Reserve button with Auth Gate
  container.querySelectorAll('.btn-action-reserve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const zoneId = btn.getAttribute('data-id');

      if (!authService.isAuthenticated()) {
        showToast("Please sign in to complete your parking bay reservation.", "warning");
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 600);
        return;
      }

      onReserve(zoneId);
    });
  });
}
