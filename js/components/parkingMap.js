/**
 * Interactive Public Parking Vector Map Component
 * Renders street map, dynamic availability markers, zoom controls, and selected preview popup
 */

export function initParkingMap(containerId, zones, selectedZoneId, onSelectZone, onViewDetails, onReserve) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;

  function render() {
    const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

    container.innerHTML = `
      <div class="map-wrapper" id="map-wrapper">
        <!-- SVG Vector City Canvas -->
        <svg class="map-svg-canvas" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet" id="map-canvas-svg">
          <defs>
            <!-- Grid Patterns -->
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.08"/>
            </pattern>
            <!-- Drop Shadow for Markers -->
            <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.35)"/>
            </filter>
          </defs>

          <!-- Background Canvas -->
          <rect width="1000" height="750" fill="var(--bg-map-canvas)" />
          <rect width="1000" height="750" fill="url(#grid-pattern)" style="color: var(--text-primary);" />

          <!-- Urban Districts & Parks -->
          <path d="M 50 80 Q 250 50 400 120 T 450 350 L 80 320 Z" fill="var(--bg-map-building)" opacity="0.6" rx="10"/>
          <path d="M 520 60 L 880 90 L 920 380 L 600 360 Z" fill="var(--bg-map-building)" opacity="0.6"/>
          <path d="M 120 420 L 460 400 L 420 680 L 100 660 Z" fill="var(--bg-map-building)" opacity="0.6"/>
          <path d="M 560 430 L 940 410 L 910 700 L 580 680 Z" fill="var(--bg-map-building)" opacity="0.6"/>

          <!-- Green Civic Parks -->
          <path d="M 320 180 Q 380 150 420 220 T 360 300 Z" fill="var(--bg-map-park)" opacity="0.8"/>
          <path d="M 680 500 Q 780 480 820 560 T 720 640 Z" fill="var(--bg-map-park)" opacity="0.8"/>

          <!-- River / Waterway -->
          <path d="M 0 520 C 300 480, 450 580, 1000 460 L 1000 520 C 450 640, 300 540, 0 580 Z" fill="var(--bg-map-water)" opacity="0.75"/>

          <!-- Major Expressways & Avenues -->
          <!-- Horizontal Major Arterials -->
          <path d="M 0 160 L 1000 160" stroke="var(--bg-map-road)" stroke-width="26" stroke-linecap="round"/>
          <path d="M 0 160 L 1000 160" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 8" opacity="0.6"/>

          <path d="M 0 380 L 1000 380" stroke="var(--bg-map-road)" stroke-width="32" stroke-linecap="round"/>
          <path d="M 0 380 L 1000 380" stroke="#f59e0b" stroke-width="2" stroke-dasharray="10 10" opacity="0.7"/>

          <path d="M 0 620 L 1000 620" stroke="var(--bg-map-road)" stroke-width="24" stroke-linecap="round"/>

          <!-- Vertical Major Avenues -->
          <path d="M 220 0 L 220 750" stroke="var(--bg-map-road)" stroke-width="24" stroke-linecap="round"/>
          <path d="M 500 0 L 500 750" stroke="var(--bg-map-road)" stroke-width="34" stroke-linecap="round"/>
          <path d="M 500 0 L 500 750" stroke="#f59e0b" stroke-width="2" stroke-dasharray="10 10" opacity="0.7"/>
          <path d="M 780 0 L 780 750" stroke="var(--bg-map-road)" stroke-width="26" stroke-linecap="round"/>

          <!-- Secondary Streets & Junctions -->
          <path d="M 80 0 L 80 750" stroke="var(--bg-map-road)" stroke-width="12" opacity="0.7"/>
          <path d="M 360 0 L 360 750" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 640 0 L 640 750" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 910 0 L 910 750" stroke="var(--bg-map-road)" stroke-width="12" opacity="0.7"/>
          <path d="M 0 280 L 1000 280" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 0 490 L 1000 490" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>

          <!-- Metro Transit Line (Purple Dashed) -->
          <path d="M 0 320 C 350 320, 600 220, 1000 100" fill="none" stroke="#8b5cf6" stroke-width="4" stroke-dasharray="6 4" opacity="0.85"/>

          <!-- User Current Location -->
          <g transform="translate(490, 390)">
            <circle r="22" fill="rgba(59, 130, 246, 0.25)" class="marker-pulse-ring"/>
            <circle r="9" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
            <text y="-14" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-weight="700" font-family="Plus Jakarta Sans">You Are Here</text>
          </g>

          <!-- Parking Markers -->
          <g id="map-markers-group">
            ${zones.map(zone => {
              const posX = zone.mapX * 10;
              const posY = zone.mapY * 7.5;
              const isSelected = zone.id === selectedZoneId;

              let markerColor = '#10b981'; // green
              let haloColor = 'rgba(16, 185, 129, 0.4)';
              if (zone.availabilityStatus === 'MEDIUM') {
                markerColor = '#f59e0b'; // amber
                haloColor = 'rgba(245, 158, 11, 0.4)';
              } else if (zone.availabilityStatus === 'LOW') {
                markerColor = '#ef4444'; // red
                haloColor = 'rgba(239, 68, 68, 0.4)';
              }

              return `
                <g class="map-marker ${isSelected ? 'active-marker' : ''}" data-id="${zone.id}" transform="translate(${posX}, ${posY})">
                  <!-- Pulsing halo -->
                  <circle r="${isSelected ? '28' : '16'}" fill="${haloColor}" class="marker-pulse-ring"/>
                  
                  <!-- Main Pin Body -->
                  <circle r="${isSelected ? '16' : '13'}" fill="${markerColor}" stroke="#ffffff" stroke-width="${isSelected ? '3.5' : '2.5'}" filter="url(#marker-glow)" class="marker-pin"/>
                  
                  <!-- Inner 'P' Symbol -->
                  <text y="4" text-anchor="middle" fill="#ffffff" font-size="${isSelected ? '12' : '10'}" font-weight="900" font-family="Plus Jakarta Sans" pointer-events="none">P</text>
                  
                  <!-- Availability Pill Badge -->
                  <g transform="translate(0, ${isSelected ? '-24' : '-20'})" pointer-events="none">
                    <rect x="-30" y="-12" width="60" height="18" rx="9" fill="var(--bg-surface)" stroke="${markerColor}" stroke-width="1.5" filter="url(#marker-glow)"/>
                    <text y="1" text-anchor="middle" fill="var(--text-primary)" font-size="9" font-weight="800" font-family="Plus Jakarta Sans">${zone.availableSpaces} bays</text>
                  </g>
                </g>
              `;
            }).join('')}
          </g>
        </svg>

        <!-- Map Navigation Controls -->
        <div class="map-controls">
          <button type="button" class="map-ctrl-btn" id="map-btn-zoom-in" title="Zoom In">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button type="button" class="map-ctrl-btn" id="map-btn-zoom-out" title="Zoom Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button type="button" class="map-ctrl-btn" id="map-btn-recenter" title="Recenter to Location">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
          </button>
        </div>

        <!-- Map Legend -->
        <div class="map-legend">
          <div class="legend-item">
            <span class="status-dot" style="background:#10b981;"></span>
            <span>High (>20)</span>
          </div>
          <div class="legend-item">
            <span class="status-dot" style="background:#f59e0b;"></span>
            <span>Moderate (10-20)</span>
          </div>
          <div class="legend-item">
            <span class="status-dot" style="background:#ef4444;"></span>
            <span>Low (<10)</span>
          </div>
        </div>

        <!-- Selected Parking Preview Popup Overlay -->
        ${selectedZone ? `
          <div class="map-preview-popup" id="map-preview-popup">
            <div class="preview-top">
              <div class="card-badges">
                <span class="badge badge-public" style="font-size:0.68rem; padding: 2px 6px;">Public</span>
                <span class="status-indicator ${selectedZone.availabilityStatus === 'HIGH' ? 'status-high' : selectedZone.availabilityStatus === 'MEDIUM' ? 'status-med' : 'status-low'}" style="font-size:0.72rem; padding: 2px 8px;">
                  <span class="status-dot"></span>
                  ${selectedZone.availableSpaces} Available
                </span>
              </div>
              <button type="button" class="preview-close" id="preview-close-btn" title="Close Preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <h4 class="preview-title">${selectedZone.name}</h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">${selectedZone.address}</p>

            <div class="preview-details-grid">
              <div><strong>Distance:</strong> ${selectedZone.distanceKm} km (~${selectedZone.walkingMinutes} min walk)</div>
              <div><strong>Rate:</strong> ₹${selectedZone.pricePerHour}/hr</div>
              <div style="grid-column: span 2; color: var(--primary-600); font-size: 0.78rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${selectedZone.predictionMessage}
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button type="button" class="btn btn-secondary btn-sm" id="map-preview-details" style="flex:1;">Details</button>
              <button type="button" class="btn btn-primary btn-sm" id="map-preview-reserve" style="flex:1;">Reserve</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Marker click handlers
    container.querySelectorAll('.map-marker').forEach(marker => {
      marker.addEventListener('click', () => {
        const id = marker.getAttribute('data-id');
        onSelectZone(id);
      });
    });

    // Preview close button
    const closeBtn = document.getElementById('preview-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const popup = document.getElementById('map-preview-popup');
        if (popup) popup.style.display = 'none';
      });
    }

    // Preview Details & Reserve buttons
    const previewDetails = document.getElementById('map-preview-details');
    if (previewDetails && selectedZone) {
      previewDetails.addEventListener('click', () => onViewDetails(selectedZone.id));
    }
    const previewReserve = document.getElementById('map-preview-reserve');
    if (previewReserve && selectedZone) {
      previewReserve.addEventListener('click', () => onReserve(selectedZone.id));
    }

    // Zoom Buttons
    const zoomIn = document.getElementById('map-btn-zoom-in');
    const zoomOut = document.getElementById('map-btn-zoom-out');
    const recenter = document.getElementById('map-btn-recenter');
    const svgEl = document.getElementById('map-canvas-svg');

    if (zoomIn && svgEl) {
      zoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.25, 2.0);
        svgEl.style.transform = `scale(${zoomLevel})`;
        svgEl.style.transition = 'transform 0.3s ease';
      });
    }
    if (zoomOut && svgEl) {
      zoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.25, 0.8);
        svgEl.style.transform = `scale(${zoomLevel})`;
        svgEl.style.transition = 'transform 0.3s ease';
      });
    }
    if (recenter && svgEl) {
      recenter.addEventListener('click', () => {
        zoomLevel = 1;
        svgEl.style.transform = `scale(1)`;
      });
    }
  }

  render();

  return {
    update: (newSelectedZoneId) => {
      selectedZoneId = newSelectedZoneId;
      render();
    }
  };
}
