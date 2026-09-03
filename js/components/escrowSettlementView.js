/**
 * SmartPark P2P Escrow & Automated Dispute Chargeback Settlement View
 * Displays funds held in smart escrow for sublet bookings and handles automated refunds.
 */

window.EscrowSettlementView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="escrow-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #10b981;">🛡️ P2P Escrow & Automated Dispute Protection</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Funds held securely in smart escrow until verified arrival without barrier friction</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Escrow Vault Protected
          </span>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 600; font-size: 0.95rem; color: #38bdf8;">Booking #SUB-201 (Escrow #ESC-701)</span>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Renter: Rahul S. ➔ Host: Pooja H. • Amount: ₹80.00</div>
            </div>
            <span style="background: #1e3a8a; color: #93c5fd; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">HELD IN ESCROW</span>
          </div>
          <div style="margin-top: 10px; font-size: 0.8rem; color: #cbd5e1;">
            Auto-Release Condition: Vehicle departs tomorrow with zero overstay or obstruction dispute flags.
          </div>
        </div>
      </div>
    `;
  }
};
