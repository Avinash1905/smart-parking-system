/**
 * Dedicated Signup View Component
 * Handles new account registration with comprehensive validation:
 * Name, Email format, Password strength, Password match, Vehicle info,
 * and Optional Company affiliation.
 */

import { authService } from '../data/authService.js';
import { adminService } from '../data/adminService.js';
import { showToast } from './toast.js';

export function renderSignupView(containerId, onSignupSuccess, onNavigateLogin) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const companies = adminService.getCompanies();

  container.innerHTML = `
    <div class="auth-page-wrapper">
      <div class="auth-card" style="max-width: 580px;">
        <!-- Auth Header -->
        <div class="auth-header">
          <div class="brand-icon-wrapper" style="width: 44px; height: 44px; margin: 0 auto 12px auto;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
          <h1 class="auth-title">Create Your SmartPark Account</h1>
          <p class="auth-subtitle">Register to discover live city bays, book guaranteed slots, or link corporate employee credentials.</p>
        </div>

        <!-- Dynamic Error Alert -->
        <div id="signup-error-alert" class="auth-alert" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span id="signup-error-msg">Please correct the highlighted errors.</span>
        </div>

        <!-- Signup Form -->
        <form id="smartpark-signup-form" novalidate>
          <!-- 1. Full Name & Email -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="input-group">
              <label class="input-label" for="signup-name">Full Name *</label>
              <input 
                type="text" 
                id="signup-name" 
                class="input-control" 
                placeholder="e.g. Priya Nair" 
                required 
                autocomplete="name"
              />
            </div>
            <div class="input-group">
              <label class="input-label" for="signup-email">Email Address *</label>
              <input 
                type="email" 
                id="signup-email" 
                class="input-control" 
                placeholder="priya@example.com" 
                required 
                autocomplete="email"
              />
            </div>
          </div>

          <!-- 2. Password & Confirm Password -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="input-group">
              <label class="input-label" for="signup-password">Password (min 8 chars) *</label>
              <input 
                type="password" 
                id="signup-password" 
                class="input-control" 
                placeholder="••••••••••••" 
                required 
                minlength="8"
                autocomplete="new-password"
              />
            </div>
            <div class="input-group">
              <label class="input-label" for="signup-confirm-password">Confirm Password *</label>
              <input 
                type="password" 
                id="signup-confirm-password" 
                class="input-control" 
                placeholder="••••••••••••" 
                required 
                autocomplete="new-password"
              />
            </div>
          </div>

          <!-- 3. Phone & Vehicle Type -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="input-group">
              <label class="input-label" for="signup-phone">Phone Number</label>
              <input 
                type="tel" 
                id="signup-phone" 
                class="input-control" 
                placeholder="+91 98765 43210" 
                autocomplete="tel"
              />
            </div>
            <div class="input-group">
              <label class="input-label" for="signup-vehicle-type">Primary Vehicle Type *</label>
              <select id="signup-vehicle-type" class="input-control">
                <option value="Car" selected>Four Wheeler (Car / SUV)</option>
                <option value="Car / EV">Electric Vehicle (EV Car)</option>
                <option value="Two Wheeler">Two Wheeler (Bike / Scooter)</option>
              </select>
            </div>
          </div>

          <!-- 4. Vehicle License Plate -->
          <div class="input-group" style="margin-bottom: 14px;">
            <label class="input-label" for="signup-vehicle-plate">Vehicle License Plate Number *</label>
            <input 
              type="text" 
              id="signup-vehicle-plate" 
              class="input-control" 
              placeholder="e.g. KA-03-HA-1122" 
              style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;"
              required 
            />
          </div>

          <!-- 5. Corporate Affiliation (Optional) -->
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 20px;">
            <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">
              🏢 Corporate / Campus Access (Optional)
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;">
              If your employer is a SmartPark partner, select your company to unlock reserved corporate parking decks.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="input-group">
                <label class="input-label" for="signup-company" style="font-size: 0.78rem;">Company Affiliation</label>
                <select id="signup-company" class="input-control" style="font-size: 0.84rem;">
                  <option value="none" selected>None (Public Citizen User)</option>
                  ${companies.map(c => `
                    <option value="${c.id}">${c.name}</option>
                  `).join('')}
                </select>
              </div>

              <div class="input-group" id="signup-empid-group" style="opacity: 0.5; pointer-events: none;">
                <label class="input-label" for="signup-empid" style="font-size: 0.78rem;">Employee / Corporate ID</label>
                <input 
                  type="text" 
                  id="signup-empid" 
                  class="input-control" 
                  placeholder="e.g. TCS-1024" 
                  style="font-size: 0.84rem; text-transform: uppercase;"
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary btn-lg" id="btn-signup-submit" style="width: 100%; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Create Account & Get Started
          </button>
        </form>

        <!-- Link to Separate Login Page -->
        <div class="auth-footer-prompt" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); text-align: center;">
          <span style="font-size: 0.9rem; color: var(--text-secondary);">Already have an account?</span>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-goto-login" style="font-weight: 700; color: var(--primary-600); margin-left: 6px;">
            Sign In →
          </button>
        </div>
      </div>
    </div>
  `;

  // Dynamic Company Selection Toggling
  const companySelect = document.getElementById('signup-company');
  const empGroup = document.getElementById('signup-empid-group');
  const empInput = document.getElementById('signup-empid');

  companySelect.addEventListener('change', () => {
    if (companySelect.value !== 'none') {
      empGroup.style.opacity = '1';
      empGroup.style.pointerEvents = 'auto';
      empInput.setAttribute('required', 'true');
    } else {
      empGroup.style.opacity = '0.5';
      empGroup.style.pointerEvents = 'none';
      empInput.removeAttribute('required');
      empInput.value = '';
    }
  });

  // Switch to Login
  document.getElementById('btn-goto-login').addEventListener('click', () => {
    if (onNavigateLogin) onNavigateLogin();
    else window.location.hash = '#/login';
  });

  // Form Submission
  const form = document.getElementById('smartpark-signup-form');
  const errorAlert = document.getElementById('signup-error-alert');
  const errorMsg = document.getElementById('signup-error-msg');
  const submitBtn = document.getElementById('btn-signup-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const phone = document.getElementById('signup-phone').value;
    const vehicleType = document.getElementById('signup-vehicle-type').value;
    const vehiclePlate = document.getElementById('signup-vehicle-plate').value;
    const companyId = document.getElementById('signup-company').value;
    const employeeId = document.getElementById('signup-empid').value;

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMsg.textContent = "Please enter a valid email address.";
      errorAlert.style.display = 'flex';
      return;
    }

    if (!vehiclePlate || vehiclePlate.trim().length < 4) {
      errorMsg.textContent = "Please enter a valid vehicle license plate number.";
      errorAlert.style.display = 'flex';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="pulse-dot" style="background:#fff;"></span>
      Creating your account...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Create Account & Get Started
      `;

      const result = authService.signup({
        name,
        email,
        password,
        confirmPassword,
        phone,
        vehicleType,
        vehiclePlate,
        companyId,
        employeeId
      });

      if (result.success) {
        showToast("Account created successfully! Welcome to SmartPark.", "success");
        if (onSignupSuccess) {
          onSignupSuccess(result.user);
        }
      } else {
        errorMsg.textContent = result.message;
        errorAlert.style.display = 'flex';
        showToast(result.message, "error");
      }
    }, 400);
  });
}
