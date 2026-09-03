/**
 * SmartPark Cashless FastPass Wallet View Component
 * Renders stored prepaid balances, auto-recharge settings, FastTag RFID links, and real-time transaction ledgers.
 */

import { showToast } from './toast.js';

export function renderWalletManagementView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        💳 SmartPark FastPass Cashless Wallet
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Seamless contact-free barrier gate exit via NETC FastTag RFID transponders and pre-funded digital balances.
      </p>
    </div>

    <!-- Balance & FastTag Card -->
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 24px; border-radius: var(--radius-xl); margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.15);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">CURRENT PREPAID BALANCE</span>
          <div style="font-size: 2.4rem; font-weight: 900; margin-top: 4px;">₹1,420.50</div>
        </div>
        <span class="badge" style="background: rgba(16,185,129,0.3); color: #6ee7b7;">● FASTTAG ACTIVE</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; opacity: 0.9;">
        <div>Vehicle Linked: <strong>KA-01-MJ-5890</strong></div>
        <div>RFID Tag: <strong>EPC-9902-8819-2041</strong></div>
      </div>
    </div>

    <!-- Wallet Actions Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <!-- Quick Top Up -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Quick Balance Top-Up</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px;">
          <button type="button" class="btn btn-secondary btn-sm" style="font-weight: 800;">+ ₹500</button>
          <button type="button" class="btn btn-secondary btn-sm" style="font-weight: 800;">+ ₹1,000</button>
          <button type="button" class="btn btn-secondary btn-sm" style="font-weight: 800;">+ ₹2,000</button>
        </div>

        <button type="button" class="btn btn-primary" id="btn-recharge-wallet" style="width: 100%; justify-content: center;">
          ⚡ Recharge via UPI / NetBanking
        </button>
      </div>

      <!-- Auto Debit Settings -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Auto-Debit &amp; Barrier Rules</h3>
        
        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 12px; cursor: pointer;">
          <input type="checkbox" checked style="accent-color: var(--primary-600);"> Auto-open exit barrier gate on RFID detection
        </label>
        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 12px; cursor: pointer;">
          <input type="checkbox" checked style="accent-color: var(--primary-600);"> Auto-recharge ₹500 if balance falls below ₹200
        </label>
      </div>
    </div>
  `;

  document.getElementById('btn-recharge-wallet').addEventListener('click', () => {
    showToast("Recharge transaction of ₹500 approved via FastTag wallet.", "success", 3500);
  });
}
