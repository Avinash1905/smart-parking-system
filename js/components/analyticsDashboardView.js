/**
 * Admin Analytics & Reporting Component
 * Visualizes 24-hour occupancy trends, peak-hour distributions, and revenue/utilization metrics via SVG graphs.
 */

export function renderAnalyticsDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 24-hour occupancy data points (percentage 0-100)
  const hourlyOccupancy = [
    { hour: "00:00", occ: 15 }, { hour: "02:00", occ: 10 }, { hour: "04:00", occ: 8 },
    { hour: "06:00", occ: 22 }, { hour: "08:00", occ: 58 }, { hour: "09:00", occ: 84 },
    { hour: "10:00", occ: 92 }, { hour: "11:00", occ: 95 }, { hour: "12:00", occ: 88 },
    { hour: "13:00", occ: 80 }, { hour: "14:00", occ: 76 }, { hour: "15:00", occ: 79 },
    { hour: "16:00", occ: 85 }, { hour: "17:00", occ: 94 }, { hour: "18:00", occ: 98 },
    { hour: "19:00", occ: 90 }, { hour: "20:00", occ: 72 }, { hour: "21:00", occ: 54 },
    { hour: "22:00", occ: 38 }, { hour: "23:00", occ: 24 }
  ];

  // Generate SVG Path for Area Chart
  const svgWidth = 600;
  const svgHeight = 180;
  const padding = 30;

  const points = hourlyOccupancy.map((d, i) => {
    const x = padding + (i / (hourlyOccupancy.length - 1)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - (d.occ / 100) * (svgHeight - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');
  const areaD = `${pathD} L ${svgWidth - padding},${svgHeight - padding} L ${padding},${svgHeight - padding} Z`;

  container.innerHTML = `
    <!-- Top Summary Metrics Grid -->
    <div class="summary-grid" style="margin-bottom: 24px;">
      <div class="summary-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Average Daily Occupancy</span>
          <div class="kpi-value">67.4%</div>
          <span class="kpi-subtext" style="color: var(--status-high-text);">+4.2% vs last week</span>
        </div>
        <div class="kpi-icon-box kpi-icon-emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
      </div>

      <div class="summary-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Peak Demand Window</span>
          <div class="kpi-value">98%</div>
          <span class="kpi-subtext" style="color: var(--status-low-text);">05:30 PM — 06:45 PM</span>
        </div>
        <div class="kpi-icon-box kpi-icon-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>

      <div class="summary-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Average Dwell Time</span>
          <div class="kpi-value">1h 48m</div>
          <span class="kpi-subtext">Across 24 facilities</span>
        </div>
        <div class="kpi-icon-box kpi-icon-indigo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
        </div>
      </div>

      <div class="summary-kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Estimated Revenue</span>
          <div class="kpi-value">₹84,200</div>
          <span class="kpi-subtext" style="color: var(--primary-600);">Daily tariff collected</span>
        </div>
        <div class="kpi-icon-box kpi-icon-blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="analytics-grid">
      <!-- 24-Hour Area Curve -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">24-Hour City-Wide Occupancy Curve</h3>
            <span style="font-size: 0.8125rem; color: var(--text-muted);">Real-time telemetry aggregated across all municipal and private decks</span>
          </div>
          <span class="badge badge-public">Live Stream</span>
        </div>

        <div class="svg-chart-container">
          <svg class="svg-chart" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="${padding}" y1="${padding}" x2="${svgWidth - padding}" y2="${padding}" stroke="var(--border-color)" stroke-dasharray="3" />
            <line x1="${padding}" y1="${svgHeight / 2}" x2="${svgWidth - padding}" y2="${svgHeight / 2}" stroke="var(--border-color)" stroke-dasharray="3" />
            <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="var(--border-color)" />

            <!-- Area & Line -->
            <path d="${areaD}" fill="url(#areaGrad)" />
            <path d="${pathD}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />

            <!-- Highlight Peak Dot -->
            <circle cx="${svgWidth * 0.72}" cy="${svgHeight * 0.22}" r="5" fill="#ef4444" stroke="#fff" stroke-width="2" />
          </svg>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; padding: 0 10px;">
          <span>12 AM</span>
          <span>06 AM</span>
          <span>12 PM</span>
          <span style="color: #ef4444; font-weight: 800;">06 PM (Peak: 98%)</span>
          <span>11 PM</span>
        </div>
      </div>

      <!-- Peak Hour Heatmap Timeline -->
      <div class="chart-card">
        <h3 class="chart-title" style="margin-bottom: 6px;">Peak-Hour Heatmap</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Occupancy intensity per hour of day</p>

        <div class="heatmap-timeline-row">
          ${hourlyOccupancy.map(h => {
            const heightPct = h.occ;
            let barBg = 'rgba(16, 185, 129, 0.7)';
            if (h.occ >= 85) barBg = 'rgba(239, 68, 68, 0.85)';
            else if (h.occ >= 60) barBg = 'rgba(245, 158, 11, 0.8)';

            return `
              <div class="heatmap-bar-col" title="${h.hour}: ${h.occ}% Occupied">
                <div class="heatmap-bar" style="height: ${heightPct}%; background: ${barBg};"></div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 8px;">
          <span>00h</span>
          <span>08h (Morning Peak)</span>
          <span>18h (Evening Peak)</span>
          <span>23h</span>
        </div>

        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 6px;">
            <span style="color: var(--text-secondary);">Public Decks Utilization:</span>
            <strong style="color: var(--text-primary);">72.4%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.84rem;">
            <span style="color: var(--text-secondary);">Corporate Decks Utilization:</span>
            <strong style="color: var(--text-primary);">61.8%</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}
