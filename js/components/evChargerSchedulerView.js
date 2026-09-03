/**
 * SmartPark EV Dynamic Load Shedding & Charger Scheduler View Component
 * Renders OCPP 2.0.1 smart load balancing curves, transformer headroom gauges, and stall allocation graphs.
 */

import { showToast } from './toast.js';

export function renderEvChargerSchedulerView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        ⚡ EV Smart Charging Load Balancing Console
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Dynamic OCPP 2.0.1 load shedding preventing facility electrical transformer overloads during peak charging periods.
      </p>
    </div>

    <!-- Power Budget Gauges -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0;">Transformer Load Status (350 kW Capacity)</h3>
        <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
          ● 210 kW Dispatched (60% Utilization - Optimal)
        </span>
      </div>

      <div style="width: 100%; height: 16px; background: var(--bg-surface-subtle); border-radius: 8px; overflow: hidden; margin-bottom: 20px; border: 1px solid var(--border-color);">
        <div style="width: 60%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);"></div>
      </div>

      <button type="button" class="btn btn-primary" id="btn-rebalance-ev" style="width: 100%; justify-content: center;">
        ⚡ Re-Optimize Dynamic Power Distribution Matrix
      </button>
    </div>
  `;

  document.getElementById('btn-rebalance-ev').addEventListener('click', () => {
    showToast("Dynamic load shedding recalculated across 8 DC fast chargers.", "success", 3500);
  });
}
