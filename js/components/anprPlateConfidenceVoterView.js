/**
 * SmartPark ANPR Character Entropy & Confidence Voter View
 * Displays Shannon entropy scores across neural character segments.
 */

window.ANPRPlateConfidenceVoterView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="voter-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">🔤 ANPR Shannon Entropy Character Voter</h3>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Character-by-character confidence probability distribution</p>
          </div>
          <span style="background: #082f49; color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">
            ● Entropy: 0.042 (High Certainty)
          </span>
        </div>

        <div style="display: flex; gap: 6px; overflow-x: auto; padding: 8px 0;">
          <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; text-align: center;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #10b981;">K</div>
            <div style="font-size: 0.65rem; color: #94a3b8;">99.8%</div>
          </div>
          <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; text-align: center;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #10b981;">A</div>
            <div style="font-size: 0.65rem; color: #94a3b8;">99.9%</div>
          </div>
          <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; text-align: center;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #10b981;">0</div>
            <div style="font-size: 0.65rem; color: #94a3b8;">99.4%</div>
          </div>
          <div style="background: #0f172a; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; text-align: center;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #10b981;">1</div>
            <div style="font-size: 0.65rem; color: #94a3b8;">99.7%</div>
          </div>
        </div>
      </div>
    `;
  }
};
