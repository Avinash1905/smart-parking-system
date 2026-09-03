/**
 * SmartPark ESG Corporate Sustainability & Carbon Accounting Dashboard View
 * Visualizes avoided GHG emissions, clean EV kilometers driven, and green credits minted.
 */

window.ESGSustainabilityReportView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="esg-report-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #10b981;">🌿 ESG Sustainability & GHG Carbon Accounting</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">ISO 14064 certified municipal environmental reporting matrix</p>
          </div>
          <button id="btn-export-esg-pdf" style="background: #059669; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            ⬇ Export Audit PDF
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Net Avoided CO₂ (MTD)</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #10b981; margin-top: 2px;">16.48 Tonnes</div>
            <div style="font-size: 0.75rem; color: #34d399; margin-top: 2px;">↑ 22% vs last month</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Clean EV Km Enabled</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #38bdf8; margin-top: 2px;">75,000 km</div>
            <div style="font-size: 0.75rem; color: #7dd3fc; margin-top: 2px;">12,500 kWh Dispensed</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Solar Energy Generated</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #f59e0b; margin-top: 2px;">4,200 kWh</div>
            <div style="font-size: 0.75rem; color: #fde68a; margin-top: 2px;">Rooftop Solar Array</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Green Carbon Credits</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #a78bfa; margin-top: 2px;">16.48 Verified</div>
            <div style="font-size: 0.75rem; color: #c084fc; margin-top: 2px;">759 Tree Equivalents</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-export-esg-pdf')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Generating ISO 14064 verified ESG environmental compliance report...', 'info');
    });
  }
};
