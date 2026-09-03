/**
 * SmartPark Transformer K-Factor Derating Monitor View
 * Displays non-linear harmonic load derating and thermal insulation margins.
 */

window.EVKFactorView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="kfactor-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #34d399;">⚡ Transformer K-Factor Harmonic Derating</h3>
        <p style="margin: 4px 0 12px; font-size: 0.85rem; color: #94a3b8;">Eddy current loss protection for high-power DC fast charger rectifier loads</p>
        <div style="background: #0f172a; padding: 10px; border-radius: 6px; font-size: 0.85rem; color: #cbd5e1;">
          Measured K-Factor: K-4.2 • Derated Safe Capacity: 470.0 kVA / 500 kVA
        </div>
      </div>
    `;
  }
};
