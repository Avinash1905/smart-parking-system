/**
 * SmartPark Corporate Carpool Matcher & Commute Optimizer Modal
 * Enables employees to discover carpool pairs, review detour durations, and reserve carpool bays.
 */

window.CarpoolMatcherModal = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="carpool-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">🚗 Corporate Carpool & Shared Commute Hub</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Match with colleagues on your route & unlock 50% parking fee rebates</p>
          </div>
          <button id="btn-create-carpool-offer" style="background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + Offer a Ride
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Arjun Reddy (Driver)</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Route: Koramangala ➔ Tech Park HQ</div>
              </div>
              <span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                95% Route Match
              </span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 8px;">Vehicle: MG ZS EV • 3 Seats Available</div>
            <div style="font-size: 0.75rem; color: #f59e0b; margin-top: 2px;">Departure: 09:05 AM (est. 4 min detour)</div>
            <button class="btn-join-carpool" style="width: 100%; margin-top: 10px; background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem;">
              Request Seat & Share Bay
            </button>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">Pooja Hegde (Rider)</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Route: Indiranagar ➔ Tech Park HQ</div>
              </div>
              <span style="background: #1e3a8a; color: #93c5fd; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                88% Route Match
              </span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 8px;">Looking for morning commute seat</div>
            <div style="font-size: 0.75rem; color: #f59e0b; margin-top: 2px;">Departure: 08:50 AM (est. 6 min detour)</div>
            <button class="btn-join-carpool" style="width: 100%; margin-top: 10px; background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px; cursor: pointer; font-weight: 600; font-size: 0.8rem;">
              Offer Ride & Claim Rebate
            </button>
          </div>
        </div>
      </div>
    `;

    el.querySelectorAll('.btn-join-carpool').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) window.Toast.show('Carpool request submitted! Dedicated Carpool Bay assigned.', 'success');
      });
    });
  }
};
