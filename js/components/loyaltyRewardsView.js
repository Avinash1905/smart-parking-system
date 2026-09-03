/**
 * SmartPark Eco-Commuter & Green Parking Rewards Store Component
 * Allows users to view their green rewards points, carbon savings, and redeem vouchers.
 */

window.LoyaltyRewardsView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="loyalty-rewards-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #10b981;">🌱 Green Commuter & Loyalty Rewards</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Earn credits for EV charging, off-peak parking, and smart carpooling</p>
          </div>
          <div style="background: #064e3b; border: 1px solid #059669; padding: 6px 14px; border-radius: 8px; text-align: right;">
            <div style="font-size: 0.75rem; color: #a7f3d0;">YOUR BALANCE</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #34d399;">840 Pts (Gold Tier)</div>
          </div>
        </div>

        <!-- Tier Highlights -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Lifetime CO₂ Offset</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #10b981; margin-top: 2px;">145.2 kg</div>
            <div style="font-size: 0.75rem; color: #34d399;">~7 Trees Equivalent</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Active Peak Discount</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #f59e0b; margin-top: 2px;">15% OFF</div>
            <div style="font-size: 0.75rem; color: #fbbf24;">Gold Member Benefit</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Overstay Grace Window</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">+30 Mins</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">No Citation Immunity</div>
          </div>
        </div>

        <!-- Rewards Catalog -->
        <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: #cbd5e1;">Redeemable Parking & Transit Vouchers</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">1-Hour Free Parking</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">Valid at any municipal garage</div>
              <div style="font-size: 0.8rem; color: #34d399; font-weight: bold; margin-top: 4px;">250 Points</div>
            </div>
            <button class="btn-redeem-reward" data-cost="250" style="background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">
              Redeem
            </button>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">50% Off EV Fast Charge</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">Max 30 kWh DC Session</div>
              <div style="font-size: 0.8rem; color: #34d399; font-weight: bold; margin-top: 4px;">500 Points</div>
            </div>
            <button class="btn-redeem-reward" data-cost="500" style="background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">
              Redeem
            </button>
          </div>
        </div>
      </div>
    `;

    el.querySelectorAll('.btn-redeem-reward').forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = btn.getAttribute('data-cost');
        if (window.Toast) window.Toast.show(`Reward voucher redeemed for ${cost} points. Digital code copied!`, 'success');
      });
    });
  }
};
