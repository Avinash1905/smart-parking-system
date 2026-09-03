/**
 * SmartPark Dynamic Curb Overstay Compliance & Fine View
 * Displays active street curb loading sessions, elapsed dwell timers, and overstay violations.
 */

window.SmartCurbOverstayView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="curb-overstay-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">⏱️ Dynamic Curb Dwell Timers & Overstay Audit</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time micro-freight dwell limits & automated infraction escalation</p>
          </div>
          <span style="background: #78350f; color: #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 1 Active Delivery Overstay Flagged
          </span>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-mono; font-size: 0.95rem; color: #f87171;">KA-04-TR-9001 (BlueDart)</span>
            <span style="background: #7f1d1d; color: #fca5a5; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
              +8 MIN OVERSTAY
            </span>
          </div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
            Zone: CURB-MG-01 (MG Road) • Allowed: 20 mins • Elapsed: 28 mins<br>
            <span style="color: #f87171; font-weight: bold;">Assessed Citation: ₹330.00</span>
          </div>
        </div>
      </div>
    `;
  }
};
