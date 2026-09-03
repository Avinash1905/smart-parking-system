/**
 * SmartPark Corporate Multi-Tenant Billing View Component
 * Renders itemized corporate parking statements, volume discount tiers (10%), and monthly tax invoices.
 */

import { showToast } from './toast.js';

export function renderMultiTenantBillingView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        📑 Corporate Tenant Billing &amp; Reconciliation
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Review monthly postpaid stall allocations, guest parking pass overages, and volume discount statements.
      </p>
    </div>

    <!-- Corporate Statement Card -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
            🏢 ACCOUNT: TCS (TATA CONSULTANCY SERVICES)
          </span>
          <h3 style="font-size: 1.4rem; font-weight: 900; margin: 4px 0 0 0;">Statement #CORP-INV-202609-TCS</h3>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">TOTAL DUE (NET 30)</div>
          <div style="font-size: 1.8rem; font-weight: 900; color: var(--status-high-text);">₹1,36,880.00</div>
        </div>
      </div>

      <!-- Line Item Details -->
      <div style="background: var(--bg-surface-subtle); padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 8px;">
          <span>50 Dedicated Stalls @ ₹2,500/mo (10% Volume Discount Applied)</span>
          <strong>₹1,12,500.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 8px;">
          <span>140 Hours VIP Visitor Pre-Clearance @ ₹25/hr</span>
          <strong>₹3,500.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">
          <span>CGST (9.0%)</span>
          <span>₹10,440.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px;">
          <span>SGST (9.0%)</span>
          <span>₹10,440.00</span>
        </div>
      </div>

      <button type="button" class="btn btn-primary" id="btn-download-corp-inv" style="width: 100%; justify-content: center;">
        📥 Download Certified Corporate GST Invoice (PDF)
      </button>
    </div>
  `;

  document.getElementById('btn-download-corp-inv').addEventListener('click', () => {
    showToast("Generating certified corporate GST invoice...", "success", 3500);
  });
}
