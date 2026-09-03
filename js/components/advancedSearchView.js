/**
 * SmartPark Advanced Multi-Faceted Spatial Search View
 * Renders radius sliders, price ceiling inputs, EV amenities toggles, and live ranked parking results.
 */

import { searchController } from '../controllers/searchController.js';
import { showToast } from './toast.js';

export function renderAdvancedSearchView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        🔍 Multi-Attribute Facility Discovery
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Filter urban parking garages by real-time vacancy certainty, EV fast chargers, covered roof, and price ceilings.
      </p>
    </div>

    <!-- Search & Filter Controls Grid -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">SEARCH RADIUS (KM)</label>
          <input type="range" id="search-radius-slider" min="1" max="25" value="10" style="width: 100%; accent-color: var(--primary-600);">
          <div style="font-size: 0.82rem; color: var(--text-primary); font-weight: 700; margin-top: 4px;" id="radius-val">10 km radius</div>
        </div>

        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">MAX HOURLY RATE (₹/HR)</label>
          <input type="number" id="search-price-ceiling" placeholder="No Limit" min="10" max="200" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary);">
        </div>

        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">FACILITY TYPE</label>
          <select id="search-category-select" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary);">
            <option value="ALL">All Facilities (Public &amp; Private)</option>
            <option value="PUBLIC">Public Commercial Parking</option>
            <option value="PRIVATE_COMPANY">Corporate Tech Parks</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">SORT BY</label>
          <select id="search-sort-select" style="width: 100%; padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-subtle); color: var(--text-primary);">
            <option value="RECOMMENDED">✨ Smart Recommended (Best Match)</option>
            <option value="DISTANCE">📍 Closest Distance</option>
            <option value="PRICE_LOW_TO_HIGH">💰 Lowest Price First</option>
            <option value="AVAILABILITY">🟢 Most Open Bays</option>
          </select>
        </div>
      </div>

      <!-- Amenity Checkboxes -->
      <div style="display: flex; flex-wrap: wrap; gap: 16px; padding-top: 12px; border-top: 1px solid var(--border-color);">
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-primary); cursor: pointer;">
          <input type="checkbox" id="chk-filter-ev" checked style="accent-color: var(--primary-600);"> ⚡ Dedicated EV Charger
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-primary); cursor: pointer;">
          <input type="checkbox" id="chk-filter-roof" style="accent-color: var(--primary-600);"> ☂️ Covered / Underground Roof
        </label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-primary); cursor: pointer;">
          <input type="checkbox" id="chk-filter-security" style="accent-color: var(--primary-600);"> 🛡️ 24/7 On-Site Security
        </label>
      </div>
    </div>

    <!-- Live Results Container -->
    <div id="search-results-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
      <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center; color: var(--text-muted);">
        Loading live spatial matches...
      </div>
    </div>
  `;

  const slider = document.getElementById('search-radius-slider');
  const radiusVal = document.getElementById('radius-val');
  if (slider && radiusVal) {
    slider.addEventListener('input', () => {
      radiusVal.textContent = `${slider.value} km radius`;
    });
  }
}
