/**
 * SmartPark Multi-Deck EV Energy Broker & Transformer Load Balancer View
 * Displays real-time transformer load capacity, deck charging quotas, and available electrical headroom.
 */

window.MultiDeckEVBrokerView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="ev-broker-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ Multi-Deck EV Energy Broker & Transformer Balancer</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Dynamic power dispatch across B1, Ground, and Rooftop Solar clusters</p>
          </div>
          <span style="background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● 125.5 kW / 250.0 kW (50.2% Load)
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Deck B1 Underground</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">48.2 kW</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">4 Active DC Chargers</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Ground Floor Hub</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">14.8 kW</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">2 Active AC Chargers</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Deck L2 Solar Canopy</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #f59e0b; margin-top: 2px;">62.5 kW</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">5 Active Solar Chargers</div>
          </div>
        </div>
      </div>
    `;
  }
};
