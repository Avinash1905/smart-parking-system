/**
 * SmartPark Electrical Substation Power Quality Telemetry View
 * Displays 11kV step-down transformer health, power factor, and harmonic distortion metrics.
 */

window.EVSubstationTelemetryView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="substation-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">⚡ Main 11kV/415V Substation Power Quality</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Transformer insulation partial discharge, power factor & SF6 pressure</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● PF: 0.988 (Near Unity)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Secondary Voltage</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">415.2 V AC</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">Phase-to-Phase Nominal</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Harmonics (THD)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">1.85%</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">IEEE 519 Compliant</div>
          </div>
        </div>
      </div>
    `;
  }
};
