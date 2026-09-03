/**
 * SmartPark Commercial Fleet & Loading Dock Dispatch Component
 * Manages logistics operators, delivery vans, cargo EVs, and commercial bay reservations.
 */

import { showToast } from './toast.js';

export function renderFleetManager(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fleetList = [
    { id: "flt-01", operator: "Amazon Prime Logistics", plate: "KA-01-FL-1001", type: "Electric Delivery Van", driver: "Ramesh Kumar", dock: "DOCK-01", status: "DOCKED" },
    { id: "flt-02", operator: "Flipkart Quick Fleet", plate: "KA-05-FL-4088", type: "Electric Cargo Truck", driver: "Amit Patel", dock: "DOCK-02", status: "IN_TRANSIT" },
    { id: "flt-03", operator: "DHL Express Expressway", plate: "KA-03-FL-7711", type: "Delivery Van", driver: "Sunil Rao", dock: "DOCK-03", status: "IN_TRANSIT" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
            🚚 Logistics & Commercial Bays
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Commercial Fleet Dispatch & Loading Docks</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Manage logistics delivery van access, commercial loading bays, and automated clearance permits.</p>
        </div>

        <button type="button" class="btn btn-primary btn-sm" id="btn-add-fleet-vehicle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register Fleet Vehicle
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Operator / Company</th>
              <th>Vehicle Plate</th>
              <th>Vehicle Category</th>
              <th>Assigned Driver</th>
              <th>Loading Bay</th>
              <th>Dock Status</th>
              <th>Gate Action</th>
            </tr>
          </thead>
          <tbody>
            ${fleetList.map(f => `
              <tr>
                <td><strong>${f.operator}</strong></td>
                <td><span style="font-family: monospace; font-weight: 800; color: var(--primary-600);">${f.plate}</span></td>
                <td>${f.type}</td>
                <td>${f.driver}</td>
                <td><strong style="color: var(--status-high-text);">${f.dock}</strong></td>
                <td>
                  <span class="history-status-badge ${f.status === 'DOCKED' ? 'badge-status-active' : 'badge-viol-review'}">
                    ● ${f.status}
                  </span>
                </td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-clear-fleet-gate" data-id="${f.id}">
                    Lift Dock Gate
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-add-fleet-vehicle').addEventListener('click', () => {
    showToast("Opening Commercial Fleet registration wizard...", "info", 1500);
  });

  container.querySelectorAll('.btn-clear-fleet-gate').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast("Loading bay boom barrier lifted for delivery truck!", "success", 2000);
    });
  });
}
