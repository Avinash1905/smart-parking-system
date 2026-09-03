/**
 * SmartPark Dynamic Tariff & Fare Calculator Component
 * Interactive slider modal that visualizes dynamic surge multipliers, EV green discounts,
 * duration volume tiers, and corporate subsidies.
 */

import { showToast } from './toast.js';

export function openDynamicPricingModal(zone) {
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

  const baseRate = zone ? (zone.pricePerHour || zone.price_per_hour || 20.0) : 20.0;
  const zoneName = zone ? zone.name : "Municipal Central Parking";

  const modalHtml = `
    <div class="modal-overlay active" id="modal-pricing-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Fare Engine</span>
            <h3 class="modal-title">Dynamic Tariff Calculator</h3>
          </div>
          <button type="button" class="modal-close" id="modal-pricing-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 16px;">
            Facility: <strong style="color: var(--text-primary);">${zoneName}</strong> (Base: ₹${baseRate}/hr)
          </div>

          <!-- Duration Slider -->
          <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary);">Duration of Stay:</span>
              <span id="slider-dur-val" style="font-size: 0.84rem; font-weight: 800; color: var(--primary-600);">2.0 Hours</span>
            </div>
            <input type="range" id="slider-duration" min="0.5" max="12.0" step="0.5" value="2.0" style="width: 100%; accent-color: var(--primary-600);" />
          </div>

          <!-- Occupancy Slider -->
          <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary);">Live Occupancy Demand:</span>
              <span id="slider-occ-val" style="font-size: 0.84rem; font-weight: 800; color: var(--status-high-text);">55% Full (Standard)</span>
            </div>
            <input type="range" id="slider-occupancy" min="10" max="100" step="5" value="55" style="width: 100%; accent-color: var(--primary-600);" />
          </div>

          <!-- Checkbox Discounts -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer; color: var(--text-primary);">
              <input type="checkbox" id="chk-ev-subsidy" style="accent-color: var(--accent-cyan);" />
              <span>⚡ EV Green Discount (-15%)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer; color: var(--text-primary);">
              <input type="checkbox" id="chk-corp-subsidy" style="accent-color: var(--primary-600);" />
              <span>🏢 Corporate Partner (-30%)</span>
            </label>
          </div>

          <!-- Calculation Summary Output Box -->
          <div style="background: var(--bg-surface-subtle); border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.84rem; color: var(--text-secondary);">
              <span>Base Amount:</span>
              <span id="calc-base-val">₹40.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.84rem; color: var(--text-secondary);">
              <span>Demand Surge Multiplier:</span>
              <span id="calc-surge-val">1.0x (No Surge)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.84rem; color: var(--status-high-text);">
              <span>Applied Discounts & Subsidies:</span>
              <span id="calc-disc-val">-₹0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.84rem; color: var(--text-secondary);">
              <span>GST Tax (18%):</span>
              <span id="calc-tax-val">₹7.20</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; color: var(--text-primary); border-top: 1.5px solid var(--border-color); padding-top: 10px;">
              <span>Total Estimated Tariff:</span>
              <span id="calc-total-val" style="color: var(--primary-600);">₹47.20</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-pricing-done">Done</button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  function recalculate() {
    const dur = parseFloat(document.getElementById('slider-duration').value);
    const occ = parseInt(document.getElementById('slider-occupancy').value);
    const isEv = document.getElementById('chk-ev-subsidy').checked;
    const isCorp = document.getElementById('chk-corp-subsidy').checked;

    document.getElementById('slider-dur-val').textContent = `${dur} Hours`;
    
    let surgeMult = 1.0;
    let surgeText = "1.0x (No Surge)";
    if (occ >= 90) {
      surgeMult = 1.30;
      surgeText = "1.30x (High Surge +30%)";
    } else if (occ >= 75) {
      surgeMult = 1.15;
      surgeText = "1.15x (Moderate Surge +15%)";
    }

    document.getElementById('slider-occ-val').textContent = `${occ}% Full (${occ >= 75 ? 'Surge Active' : 'Standard'})`;
    document.getElementById('slider-occ-val').style.color = occ >= 90 ? 'var(--status-low-text)' : occ >= 75 ? 'var(--status-med-text)' : 'var(--status-high-text)';

    const baseAmount = dur * baseRate;
    const surgeAmount = baseAmount * surgeMult;

    let totalDisc = 0.0;
    if (isEv) totalDisc += (surgeAmount * 0.15);
    if (isCorp) totalDisc += (surgeAmount * 0.30);
    if (dur >= 4.0) totalDisc += (surgeAmount * 0.10);

    const netFare = Math.max(10.0, surgeAmount - totalDisc);
    const tax = netFare * 0.18;
    const total = netFare + tax;

    document.getElementById('calc-base-val').textContent = `₹${baseAmount.toFixed(2)}`;
    document.getElementById('calc-surge-val').textContent = surgeText;
    document.getElementById('calc-disc-val').textContent = `-₹${totalDisc.toFixed(2)}`;
    document.getElementById('calc-tax-val').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('calc-total-val').textContent = `₹${total.toFixed(2)}`;
  }

  document.getElementById('slider-duration').addEventListener('input', recalculate);
  document.getElementById('slider-occupancy').addEventListener('input', recalculate);
  document.getElementById('chk-ev-subsidy').addEventListener('change', recalculate);
  document.getElementById('chk-corp-subsidy').addEventListener('change', recalculate);

  document.getElementById('modal-pricing-close').addEventListener('click', closeModal);
  document.getElementById('btn-pricing-done').addEventListener('click', closeModal);
  document.getElementById('modal-pricing-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-pricing-overlay') closeModal();
  });

  recalculate();
}
