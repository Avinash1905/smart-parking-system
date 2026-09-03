/**
 * SmartPark Peer-to-Peer (P2P) Corporate Bay Sublet Marketplace View
 * Displays available corporate spots listed for sublet by WFH employees and handles 1-click reservations.
 */

window.ParkingSubletView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="sublet-marketplace-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #60a5fa;">🏢 P2P Corporate Parking Sublet Marketplace</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Rent unused monthly permit spots on Work-From-Home days</p>
          </div>
          <button id="btn-list-sublet-spot" style="background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            + List My Spot for Sublet
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem;">TCS Tech Park / Bay M-14</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">Host: Pooja Hegde (WFH Tomorrow)</div>
              </div>
              <span style="font-weight: 800; color: #10b981; font-size: 1.1rem;">₹80 / day</span>
            </div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 8px;">Date: Tomorrow (Sep 4) • 08:00 AM - 08:00 PM</div>
            <button class="btn-book-sublet" style="width: 100%; margin-top: 10px; background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
              Book Sublet Spot
            </button>
          </div>
        </div>
      </div>
    `;

    el.querySelectorAll('.btn-book-sublet').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.Toast) window.Toast.show('Sublet spot booked! QR entry pass dispatched.', 'success');
      });
    });

    document.getElementById('btn-list-sublet-spot')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Sublet spot listing dialog opened.', 'info');
    });
  }
};
