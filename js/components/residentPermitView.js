/**
 * SmartPark Municipal Resident Permit Parking (RPP) View
 * Displays neighborhood permit validation, visitor scratchcards, and permit status.
 */

window.ResidentPermitView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="resident-permit-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🏘️ Municipal Resident Permit Parking (RPP)</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Neighborhood permit governance & digital visitor day passes</p>
          </div>
          <button id="btn-apply-resident-permit" style="background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Apply for Resident Permit
          </button>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 600; font-size: 0.95rem; color: #38bdf8;">Siddharth Verma (RPP-8801)</span>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Zone: RES-ZONE-KORAMANGALA-4TH • Plate: KA-01-MJ-5890</div>
            </div>
            <span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
              ACTIVE (ANNUAL)
            </span>
          </div>

          <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">
            Address: #412, 7th Main, Koramangala 4th Block • Valid Until: 2026-12-31
          </div>

          <button id="btn-issue-guest-daypass" style="margin-top: 10px; background: #334155; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer; font-size: 0.8rem;">
            + Issue Guest 24-Hour Digital Scratchcard
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-issue-guest-daypass')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Visitor 24h digital scratchcard generated and active.', 'success');
    });
  }
};
