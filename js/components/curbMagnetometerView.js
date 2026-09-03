/**
 * SmartPark Wireless Magnetometer IoT Curb Sensor View
 * Displays 3-axis (X,Y,Z) magnetic flux telemetry and battery life indicators for surface-mount curb pucks.
 */

window.CurbMagnetometerView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="magnetometer-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🧲 Wireless Geomagnetic Curb Puck Sensors</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Surface-mount 3-axis magnetometer perturbation vehicle arrival detection</p>
          </div>
          <span style="background: #78350f; color: #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 8.5 Year Battery Life (LoRaWAN)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Sensor MAG-CURB-01</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #ef4444; margin-top: 2px;">ΔZ: 14.2 µT</div>
            <div style="font-size: 0.75rem; color: #fca5a5;">VEHICLE OCCUPIED</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Sensor MAG-CURB-02</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #10b981; margin-top: 2px;">ΔZ: 1.1 µT</div>
            <div style="font-size: 0.75rem; color: #34d399;">SPOT AVAILABLE</div>
          </div>
        </div>
      </div>
    `;
  }
};
