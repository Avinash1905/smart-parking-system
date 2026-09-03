/**
 * Visitor Access Request Modal Component
 * Complete interactive flow for requesting temporary visitor parking access and generating a Visitor QR Pass
 */

import { PRIVATE_PARKING_ZONES } from '../data/privateParkingData.js';

export function openVisitorRequestModal(preselectedZoneId = null) {
  let modalContainer = document.getElementById('modals-root');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modals-root';
    document.body.appendChild(modalContainer);
  }

  const visitorZones = PRIVATE_PARKING_ZONES.filter(z => z.parkingType === 'VISITOR' || z.parkingType === 'EMPLOYEE');
  const initialZone = visitorZones.find(z => z.id === preselectedZoneId) || visitorZones[0];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(Math.ceil(now.getMinutes() / 15) * 15 % 60).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  const modalHtml = `
    <div class="modal-overlay active" id="visitor-modal-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-type-visitor" style="margin-bottom: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              Temporary Company Permit
            </span>
            <h3 class="modal-title">Request Visitor Parking Access</h3>
          </div>
          <button type="button" class="modal-close" id="visitor-btn-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" id="visitor-modal-body">
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">
            Submit your visitor credentials and host contact details. Temporary parking clearance is validated automatically for verified hosts.
          </p>

          <!-- Company / Facility Selector -->
          <div class="input-group" style="margin-bottom: 14px;">
            <label class="input-label" for="visitor-zone-select">Destination Facility</label>
            <select id="visitor-zone-select" class="input-control">
              ${visitorZones.map(z => `
                <option value="${z.id}" ${z.id === initialZone.id ? 'selected' : ''}>
                  [${z.companyName}] ${z.name} (${z.availableSpaces} bays free)
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Host Employee & Purpose -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div class="input-group">
              <label class="input-label" for="visitor-host-name">Host Employee / POC</label>
              <input type="text" id="visitor-host-name" class="input-control" placeholder="e.g. Rajesh Sharma" value="Priya Nair (HR / Dept)" />
            </div>
            <div class="input-group">
              <label class="input-label" for="visitor-purpose">Visit Purpose</label>
              <select id="visitor-purpose" class="input-control">
                <option value="Client Meeting">Client / Vendor Meeting</option>
                <option value="Technical Interview">Job / Technical Interview</option>
                <option value="Contractor Work">Contractor / Facility Work</option>
                <option value="Guest Visit">Official Guest Visit</option>
              </select>
            </div>
          </div>

          <!-- Date & Expected Time -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div class="input-group">
              <label class="input-label" for="visitor-date">Date of Visit</label>
              <input type="date" id="visitor-date" class="input-control" value="${todayStr}" />
            </div>
            <div class="input-group">
              <label class="input-label" for="visitor-time">Arrival Time</label>
              <input type="time" id="visitor-time" class="input-control" value="${timeStr}" />
            </div>
          </div>

          <!-- Visitor Name & Vehicle Plate -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div class="input-group">
              <label class="input-label" for="visitor-full-name">Visitor Full Name</label>
              <input type="text" id="visitor-full-name" class="input-control" placeholder="Your name" value="Sameer Deshmukh" />
            </div>
            <div class="input-group">
              <label class="input-label" for="visitor-plate">Vehicle Plate Number</label>
              <input type="text" id="visitor-plate" class="input-control" placeholder="e.g. KA-05-EX-9988" value="KA-05-EX-9988" style="text-transform: uppercase; font-weight: 700;" />
            </div>
          </div>

          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            An automated SMS & QR notification will be dispatched upon security barrier clearance.
          </div>
        </div>

        <div class="modal-footer" id="visitor-modal-footer">
          <button type="button" class="btn btn-secondary" id="visitor-btn-cancel">Cancel</button>
          <button type="button" class="btn btn-primary" id="visitor-btn-submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Submit & Generate Visitor Pass
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('visitor-btn-close').addEventListener('click', closeModal);
  document.getElementById('visitor-btn-cancel').addEventListener('click', closeModal);
  document.getElementById('visitor-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'visitor-modal-overlay') closeModal();
  });

  // Submit Handler
  document.getElementById('visitor-btn-submit').addEventListener('click', () => {
    const zoneId = document.getElementById('visitor-zone-select').value;
    const selectedZone = visitorZones.find(z => z.id === zoneId) || initialZone;
    const visitorName = document.getElementById('visitor-full-name').value || 'Sameer Deshmukh';
    const plate = document.getElementById('visitor-plate').value || 'KA-05-EX-9988';
    const hostName = document.getElementById('visitor-host-name').value || 'Priya Nair (HR)';
    const purpose = document.getElementById('visitor-purpose').value;
    const passId = 'VSTR-' + Math.floor(100000 + Math.random() * 900000);
    const assignedBay = 'V-Bay ' + Math.floor(1 + Math.random() * 12);

    const bodyEl = document.getElementById('visitor-modal-body');
    const footerEl = document.getElementById('visitor-modal-footer');

    bodyEl.innerHTML = `
      <div style="text-align: center; padding: 8px 0;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--status-high-bg); border: 2px solid var(--status-high-border); color: var(--status-high-text); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 2px;">Visitor Parking Access Approved!</h3>
        <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 16px;">
          Clearance granted by <strong>${selectedZone.companyName} Security Control</strong>.
        </p>

        <!-- Digital Visitor Pass Card -->
        <div style="background: var(--bg-surface-subtle); border: 2px solid var(--accent-cyan); border-radius: var(--radius-xl); padding: 18px; max-width: 320px; margin: 0 auto 14px auto; box-shadow: var(--shadow-lg);">
          <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${selectedZone.companyName} • TEMPORARY VISITOR PASS
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">
            ${selectedZone.name}
          </div>

          <!-- QR Simulation SVG -->
          <div style="background: #ffffff; padding: 10px; border-radius: var(--radius-md); display: inline-block; box-shadow: var(--shadow-sm); margin-bottom: 10px;">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#ffffff"/>
              <rect x="8" y="8" width="26" height="26" fill="#0891b2"/>
              <rect x="12" y="12" width="18" height="18" fill="#ffffff"/>
              <rect x="16" y="16" width="10" height="10" fill="#0891b2"/>

              <rect x="66" y="8" width="26" height="26" fill="#0891b2"/>
              <rect x="70" y="12" width="18" height="18" fill="#ffffff"/>
              <rect x="74" y="16" width="10" height="10" fill="#0891b2"/>

              <rect x="8" y="66" width="26" height="26" fill="#0891b2"/>
              <rect x="12" y="70" width="18" height="18" fill="#ffffff"/>
              <rect x="16" y="74" width="10" height="10" fill="#0891b2"/>

              <rect x="42" y="14" width="6" height="6" fill="#0891b2"/>
              <rect x="52" y="24" width="6" height="6" fill="#0891b2"/>
              <rect x="44" y="38" width="8" height="8" fill="#0891b2"/>
              <rect x="22" y="44" width="6" height="6" fill="#0891b2"/>
              <rect x="66" y="48" width="8" height="8" fill="#0891b2"/>
              <rect x="48" y="66" width="6" height="6" fill="#0891b2"/>
              <rect x="64" y="74" width="6" height="6" fill="#0891b2"/>
              <rect x="76" y="82" width="8" height="8" fill="#0891b2"/>
            </svg>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem; text-align: left; border-top: 1px solid var(--border-color); padding-top: 8px;">
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">VISITOR</div>
              <div style="font-weight: 700; color: var(--text-primary);">${visitorName}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">BAY</div>
              <div style="font-weight: 800; color: var(--accent-cyan);">${assignedBay}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">HOST</div>
              <div style="font-weight: 700; color: var(--text-primary);">${hostName}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">PASS ID</div>
              <div style="font-weight: 700; color: var(--text-primary);">${passId}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    footerEl.innerHTML = `
      <button type="button" class="btn btn-secondary" id="visitor-btn-print">Print / Save Pass</button>
      <button type="button" class="btn btn-primary" id="visitor-btn-done">Done</button>
    `;

    document.getElementById('visitor-btn-done').addEventListener('click', closeModal);
    document.getElementById('visitor-btn-print').addEventListener('click', () => {
      window.print();
    });
  });
}
