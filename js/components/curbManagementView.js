/**
 * SmartPark Municipal Curb Management & Micro-Freight Loading Zone Component
 * Displays street curb status, delivery vehicle stay timers, and overstay violations.
 */

window.CurbManagementView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="curb-management-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">📦 Municipal Dynamic Curb & Freight Delivery Zones</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Commercial delivery loading dock timers & micro-curb allocations</p>
          </div>
          <button id="btn-request-curb-slot" style="background: #f59e0b; color: #000; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Book Delivery Curb Slot
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-size: 0.9rem; color: #f59e0b;">MG Road Promenade Zone A</span>
              <span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">COMMERCIAL LOADING ONLY</span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">Total Bays: 6 • 4 In Use • Max 30 Min Stay</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Current Rate: ₹30.00 / hr • Overstay Penalty: ₹10/min</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-size: 0.9rem; color: #34d399;">Indiranagar 100ft Road West</span>
              <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">EV RIDESHARE STAGING</span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">Total Bays: 10 • 3 In Use • Max 45 Min Stay</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Current Rate: ₹25.00 / hr (EV Rebate Active)</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-request-curb-slot')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Curb slot delivery booking dialog opened.', 'info');
    });
  }
};
