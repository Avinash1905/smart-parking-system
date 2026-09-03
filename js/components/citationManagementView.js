/**
 * SmartPark Citation, Infraction & Violation Management Component
 * Allows parking operators to review overstay infractions, fine notices, wheel-boot dispatches, and disputes.
 */

window.CitationManagementView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="citation-management-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f87171;">🚨 Parking Enforcement & Citations</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated Overstay Detection & Penalty Workflow Center</p>
          </div>
          <button id="btn-issue-new-citation" style="background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Manual Citation
          </button>
        </div>

        <!-- Citation Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Active Infractions</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #f87171; margin-top: 2px;">14 Pending</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Wheel Boots Dispatched</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #fbbf24; margin-top: 2px;">3 Immobilized</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Fines Collected (MTD)</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #10b981; margin-top: 2px;">₹48,500</div>
          </div>
        </div>

        <!-- Citations Table -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid #334155; color: #94a3b8;">
                <th style="padding: 8px 10px;">Ticket #</th>
                <th style="padding: 8px 10px;">Plate</th>
                <th style="padding: 8px 10px;">Infraction Type</th>
                <th style="padding: 8px 10px;">Location</th>
                <th style="padding: 8px 10px;">Fine Amount</th>
                <th style="padding: 8px 10px;">Status</th>
                <th style="padding: 8px 10px;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; font-mono; font-weight: 600; color: #38bdf8;">CIT-8801A</td>
                <td style="padding: 10px; font-mono;">KA-03-HA-8812</td>
                <td style="padding: 10px;">Expired Parking Duration (+45 min)</td>
                <td style="padding: 10px;">Zone Pub 01 / Bay S-04</td>
                <td style="padding: 10px; font-weight: bold; color: #f87171;">₹750.00</td>
                <td style="padding: 10px;"><span style="background: #7f1d1d; color: #fca5a5; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">UNPAID</span></td>
                <td style="padding: 10px;">
                  <button class="btn-resolve-cit" style="background: #334155; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 0.75rem;">
                    Resolve
                  </button>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; font-mono; font-weight: 600; color: #38bdf8;">CIT-8802B</td>
                <td style="padding: 10px; font-mono;">DL-09-CQ-4100</td>
                <td style="padding: 10px;">ICE Vehicle in EV Fast Charging Bay</td>
                <td style="padding: 10px;">Zone Pub 01 / Bay EV-02</td>
                <td style="padding: 10px; font-weight: bold; color: #f87171;">₹1,500.00</td>
                <td style="padding: 10px;"><span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">BOOT DEPLOYED</span></td>
                <td style="padding: 10px;">
                  <button class="btn-resolve-cit" style="background: #334155; color: #fff; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 0.75rem;">
                    Release Boot
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Hook events
    el.querySelectorAll('.btn-resolve-cit').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) window.Toast.show('Citation settled and status updated to RESOLVED.', 'success');
      });
    });
  }
};
