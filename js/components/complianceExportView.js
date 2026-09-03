/**
 * Admin Compliance, ESG Sustainability & Tax Reports Component
 * Visualizes municipal mobility metrics, environmental carbon offsets, and revenue compliance audits.
 */

import { showToast } from './toast.js';

export function renderComplianceReports(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
            📊 ESG & Municipal Compliance
          </span>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">Mobility & Regulatory Compliance Report</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Verified civic congestion metrics, environmental sustainability impact, and tax reconciliation records.</p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-export-rep-json">
            Export JSON
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-export-rep-pdf">
            Download PDF Report
          </button>
        </div>
      </div>

      <!-- ESG Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px;">
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">CO₂ EMISSIONS AVOIDED</span>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--status-high-text); margin: 4px 0;">3,480 kg</div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">via optimized arrival routing</span>
        </div>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px;">
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">CRUISING TRAFFIC REDUCTION</span>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary-600); margin: 4px 0;">-28.4%</div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">across monitored CBD corridors</span>
        </div>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px;">
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL GST TAX RECONCILED</span>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 4px 0;">₹48,240</div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">18% CGST/SGST compliant</span>
        </div>
      </div>

      <!-- Audit Statement Summary Table -->
      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Audit Dimension</th>
              <th>Status / Measurement</th>
              <th>Target Benchmark</th>
              <th>Compliance State</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Curb Space Sensor Uptime</strong></td>
              <td>99.98% operational reliability</td>
              <td>&gt; 99.5%</td>
              <td><span class="history-status-badge badge-status-active">PASSED</span></td>
            </tr>
            <tr>
              <td><strong>Barrier ANPR Match Accuracy</strong></td>
              <td>99.4% plate OCR resolution</td>
              <td>&gt; 98.0%</td>
              <td><span class="history-status-badge badge-status-active">PASSED</span></td>
            </tr>
            <tr>
              <td><strong>EV Green Stall Allocation</strong></td>
              <td>16.8% total spaces electrified</td>
              <td>&gt; 12.0%</td>
              <td><span class="history-status-badge badge-status-active">PASSED</span></td>
            </tr>
            <tr>
              <td><strong>Dispute Resolution Turnaround</strong></td>
              <td>Average 42 minutes resolution</td>
              <td>&lt; 2 Hours</td>
              <td><span class="history-status-badge badge-status-active">PASSED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-export-rep-json').addEventListener('click', () => {
    showToast("Exporting compliance JSON statement...", "info", 1500);
  });

  document.getElementById('btn-export-rep-pdf').addEventListener('click', () => {
    showToast("Generating official mobility audit PDF report...", "success", 2000);
  });
}
