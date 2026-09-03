/**
 * SmartPark Near-Field Communication (NFC) Digital Valet Pass Component
 * Renders Apple Wallet / Google Wallet pass token integration for paperless valet parking.
 */

window.ValetKeylessNFCView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="nfc-valet-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff; text-align: center;">
        <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #38bdf8;">📱 Tap-to-Claim Digital Valet Pass (NFC / Apple Wallet)</h3>
        <p style="margin: 4px 0 16px; font-size: 0.85rem; color: #94a3b8;">Zero-paper digital pass added to Apple Wallet / Google Pay</p>

        <div style="background: #000000; border: 2px solid #38bdf8; border-radius: 12px; padding: 20px; max-width: 340px; margin: 0 auto; box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);">
          <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase;">SmartPark Premium Valet</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin: 8px 0; font-family: monospace;">TICKET #VAL-9901</div>
          <div style="font-size: 0.85rem; color: #10b981; font-weight: 600;">BMW i4 (KA-01-EE-4410)</div>
          <div style="margin-top: 14px; font-size: 0.75rem; color: #cbd5e1;">Hold top of iPhone near valet stand NFC reader to summon vehicle</div>
        </div>
      </div>
    `;
  }
};
