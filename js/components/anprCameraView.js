/**
 * SmartPark Live ANPR Camera OCR & Boom Barrier Monitor Component
 * Displays simulated real-time computer vision camera feeds, plate bounding boxes, and OCR telemetry.
 */

import { showToast } from './toast.js';

export function renderANPRCameraMonitor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const recentCaptures = [
    { id: "anpr-01", cam: "CAM-NORTH-01", loc: "North Barrier Gate #1", plate: "KA-01-MJ-5890", score: "99.2%", status: "AUTHORIZED", time: "Just now" },
    { id: "anpr-02", cam: "CAM-SOUTH-02", loc: "South Barrier Gate #2", plate: "KA-51-AB-7711", score: "98.7%", status: "AUTHORIZED", time: "2 mins ago" },
    { id: "anpr-03", cam: "CAM-PVT-01", loc: "TCS Deck Entry Barrier", plate: "AP-39-AB-1234", score: "97.4%", status: "VIOLATION_FLAGGED", time: "14 mins ago" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
            📷 Optical License Plate Recognition
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">ANPR Video Stream & Gate Actuator</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Sub-50ms OCR recognition pipeline with automated boom barrier solenoid actuation.</p>
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-anpr-scan">
          ⚡ Force Camera Capture Frame
        </button>
      </div>

      <!-- Live Video Feed Mock Viewport -->
      <div style="background: #090d16; border: 2px solid #1f2937; border-radius: var(--radius-xl); padding: 24px; margin-bottom: 20px; position: relative; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="pulse-dot" style="background: #ef4444;"></span>
            <span style="font-family: monospace; font-size: 0.84rem; font-weight: 800; color: #ffffff;">LIVE FEED: CAM-NORTH-01 (1080p 60FPS)</span>
          </div>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.2); color: #10b981;">OCR ENGINE ONLINE</span>
        </div>

        <!-- Camera Frame with Bounding Box Overlay -->
        <div style="height: 180px; background: #111827; border: 1.5px dashed #374151; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; position: relative;">
          <!-- Bounding Box -->
          <div style="border: 2px solid #10b981; border-radius: 6px; padding: 8px 18px; background: rgba(16,185,129,0.1); text-align: center;">
            <span style="font-family: monospace; font-size: 0.72rem; color: #10b981; display: block; font-weight: 800;">BOUNDING BOX (CONFIDENCE: 99.2%)</span>
            <span style="font-family: 'Courier New', monospace; font-size: 1.6rem; font-weight: 900; color: #ffffff; letter-spacing: 0.12em;">KA-01-MJ-5890</span>
          </div>
        </div>
      </div>

      <!-- Recent ANPR Events Table -->
      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Capture Ref</th>
              <th>Camera ID</th>
              <th>Detected Plate</th>
              <th>OCR Confidence</th>
              <th>Gate Barrier Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${recentCaptures.map(c => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <td><span style="font-family: monospace;">${c.cam}</span></td>
                <td><strong style="font-family: monospace; color: var(--primary-600); font-size: 0.95rem;">${c.plate}</strong></td>
                <td><strong style="color: var(--status-high-text);">${c.score}</strong></td>
                <td>
                  <span class="history-status-badge ${c.status === 'AUTHORIZED' ? 'badge-status-active' : 'badge-viol-open'}">
                    ${c.status === 'AUTHORIZED' ? '✓ GATE LIFTED' : '✕ BREACH FLAGGED'}
                  </span>
                </td>
                <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${c.time}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-trigger-anpr-scan').addEventListener('click', () => {
    showToast("Captured live video frame! License plate OCR matched with active reservation.", "success", 2500);
  });
}
