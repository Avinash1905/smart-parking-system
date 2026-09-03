/**
 * SmartPark Dual-Shutter HDR Camera Optical Fusion View
 * Displays simultaneous high-speed plate retroreflection and low-speed vehicle body overview frames.
 */

window.ANPRDualShutterView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="dual-shutter-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">📷 Dual-Shutter HDR Optical Fusion Pipeline</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Simultaneous fast-exposure plate OCR & slow-exposure vehicle body classification</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 120 dB Dynamic Range (HDR)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Fast Shutter (500 µs)</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #34d399; margin-top: 2px;">Plate: KA-01-MJ-5890</div>
            <div style="font-size: 0.75rem; color: #a7f3d0;">No Motion Blur (99.8% OCR)</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Slow Shutter (8000 µs)</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">White Tata Nexon EV</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Make & Model Classified</div>
          </div>
        </div>
      </div>
    `;
  }
};
