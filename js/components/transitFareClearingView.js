/**
 * SmartPark Multimodal Transit Fare Settlement & Municipal Revenue Clearing View
 * Displays revenue distribution between parking authorities and metro rail corporations.
 */

window.TransitFareClearingView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="transit-clearing-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #a78bfa;">🚇 Multimodal Transit Revenue Clearing House</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated financial settlement between Parking Authority & Namma Metro</p>
          </div>
          <span style="background: #3b0764; color: #d8b4fe; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 1,450 Bundled Trips Settled
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Parking Authority (55%)</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">₹63,800</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Settled to Escrow</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Metro Rail Corp (45%)</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #c084fc; margin-top: 2px;">₹52,200</div>
            <div style="font-size: 0.75rem; color: #e9d5ff;">Settled to BMRCL</div>
          </div>
        </div>
      </div>
    `;
  }
};
