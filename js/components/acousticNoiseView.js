/**
 * SmartPark Acoustic Noise, Vibration & Sound Decibel Monitor Component
 * Displays ambient dBA levels, vehicle tire screech alerts, and automatic acoustic absorption baffle states.
 */

window.AcousticNoiseView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="acoustic-noise-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🔊 Garage Acoustic Decibels & Vibration Monitor</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time noise pollution compliance & aggressive driving screech detection</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 64.5 dBA (Municipal Compliant)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Ambient Sound Level</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #34d399; margin-top: 2px;">64.5 dBA</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">Night Limit < 70 dBA</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Slab Vibration Velocity</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">0.85 mm/s RMS</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">DIN 4150 Compliant</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Sound Baffles</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #94a3b8; margin-top: 2px;">STANDBY</div>
            <div style="font-size: 0.75rem; color: #cbd5e1;">Auto-Deploys > 75 dBA</div>
          </div>
        </div>
      </div>
    `;
  }
};
