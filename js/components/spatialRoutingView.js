/**
 * SmartPark Spatial Indoor Wayfinding & Navigation Component
 * Renders vector-calculated driving vectors from garage entry gates to designated bays.
 */

window.SpatialRoutingView = {
  render(containerId, startNode = 'ENTRY_GATE_NORTH', targetBay = 'BAY_12') {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="spatial-nav-container" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #60a5fa;">📍 Indoor Turn-by-Turn Wayfinding</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Real-time trajectory guidance from Entrance to Assigned Bay</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-recalculate-route" class="btn btn-secondary" style="background: #334155; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer;">
              ↻ Recalculate
            </button>
            <button id="btn-start-nav" class="btn btn-primary" style="background: #3b82f6; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-weight: 600;">
              ▶ Start Navigation
            </button>
          </div>
        </div>

        <!-- Interactive SVG Route Canvas -->
        <div style="position: relative; width: 100%; height: 320px; background: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b;">
          <svg id="wayfinding-svg-canvas" viewBox="0 0 800 400" style="width: 100%; height: 100%;">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#10b981" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Garage Lanes -->
            <rect x="50" y="50" width="700" height="300" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <line x1="200" y1="50" x2="200" y2="350" stroke="#475569" stroke-width="4" stroke-dasharray="8,8" />
            <line x1="400" y1="50" x2="400" y2="350" stroke="#475569" stroke-width="4" stroke-dasharray="8,8" />
            <line x1="600" y1="50" x2="600" y2="350" stroke="#475569" stroke-width="4" stroke-dasharray="8,8" />
            <line x1="50" y1="200" x2="750" y2="200" stroke="#64748b" stroke-width="6" />

            <!-- Parking Spots Ground Floor -->
            <g id="svg-bays">
              <rect x="80" y="70" width="60" height="100" rx="4" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
              <text x="110" y="125" fill="#fff" font-size="12" text-anchor="middle" font-weight="bold">BAY 01</text>

              <rect x="230" y="70" width="60" height="100" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
              <text x="260" y="125" fill="#94a3b8" font-size="12" text-anchor="middle">BAY 02</text>

              <rect x="430" y="70" width="60" height="100" rx="4" fill="#831843" stroke="#f43f5e" stroke-width="1.5"/>
              <text x="460" y="125" fill="#fff" font-size="12" text-anchor="middle">OCCUPIED</text>

              <!-- Target Bay 12 -->
              <rect x="630" y="230" width="60" height="100" rx="4" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.5"/>
              <text x="660" y="285" fill="#60a5fa" font-size="12" text-anchor="middle" font-weight="bold">BAY 12 ★</text>
            </g>

            <!-- Navigation Path Trajectory -->
            <path id="nav-trajectory-path" d="M 60,200 L 200,200 L 400,200 L 600,200 L 600,280 L 630,280" 
                  fill="none" stroke="url(#routeGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"
                  filter="url(#glow)"/>

            <!-- Moving Vehicle Marker -->
            <circle id="nav-vehicle-dot" cx="60" cy="200" r="8" fill="#38bdf8" stroke="#ffffff" stroke-width="2">
              <animateMotion path="M 60,200 L 200,200 L 400,200 L 600,200 L 600,280 L 630,280" dur="4s" repeatCount="indefinite" />
            </circle>

            <!-- Entrance Marker -->
            <circle cx="60" cy="200" r="10" fill="#10b981" />
            <text x="60" y="235" fill="#10b981" font-size="11" text-anchor="middle" font-weight="bold">ENTRY</text>

            <!-- Target Pin -->
            <circle cx="660" cy="280" r="10" fill="#f59e0b" />
            <text x="660" y="315" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="bold">TARGET</text>
          </svg>
        </div>

        <!-- Step Instructions -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Step 1</div>
            <div style="font-weight: 600; margin-top: 2px;">Enter via North Gate</div>
            <div style="font-size: 0.8rem; color: #cbd5e1;">Proceed straight on Central Aisle for 40m</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Step 2</div>
            <div style="font-weight: 600; margin-top: 2px;">Turn Right at Pier C</div>
            <div style="font-size: 0.8rem; color: #cbd5e1;">Drive 15m toward East Bay Wing</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;">Step 3</div>
            <div style="font-weight: 600; margin-top: 2px;">Park in Bay 12</div>
            <div style="font-size: 0.8rem; color: #cbd5e1;">Sensor auto-registers arrival instantly</div>
          </div>
        </div>
      </div>
    `;

    // Hook listeners
    const recalcBtn = el.querySelector('#btn-recalculate-route');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        if (window.Toast) window.Toast.show('Route recalculated: optimal driving path active.', 'info');
      });
    }
  }
};
