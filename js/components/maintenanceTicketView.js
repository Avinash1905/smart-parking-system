/**
 * SmartPark Predictive Facility Maintenance & Work Order View
 * Displays technician work orders, hardware fault alerts, and equipment replacement tracking.
 */

window.MaintenanceTicketView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="maintenance-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🛠️ Facility Maintenance & Hardware Work Orders</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated IoT sensor diagnostics, barrier servicing, and field crew dispatches</p>
          </div>
          <button id="btn-create-work-order" style="background: #f59e0b; color: #000; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Open Work Order
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <!-- Active Ticket 1 -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; border-left: 4px solid #f59e0b;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-mono; font-size: 0.85rem; color: #38bdf8;">WO-101 (Ultrasonic Sensor)</span>
              <span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">IN PROGRESS</span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">Spot SNS-PUB01-S04: 5 consecutive missed heartbeats. Suspected battery depletion.</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">Assigned: Rajesh Kumar (Field Tech #03)</div>
            <button class="btn-resolve-wo" style="margin-top: 10px; background: #334155; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 0.75rem;">
              Mark Repaired & Calibrated
            </button>
          </div>

          <!-- Active Ticket 2 -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; border-left: 4px solid #3b82f6;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-mono; font-size: 0.85rem; color: #38bdf8;">WO-102 (Gate Motor Torque)</span>
              <span style="background: #1e3a8a; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">SCHEDULED</span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">South Entry Barrier: Lubrication & spring tension balance check.</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">Assigned: Automated Maintenance Cycle (Tonight 02:00 AM)</div>
            <button class="btn-resolve-wo" style="margin-top: 10px; background: #334155; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 0.75rem;">
              Review Checklist
            </button>
          </div>
        </div>
      </div>
    `;

    el.querySelectorAll('.btn-resolve-wo').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) window.Toast.show('Work order status updated to COMPLETED. Sensor online.', 'success');
      });
    });
  }
};
