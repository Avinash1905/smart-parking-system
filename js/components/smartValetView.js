/**
 * SmartPark Automated Valet Parking (AVP) & Key Locker Operator View
 * Tracks digital valet claim passes, smart key locker states, and vehicle retrieval queues.
 */

window.SmartValetView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="valet-management-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #fbbf24;">🛎️ Smart Valet & Key Locker Terminal</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automated valet dispatch & contactless vehicle retrieval queue</p>
          </div>
          <button id="btn-request-valet-checkin" style="background: #f59e0b; color: #000; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Valet Drop-Off Check-In
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <!-- Key Locker Status -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #fbbf24; margin-bottom: 8px;">SMART KEY LOCKER MATRIX (30 BOXES)</div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; text-align: center;">
              <div style="background: #065f46; color: #34d399; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-01</div>
              <div style="background: #854d0e; color: #fef08a; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-02</div>
              <div style="background: #065f46; color: #34d399; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-03</div>
              <div style="background: #1e293b; color: #94a3b8; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-04</div>
              <div style="background: #854d0e; color: #fef08a; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-05</div>
              <div style="background: #065f46; color: #34d399; padding: 6px; border-radius: 4px; font-size: 0.75rem;">B-06</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-top: 10px;">
              <span>● Green: Stored</span>
              <span>● Yellow: Retrieval In-Prog</span>
              <span>● Grey: Empty</span>
            </div>
          </div>

          <!-- Active Retrieval Queue -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; font-weight: bold; color: #38bdf8; margin-bottom: 8px;">RETRIEVAL QUEUE (READY AT STAGING)</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.85rem;">KA-01-EE-4410 (BMW i4)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Driver: S. Kapoor • Staging Bay 01</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">Ready</span>
              </div>

              <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.85rem;">DL-03-XX-1100 (Audi A6)</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Runner dispatched to Deck L2 • est. 2m</div>
                </div>
                <span style="background: #854d0e; color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">In Transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-request-valet-checkin')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Valet intake form generated for incoming guest.', 'info');
    });
  }
};
