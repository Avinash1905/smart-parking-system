/**
 * SmartPark ANPR Camera Optical Confidence Calibrator View
 * Displays lens focal length calibration, radial distortion correction, and MTF50 sharpness metrics.
 */

window.ANPRConfidenceCalibratorView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="calibrator-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🎯 ANPR Lens Confidence & Distortion Calibrator</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Radial barrel distortion polynomial tuning & MTF50 sharpness validation</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● MTF50: 68.4 lp/mm (Sharp)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Focal Length</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">16.0 mm</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Target Distance: 6.5m</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Barrel Distortion (k1)</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">-0.045</div>
            <div style="font-size: 0.75rem; color: #a7f3d0; margin-top: 2px;">Polynomial Corrected</div>
          </div>
        </div>
      </div>
    `;
  }
};
