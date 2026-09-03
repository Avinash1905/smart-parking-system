/**
 * Dedicated Login View Component
 * Strictly contains Email, Password, Remember Me, Forgot Password, Login,
 * Validation against registered accounts, and a link to Create Account (/signup).
 */

import { authService } from '../data/authService.js';
import { showToast } from './toast.js';

export function renderLoginView(containerId, onLoginSuccess, onNavigateSignup) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const presets = authService.getSeedPresets();

  container.innerHTML = `
    <div class="auth-page-wrapper">
      <div class="auth-card">
        <!-- Auth Header -->
        <div class="auth-header">
          <div class="brand-icon-wrapper" style="width: 44px; height: 44px; margin: 0 auto 12px auto;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to your SmartPark account to view available spaces, manage passes, and access authorized facilities.</p>
        </div>

        <!-- Dynamic Error Alert -->
        <div id="auth-error-alert" class="auth-alert" style="display: none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span id="auth-error-msg">Invalid email or password.</span>
        </div>

        <!-- Login Form (Only Login Fields) -->
        <form id="smartpark-login-form" novalidate>
          <div class="input-group" style="margin-bottom: 16px;">
            <label class="input-label" for="login-email">Email Address</label>
            <div class="input-icon-wrapper">
              <input 
                type="email" 
                id="login-email" 
                class="input-control" 
                placeholder="name@company.com" 
                required 
                autocomplete="email"
              />
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
          </div>

          <div class="input-group" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label class="input-label" for="login-password" style="margin-bottom: 0;">Password</label>
              <a href="javascript:void(0)" id="link-forgot-password" class="auth-switch-link" style="font-size: 0.8125rem;">Forgot password?</a>
            </div>
            <div class="input-icon-wrapper">
              <input 
                type="password" 
                id="login-password" 
                class="input-control" 
                placeholder="••••••••••••" 
                required 
                autocomplete="current-password"
              />
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>

          <div class="remember-row" style="margin-bottom: 20px;">
            <label class="remember-me-label">
              <input type="checkbox" id="login-remember" checked />
              <span>Remember this device</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" id="btn-login-submit" style="width: 100%; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign In to Dashboard
          </button>
        </form>

        <!-- Link to Separate Signup Page -->
        <div class="auth-footer-prompt" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); text-align: center;">
          <span style="font-size: 0.9rem; color: var(--text-secondary);">Don't have an account?</span>
          <button type="button" class="btn btn-ghost btn-sm" id="btn-goto-signup" style="font-weight: 700; color: var(--primary-600); margin-left: 6px;">
            Create Account →
          </button>
        </div>

        <!-- Quick-Fill Demo Profiles Section -->
        <div class="demo-box" style="margin-top: 24px;">
          <div class="demo-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Quick Test Accounts:
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            ${presets.map((p, idx) => `
              <button type="button" class="btn btn-secondary btn-sm btn-fill-preset" data-email="${p.email}" data-pass="${p.password}" style="justify-content: flex-start; text-align: left; padding: 6px 10px; font-size: 0.78rem;">
                <span class="pulse-dot" style="width: 5px; height: 5px;"></span>
                <span>${p.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Forgot password alert handler
  document.getElementById('link-forgot-password').addEventListener('click', () => {
    showToast("Password reset instructions will be sent to your registered email address.", "info");
  });

  // Switch to Signup
  document.getElementById('btn-goto-signup').addEventListener('click', () => {
    if (onNavigateSignup) onNavigateSignup();
    else window.location.hash = '#/signup';
  });

  // Quick Preset Fillers
  container.querySelectorAll('.btn-fill-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const pass = btn.getAttribute('data-pass');
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = pass;
      document.getElementById('auth-error-alert').style.display = 'none';
      showToast(`Loaded ${btn.textContent.trim()} credentials.`, 'info', 2000);
    });
  });

  // Form Submission
  const form = document.getElementById('smartpark-login-form');
  const errorAlert = document.getElementById('auth-error-alert');
  const errorMsg = document.getElementById('auth-error-msg');
  const submitBtn = document.getElementById('btn-login-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-remember').checked;

    if (!email || !password) {
      errorMsg.textContent = "Please provide both your email address and password.";
      errorAlert.style.display = 'flex';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="pulse-dot" style="background:#fff;"></span>
      Verifying credentials...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Sign In to Dashboard
      `;

      const result = authService.login(email, password, rememberMe);

      if (result.success) {
        showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        errorMsg.textContent = result.message;
        errorAlert.style.display = 'flex';
        showToast(result.message, 'error');
      }
    }, 350);
  });
}
