/**
 * SmartPark 2D Urban Parking Heatmap View Component
 * Renders interactive spatial grid density matrices representing city-scale parking pressure.
 */

import { showToast } from './toast.js';

export function renderParkingHeatMatrixView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🗺️ Urban Parking Demand Heat Matrix
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Real-time 2D spatial saturation mapping across municipal commercial districts and technology corridors.
      </p>
    </div>

    <!-- Spatial Heat Grid Container -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 16px 0;">Central Business District (5x5 Spatial Grid)</h3>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; max-width: 480px; margin: 0 auto 20px auto;">
        <div style="background: #ef4444; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">95%</div>
        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">78%</div>
        <div style="background: #ef4444; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">91%</div>
        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">45%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">28%</div>

        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">82%</div>
        <div style="background: #ef4444; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">98%</div>
        <div style="background: #ef4444; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">94%</div>
        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">72%</div>
        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">42%</div>

        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">48%</div>
        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">80%</div>
        <div style="background: #ef4444; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">96%</div>
        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">68%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">32%</div>

        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">24%</div>
        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">52%</div>
        <div style="background: #f59e0b; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">74%</div>
        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">40%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">20%</div>

        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">18%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">30%</div>
        <div style="background: #3b82f6; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">44%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">22%</div>
        <div style="background: #10b981; color: #fff; padding: 20px 10px; border-radius: 8px; text-align: center; font-weight: 900; font-size: 0.8rem;">15%</div>
      </div>
    </div>
  `;
}
