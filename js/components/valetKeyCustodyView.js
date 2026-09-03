/**
 * SmartPark Contactless Valet Key Custody & Retrieval View Component
 * Renders electronic BLE key locker pin pads, vehicle damage condition checklists, and attendant chain-of-custody logs.
 */

import { showToast } from './toast.js';

export function renderValetKeyCustodyView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🔑 Contactless Valet Key Vault &amp; Chain-of-Custody
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Smart electronic key lockers with encrypted BLE custody verification and vehicle retrieval PINs.
      </p>
    </div>

    <!-- Active Key Vault Card -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
            🔒 KEY SAFELY VAULTED
          </span>
          <h3 style="font-size: 1.3rem; font-weight: 900; margin: 4px 0 0 0;">Hyundai Ioniq 5 (KA-01-MJ-5890)</h3>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LOCKER SLOT</div>
          <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary-600);">Box #14</div>
        </div>
      </div>

      <div style="background: var(--bg-surface-subtle); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 20px;">
        <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">ONE-TIME RETRIEVAL PIN</div>
        <div style="font-size: 2.2rem; font-weight: 900; letter-spacing: 4px; color: var(--text-primary);">8849</div>
        <div style="font-size: 0.75rem; color: var(--status-high-text); margin-top: 4px;">● Present this PIN or scan your QR pass at Valet Kiosk Alpha to request car return.</div>
      </div>

      <button type="button" class="btn btn-primary" id="btn-request-valet-car" style="width: 100%; justify-content: center;">
        🚗 Request Valet Vehicle Delivery to Egress Bay
      </button>
    </div>
  `;

  document.getElementById('btn-request-valet-car').addEventListener('click', () => {
    showToast("Vehicle retrieval dispatch initiated! ETA: ~4 Minutes to Egress Portal.", "success", 4000);
  });
}
