/**
 * SmartPark Habitual Commuter Clustering & Predictive Pre-Clearance Component
 * Displays regular arrival statistics, regularity indexes, and habitual bay allocations.
 */

window.ANPRClusteringView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="anpr-clustering-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🧠 Habitual Commuter Clustering & Pre-Clearance</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Arrival distribution curves & automatic spot reserving for regular drivers</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 88% Commuter Regularity Index
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 600; font-mono; font-size: 0.95rem; color: #38bdf8;">KA-01-MJ-5890 (Vikram S.)</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
              Predicted Window: 08:55 AM - 09:20 AM<br>
              Habitual Spot: Deck B1 / Bay 08<br>
              <span style="color: #10b981; font-weight: 600;">Auto Pre-Clearance: ENABLED</span>
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 600; font-mono; font-size: 0.95rem; color: #38bdf8;">MH-12-AB-3049 (Ananya R.)</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
              Predicted Window: 09:10 AM - 09:35 AM<br>
              Habitual Spot: Ground / Bay S-14<br>
              <span style="color: #10b981; font-weight: 600;">Auto Pre-Clearance: ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
