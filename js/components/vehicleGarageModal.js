/**
 * Vehicle Garage Manager Component
 * Enables users to manage multiple vehicles, add new registrations, toggle EV charging compatibility, and set default vehicle.
 */

import { authService } from '../data/authService.js';
import { showToast } from './toast.js';

let userVehicles = [
  { id: "veh-01", plate: "KA-01-MJ-5890", type: "Electric Car (EV)", brand: "Tata", model: "Nexon EV", color: "Teal Blue", isDefault: true, isEV: true },
  { id: "veh-02", plate: "KA-05-AA-4422", type: "Two Wheeler", brand: "Ather", model: "450X", color: "Space Grey", isDefault: false, isEV: true }
];

export function openVehicleGarageModal(onUpdated) {
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

  function renderModal() {
    const modalHtml = `
      <div class="modal-overlay active" id="modal-garage-overlay">
        <div class="modal-content" style="max-width: 580px;">
          <div class="modal-header">
            <div>
              <span class="badge badge-public" style="margin-bottom: 4px;">My Garage</span>
              <h3 class="modal-title">Registered Vehicles</h3>
            </div>
            <button type="button" class="modal-close" id="modal-garage-close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Vehicle List -->
            <div id="garage-vehicles-list" style="margin-bottom: 24px;">
              ${userVehicles.map(v => `
                <div class="vehicle-card-row">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span class="vehicle-plate-badge">${v.plate}</span>
                      ${v.isDefault ? '<span class="badge" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">Default</span>' : ''}
                      ${v.isEV ? '<span class="badge badge-ev">⚡ EV</span>' : ''}
                    </div>
                    <div style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 600;">
                      ${v.brand} ${v.model} • ${v.type} (${v.color})
                    </div>
                  </div>

                  <div style="display: flex; gap: 6px;">
                    ${!v.isDefault ? `
                      <button type="button" class="btn btn-secondary btn-sm btn-set-default-veh" data-id="${v.id}">
                        Set Default
                      </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Add Vehicle Form Header -->
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; padding-top: 14px; border-top: 1px solid var(--border-color);">
              + Register New Vehicle
            </h4>

            <form id="form-add-vehicle">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div class="input-group">
                  <label class="input-label" for="veh-plate-input">License Plate *</label>
                  <input type="text" id="veh-plate-input" class="input-control" placeholder="e.g. KA-03-HA-9080" style="text-transform: uppercase; font-weight: 700;" required />
                </div>
                <div class="input-group">
                  <label class="input-label" for="veh-type-select">Vehicle Category</label>
                  <select id="veh-type-select" class="input-control">
                    <option value="Car (Standard)">Four Wheeler (Car / SUV)</option>
                    <option value="Electric Car (EV)">Electric Car (EV)</option>
                    <option value="Two Wheeler">Two Wheeler (Bike / Scooter)</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                <div class="input-group">
                  <label class="input-label" for="veh-brand-input">Make / Brand</label>
                  <input type="text" id="veh-brand-input" class="input-control" placeholder="e.g. Hyundai" required />
                </div>
                <div class="input-group">
                  <label class="input-label" for="veh-model-input">Model & Color</label>
                  <input type="text" id="veh-model-input" class="input-control" placeholder="e.g. i20 (White)" required />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;">
                Save Vehicle to Garage
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    modalContainer.innerHTML = modalHtml;

    document.getElementById('modal-garage-close').addEventListener('click', closeModal);
    document.getElementById('modal-garage-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-garage-overlay') closeModal();
    });

    // Set default handler
    modalContainer.querySelectorAll('.btn-set-default-veh').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        userVehicles.forEach(v => v.isDefault = (v.id === id));
        showToast("Default vehicle updated!", "success", 1500);
        renderModal();
        if (onUpdated) onUpdated(userVehicles);
      });
    });

    // Add vehicle form
    document.getElementById('form-add-vehicle').addEventListener('submit', (e) => {
      e.preventDefault();
      const plate = document.getElementById('veh-plate-input').value.trim().toUpperCase();
      const type = document.getElementById('veh-type-select').value;
      const brand = document.getElementById('veh-brand-input').value.trim();
      const model = document.getElementById('veh-model-input').value.trim();

      userVehicles.push({
        id: `veh-${Date.now().toString(36)}`,
        plate,
        type,
        brand,
        model,
        color: "Standard",
        isDefault: false,
        isEV: type.includes('EV')
      });

      showToast(`Vehicle ${plate} added to garage!`, "success", 2000);
      renderModal();
      if (onUpdated) onUpdated(userVehicles);
    });
  }

  renderModal();
}
