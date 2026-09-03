/**
 * Admin IoT Hardware & Sensor Diagnostics Component
 * Real-time monitoring of ground ultrasonic studs, ANPR cameras, battery levels, and telemetry signal health.
 */

export function renderHardwareMonitor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sampleNodes = [
    { code: "SNS-101", type: "Ground Ultrasonic Stud", zone: "Municipal Central", slot: "A-01", batt: 98, status: "ONLINE", rssi: "-64 dBm" },
    { code: "SNS-102", type: "Ground Ultrasonic Stud", zone: "Municipal Central", slot: "A-02", batt: 95, status: "ONLINE", rssi: "-68 dBm" },
    { code: "ANPR-GATE-01", type: "HD Camera / Barrier", zone: "Municipal Central", slot: "North Gate", batt: 100, status: "ONLINE", rssi: "-52 dBm" },
    { code: "SNS-201", type: "Ground Ultrasonic Stud", zone: "TCS Deck Alpha", slot: "T-01", batt: 91, status: "ONLINE", rssi: "-71 dBm" },
    { code: "SNS-202", type: "EV Fast Charger Node", zone: "TCS Deck Alpha", slot: "T-02", batt: 100, status: "ONLINE", rssi: "-58 dBm" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text); margin-bottom: 4px;">
            📡 Hardware Network Diagnostic
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">IoT Sensor Grid & Gateway Monitor</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Real-time telemetry signal strength, battery degradation telemetry, and remote firmware diagnostics.</p>
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="btn-ping-all-sensors">
          ⚡ Send Global Diagnostic Ping
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Sensor Code</th>
              <th>Hardware Type</th>
              <th>Facility & Bay</th>
              <th>Battery %</th>
              <th>Signal (RSSI)</th>
              <th>Health Status</th>
            </tr>
          </thead>
          <tbody>
            ${sampleNodes.map(n => `
              <tr>
                <td><strong style="font-family: monospace; color: var(--primary-600);">${n.code}</strong></td>
                <td>${n.type}</td>
                <td><strong>${n.zone}</strong> (${n.slot})</td>
                <td><strong style="color: var(--status-high-text);">${n.batt}%</strong></td>
                <td><span style="font-family: monospace; font-size: 0.8125rem;">${n.rssi}</span></td>
                <td><span class="history-status-badge badge-status-active">● ${n.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
