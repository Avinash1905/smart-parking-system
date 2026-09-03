/**
 * SmartPark Maintenance Operations & Technician Work Order Component
 * Coordinates facility asset inspections, repair orders, and field technician dispatches.
 */

import { showToast } from './toast.js';

export function renderMaintenanceOperations(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const orders = [
    { code: "WO-8821", facility: "Municipal Central Parking", asset: "Boom Barrier Solenoid", tech: "Ravi Teja", prio: "HIGH", status: "IN_PROGRESS" },
    { code: "WO-8822", facility: "TCS Corporate Deck Alpha", asset: "EV Charger Cable", tech: "Siddharth K.", prio: "MEDIUM", status: "OPEN" },
    { code: "WO-8823", facility: "Indiranagar 100ft Civic Deck", asset: "Floor B1 Line Re-Striping", tech: "Praveen M.", prio: "LOW", status: "SCHEDULED" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(245,158,11,0.15); color: #f59e0b; margin-bottom: 4px;">
            🛠️ Facility Operations
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Preventive Maintenance & Work Orders</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Manage hardware repair tickets, technician work schedules, and physical barrier maintenance.</p>
        </div>

        <button type="button" class="btn btn-primary btn-sm" id="btn-create-work-order">
          + Create Work Order
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order Code</th>
              <th>Parking Facility</th>
              <th>Asset / Equipment</th>
              <th>Technician</th>
              <th>Priority</th>
              <th>Work Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong style="font-family: monospace; color: var(--primary-600);">${o.code}</strong></td>
                <td><strong>${o.facility}</strong></td>
                <td>${o.asset}</td>
                <td>${o.tech}</td>
                <td>
                  <span class="history-status-badge ${o.prio === 'HIGH' ? 'badge-viol-open' : 'badge-viol-review'}">
                    ${o.prio}
                  </span>
                </td>
                <td><span class="history-status-badge badge-status-active">● ${o.status}</span></td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-complete-wo" data-code="${o.code}">
                    Mark Done
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-create-work-order').addEventListener('click', () => {
    showToast("Opening Maintenance Work Order creation wizard...", "info", 1500);
  });

  container.querySelectorAll('.btn-complete-wo').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.getAttribute('data-code');
      showToast(`Work Order ${c} marked completed! Maintenance log updated.`, "success", 2000);
    });
  });
}
