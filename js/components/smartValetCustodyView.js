/**
 * SmartPark Electronic Valet Key Safe & Custody Audit View
 * Displays electronic key locker solenoid states, fingerprint authentication events, and custody logs.
 */

window.SmartValetCustodyView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="valet-custody-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #fbbf24;">🔑 Biometric Key Locker Custody Audit Log</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Tamper-proof physical key custody timestamps with biometric validation</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 30 Locker Boxes Secured
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 600; font-size: 0.85rem; color: #38bdf8;">Ticket #VAL-9901 (Box #04)</span>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Key Deposited by Runner Deepak V. (Fingerprint Match)</div>
            </div>
            <span style="background: #065f46; color: #34d399; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">LOCKED</span>
          </div>
        </div>
      </div>
    `;
  }
};
