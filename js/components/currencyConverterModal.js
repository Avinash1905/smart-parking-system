/**
 * SmartPark Multi-Currency International Tariff Converter Component
 * Converts local INR parking fees to USD, EUR, GBP, AED, SGD for international travelers.
 */

import { showToast } from './toast.js';

export function openCurrencyConverterModal(inrAmount = 40.0) {
  let modalContainer = document.getElementById('modals-root');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modals-root';
    document.body.appendChild(modalContainer);
  }

  function closeModal() {
    const overlay = document.querySelector('.modal-overlay.active');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  const modalHtml = `
    <div class="modal-overlay active" id="modal-fx-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Global Travelers</span>
            <h3 class="modal-title">International FX Currency Converter</h3>
          </div>
          <button type="button" class="modal-close" id="modal-fx-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.875rem; color: var(--text-secondary);">Base Parking Fare:</span>
            <strong style="font-size: 1.3rem; color: var(--primary-600);">₹${inrAmount.toFixed(2)} INR</strong>
          </div>

          <div class="input-group" style="margin-bottom: 18px;">
            <label class="input-label" for="fx-currency-select">Select Your Billing Currency</label>
            <select id="fx-currency-select" class="input-control">
              <option value="USD" data-rate="83.50">USD ($) — United States Dollar</option>
              <option value="EUR" data-rate="90.20">EUR (€) — Euro</option>
              <option value="GBP" data-rate="105.80">GBP (£) — British Pound</option>
              <option value="AED" data-rate="22.75">AED (د.إ) — UAE Dirham</option>
              <option value="SGD" data-rate="62.40">SGD ($) — Singapore Dollar</option>
            </select>
          </div>

          <!-- Converted Output Box -->
          <div style="background: var(--bg-surface); border: 2px solid var(--border-color); border-radius: var(--radius-xl); padding: 20px; text-align: center; margin-bottom: 20px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">CONVERTED FOREIGN AMOUNT</span>
            <div id="fx-converted-display" style="font-size: 2rem; font-weight: 900; color: var(--status-high-text); margin: 4px 0;">
              $0.48 USD
            </div>
            <span id="fx-rate-note" style="font-size: 0.78rem; color: var(--text-secondary);">
              Live Interbank Rate: 1 USD = ₹83.50 INR (Zero Foreign Surcharge)
            </span>
          </div>

          <button type="button" class="btn btn-primary" id="btn-pay-intl-card" style="width: 100%; justify-content: center;">
            Pay with International Card →
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  const selectEl = document.getElementById('fx-currency-select');
  function updateFx() {
    const opt = selectEl.options[selectEl.selectedIndex];
    const rate = parseFloat(opt.getAttribute('data-rate'));
    const curr = opt.value;
    const conv = inrAmount / rate;
    
    let symbol = "$";
    if (curr === "EUR") symbol = "€";
    if (curr === "GBP") symbol = "£";
    if (curr === "AED") symbol = "AED ";
    if (curr === "SGD") symbol = "S$";

    document.getElementById('fx-converted-display').textContent = `${symbol}${conv.toFixed(2)} ${curr}`;
    document.getElementById('fx-rate-note').textContent = `Live Interbank Rate: 1 ${curr} = ₹${rate.toFixed(2)} INR (Zero Foreign Surcharge)`;
  }

  selectEl.addEventListener('change', updateFx);
  document.getElementById('modal-fx-close').addEventListener('click', closeModal);
  document.getElementById('modal-fx-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-fx-overlay') closeModal();
  });

  document.getElementById('btn-pay-intl-card').addEventListener('click', () => {
    showToast("International Card authorized! Digital receipt issued in selected foreign currency.", "success", 2500);
    closeModal();
  });

  updateFx();
}
