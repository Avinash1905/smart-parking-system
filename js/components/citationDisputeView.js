/**
 * SmartPark Citation Dispute & Legal Review View Component
 * Allows drivers to review photographic camera evidence, submit official appeals, and track dispute decisions.
 */

import { showToast } from './toast.js';

export function renderCitationDisputeView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        ⚖️ Citation Review &amp; Official Dispute Portal
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Review timestamped ALPR barrier logs, attach proof of valid booking, and submit formal cancellation appeals.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
      <!-- Active Citations Panel -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Open Citations &amp; Enforcements</h3>
        
        <div style="background: var(--bg-surface-subtle); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 800; color: var(--status-critical); font-size: 0.95rem;">CITATION #CIT-202609-8819</span>
            <span class="badge badge-private" style="background: rgba(239,68,68,0.15); color: var(--status-critical);">₹500 FINE OPEN</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-primary); font-weight: 700;">Overstayed Grace Period (42 Minutes Excess)</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Zone: Municipal Central Parking • Bay A-03 • Plate: KA-01-MJ-5890</div>
          
          <div style="margin-top: 12px; display: flex; gap: 10px;">
            <button type="button" class="btn btn-primary btn-sm" id="btn-pay-citation">Pay Online (₹500)</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-lodge-dispute">Lodge Appeal</button>
          </div>
        </div>
      </div>

      <!-- Dispute Submission Form -->
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 16px 0;">Submit Official Appeal</h3>
        
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">REASON FOR DISPUTE</label>
          <select id="dispute-reason" style="width: 100%; padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary);">
            <option value="GATE_MALFUNCTION">Barrier Gate Technical Malfunction</option>
            <option value="ALPR_MISREAD">ALPR Optical Character Misread</option>
            <option value="OFFICIAL_EMERGENCY">Medical / Emergency Roadside Assistance</option>
            <option value="DOUBLE_CHARGED">Duplicate Transaction Recorded</option>
          </select>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">EXPLANATION STATEMENT</label>
          <textarea id="dispute-statement" rows="4" placeholder="Provide factual context or transaction ID..." style="width: 100%; padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary); font-size: 0.84rem;"></textarea>
        </div>

        <button type="button" class="btn btn-primary" id="btn-submit-appeal" style="width: 100%; justify-content: center;">
          ⚖️ Submit Cryptographically Signed Appeal
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-pay-citation').addEventListener('click', () => {
    showToast("Connecting to secure UPI payment gateway...", "info", 3000);
  });

  document.getElementById('btn-submit-appeal').addEventListener('click', () => {
    showToast("Appeal #DISP-9902 submitted to the adjudication board. SLA: 48h.", "success", 4000);
  });
}
