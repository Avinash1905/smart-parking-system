/**
 * Admin Modals Component
 * Modals for Adding Parking Locations, Adding Violations, and Viewing/Transitioning Violation Statuses.
 */

import { adminService } from '../data/adminService.js';
import { violationService, VIOLATION_TYPES } from '../data/violationService.js';

export function initAdminModals() {
  let modalContainer = document.getElementById('modals-root');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modals-root';
    document.body.appendChild(modalContainer);
  }

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  return {
    openAddLocationModal: (onLocationSaved) => {
      closeModal();
      const companies = adminService.getCompanies();

      const modalHtml = `
        <div class="modal-overlay active" id="modal-add-loc-overlay">
          <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
              <div>
                <span class="badge badge-public" style="margin-bottom: 4px;">SmartPark Admin Control</span>
                <h3 class="modal-title">Add Parking Location</h3>
              </div>
              <button type="button" class="modal-close" id="modal-loc-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form id="form-add-location">
              <div class="modal-body">
                <!-- Location Name -->
                <div class="input-group" style="margin-bottom: 14px;">
                  <label class="input-label" for="loc-name">Parking Facility Name *</label>
                  <input type="text" id="loc-name" class="input-control" placeholder="e.g. Whitefield Corporate Deck A" required value="Whitefield Tech Deck" />
                </div>

                <!-- Type & Company Row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="input-group">
                    <label class="input-label" for="loc-type">Parking Type *</label>
                    <select id="loc-type" class="input-control">
                      <option value="PUBLIC">PUBLIC (All Citizens)</option>
                      <option value="PRIVATE_COMPANY" selected>PRIVATE_COMPANY (Employees Only)</option>
                      <option value="PRIVATE_RESTRICTED">PRIVATE_RESTRICTED (Clearance List)</option>
                      <option value="VISITOR">VISITOR (Approval Required)</option>
                    </select>
                  </div>

                  <div class="input-group" id="loc-company-group">
                    <label class="input-label" for="loc-company">Assigned Company *</label>
                    <select id="loc-company" class="input-control">
                      ${companies.map(c => `
                        <option value="${c.id}" data-name="${c.name}">${c.name}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <!-- Address -->
                <div class="input-group" style="margin-bottom: 14px;">
                  <label class="input-label" for="loc-address">Physical Address *</label>
                  <input type="text" id="loc-address" class="input-control" placeholder="e.g. ITPL Main Road, Whitefield" required value="ITPL Main Road, Whitefield Tech Zone" />
                </div>

                <!-- Capacity & Available & Tariff -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                  <div class="input-group">
                    <label class="input-label" for="loc-capacity">Total Capacity</label>
                    <input type="number" id="loc-capacity" class="input-control" min="1" value="100" required />
                  </div>
                  <div class="input-group">
                    <label class="input-label" for="loc-available">Available Bays</label>
                    <input type="number" id="loc-available" class="input-control" min="0" value="65" required />
                  </div>
                  <div class="input-group">
                    <label class="input-label" for="loc-price">Rate (₹/hr)</label>
                    <input type="number" id="loc-price" class="input-control" min="0" value="20" required />
                  </div>
                </div>

                <!-- Status & EV Charging -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                  <div class="input-group">
                    <label class="input-label" for="loc-status">Operational Status</label>
                    <select id="loc-status" class="input-control">
                      <option value="ACTIVE" selected>ACTIVE (Online)</option>
                      <option value="INACTIVE">INACTIVE (Maintenance)</option>
                    </select>
                  </div>

                  <div class="input-group">
                    <label class="input-label" for="loc-access-type">Access Enforcement Type</label>
                    <select id="loc-access-type" class="input-control">
                      <option value="COMPANY_EMPLOYEES" selected>COMPANY_EMPLOYEES</option>
                      <option value="AUTHORIZED_USERS">AUTHORIZED_USERS</option>
                      <option value="VISITOR_APPROVAL">VISITOR_APPROVAL</option>
                      <option value="ALL_USERS">ALL_USERS</option>
                    </select>
                  </div>
                </div>

                <label class="remember-me-label" style="font-size: 0.8125rem;">
                  <input type="checkbox" id="loc-ev" checked style="accent-color: var(--primary-600);" />
                  <span>Equipped with EV Fast Charging Bays</span>
                </label>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="modal-loc-cancel">Cancel</button>
                <button type="submit" class="btn btn-primary" id="modal-loc-save">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Add Parking Location
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modalHtml;

      // Dynamic Company Field Toggling based on Parking Type
      const typeSelect = document.getElementById('loc-type');
      const companyGroup = document.getElementById('loc-company-group');
      const companySelect = document.getElementById('loc-company');

      function updateCompanyField() {
        if (typeSelect.value === 'PUBLIC') {
          companyGroup.style.opacity = '0.4';
          companyGroup.style.pointerEvents = 'none';
          companySelect.removeAttribute('required');
        } else {
          companyGroup.style.opacity = '1';
          companyGroup.style.pointerEvents = 'auto';
          companySelect.setAttribute('required', 'true');
        }
      }
      typeSelect.addEventListener('change', updateCompanyField);
      updateCompanyField();

      document.getElementById('modal-loc-close').addEventListener('click', closeModal);
      document.getElementById('modal-loc-cancel').addEventListener('click', closeModal);
      document.getElementById('modal-add-loc-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-add-loc-overlay') closeModal();
      });

      // Submit Form
      document.getElementById('form-add-location').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCompanyOpt = companySelect.options[companySelect.selectedIndex];

        const locationData = {
          name: document.getElementById('loc-name').value.trim(),
          parkingType: typeSelect.value,
          companyId: typeSelect.value === 'PUBLIC' ? null : companySelect.value,
          companyName: typeSelect.value === 'PUBLIC' ? '—' : selectedCompanyOpt.getAttribute('data-name'),
          address: document.getElementById('loc-address').value.trim(),
          totalSpaces: document.getElementById('loc-capacity').value,
          availableSpaces: document.getElementById('loc-available').value,
          pricePerHour: document.getElementById('loc-price').value,
          status: document.getElementById('loc-status').value,
          accessType: document.getElementById('loc-access-type').value,
          evCharging: document.getElementById('loc-ev').checked
        };

        const added = adminService.addLocation(locationData);
        closeModal();
        if (onLocationSaved) onLocationSaved(added);
      });
    },

    openAddViolationModal: (onViolationSaved) => {
      closeModal();
      const locations = adminService.getAllLocations();
      const nowStr = new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      const modalHtml = `
        <div class="modal-overlay active" id="modal-add-viol-overlay">
          <div class="modal-content" style="max-width: 540px;">
            <div class="modal-header">
              <div>
                <span class="badge badge-type-restricted" style="margin-bottom: 4px;">Enforcement Control</span>
                <h3 class="modal-title">Create Parking Violation</h3>
              </div>
              <button type="button" class="modal-close" id="modal-viol-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form id="form-add-violation">
              <div class="modal-body">
                <!-- Vehicle Number & Driver Name -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                  <div class="input-group">
                    <label class="input-label" for="viol-plate">Vehicle Number *</label>
                    <input type="text" id="viol-plate" class="input-control" placeholder="e.g. KA-01-AB-1234" required value="KA-05-AB-4099" style="text-transform: uppercase; font-weight: 700;" />
                  </div>
                  <div class="input-group">
                    <label class="input-label" for="viol-user">Driver / Registered User</label>
                    <input type="text" id="viol-user" class="input-control" placeholder="e.g. Avinash Sharma" value="Avinash Sharma" />
                  </div>
                </div>

                <!-- Parking Location & Violation Type -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                  <div class="input-group">
                    <label class="input-label" for="viol-location">Parking Location *</label>
                    <select id="viol-location" class="input-control">
                      ${locations.map(l => `
                        <option value="${l.id}" data-name="${l.name}">${l.name}</option>
                      `).join('')}
                    </select>
                  </div>

                  <div class="input-group">
                    <label class="input-label" for="viol-type">Violation Type *</label>
                    <select id="viol-type" class="input-control">
                      ${VIOLATION_TYPES.map(t => `
                        <option value="${t}">${t}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <!-- Date & Time -->
                <div class="input-group" style="margin-bottom: 14px;">
                  <label class="input-label" for="viol-datetime">Timestamp</label>
                  <input type="text" id="viol-datetime" class="input-control" value="${nowStr}" />
                </div>

                <!-- Description -->
                <div class="input-group" style="margin-bottom: 14px;">
                  <label class="input-label" for="viol-desc">Violation Description</label>
                  <textarea id="viol-desc" class="input-control" rows="2" placeholder="Explain the violation details...">Vehicle parked in employee-only corporate bay without valid authorization pass.</textarea>
                </div>

                <!-- Evidence Notes -->
                <div class="input-group">
                  <label class="input-label" for="viol-evidence">Evidence / Inspector Notes</label>
                  <input type="text" id="viol-evidence" class="input-control" value="Barrier ANPR camera log #9921 verification failure." />
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="modal-viol-cancel">Cancel</button>
                <button type="submit" class="btn btn-primary" id="modal-viol-save">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Create Violation
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modalHtml;

      document.getElementById('modal-viol-close').addEventListener('click', closeModal);
      document.getElementById('modal-viol-cancel').addEventListener('click', closeModal);
      document.getElementById('modal-add-viol-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-add-viol-overlay') closeModal();
      });

      document.getElementById('form-add-violation').addEventListener('submit', (e) => {
        e.preventDefault();
        const locSelect = document.getElementById('viol-location');
        const selectedLoc = locSelect.options[locSelect.selectedIndex];

        const violData = {
          vehiclePlate: document.getElementById('viol-plate').value,
          userName: document.getElementById('viol-user').value,
          parkingLocation: selectedLoc.getAttribute('data-name'),
          locationId: locSelect.value,
          violationType: document.getElementById('viol-type').value,
          dateTime: document.getElementById('viol-datetime').value,
          description: document.getElementById('viol-desc').value,
          evidenceNotes: document.getElementById('viol-evidence').value
        };

        const added = violationService.addViolation(violData);
        closeModal();
        if (onViolationSaved) onViolationSaved(added);
      });
    },

    openViolationDetailsModal: (violationId, onStatusUpdated) => {
      closeModal();
      const viol = violationService.getViolationById(violationId);
      if (!viol) return;

      function getStatusBadge(st) {
        switch (st) {
          case 'OPEN': return '<span class="history-status-badge badge-viol-open">● OPEN</span>';
          case 'UNDER_REVIEW': return '<span class="history-status-badge badge-viol-review">● UNDER REVIEW</span>';
          case 'RESOLVED': return '<span class="history-status-badge badge-viol-resolved">✓ RESOLVED</span>';
          case 'DISMISSED': return '<span class="history-status-badge badge-viol-dismissed">✕ DISMISSED</span>';
          default: return st;
        }
      }

      const modalHtml = `
        <div class="modal-overlay active" id="modal-viol-details-overlay">
          <div class="modal-content" style="max-width: 540px;">
            <div class="modal-header">
              <div>
                <span class="badge badge-type-restricted" style="margin-bottom: 4px;">Violation Record</span>
                <h3 class="modal-title">${viol.id} — ${viol.violationType}</h3>
              </div>
              <button type="button" class="modal-close" id="modal-vd-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="modal-body">
              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 18px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.84rem;">
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">VEHICLE NUMBER</span>
                    <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${viol.vehiclePlate}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">CURRENT STATUS</span>
                    <div style="margin-top: 2px;">${getStatusBadge(viol.status)}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">DRIVER / USER</span>
                    <div style="font-weight: 700; color: var(--text-primary);">${viol.userName}</div>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.75rem;">DATE & TIME</span>
                    <div style="font-weight: 600; color: var(--text-secondary);">${viol.dateTime}</div>
                  </div>
                  <div style="grid-column: span 2;">
                    <span style="color: var(--text-muted); font-size: 0.75rem;">PARKING FACILITY</span>
                    <div style="font-weight: 700; color: var(--primary-600);">${viol.parkingLocation}</div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Description</h4>
              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px; background: var(--bg-surface-subtle); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                ${viol.description}
              </p>

              <!-- Evidence Notes -->
              <h4 style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Evidence / Inspector Telemetry</h4>
              <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.5; background: var(--bg-surface-subtle); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                ${viol.evidenceNotes}
              </p>
            </div>

            <div class="modal-footer" style="display: flex; justify-content: space-between; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary" id="modal-vd-close-btn">Close</button>
              
              <div style="display: flex; gap: 8px;">
                ${viol.status === 'OPEN' ? `
                  <button type="button" class="btn btn-secondary btn-sm" id="btn-status-review" style="color: #3b82f6; border-color: #3b82f6;">
                    Mark Under Review
                  </button>
                ` : ''}

                ${viol.status !== 'RESOLVED' ? `
                  <button type="button" class="btn btn-primary btn-sm" id="btn-status-resolve" style="background: #10b981;">
                    ✓ Resolve
                  </button>
                ` : ''}

                ${viol.status !== 'DISMISSED' ? `
                  <button type="button" class="btn btn-ghost btn-sm" id="btn-status-dismiss" style="color: var(--status-low-text);">
                    Dismiss
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modalHtml;

      document.getElementById('modal-vd-close').addEventListener('click', closeModal);
      document.getElementById('modal-vd-close-btn').addEventListener('click', closeModal);
      document.getElementById('modal-viol-details-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-viol-details-overlay') closeModal();
      });

      const btnReview = document.getElementById('btn-status-review');
      if (btnReview) {
        btnReview.addEventListener('click', () => {
          violationService.updateStatus(viol.id, 'UNDER_REVIEW');
          closeModal();
          if (onStatusUpdated) onStatusUpdated();
        });
      }

      const btnResolve = document.getElementById('btn-status-resolve');
      if (btnResolve) {
        btnResolve.addEventListener('click', () => {
          violationService.updateStatus(viol.id, 'RESOLVED');
          closeModal();
          if (onStatusUpdated) onStatusUpdated();
        });
      }

      const btnDismiss = document.getElementById('btn-status-dismiss');
      if (btnDismiss) {
        btnDismiss.addEventListener('click', () => {
          violationService.updateStatus(viol.id, 'DISMISSED');
          closeModal();
          if (onStatusUpdated) onStatusUpdated();
        });
      }
    }
  };
}
