/**
 * SmartPark Open Mobility Data (MDS & GBFS) Export Component
 * Public and municipal API endpoint feeds conforming to the Mobility Data Specification.
 */

import { showToast } from './toast.js';

export function renderOpenMobilityData(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="badge badge-public" style="background: rgba(99,102,241,0.15); color: var(--primary-600); margin-bottom: 4px;">
            🌐 Open Civic Data API
          </span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">Mobility Data Specification (MDS 2.0) Feed</h2>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">Standardized curb-space API feed for municipal transit authorities, Google Maps, and navigation apps.</p>
        </div>

        <button type="button" class="btn btn-primary btn-sm" id="btn-copy-mds-feed">
          📋 Copy Live MDS JSON Endpoint
        </button>
      </div>

      <!-- JSON Preview Box -->
      <div style="background: #090d16; border: 1.5px solid #1f2937; border-radius: var(--radius-lg); padding: 18px; margin-bottom: 20px; font-family: monospace; font-size: 0.8125rem; color: #38bdf8; overflow-x: auto;">
        <pre>{
  "version": "MDS-Curb-2.0.0",
  "ttl": 15,
  "data": {
    "parking_facilities_count": 24,
    "total_curb_spaces": 1640,
    "realtime_spaces_available": 842,
    "api_endpoint": "https://api.smartpark.io/v2/curb/mds.json"
  }
}</pre>
      </div>
    </div>
  `;

  document.getElementById('btn-copy-mds-feed').addEventListener('click', () => {
    showToast("MDS Feed URL copied to clipboard: https://api.smartpark.io/v2/curb/mds.json", "success", 2500);
  });
}
