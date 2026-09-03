/**
 * SmartPark GNSS Dynamic Polygon Geofencing & Curb Zone View
 * Renders GPS polygon coordinates for street curb parking and delivery truck dwell meters.
 */

window.SmartCurbGeofenceView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="geofence-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">📍 High-Precision GNSS Geofenced Curb Meters</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Automatic vehicle dwell detection & frictionless digital curb ticketing</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● RTK GNSS Accuracy: ± 2 cm
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 600; font-size: 0.9rem; color: #f59e0b;">CURB-MG-01 (MG Road Promenade)</div>
            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px;">
              Geofence Polygon: 4 Vertex Perimeter<br>
              Active Delivery Dwell: BlueDart Express (KA-04-TR-9001)<br>
              <span style="color: #38bdf8;">Session: 14 mins elapsed / 30 mins max</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
