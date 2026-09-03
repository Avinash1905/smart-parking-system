/**
 * SmartPark Dynamic Toast Notification Component
 */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'smartpark-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'info', duration = 3500) {
  ensureToastContainer();

  const toast = document.createElement('div');
  toast.className = `smartpark-toast toast-${type}`;
  toast.style.cssText = `
    min-width: 280px;
    max-width: 420px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 14px 18px;
    box-shadow: var(--shadow-xl);
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    font-family: var(--font-family);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  let iconSvg = '';
  if (type === 'success') {
    toast.style.borderLeft = '4px solid #10b981';
    iconSvg = `<span style="color: #10b981;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>`;
  } else if (type === 'error') {
    toast.style.borderLeft = '4px solid #ef4444';
    iconSvg = `<span style="color: #ef4444;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>`;
  } else if (type === 'warning') {
    toast.style.borderLeft = '4px solid #f59e0b';
    iconSvg = `<span style="color: #f59e0b;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>`;
  } else {
    toast.style.borderLeft = '4px solid var(--primary-600)';
    iconSvg = `<span style="color: var(--primary-600);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex: 1; line-height: 1.4;">${message}</div>
    <button type="button" style="background:none; border:none; color: var(--text-muted); cursor:pointer; padding:4px;" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  const closeBtn = toast.querySelector('button');
  const removeToast = () => {
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  };

  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
}
