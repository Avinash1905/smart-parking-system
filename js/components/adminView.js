/**
 * Admin Management View Component
 * Renders Admin Dashboard Overview, Parking Locations CRUD Table, Companies Directory,
 * Violations Workflow Table, and Access Denied Guard.
 */

import { authService } from '../data/authService.js';
import { adminService } from '../data/adminService.js';
import { violationService } from '../data/violationService.js';
import { initAdminModals } from './adminModals.js';

export function renderAdminView(containerId, activeSubTab = 'overview', onNavigate) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const modals = initAdminModals();

  // 1. Role Check: Guard non-admin users
  if (!authService.isAdmin()) {
    container.innerHTML = `
      <div class="access-denied-box">
        <div class="access-denied-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">Access Denied</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
          You do not have administrative privileges to access the SmartPark Administration Console. Please sign in with an authorized administrator account.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button type="button" class="btn btn-secondary" id="btn-denied-dashboard">Go to User Dashboard</button>
          <button type="button" class="btn btn-primary" id="btn-denied-login">Admin Login</button>
        </div>
      </div>
    `;

    document.getElementById('btn-denied-dashboard').addEventListener('click', () => onNavigate('#/dashboard'));
    document.getElementById('btn-denied-login').addEventListener('click', () => onNavigate('#/login'));
    return;
  }

  // 2. Fetch Data
  const metrics = adminService.getOverviewMetrics();
  const locations = adminService.getAllLocations();
  const companies = adminService.getCompanies();
  const violations = violationService.getViolations();

  // Helper formatting
  function getParkingTypeBadge(type) {
    switch (type) {
      case 'PUBLIC':
        return '<span class="badge badge-public">PUBLIC</span>';
      case 'PRIVATE_COMPANY':
        return '<span class="badge badge-type-employee">EMPLOYEE</span>';
      case 'PRIVATE_RESTRICTED':
        return '<span class="badge badge-type-restricted">RESTRICTED</span>';
      case 'VISITOR':
        return '<span class="badge badge-type-visitor">VISITOR</span>';
      default:
        return `<span class="badge">${type}</span>`;
    }
  }

  function getViolationStatusBadge(st) {
    switch (st) {
      case 'OPEN': return '<span class="history-status-badge badge-viol-open">● OPEN</span>';
      case 'UNDER_REVIEW': return '<span class="history-status-badge badge-viol-review">● UNDER REVIEW</span>';
      case 'RESOLVED': return '<span class="history-status-badge badge-viol-resolved">✓ RESOLVED</span>';
      case 'DISMISSED': return '<span class="history-status-badge badge-viol-dismissed">✕ DISMISSED</span>';
      default: return st;
    }
  }

  container.innerHTML = `
    <div class="admin-wrapper">
      <!-- Admin Header Row -->
      <div class="admin-header-row">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge badge-public" style="background: rgba(16, 185, 129, 0.15); color: var(--status-high-text); border-color: rgba(16, 185, 129, 0.3);">
              🛡️ Master Administrator Console
            </span>
          </div>
          <h1 class="admin-title">SmartPark Control Center</h1>
          <p class="admin-subtext">Manage municipal parking infrastructure, corporate campus access rules, and parking enforcement violations.</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn btn-primary btn-sm" id="admin-top-add-loc">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Parking Location
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="admin-top-add-viol">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Log Violation
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-nav-tabs">
        <button type="button" class="admin-tab-btn ${activeSubTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Overview
        </button>

        <button type="button" class="admin-tab-btn ${activeSubTab === 'parking' ? 'active' : ''}" data-tab="parking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          Parking Locations
          <span class="tab-count-badge">${locations.length}</span>
        </button>

        <button type="button" class="admin-tab-btn ${activeSubTab === 'companies' ? 'active' : ''}" data-tab="companies">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Companies
          <span class="tab-count-badge">${companies.length}</span>
        </button>

        <button type="button" class="admin-tab-btn ${activeSubTab === 'violations' ? 'active' : ''}" data-tab="violations">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Parking Violations
          <span class="tab-count-badge" style="background: rgba(239, 68, 68, 0.2); color: var(--status-low-text);">${violations.filter(v => v.status === 'OPEN').length} Open</span>
        </button>
      </div>

      <!-- TAB CONTENT AREA -->
      <div id="admin-tab-body">
        ${renderTabContent(activeSubTab)}
      </div>
    </div>
  `;

  function renderTabContent(tab) {
    if (tab === 'parking') {
      return renderParkingLocationsTab();
    }
    if (tab === 'companies') {
      return renderCompaniesTab();
    }
    if (tab === 'violations') {
      return renderViolationsTab();
    }
    return renderOverviewTab();
  }

  function renderOverviewTab() {
    return `
      <!-- Summary KPI Cards -->
      <div class="summary-grid" style="margin-bottom: 32px;">
        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Total Parking Locations</span>
            <div class="kpi-value">${metrics.totalLocations}</div>
            <span class="kpi-subtext" style="color: var(--primary-600);">City & Corporate</span>
          </div>
          <div class="kpi-icon-box kpi-icon-indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Public Locations</span>
            <div class="kpi-value">${metrics.publicLocations}</div>
            <span class="kpi-subtext" style="color: var(--status-high-text);">Open to All</span>
          </div>
          <div class="kpi-icon-box kpi-icon-emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Private Locations</span>
            <div class="kpi-value">${metrics.privateLocations}</div>
            <span class="kpi-subtext" style="color: var(--status-med-text);">Corporate & Restricted</span>
          </div>
          <div class="kpi-icon-box kpi-icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>

        <div class="summary-kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">Available Spaces</span>
            <div class="kpi-value">${metrics.availableSpaces}</div>
            <span class="kpi-subtext">Live telemetry online</span>
          </div>
          <div class="kpi-icon-box kpi-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Facility Management</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">
            Configure real-time tariffs, capacity caps, dynamic sensor rules, and assign company affiliations.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-quick-manage-parking">
            Manage Parking Locations →
          </button>
        </div>

        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Enforcement & Violations</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">
            Review unauthorized parking alerts, ANPR camera mismatches, and overstay violations.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-quick-manage-viol">
            Review Active Violations (${violations.filter(v => v.status === 'OPEN').length}) →
          </button>
        </div>
      </div>
    `;
  }

  function renderParkingLocationsTab() {
    return `
      <div class="admin-toolbar">
        <div class="admin-search-wrapper">
          <input type="text" id="admin-search-loc" class="input-control" placeholder="Search facilities by name or address..." />
        </div>
        <button type="button" class="btn btn-primary" id="btn-table-add-loc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Parking Location
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Parking Location</th>
              <th>Type</th>
              <th>Company</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-loc-table-body">
            ${locations.map(loc => `
              <tr>
                <td>
                  <strong>${loc.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${loc.address}</div>
                </td>
                <td>${getParkingTypeBadge(loc.parkingType)}</td>
                <td>${loc.companyName || '—'}</td>
                <td><strong>${loc.totalSpaces}</strong> bays</td>
                <td><span style="color: var(--status-high-text); font-weight: 700;">${loc.availableSpaces}</span></td>
                <td>₹${loc.pricePerHour}/h</td>
                <td>
                  <span class="history-status-badge ${loc.status === 'ACTIVE' ? 'badge-status-active' : 'badge-status-inactive'}">
                    ${loc.status}
                  </span>
                </td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-loc-toggle" data-id="${loc.id}">
                    ${loc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCompaniesTab() {
    return `
      <div class="admin-toolbar">
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
          Registered Corporate Partners & Campuses
        </div>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Code</th>
              <th>Headquarters / Campus</th>
              <th>Registered Employees</th>
              <th>Associated Parking Decks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${companies.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td><span class="badge badge-company badge-company-tcs">${c.code}</span></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${c.headquarters}</span></td>
                <td><strong>${c.employeesCount}</strong> Verified</td>
                <td><strong>${c.parkingLocationsCount}</strong> Decks</td>
                <td><span class="history-status-badge badge-status-active">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderViolationsTab() {
    return `
      <div class="admin-toolbar">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="filter-chip active" data-viol-filter="ALL">All Violations (${violations.length})</button>
          <button class="filter-chip" data-viol-filter="OPEN">Open (${violations.filter(v => v.status === 'OPEN').length})</button>
          <button class="filter-chip" data-viol-filter="UNDER_REVIEW">Under Review (${violations.filter(v => v.status === 'UNDER_REVIEW').length})</button>
          <button class="filter-chip" data-viol-filter="RESOLVED">Resolved (${violations.filter(v => v.status === 'RESOLVED').length})</button>
        </div>

        <button type="button" class="btn btn-primary" id="btn-table-add-viol">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log Violation
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Violation ID</th>
              <th>Vehicle Number</th>
              <th>Driver / User</th>
              <th>Parking Location</th>
              <th>Violation Type</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-viol-table-body">
            ${violations.map(v => `
              <tr>
                <td><strong>${v.id}</strong></td>
                <td><strong style="color: var(--primary-600);">${v.vehiclePlate}</strong></td>
                <td>${v.userName}</td>
                <td><span style="font-size: 0.8125rem;">${v.parkingLocation}</span></td>
                <td><span class="badge" style="background: rgba(239,68,68,0.08); color: var(--status-low-text);">${v.violationType}</span></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${v.dateTime}</span></td>
                <td>${getViolationStatusBadge(v.status)}</td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-viol-view" data-id="${v.id}">
                    View & Action
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- Attach Event Listeners ---
  // Tab Switching
  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      onNavigate(`#/admin/${targetTab === 'overview' ? '' : targetTab}`);
    });
  });

  // Top Buttons
  const topAddLoc = document.getElementById('admin-top-add-loc');
  const tableAddLoc = document.getElementById('btn-table-add-loc');
  const openLocModal = () => {
    modals.openAddLocationModal(() => {
      renderAdminView(containerId, activeSubTab, onNavigate);
    });
  };
  if (topAddLoc) topAddLoc.addEventListener('click', openLocModal);
  if (tableAddLoc) tableAddLoc.addEventListener('click', openLocModal);

  const topAddViol = document.getElementById('admin-top-add-viol');
  const tableAddViol = document.getElementById('btn-table-add-viol');
  const openViolModal = () => {
    modals.openAddViolationModal(() => {
      renderAdminView(containerId, activeSubTab, onNavigate);
    });
  };
  if (topAddViol) topAddViol.addEventListener('click', openViolModal);
  if (tableAddViol) tableAddViol.addEventListener('click', openViolModal);

  // Overview quick navigation
  const qManageParking = document.getElementById('btn-quick-manage-parking');
  if (qManageParking) qManageParking.addEventListener('click', () => onNavigate('#/admin/parking'));

  const qManageViol = document.getElementById('btn-quick-manage-viol');
  if (qManageViol) qManageViol.addEventListener('click', () => onNavigate('#/admin/violations'));

  // Toggle Location Status
  container.querySelectorAll('.btn-loc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const locId = btn.getAttribute('data-id');
      adminService.toggleLocationStatus(locId);
      renderAdminView(containerId, activeSubTab, onNavigate);
    });
  });

  // View Violation Details
  container.querySelectorAll('.btn-viol-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const vId = btn.getAttribute('data-id');
      modals.openViolationDetailsModal(vId, () => {
        renderAdminView(containerId, activeSubTab, onNavigate);
      });
    });
  });

  // Violation Filter Chips
  container.querySelectorAll('.filter-chip[data-viol-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip[data-viol-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const st = chip.getAttribute('data-viol-filter');
      const filtered = violationService.getViolations(st);
      const tbody = document.getElementById('admin-viol-table-body');
      if (tbody) {
        tbody.innerHTML = filtered.map(v => `
          <tr>
            <td><strong>${v.id}</strong></td>
            <td><strong style="color: var(--primary-600);">${v.vehiclePlate}</strong></td>
            <td>${v.userName}</td>
            <td><span style="font-size: 0.8125rem;">${v.parkingLocation}</span></td>
            <td><span class="badge" style="background: rgba(239,68,68,0.08); color: var(--status-low-text);">${v.violationType}</span></td>
            <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${v.dateTime}</span></td>
            <td>${getViolationStatusBadge(v.status)}</td>
            <td>
              <button type="button" class="btn btn-secondary btn-sm btn-viol-view" data-id="${v.id}">
                View & Action
              </button>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('.btn-viol-view').forEach(btn => {
          btn.addEventListener('click', () => {
            const vId = btn.getAttribute('data-id');
            modals.openViolationDetailsModal(vId, () => {
              renderAdminView(containerId, activeSubTab, onNavigate);
            });
          });
        });
      }
    });
  });
}
