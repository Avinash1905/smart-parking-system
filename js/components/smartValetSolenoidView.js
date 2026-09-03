/**
 * SmartPark Electronic Key Safe Solenoid Dispatcher View
 * Displays electronic key safe latching status and inductive flyback diode checks.
 */

window.SmartValetSolenoidView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="solenoid-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #fbbf24;">⚡ Key Cabinet Solenoid Actuator Console</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">High-speed 24V electronic latch pulses & inductive flyback monitoring</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Flyback Protection: OK
          </span>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
          <div style="font-size: 0.85rem; color: #cbd5e1;">Cabinet 01 • Solenoid Channel 04 • Pulse Duration: 400ms</div>
          <div style="font-size: 0.75rem; color: #34d399; margin-top: 4px;">State: READY FOR DISPENSE</div>
        </div>
      </div>
    `;
  }
};
