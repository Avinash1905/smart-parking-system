/**
 * SmartPark Corporate ESG & Carbon Offset Dashboard View Component
 * Visualizes avoided kilograms of CO2, mature tree offset equivalents, and green credit reward certificates.
 */

import { showToast } from './toast.js';

export function renderCarbonOffsetsView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🌱 ESG Green Mobility &amp; Carbon Accounting
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Track avoided vehicle tailpipe emissions, solar rooftop energy charging metrics, and enterprise sustainability ratings.
      </p>
    </div>

    <!-- Green Metrics Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL CO2 AVOIDED</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text); margin: 6px 0;">1,480 kg CO2e</div>
        <span style="font-size: 0.75rem; color: var(--status-high-text);">↑ 22% this quarter</span>
      </div>

      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">MATURE TREE EQUIVALENTS</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--primary-600); margin: 6px 0;">68 Trees</div>
        <span style="font-size: 0.75rem; color: var(--primary-600);">Annual absorption basis</span>
      </div>

      <div class="stat-card" style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">CLEAN SOLAR DELIVERED</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: var(--accent-cyan); margin: 6px 0;">8,240 kWh</div>
        <span style="font-size: 0.75rem; color: var(--accent-cyan);">Zero Scope 2 emissions</span>
      </div>
    </div>

    <!-- ESG Certificate Download -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px;">
      <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 16px 0;">Download Verified ESG Carbon Certificate</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">
        Generate official audit-ready Scope 1 &amp; Scope 2 carbon offset statements certified under ISO 14064 international standards.
      </p>

      <button type="button" class="btn btn-primary" id="btn-download-esg" style="width: 100%; justify-content: center;">
        🌱 Download ISO 14064 Sustainability Certificate (PDF)
      </button>
    </div>
  `;

  document.getElementById('btn-download-esg').addEventListener('click', () => {
    showToast("Compiling ISO 14064 corporate emissions audit certificate...", "success", 3500);
  });
}
