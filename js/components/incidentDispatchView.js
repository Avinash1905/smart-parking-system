/**
 * SmartPark Security & Emergency Incident Response Dispatch Terminal
 * Displays live panic button alarms, intercom calls, and security patrol dispatch channels.
 */

window.IncidentDispatchView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="incident-dispatch-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #ef4444;">🛡️ Emergency & Incident Dispatch Station</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Central station for SOS intercom triggers, lane blockages, and quick-response units</p>
          </div>
          <button id="btn-broadcast-emergency" style="background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            ⚠ Broadcast Garage Alert
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <!-- Active Incidents -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #ef4444; margin-bottom: 8px;">ACTIVE DISPATCH ALERTS</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 10px; border-radius: 6px; border-left: 4px solid #ef4444;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; font-size: 0.85rem;">[CRITICAL] Fire Lane Blocked</span>
                  <span style="font-size: 0.75rem; color: #ef4444; font-weight: bold;">09:42 AM</span>
                </div>
                <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">Zone Pub 01 / North Ramp Exit</div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Dispatched: Quick Response Team Alpha</div>
              </div>

              <div style="background: #1e293b; padding: 10px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; font-size: 0.85rem;">[WARNING] SOS Pillar Call Active</span>
                  <span style="font-size: 0.75rem; color: #f59e0b; font-weight: bold;">09:30 AM</span>
                </div>
                <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">Deck L1 / Pillar E-04 Intercom</div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Operator connected via VOIP intercom</div>
              </div>
            </div>
          </div>

          <!-- Patrol Unit Status -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">SECURITY PATROL MATRIX</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Officer K. Rao (Patrol #01)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Location: Level B1 Basements • Radio CH-1</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Active</span>
              </div>

              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-size: 0.85rem;">Patrol Drone Alpha-2</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Rooftop Solar Deck L2 • Auto-Sweep</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Patrolling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-broadcast-emergency')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Emergency broadcast message sent across all facility VMS displays.', 'warning');
    });
  }
};
