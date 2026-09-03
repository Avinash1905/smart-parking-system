/**
 * SmartPark Municipal Patrol Officer & Dispatch Terminal Component
 * Real-time monitoring of on-duty enforcement wardens, beat territories, and handheld terminals.
 */

import { showToast } from './toast.js';

export function renderPatrolDispatch(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const officers = [
    { badge: "OFFICER-704", name: "Vikas Gowda", beat: "Municipal Central & CBD", device: "POS-TAB-902", citations: 3, status: "ON_PATROL" },
    { badge: "OFFICER-812", name: "Kiran Reddy", beat: "Brigade Road Corridor", device: "POS-TAB-905", citations: 5, status: "ON_PATROL" },
    { badge: "OFFICER-920", name: "Priyanka Sen", beat: "Electronic City Gate 1", device: "POS-TAB-918", citations: 1, status: "ON_BREAK" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(239,68,68,0.15); color: var(--status-low-text); margin-bottom: 4px;">
            👮 Municipal Warden Dispatch
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Patrol Officer Beats & Handheld Terminals</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Coordinate traffic enforcement officers, monitor citation issuances, and dispatch wardens to unauthorized parking breaches.</p>
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="btn-broadcast-wardens">
          📢 Broadcast Alert to All Handhelds
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Badge ID</th>
              <th>Officer Name</th>
              <th>Assigned Beat Corridor</th>
              <th>Handheld Terminal</th>
              <th>Citations Issued</th>
              <th>Duty Status</th>
              <th>Dispatch Action</th>
            </tr>
          </thead>
          <tbody>
            ${officers.map(o => `
              <tr>
                <td><strong style="font-family: monospace; color: var(--primary-600);">${o.badge}</strong></td>
                <td><strong>${o.name}</strong></td>
                <td>${o.beat}</td>
                <td><span style="font-family: monospace; font-size: 0.8125rem;">${o.device}</span></td>
                <td><strong>${o.citations} Notices</strong></td>
                <td>
                  <span class="history-status-badge ${o.status === 'ON_PATROL' ? 'badge-status-active' : 'badge-viol-review'}">
                    ● ${o.status}
                  </span>
                </td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-dispatch-warden" data-badge="${o.badge}">
                    Dispatch to Breach
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-broadcast-wardens').addEventListener('click', () => {
    showToast("Broadcast message sent to all active officer handheld terminals.", "info", 2000);
  });

  container.querySelectorAll('.btn-dispatch-warden').forEach(btn => {
    btn.addEventListener('click', () => {
      const b = btn.getAttribute('data-badge');
      showToast(`Incident dispatch coordinates transmitted to ${b}!`, "success", 2500);
    });
  });
}
