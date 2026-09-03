/**
 * Admin Corporate Partners & Campus Directory Component
 * Manages registered enterprise tenants, associated parking facilities, and employee clearance lists.
 */

import { adminService } from '../data/adminService.js';
import { showToast } from './toast.js';

export function renderCompanyDirectory(containerId, onUpdated) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const companies = adminService.getCompanies();

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
            🏢 Corporate Mobility Portal
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Enterprise Partners & Tech Campuses</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Manage company clearance codes, employee badge quotas, and designated parking facilities.</p>
        </div>

        <button type="button" class="btn btn-primary btn-sm" id="btn-add-partner-comp">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Register Enterprise Partner
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Partner Code</th>
              <th>Campus / Headquarters</th>
              <th>Verified Employees</th>
              <th>Associated Decks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${companies.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td><span class="badge badge-company badge-company-tcs">${c.code}</span></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${c.headquarters}</span></td>
                <td><strong>${c.employeesCount}</strong> Drivers</td>
                <td><strong>${c.parkingLocationsCount}</strong> Decks</td>
                <td><span class="history-status-badge badge-status-active">${c.status}</span></td>
                <td>
                  <button type="button" class="btn btn-secondary btn-sm btn-manage-comp-emp" data-id="${c.id}">
                    Manage Drivers
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-add-partner-comp').addEventListener('click', () => {
    showToast("Opening Enterprise Partner registration wizard...", "info", 1500);
  });

  container.querySelectorAll('.btn-manage-comp-emp').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast("Loading employee whitelist registry for this partner...", "info", 1500);
    });
  });
}
