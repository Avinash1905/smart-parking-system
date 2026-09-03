/**
 * SmartPark ANPR Camera Optical Hardware Watchdog & Lens Dew Heater View
 * Displays real-time camera FPS, RTSP drop counters, dew point heaters, and firmware status.
 */

window.ANPRCameraFirmwareView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="camera-firmware-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">📷 ANPR Camera Hardware Watchdog & Dew Heaters</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">RTSP stream telemetry, lens heating elements, and firmware OTA status</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 4 Gate Cameras Online
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-weight: 600; font-size: 0.85rem; color: #38bdf8;">CAM-GATE-NORTH-01</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Entry Lane 1 (North Hub)</div>
            <div style="margin-top: 8px; font-size: 0.8rem; color: #cbd5e1;">
              Lens Temp: 32.4°C • Drop: 0.02%<br>
              <span style="color: #34d399;">Dew Heater: Standby</span>
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-weight: 600; font-size: 0.85rem; color: #38bdf8;">CAM-GATE-SOUTH-01</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Metro Flyover Entry Lane</div>
            <div style="margin-top: 8px; font-size: 0.8rem; color: #cbd5e1;">
              Lens Temp: 28.5°C • Drop: 0.05%<br>
              <span style="color: #fbbf24;">Dew Heater: HEATING (ACTIVE)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
