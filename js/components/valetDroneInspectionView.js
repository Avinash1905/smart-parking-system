/**
 * SmartPark Autonomous Valet Intake Drone Vehicle Condition Inspection View
 * Displays high-resolution LiDAR 3D scans of vehicle exteriors, tire tread depth, and liability waivers.
 */

window.ValetDroneInspectionView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="valet-drone-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🛸 Valet Intake Drone Optical & LiDAR Inspection</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Pre-existing paint scratch logging & contactless custody liability certification</p>
          </div>
          <span style="background: #065f46; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Body Grade: GRADE A (VERY GOOD)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 600; font-mono; font-size: 0.95rem; color: #38bdf8;">KA-01-EE-4410 (Scan #SCAN-DRONE-9901)</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
              Pre-existing Defects: 2 minor cosmetic items recorded<br>
              • Front Bumper Left: 12mm clearcoat scratch<br>
              • Rear Right Door: 4mm paint chip<br>
              <span style="color: #34d399;">Tire Tread Depth: 5.4 mm (Optimal)</span>
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 600; font-size: 0.85rem; color: #fbbf24;">CUSTODY LIABILITY WAIVER</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
              Digital certificate timestamped on blockchain notary.<br>
              SHA256: e82f99...4b12<br>
              <span style="color: #10b981; font-weight: bold;">Signed & Sent to Customer Phone</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
