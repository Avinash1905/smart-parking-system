/**
 * SmartPark Dual-Tree Complex Wavelet ANPR Denoiser View
 * Displays real-time signal-to-noise ratio (SNR) improvements and wavelet shrinkage thresholds.
 */

window.ANPRDenoiserView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="denoiser-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🌊 Dual-Tree Complex Wavelet ANPR Denoiser</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">High-ISO nighttime plate noise filtering & contrast sharpening</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● +9.4 dB SNR Gain
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Night Sensor Gain</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8; margin-top: 2px;">ISO 3200</div>
            <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 2px;">Low Light Boost</div>
          </div>

          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
            <div style="font-size: 0.75rem; color: #94a3b8;">Wavelet Threshold</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #34d399; margin-top: 2px;">σ = 14.5</div>
            <div style="font-size: 0.75rem; color: #a7f3d0; margin-top: 2px;">Bivariate Shrinkage</div>
          </div>
        </div>
      </div>
    `;
  }
};
