/**
 * SmartPark Corporate Tenant Whitelist & Badge Roster View Component
 * Renders corporate employee badge directories, visitor pass issuance forms, and monthly allocation bars.
 */

import { TenantAdminController } from '../controllers/tenantAdminController.js';
import { showToast } from './toast.js';

export function renderTenantRosterView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🏢 Corporate Tenant Badge Management
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Manage employee digital access keys, issue VIP visitor parking barcodes, and monitor monthly parking allocations.
      </p>
    </div>

    <!-- Allocation Overview -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">COMPANY ACCOUNT</div>
        <div style="font-size: 1.3rem; font-weight: 900; color: var(--text-primary); margin-top: 2px;">Tata Consultancy Services (TCS)</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">ACTIVE BADGE UTILIZATION</div>
        <div style="font-size: 1.3rem; font-weight: 900; color: var(--primary-600); margin-top: 2px;">42 / 50 Allocated Stalls (84%)</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px;">
      <!-- Employee Whitelist -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Authorized Employee Roster</h3>
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 800; color: var(--text-primary);">Avinash Sharma (TCS-1024)</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Plate: KA-01-MJ-5890 • Executive Bay Access</div>
            </div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">ACTIVE</span>
          </div>

          <div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 800; color: var(--text-primary);">Priya Venkatesh (TCS-8910)</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Plate: KA-04-ER-2041 • Standard Reserved</div>
            </div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">ACTIVE</span>
          </div>
        </div>
      </div>

      <!-- Quick Issue Visitor Pass -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Issue VIP Visitor Pre-Clearance</h3>
        
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">GUEST FULL NAME</label>
          <input type="text" id="visitor-name" placeholder="Dr. Suresh Nair" style="width: 100%; padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); font-size: 0.84rem;">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">GUEST VEHICLE PLATE</label>
          <input type="text" id="visitor-plate" placeholder="KA-05-ZZ-9900" style="width: 100%; padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); font-size: 0.84rem; text-transform: uppercase;">
        </div>

        <button type="button" class="btn btn-primary" id="btn-issue-vpass" style="width: 100%; justify-content: center;">
          🎟️ Issue Digital QR Visitor Pass
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-issue-vpass').addEventListener('click', () => {
    const name = document.getElementById('visitor-name').value || 'Guest Visitor';
    const plate = document.getElementById('visitor-plate').value || 'KA-01-XX-0000';
    TenantAdminController.issueVisitorPass(name, 'TCS', plate);
  });
}
