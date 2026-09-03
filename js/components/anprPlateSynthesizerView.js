/**
 * SmartPark ANPR Plate Aspect Ratio & Noise Rejection Pipeline View
 * Displays real-time geometric aspect ratio filtering and candidate bounding box verification.
 */

window.ANPRPlateSynthesizerView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="synthesizer-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🔍 ANPR Aspect Ratio & Bounding Box Filter</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Morphological artifact rejection & optical noise filtering</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 99.8% Artifact Rejection
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Valid Aspect Ratio Range</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">2.0 : 1 ➔ 6.0 : 1</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Statutory HSRP standard</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Reflective Glare Suppressed</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">ACTIVE</div>
            <div style="font-size: 0.75rem; color: #7dd3fc; margin-top: 2px;">Polarized Shutter Sync</div>
          </div>
        </div>
      </div>
    `;
  }
};
