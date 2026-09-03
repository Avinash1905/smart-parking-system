/**
 * SmartPark Dynamic Pricing & Tariff Calculator Simulator Component
 * Allows drivers to simulate expected parking tariffs based on arrival time, duration, and vehicle profile.
 */

window.DynamicPricingCalculatorView = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="pricing-calculator-card" style="background: var(--bg-card, #1a2234); border: 1px solid var(--border-color, #2d3748); border-radius: 12px; padding: 20px; color: #fff;">
        <div style="margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #f59e0b;">🏷️ Dynamic Parking Tariff Estimator</h3>
          <p style="margin: 4px 0 0; font-size: 0.85rem; color: #94a3b8;">Estimate real-time rates with peak surge multipliers and vehicle discounts</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <!-- Controls -->
          <div>
            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;">Select Parking Facility</label>
              <select id="calc-zone-select" style="width: 100%; padding: 8px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #fff;">
                <option value="zone-pub-01">Municipal Central Parking (₹20/hr base)</option>
                <option value="zone-pub-02">Metro Station East Hub (₹15/hr base)</option>
                <option value="zone-pvt-01">TCS Tech Park Multi-Deck (₹10/hr corp)</option>
              </select>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;">Vehicle Classification</label>
              <select id="calc-vehicle-type" style="width: 100%; padding: 8px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #fff;">
                <option value="SEDAN">Standard Sedan (1.0x)</option>
                <option value="MOTORCYCLE">Two-Wheeler / Bike (0.5x)</option>
                <option value="COMPACT">Compact / Hatchback (0.9x)</option>
                <option value="SUV">SUV / Large Vehicle (1.25x)</option>
                <option value="EV">Electric Vehicle (EV Standby 1.1x)</option>
              </select>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;">Duration (Hours)</label>
              <input type="range" id="calc-duration" min="1" max="12" step="0.5" value="2" style="width: 100%; accent-color: #f59e0b;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">
                <span>1 hr</span>
                <span id="calc-duration-label" style="font-weight: bold; color: #f59e0b;">2.0 Hours</span>
                <span>12 hrs</span>
              </div>
            </div>

            <div style="margin-bottom: 12px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.85rem; color: #cbd5e1;">
                <input type="checkbox" id="calc-ev-charging" style="accent-color: #10b981;">
                Include Dedicated EV Fast Charging (₹12.50/kWh)
              </label>
            </div>
          </div>

          <!-- Estimated Quote Summary -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase;">Estimated Tariff Summary</div>
              <div id="calc-grand-total" style="font-size: 2.2rem; font-weight: 800; color: #10b981; margin: 8px 0;">₹42.00</div>
              <div id="calc-demand-badge" style="display: inline-block; background: #065f46; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                ● Normal Demand (1.0x)
              </div>
            </div>

            <div style="border-top: 1px solid #334155; padding-top: 12px; margin-top: 12px; font-size: 0.8rem; color: #94a3b8;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Base Parking Fee:</span>
                <span id="calc-base-fee" style="color: #cbd5e1;">₹40.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>EV Power Charge:</span>
                <span id="calc-ev-fee" style="color: #cbd5e1;">₹0.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>GST / City Surcharge (5%):</span>
                <span id="calc-tax-fee" style="color: #cbd5e1;">₹2.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Recalculation logic
    const updateQuote = () => {
      const duration = parseFloat(document.getElementById('calc-duration')?.value || '2');
      const vtype = document.getElementById('calc-vehicle-type')?.value || 'SEDAN';
      const isEv = document.getElementById('calc-ev-charging')?.checked || false;

      const durLabel = document.getElementById('calc-duration-label');
      if (durLabel) durLabel.innerText = `${duration} Hours`;

      let baseRate = 20.0;
      let vMult = 1.0;
      if (vtype === 'MOTORCYCLE') vMult = 0.5;
      else if (vtype === 'COMPACT') vMult = 0.9;
      else if (vtype === 'SUV') vMult = 1.25;
      else if (vtype === 'EV') vMult = 1.1;

      const baseFee = baseRate * vMult * duration;
      const evFee = isEv ? 7.4 * duration * 2.5 : 0.0;
      const tax = (baseFee + evFee) * 0.05;
      const grandTotal = baseFee + evFee + tax;

      const totalEl = document.getElementById('calc-grand-total');
      if (totalEl) totalEl.innerText = `₹${grandTotal.toFixed(2)}`;

      const baseFeeEl = document.getElementById('calc-base-fee');
      if (baseFeeEl) baseFeeEl.innerText = `₹${baseFee.toFixed(2)}`;

      const evFeeEl = document.getElementById('calc-ev-fee');
      if (evFeeEl) evFeeEl.innerText = `₹${evFee.toFixed(2)}`;

      const taxFeeEl = document.getElementById('calc-tax-fee');
      if (taxFeeEl) taxFeeEl.innerText = `₹${tax.toFixed(2)}`;
    };

    ['calc-zone-select', 'calc-vehicle-type', 'calc-duration', 'calc-ev-charging'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', updateQuote);
    });
  }
};
