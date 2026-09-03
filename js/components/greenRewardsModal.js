/**
 * SmartPark Eco Carbon Wallet & Green Driver Rewards Modal Component
 * Displays carbon offset points earned and enables redemption for parking vouchers.
 */

import { showToast } from './toast.js';

export function openGreenRewardsModal() {
  let modalContainer = document.getElementById('modals-root');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modals-root';
    document.body.appendChild(modalContainer);
  }

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  const vouchers = [
    { id: "vch-1", name: "₹50 Off Next Municipal Parking", pts: 100, desc: "Instant discount voucher for public decks." },
    { id: "vch-2", name: "10 kWh Free EV Fast Charge", pts: 250, desc: "Solar grid fast charging credit." },
    { id: "vch-3", name: "Free Eco Car Wash Coupon", pts: 400, desc: "Complimentary waterless hand wash." }
  ];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-rewards-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
              🌱 ESG Carbon Wallet
            </span>
            <h3 class="modal-title">Green Driver Rewards</h3>
          </div>
          <button type="button" class="modal-close" id="modal-rewards-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Wallet Balance Card -->
          <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.15) 100%); border: 1.5px solid rgba(16,185,129,0.4); border-radius: var(--radius-xl); padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL ECO POINTS</span>
              <div style="font-size: 2rem; font-weight: 900; color: var(--status-high-text); margin: 2px 0;">420 PTS</div>
              <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: var(--status-high-text);">Tier: Green Champion</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">LIFETIME CO₂ SAVED</span>
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-600); margin: 2px 0;">86.4 kg</div>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Top 5% Eco Driver</span>
            </div>
          </div>

          <!-- Redeemable Vouchers -->
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">Redeem Carbon Vouchers</h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${vouchers.map(v => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
                <div>
                  <strong style="color: var(--text-primary); font-size: 0.9rem; display: block;">${v.name}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">${v.desc}</span>
                </div>
                <button type="button" class="btn btn-secondary btn-sm btn-claim-voucher" data-name="${v.name}" style="color: var(--status-high-text); border-color: rgba(16,185,129,0.4);">
                  Redeem (${v.pts} Pts)
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-rewards-close').addEventListener('click', closeModal);
  document.getElementById('modal-rewards-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rewards-overlay') closeModal();
  });

  modalContainer.querySelectorAll('.btn-claim-voucher').forEach(btn => {
    btn.addEventListener('click', () => {
      const vName = btn.getAttribute('data-name');
      showToast(`Voucher redeemed! ${vName} added to your account coupon book.`, "success", 2500);
      closeModal();
    });
  });
}
