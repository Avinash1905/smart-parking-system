/**
 * User Profile & Account Settings Modal
 * Enables managing profile information, contact number, corporate credentials, and security password updates.
 */

import { authService } from '../data/authService.js';
import { showToast } from './toast.js';

export function openUserProfileModal(onUpdated) {
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

  const user = authService.getCurrentUser() || {
    name: "Avinash Sharma",
    email: "demo@smartpark.com",
    companyName: "TCS (Tata Consultancy Services)",
    employeeId: "TCS-1024",
    phone: "+91 9876543210"
  };

  const modalHtml = `
    <div class="modal-overlay active" id="modal-prof-overlay">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div>
            <span class="badge badge-public" style="margin-bottom: 4px;">Account Settings</span>
            <h3 class="modal-title">My Profile & Security</h3>
          </div>
          <button type="button" class="modal-close" id="modal-prof-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 20px;">
          <form id="form-user-profile">
            <!-- Personal Info -->
            <div class="input-group" style="margin-bottom: 12px;">
              <label class="input-label" for="prof-name-input">Full Name</label>
              <input type="text" id="prof-name-input" class="input-control" value="${user.name}" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div class="input-group">
                <label class="input-label" for="prof-email-input">Email Address</label>
                <input type="email" id="prof-email-input" class="input-control" value="${user.email}" disabled />
              </div>
              <div class="input-group">
                <label class="input-label" for="prof-phone-input">Mobile Number</label>
                <input type="tel" id="prof-phone-input" class="input-control" value="${user.phone || '+91 98765 43210'}" />
              </div>
            </div>

            <!-- Corporate Credentials Box -->
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 16px;">
              <div style="font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">
                Corporate Affiliation
              </div>
              <div style="font-size: 0.84rem; color: var(--text-secondary);">
                ${user.companyName ? `<strong>${user.companyName}</strong> (ID: ${user.employeeId || 'Verified'})` : 'No corporate affiliation linked.'}
              </div>
            </div>

            <!-- Security Password Change -->
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Update Password</h4>
            <div class="input-group" style="margin-bottom: 16px;">
              <input type="password" id="prof-pass-input" class="input-control" placeholder="Enter new password (min. 8 characters)" minlength="8" />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-prof-close').addEventListener('click', closeModal);
  document.getElementById('modal-prof-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-prof-overlay') closeModal();
  });

  document.getElementById('form-user-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('prof-name-input').value.trim();
    const newPhone = document.getElementById('prof-phone-input').value.trim();

    if (user) {
      user.name = newName;
      user.phone = newPhone;
      authService.saveCurrentUser(user);
    }

    showToast("Profile settings updated successfully!", "success", 2000);
    if (onUpdated) onUpdated(user);
    closeModal();
  });
}
