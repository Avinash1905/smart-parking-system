/**
 * Notification Center Component
 * Displays interactive in-app notifications drawer, unread counter pill, and mark-read controls.
 */

import { authService } from '../data/authService.js';
import { showToast } from './toast.js';

let notifications = [
  {
    id: "notif-01",
    title: "Reservation Confirmed",
    message: "Your slot M-24 at Municipal Central Parking is booked for 2 hours.",
    type: "SUCCESS",
    isRead: false,
    time: "10 mins ago",
    url: "#/dashboard"
  },
  {
    id: "notif-02",
    title: "Corporate Access Verified",
    message: "TCS Corporate Parking Deck Alpha access is active for KA-01-MJ-5890.",
    type: "INFO",
    isRead: false,
    time: "2 hours ago",
    url: "#/parking/private"
  },
  {
    id: "notif-03",
    title: "Parking Reminder",
    message: "Your booking at Municipal Central Parking will expire in 45 minutes.",
    type: "WARNING",
    isRead: true,
    time: "Yesterday",
    url: "#/dashboard"
  }
];

export function initNotificationCenter() {
  const container = document.getElementById('navbar-actions');
  const user = authService.getCurrentUser();
  if (!user) return;

  // Check unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    getUnreadCount: () => notifications.filter(n => !n.isRead).length,
    openDrawer: () => openNotificationDrawer()
  };
}

export function openNotificationDrawer() {
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const modalHtml = `
    <div class="modal-overlay active" id="modal-notif-overlay">
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h3 class="modal-title">Notifications</h3>
            ${unreadCount > 0 ? `<span class="badge" style="background:#ef4444; color:#fff; font-size:0.7rem;">${unreadCount} New</span>` : ''}
          </div>
          <button type="button" class="modal-close" id="modal-notif-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body" style="padding: 16px 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <span style="font-size: 0.8125rem; color: var(--text-muted);">Real-time parking updates</span>
            <button type="button" class="btn btn-ghost btn-sm" id="btn-mark-all-read" style="font-size: 0.78rem;">Mark all as read</button>
          </div>

          <div id="notif-list-container">
            ${notifications.map(n => `
              <div class="notif-item-card ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
                <div style="font-size: 1.2rem;">
                  ${n.type === 'SUCCESS' ? '🟢' : n.type === 'WARNING' ? '⚠️' : 'ℹ️'}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <strong style="font-size: 0.875rem; color: var(--text-primary);">${n.title}</strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${n.time}</span>
                  </div>
                  <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.4;">${n.message}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" id="modal-notif-close-btn" style="width: 100%;">Close</button>
        </div>
      </div>
    </div>
  `;

  modalContainer.innerHTML = modalHtml;

  document.getElementById('modal-notif-close').addEventListener('click', closeModal);
  document.getElementById('modal-notif-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-notif-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-notif-overlay') closeModal();
  });

  document.getElementById('btn-mark-all-read').addEventListener('click', () => {
    notifications.forEach(n => n.isRead = true);
    document.querySelectorAll('.notif-item-card').forEach(c => c.classList.remove('unread'));
    showToast("All notifications marked as read.", "info", 1500);
  });
}
