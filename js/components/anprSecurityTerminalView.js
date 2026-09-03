/**
 * SmartPark ANPR Gate Security Operator Terminal Component
 * Provides security personnel with live camera plate capture feeds, automated barrier overrides,
 * and flagged hotlist intrusion alarms.
 */

window.ANPRSecurityTerminalView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="anpr-terminal-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">📷 ANPR Optical Gate Control & Plate Scanner</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">High-speed OCR Plate Ingestion & Barrier Actuation Console</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-gate-open-manual" style="background: #10b981; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
              ▲ Raise Barrier
            </button>
            <button id="btn-gate-close-manual" style="background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-weight: 600;">
              ▼ Lower Barrier
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <!-- CCTV Live OCR Simulation Feed -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.8rem; color: #94a3b8;">CAMERA FEED: CAM-GATE-NORTH-01</span>
              <span style="font-size: 0.75rem; color: #ef4444; font-weight: bold;">● REC LIVE (30 FPS)</span>
            </div>
            
            <div style="position: relative; width: 100%; height: 180px; background: #020617; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px dashed #334155;">
              <!-- Simulated Bounding Box -->
              <div style="border: 2px solid #38bdf8; border-radius: 4px; padding: 8px 16px; background: rgba(56, 189, 248, 0.1); text-align: center;">
                <div style="font-size: 0.7rem; color: #38bdf8; text-transform: uppercase;">License Plate OCR Target</div>
                <div style="font-size: 1.4rem; font-weight: 800; letter-spacing: 2px; color: #ffffff; font-family: monospace;">
                  KA-01-MJ-5890
                </div>
                <div style="font-size: 0.7rem; color: #10b981; margin-top: 2px;">Confidence: 98.4% (Pass)</div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <input type="text" id="anpr-manual-test-plate" placeholder="Test Plate (e.g. DL-01-XX-9999)" 
                     style="flex: 1; padding: 6px 10px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #fff; font-family: monospace;">
              <button id="btn-trigger-ocr-scan" style="background: #3b82f6; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer;">
                Scan
              </button>
            </div>
          </div>

          <!-- Real-time ANPR Event Stream -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 10px;">RECENT OPTICAL GATE PASSAGE EVENTS</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="background: #1e293b; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.9rem;">KA-01-MJ-5890</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Permit: Employee Verified (TCS)</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Gate Opened</span>
              </div>

              <div style="background: #1e293b; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.9rem;">MH-12-AB-3049</div>
                  <div style="font-size: 0.75rem; color: #94a3b8;">Public Reservation #RES-9901</div>
                </div>
                <span style="background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Gate Opened</span>
              </div>

              <div style="background: #1e293b; padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.9rem; color: #f87171;">DL-01-XX-9999</div>
                  <div style="font-size: 0.75rem; color: #fca5a5;">⚠ ALERT: Blacklisted Plate</div>
                </div>
                <span style="background: #7f1d1d; color: #fca5a5; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Lockdown</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook button events
    document.getElementById('btn-gate-open-manual')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Manual Override: Entry Barrier Raised.', 'success');
    });

    document.getElementById('btn-gate-close-manual')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show('Manual Override: Entry Barrier Lowered.', 'warning');
    });

    document.getElementById('btn-trigger-ocr-scan')?.addEventListener('click', () => {
      const plate = document.getElementById('anpr-manual-test-plate')?.value || 'KA-01-AB-1234';
      if (window.Toast) window.Toast.show(`ANPR Match: ${plate} passed optical validation.`, 'info');
    });
  }
};
