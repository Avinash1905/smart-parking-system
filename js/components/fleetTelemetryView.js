/**
 * SmartPark Corporate Fleet Telemetry & Asset Manager Component
 * Visualizes enterprise pool vehicle positions, battery state-of-charge, and maintenance logs.
 */

window.FleetTelemetryView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="fleet-telemetry-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #60a5fa;">🏢 Corporate Fleet & Pool Vehicles</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time asset telemetry & automated corporate bay assignments</p>
          </div>
          <button id="btn-add-fleet-vehicle" style="background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Register Fleet Vehicle
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; font-family: monospace; font-size: 1rem; color: #38bdf8;">KA-01-FL-5501</span>
              <span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">CHARGING</span>
            </div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 6px;">Tata Nexon EV (Fleet #01)</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Assigned: Vikram Mehta (Sales HQ)</div>

            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #cbd5e1; margin-bottom: 2px;">
                <span>Battery SoC: 88%</span>
                <span>Bay: TCS Deck EV-04</span>
              </div>
              <div style="background: #334155; height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: #10b981; width: 88%; height: 100%;"></div>
              </div>
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; font-family: monospace; font-size: 1rem; color: #38bdf8;">KA-05-FL-8819</span>
              <span style="background: #1e3a8a; color: #93c5fd; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">READY</span>
            </div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 6px;">Mahindra XUV400 (Fleet #03)</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Assigned: Rohan Gupta (Logistics)</div>

            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #cbd5e1; margin-bottom: 2px;">
                <span>Battery SoC: 95%</span>
                <span>Bay: Infosys Hub S-12</span>
              </div>
              <div style="background: #334155; height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: #10b981; width: 95%; height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-add-fleet-vehicle')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Corporate Fleet Vehicle registration dialog opened.', 'info');
    });
  }
};
