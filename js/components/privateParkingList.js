/**
 * Private Parking List & Company Cards Component with Strict Multi-Tier Access Control
 * Implements:
 * 1. Logged-out gate ("Please login to check your access")
 * 2. Logged-in user without private access ("You currently don't have access to any private parking facility")
 * 3. Logged-in user with corporate/explicit clearance (Only authorized decks are reservable)
 */

import { authService } from '../data/authService.js';

export function renderPrivateParkingList(
  containerId, 
  zones, 
  selectedZoneId, 
  currentUserSession, 
  onSelectZone, 
  onViewDetails, 
  onReserve, 
  onRequestVisitorAccess,
  onNavigatePublic,
  onNavigateLogin,
  onNavigateSignup
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isUserLoggedIn = authService.isAuthenticated();
  const currentUser = currentUserSession || authService.getCurrentUser();

  // 1. GATE 1: Logged-Out Anonymous User
  if (!isUserLoggedIn || !currentUser) {
    container.innerHTML = `
      <div class="card" style="padding: 48px 32px; text-align: center; max-width: 640px; margin: 20px auto; box-shadow: var(--shadow-lg);">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-surface-subtle); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: var(--primary-600); border: 2px solid var(--border-color);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <span class="badge badge-type-restricted" style="margin-bottom: 12px;">Authentication Required</span>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">Private Parking Requires Authentication</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; max-width: 480px; margin: 0 auto 24px auto;">
          Private parking facilities are available only to authenticated and authorized SmartPark corporate users. Please sign in or register to check your access clearance.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary btn-lg" id="btn-pvt-gate-login">
            Sign In to Verify Access
          </button>
          <button type="button" class="btn btn-secondary btn-lg" id="btn-pvt-gate-signup">
            Create Account
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-pvt-gate-login').addEventListener('click', () => {
      if (onNavigateLogin) onNavigateLogin();
      else window.location.hash = '#/login';
    });

    document.getElementById('btn-pvt-gate-signup').addEventListener('click', () => {
      if (onNavigateSignup) onNavigateSignup();
      else window.location.hash = '#/signup';
    });

    return;
  }

  // 2. GATE 2: Logged-in user has NO private parking authorization (Public Citizen User)
  const hasAnyAccess = authService.hasPrivateParkingAccess(currentUser);
  if (!hasAnyAccess) {
    container.innerHTML = `
      <div class="card" style="padding: 48px 32px; text-align: center; max-width: 640px; margin: 20px auto; box-shadow: var(--shadow-md);">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(245, 158, 11, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: var(--status-med-text); border: 1.5px solid var(--status-med-border);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--status-med-text); margin-bottom: 10px;">Corporate Clearance Required</span>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">No Corporate Parking Access</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; max-width: 480px; margin: 0 auto 20px auto;">
          Private parking facilities are exclusively reserved for verified partner employees (TCS, Infosys, Wipro, Tech Mahindra). Your account (<strong>${currentUser.email}</strong>) is currently registered as a Public Citizen.
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
          You can use all public municipal lots with live sensor availability and AI predictions.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="btn-pvt-goto-public">
            Explore Public Parking →
          </button>
          <button type="button" class="btn btn-secondary" id="btn-pvt-request-pass">
            Request Visitor Pass
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-pvt-goto-public').addEventListener('click', () => {
      if (onNavigatePublic) onNavigatePublic();
      else window.location.hash = '#/parking/public';
    });

    document.getElementById('btn-pvt-request-pass').addEventListener('click', () => {
      if (onRequestVisitorAccess) onRequestVisitorAccess();
    });

    return;
  }

  // 3. GATE 3: Logged-in user WITH private authorization
  function getCompanyClass(companyId) {
    if (!companyId) return 'badge-company-other';
    const c = companyId.toUpperCase();
    if (c.includes('TCS')) return 'badge-company-tcs';
    if (c.includes('INFOSYS')) return 'badge-company-infosys';
    if (c.includes('WIPRO')) return 'badge-company-wipro';
    if (c.includes('TECHM')) return 'badge-company-techm';
    return 'badge-company-other';
  }

  function getTypeBadge(type, label) {
    if (type === 'VISITOR') {
      return `<span class="badge badge-type-visitor">${label || 'Visitor'}</span>`;
    }
    if (type === 'RESTRICTED' || type === 'PRIVATE_RESTRICTED') {
      return `<span class="badge badge-type-restricted">${label || 'Restricted'}</span>`;
    }
    return `<span class="badge badge-type-employee">${label || 'Employee'}</span>`;
  }

  const cardsHtml = zones.map(zone => {
    const isSelected = zone.id === selectedZoneId;
    const authDecision = authService.canAccessLocation(zone, currentUser);
    const occupancyPercent = Math.round(((zone.totalSpaces - zone.availableSpaces) / zone.totalSpaces) * 100);

    let statusClass = 'status-high';
    let statusText = 'Available';
    let progressClass = 'progress-high';

    if (zone.availabilityStatus === 'MEDIUM') {
      statusClass = 'status-med';
      statusText = 'Limited Availability';
      progressClass = 'progress-med';
    } else if (zone.availabilityStatus === 'LOW') {
      statusClass = 'status-low';
      statusText = 'Low Availability';
      progressClass = 'progress-low';
    }

    return `
      <div class="parking-card ${isSelected ? 'selected' : ''}" data-id="${zone.id}">
        <!-- Top Row: Company Badge + Type Badge + Status Indicator -->
        <div class="card-top-row">
          <div class="card-badges">
            <span class="badge-company ${getCompanyClass(zone.companyId)}">
              ${zone.companyName}
            </span>
            ${getTypeBadge(zone.parkingType, zone.typeLabel)}
            ${zone.evCharging ? `
              <span class="badge badge-ev">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                EV
              </span>
            ` : ''}
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
          <div class="spaces-count">${zone.availableSpaces} <span class="spaces-ratio">/ ${zone.totalSpaces} spaces available</span></div>
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

        <!-- Access Decision Banner -->
        ${authDecision.allowed ? `
          <div class="access-control-box authorized">
            <div class="access-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <span class="access-title-strong">✓ Access Authorized</span>
              <span>${authDecision.message}</span>
            </div>
          </div>
        ` : `
          <div class="access-control-box restricted">
            <div class="access-icon-wrapper" style="color: var(--status-low-text);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <span class="access-title-strong" style="color: var(--status-low-text);">🔒 Access Restricted</span>
              <span>${authDecision.message}</span>
            </div>
          </div>
        `}

        <!-- Actions -->
        <div class="card-actions-row">
          <button type="button" class="btn btn-secondary btn-sm btn-pvt-details" data-id="${zone.id}" style="flex: 1;">
            View Details
          </button>

          ${authDecision.allowed ? `
            <button type="button" class="btn btn-primary btn-sm btn-pvt-reserve" data-id="${zone.id}" style="flex: 1.2;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Reserve Parking
            </button>
          ` : `
            <button type="button" class="btn btn-outline btn-sm btn-pvt-public-alt" style="flex: 1.2;">
              View Public Parking
            </button>
          `}
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

  // Action Buttons
  container.querySelectorAll('.btn-pvt-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const zoneId = btn.getAttribute('data-id');
      onViewDetails(zoneId);
    });
  });

  container.querySelectorAll('.btn-pvt-reserve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const zoneId = btn.getAttribute('data-id');
      onReserve(zoneId);
    });
  });

  container.querySelectorAll('.btn-pvt-public-alt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onNavigatePublic) onNavigatePublic();
      else window.location.hash = '#/parking/public';
    });
  });
}
