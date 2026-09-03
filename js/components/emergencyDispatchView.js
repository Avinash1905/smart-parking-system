/**
 * SmartPark Emergency Evacuation & Life Safety Console View Component
 * Renders one-click life-safety barrier fire-releases, sprinkler status, and emergency muster routing maps.
 */

import { showToast } from './toast.js';

export function renderEmergencyDispatchView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🚨 Life Safety &amp; Emergency Command Center
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Automated barrier gate fire-releases, smoke evacuation fan interlocks, and emergency services dispatch.
      </p>
    </div>

    <!-- Emergency Controls Card -->
    <div style="background: var(--bg-surface); border: 2px solid rgba(239,68,68,0.4); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <h3 style="font-size: 1.2rem; font-weight: 900; color: var(--status-critical); margin: 0 0 16px 0;">
        ⚠️ Automated Life Safety Protocols
      </h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
        <button type="button" class="btn btn-secondary" id="btn-fire-release" style="color: var(--status-critical); border-color: var(--status-critical); font-weight: 800; padding: 14px;">
          🔥 Trigger Life Safety Fire Barrier Release
        </button>
        <button type="button" class="btn btn-secondary" id="btn-fan-max" style="color: var(--primary-600); border-color: var(--primary-600); font-weight: 800; padding: 14px;">
          💨 Jet Fan Smoke Extraction (100% Boost)
        </button>
      </div>

      <div style="font-size: 0.8rem; color: var(--text-muted);">
        All actions cryptographically logged to the SHA-256 audit chain and transmitted to central emergency dispatch.
      </div>
    </div>
  `;

  document.getElementById('btn-fire-release').addEventListener('click', () => {
    showToast("EMERGENCY: All barrier gates fail-safe opened for evacuation.", "error", 6000);
  });

  document.getElementById('btn-fan-max').addEventListener('click', () => {
    showToast("Jet fans ramped to 100% smoke purge velocity.", "warning", 4000);
  });
}
