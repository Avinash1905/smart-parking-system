/**
 * Admin Security Audit Logs Component
 * Displays system security events, tariff updates, user logins, and violation actions with filtering.
 */

export function renderAuditLogs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sampleLogs = [
    { id: "aud-101", action: "USER_LOGIN_SUCCESS", user: "demo@smartpark.com", role: "USER", ip: "192.168.1.45", time: "5 mins ago", details: "Corporate TCS session initialized" },
    { id: "aud-102", action: "RESERVATION_CREATED", user: "demo@smartpark.com", role: "USER", ip: "192.168.1.45", time: "15 mins ago", details: "Slot A-24 booked at Municipal Central" },
    { id: "aud-103", action: "VIOLATION_UPDATED", user: "admin@smartpark.com", role: "ADMIN", ip: "10.0.0.1", time: "2 hours ago", details: "Notice V-1027 set to RESOLVED" },
    { id: "aud-104", action: "PARKING_ZONE_CREATED", user: "admin@smartpark.com", role: "ADMIN", ip: "10.0.0.1", time: "1 day ago", details: "Municipal Central Parking configuration saved" },
    { id: "aud-105", action: "ANPR_BARRIER_EVENT", user: "system@iot.local", role: "SYSTEM", ip: "172.16.0.4", time: "2 days ago", details: "Barrier #2 license plate match confirmed" }
  ];

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
            🔒 Immutable Audit Trail
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Security & System Audit Logs</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Comprehensive history of authentication, parking allocations, and administrative interventions.</p>
        </div>

        <button type="button" class="btn btn-secondary btn-sm" id="btn-export-audit-csv">
          Export Audit Trail (CSV)
        </button>
      </div>

      <div class="admin-table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Action / Event</th>
              <th>Triggered By</th>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Event Details</th>
            </tr>
          </thead>
          <tbody>
            ${sampleLogs.map(l => `
              <tr>
                <td><strong>${l.id}</strong></td>
                <td>
                  <span class="badge" style="background: rgba(99,102,241,0.1); color: var(--primary-600); font-size: 0.72rem;">
                    ${l.action}
                  </span>
                </td>
                <td>
                  <strong>${l.user}</strong>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${l.role}</div>
                </td>
                <td><span style="font-family: monospace; font-size: 0.8125rem;">${l.ip}</span></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${l.time}</span></td>
                <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${l.details}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
