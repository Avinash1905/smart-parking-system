/**
 * SmartPark Multi-Lane ANPR Synchronization & Anti-Tailgating View
 * Displays real-time parallel lane traffic and anti-tailgating radar detection.
 */

window.ANPRMultiLaneView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="multilane-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">📷 Multi-Lane Gate Sync & Anti-Tailgating</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Parallel lane OCR synchronization & radar draft detection</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Anti-Tailgating Radar Armed
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Lane 1 Entry</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #10b981; margin-top: 2px;">KA-01-MJ-5890</div>
            <div style="font-size: 0.75rem; color: #34d399;">Time Gap: 3.4s (Pass)</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Lane 2 Entry</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">MH-12-AB-3049</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Time Gap: 4.1s (Pass)</div>
          </div>
        </div>
      </div>
    `;
  }
};
