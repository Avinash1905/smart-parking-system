/**
 * SmartPark Vehicle Garage Manager Modal Component
 * Displays registered personal & corporate vehicles with fast-charge compatibility toggles.
 */

import { VehicleController } from '../controllers/vehicleController.js';
import { showToast } from './toast.js';

export function openVehicleManagerModal() {
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

  const vehicles = VehicleController.getVehicles();

  const modalHtml = `
    <div class="modal-overlay active" id="modal-veh-overlay">
      <div class="modal-content" style="max-width: 580px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
              🚗 Vehicle Garage
            </span>
            <h3 class="modal-title">My Registered Vehicles</h3>
          </div>
          <button type="button" class="modal-close" id="modal-veh-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <!-- Vehicle List -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${vehicles.map(v => `
              <div style="background: var(--bg-surface-subtle); padding: 14px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary); letter-spacing: 0.5px;">
                    ${v.plate} ${v.is_default ? '<span class="badge badge-public" style="font-size: 0.65rem; margin-left: 6px;">DEFAULT</span>' : ''}
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                    ${v.model} (${v.type}) ${v.is_ev ? '• ⚡ Electric' : ''}
                  </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.75rem;">Select</button>
              </div>
            `).join('')}
          </div>

          <!-- Add New Vehicle Form -->
          <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-lg); border: 1px dashed var(--border-color); margin-bottom: 16px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; margin: 0 0 10px 0;">+ Register New Vehicle</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <input type="text" id="new-veh-plate" placeholder="Plate (e.g. KA-01-AB-1234)" style="padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.82rem; text-transform: uppercase;">
              <input type="text" id="new-veh-model" placeholder="Make / Model" style="padding: 8px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 0.82rem;">
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-add-vehicle" style="width: 100%; justify-content: center;">
              Save Vehicle to Garage
            </button>
          </div>

          <button type="button" class="btn btn-secondary btn-sm" id="btn-close-veh" style="width: 100%;">
            Close Garage
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-veh-close').addEventListener('click', closeModal);
  document.getElementById('btn-close-veh').addEventListener('click', closeModal);
  document.getElementById('modal-veh-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-veh-overlay') closeModal();
  });

  document.getElementById('btn-add-vehicle').addEventListener('click', () => {
    const plate = document.getElementById('new-veh-plate').value;
    const model = document.getElementById('new-veh-model').value;
    if (plate) {
      VehicleController.addVehicle(plate, 'Car', model || 'Standard Vehicle', false);
      closeModal();
    } else {
      showToast('Please enter a valid license plate number.', 'warning', 3000);
    }
  });
}
