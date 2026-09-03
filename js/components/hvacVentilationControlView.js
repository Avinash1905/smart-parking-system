/**
 * SmartPark HVAC Underground Ventilation & Scrubber Control Panel
 * Displays induction fan banks, toxic CO/NO2 ppm trends, and VFD manual overrides.
 */

window.HVACVentilationControlView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="hvac-control-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">🌀 Underground HVAC & Air Scrubber VFDs</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automatic gas dilution & variable frequency drive fan modulation</p>
          </div>
          <button id="btn-purge-fans-emergency" style="background: #334155; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            ⚡ Turbo 60Hz Purge
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Bank B1-North</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">42.0 Hz</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Airflow: 17,500 CFM</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Bank B1-South</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">40.0 Hz</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Airflow: 16,600 CFM</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Bank B2-North</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">48.0 Hz</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Airflow: 24,000 CFM</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Bank B2-South</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">48.0 Hz</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Airflow: 24,000 CFM</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-purge-fans-emergency')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('VFD inverters overridden to 60Hz Turbo Exhaust mode.', 'info');
    });
  }
};
