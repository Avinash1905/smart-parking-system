/**
 * SmartPark NETC FASTag Electronic Toll Settlement Ledger Component
 * Visualizes daily bank reconciliation batches, interchange fees, and instant RFID wallet deductions.
 */

window.FASTagSettlementView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="fastag-ledger-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🏷️ NETC FASTag Settlement & RFID Ledger</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">National Electronic Toll Collection gateway auto-reconciliation</p>
          </div>
          <button id="btn-sync-fastag-batch" style="background: #1e3a8a; color: #93c5fd; border: 1px solid #3b82f6; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
            ↻ Sync NPCI Batch
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Today's FASTag Volume</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #10b981; margin-top: 2px;">₹38,420</div>
            <div style="font-size: 0.75rem; color: #34d399;">642 Transactions</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Acquiring Bank Status</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">SBI NETC</div>
            <div style="font-size: 0.75rem; color: #7dd3fc;">Batch Reconciled</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Avg RFID Gate Latency</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #a78bfa; margin-top: 2px;">380 ms</div>
            <div style="font-size: 0.75rem; color: #c084fc;">Instant Gate Actuation</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-sync-fastag-batch')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('FASTag NPCI financial clearing batch synced successfully.', 'success');
    });
  }
};
