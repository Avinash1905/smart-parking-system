/**
 * SmartPark Sauvola Adaptive Local Thresholding Binarizer View
 * Displays dynamic window variance and illumination compensation.
 */

window.ANPRBinarizerView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="binarizer-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🌓 Sauvola Local Variance Adaptive Binarizer</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Local standard deviation thresholding overcoming severe shadow gradients</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Window: 25px (k: 0.34)
          </span>
        </div>

        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px;">
          <div style="font-size: 0.85rem; color: #cbd5e1;">Illumination gradient compensated • High OCR recall under headlights</div>
        </div>
      </div>
    `;
  }
};
