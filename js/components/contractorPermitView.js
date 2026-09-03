/**
 * SmartPark Contractor Logistics & Maintenance Loading Dock Component
 * Allows facility operations teams to schedule delivery trucks, check dock clearances, and issue digital badges.
 */

window.ContractorPermitView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="contractor-permit-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🚛 Logistics & Contractor Loading Dock Access</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Manage heavy vehicle clearances, vendor loading bays, and work permits</p>
          </div>
          <button id="btn-request-contractor-permit" style="background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Request Dock Permit
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <!-- Loading Dock Bay Status -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">LOGISTICS LOADING DOCK STATUS (MAX 3.8M CLEARANCE)</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Dock Bay 01 (Heavy Freight)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Scheduled: BlueDart Express (KA-04-TR-9001)</div>
                </div>
                <span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Occupied (Unloading)</span>
              </div>

              <div style="background: #1e293b; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Dock Bay 02 (Service & Maintenance)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Clearance: 3.8m • Hydraulic Dock Leveler Ready</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">AVAILABLE</span>
              </div>
            </div>
          </div>

          <!-- Active Vendor Work Permits -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #fbbf24; margin-bottom: 8px;">ACTIVE WORK & DELIVERY PERMITS</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Otis Elevator Engineers (PERM-8812)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Shaft C Bi-Monthly Safety Inspection</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Approved</span>
              </div>

              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Schneider Electric Solar Team</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Rooftop Inverter Preventive Check</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-request-contractor-permit')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Contractor Dock Permit requisition dialog opened.', 'info');
    });
  }
};
