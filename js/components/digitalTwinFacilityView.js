/**
 * SmartPark Digital Twin & Engineering Facility Telemetry View
 * Displays 3D structure diagnostics, air quality (IAQ), stormwater pumps, and electrical substation metrics.
 */

window.DigitalTwinFacilityView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="digital-twin-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🏗️ Facility Digital Twin & Engineering Diagnostics</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Multi-physics structural strain, indoor air scrubbers, and sump pump controls</p>
          </div>
          <span style="background: #0c4a6e; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Structural Health: 99.4% NOMINAL
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <!-- Air Quality -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #34d399; margin-bottom: 8px;">AIR QUALITY (IAQ)</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #34d399;">12.4 ppm CO</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Safe Limit < 25 ppm</div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">4 VFD Scrubbers at 38.5 Hz</div>
          </div>

          <!-- Structural Slab Deflection -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">SLAB DEFLECTION</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8;">1.2 mm</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Yield Threshold: 8.0 mm</div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">Rebar Microstrain: 140 µε</div>
          </div>

          <!-- Flood Defense -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #f59e0b; margin-bottom: 8px;">STORMWATER PUMPS</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #fbbf24;">28% Sump Level</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Duplex Pumps on Standby</div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">45,200L Harvested</div>
          </div>

          <!-- Electrical Substation -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #a78bfa; margin-bottom: 8px;">SUBSTATION TRANSFORMER</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #c084fc;">52.4 °C</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Power Factor: 0.985</div>
            <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">THD Distortion: 2.1%</div>
          </div>
        </div>
      </div>
    `;
  }
};
