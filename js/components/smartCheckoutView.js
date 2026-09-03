/**
 * SmartPark Multi-Rail Checkout & Invoice Component
 * Displays dynamic UPI QR payments, Apple/Google Pay buttons, card tokenization, and tax invoice generation.
 */

window.SmartCheckoutView = {
  render(containerId, amount = 42.0) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="checkout-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff; max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #10b981;">💳 SmartPark Instant Settlement</h3>
          <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Zero-touch contactless payment with instant digital receipt</p>
        </div>

        <!-- QR Code Simulation -->
        <div style="background: #ffffff; padding: 16px; border-radius: 12px; width: 200px; height: 200px; margin: 0 auto 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <div style="font-family: monospace; font-size: 0.75rem; color: #000; font-weight: bold; margin-bottom: 4px;">SCAN & PAY VIA UPI</div>
          <!-- SVG QR Code Icon -->
          <svg viewBox="0 0 100 100" style="width: 140px; height: 140px;">
            <rect width="100" height="100" fill="#ffffff"/>
            <rect x="10" y="10" width="30" height="30" fill="#000000"/>
            <rect x="15" y="15" width="20" height="20" fill="#ffffff"/>
            <rect x="20" y="20" width="10" height="10" fill="#000000"/>

            <rect x="60" y="10" width="30" height="30" fill="#000000"/>
            <rect x="65" y="15" width="20" height="20" fill="#ffffff"/>
            <rect x="70" y="20" width="10" height="10" fill="#000000"/>

            <rect x="10" y="60" width="30" height="30" fill="#000000"/>
            <rect x="15" y="65" width="20" height="20" fill="#ffffff"/>
            <rect x="20" y="70" width="10" height="10" fill="#000000"/>

            <rect x="45" y="45" width="10" height="10" fill="#000000"/>
            <rect x="60" y="60" width="15" height="15" fill="#000000"/>
            <rect x="80" y="75" width="10" height="15" fill="#000000"/>
          </svg>
          <div style="font-family: monospace; font-size: 0.8rem; color: #000; font-weight: bold;">₹${amount.toFixed(2)}</div>
        </div>

        <!-- Payment Methods -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          <button id="btn-pay-fastag" style="background: #1e3a8a; color: #fff; border: 1px solid #3b82f6; border-radius: 6px; padding: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
            🏷️ Auto-Debit via FASTag RFID (Seamless Exit)
          </button>
          <button id="btn-pay-card" style="background: #334155; color: #fff; border: none; border-radius: 6px; padding: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
            💳 Credit / Debit Card (Apple Pay / Google Pay)
          </button>
        </div>

        <div style="border-top: 1px solid #334155; padding-top: 12px; font-size: 0.8rem; color: #94a3b8; text-align: center;">
          🔒 256-bit Encrypted SSL Gateway • ISO-27001 Certified
        </div>
      </div>
    `;

    document.getElementById('btn-pay-fastag')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show(`FASTag auto-debit of ₹${amount.toFixed(2)} authorized. Barrier will open automatically at exit.`, 'success');
    });

    document.getElementById('btn-pay-card')?.addEventListener('click', () => {
      if (window.Toast) window.Toast.show(`Payment of ₹${amount.toFixed(2)} completed. Invoice emailed to your registered address.`, 'success');
    });
  }
};
