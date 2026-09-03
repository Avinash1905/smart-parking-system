/**
 * SmartPark EV Charging Grid & Microgrid Telemetry Component
 * Displays live charging ports, kW load meters, solar offset percentages, and active session telemetry.
 */

window.EVChargingDashboardView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="ev-dashboard-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ EV Charging Grid & Microgrid Load</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time power balancing with Rooftop Solar integration</p>
          </div>
          <span class="badge" style="background: #065f46; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Microgrid Active: 84.5 kW Load
          </span>
        </div>

        <!-- Metric Gauges Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px;">
          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.8rem; color: #94a3b8;">Active Charging Ports</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #38bdf8; margin-top: 4px;">6 / 8 Bays</div>
            <div style="font-size: 0.75rem; color: #10b981; margin-top: 2px;">↑ 75% Utilization</div>
          </div>

          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.8rem; color: #94a3b8;">Solar Energy Offset</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b; margin-top: 4px;">34.2 kW</div>
            <div style="font-size: 0.75rem; color: #10b981; margin-top: 2px;">40.5% Green Energy</div>
          </div>

          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.8rem; color: #94a3b8;">Total Energy Delivered Today</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #a78bfa; margin-top: 4px;">482.6 kWh</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">~195 kg CO₂ Saved</div>
          </div>

          <div style="background: #0f172a; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-size: 0.8rem; color: #94a3b8;">Grid Tariff Rate</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #10b981; margin-top: 4px;">₹8.50 / kWh</div>
            <div style="font-size: 0.75rem; color: #34d399; margin-top: 2px;">Time-of-Use Standard</div>
          </div>
        </div>

        <!-- Active Sessions Table -->
        <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: #cbd5e1;">Active Vehicle Charging Sessions</h4>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid #334155; color: #94a3b8;">
                <th style="padding: 8px 10px;">Bay</th>
                <th style="padding: 8px 10px;">Plate</th>
                <th style="padding: 8px 10px;">Charger Type</th>
                <th style="padding: 8px 10px;">Power</th>
                <th style="padding: 8px 10px;">Battery SoC</th>
                <th style="padding: 8px 10px;">Delivered</th>
                <th style="padding: 8px 10px;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; font-weight: 600; color: #38bdf8;">EV-01</td>
                <td style="padding: 10px; font-mono;">KA-01-EV-1008</td>
                <td style="padding: 10px;"><span style="background: #1e3a8a; color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">50kW DC Fast</span></td>
                <td style="padding: 10px;">48.2 kW</td>
                <td style="padding: 10px; width: 140px;">
                  <div style="background: #334155; border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                    <div style="background: #10b981; width: 78%; height: 100%;"></div>
                  </div>
                  <span style="font-size: 0.75rem; color: #cbd5e1;">78% (est. 12m left)</span>
                </td>
                <td style="padding: 10px;">28.4 kWh</td>
                <td style="padding: 10px;"><span style="color: #34d399; font-weight: 600;">Charging</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 10px; font-weight: 600; color: #38bdf8;">EV-02</td>
                <td style="padding: 10px; font-mono;">MH-02-EE-9002</td>
                <td style="padding: 10px;"><span style="background: #312e81; color: #c7d2fe; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">7.4kW AC Type-2</span></td>
                <td style="padding: 10px;">7.2 kW</td>
                <td style="padding: 10px; width: 140px;">
                  <div style="background: #334155; border-radius: 4px; height: 8px; overflow: hidden; margin-bottom: 4px;">
                    <div style="background: #3b82f6; width: 54%; height: 100%;"></div>
                  </div>
                  <span style="font-size: 0.75rem; color: #cbd5e1;">54% (est. 1h 20m)</span>
                </td>
                <td style="padding: 10px;">11.8 kWh</td>
                <td style="padding: 10px;"><span style="color: #38bdf8; font-weight: 600;">Charging</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
