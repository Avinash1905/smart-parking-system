/**
 * Private Parking Vector Map Component
 * Reuses the SVG city vector map with corporate parking markers, authorization badges, and preview overlay
 */

export function initPrivateParkingMap(
  containerId, 
  zones, 
  selectedZoneId, 
  currentUserSession, 
  onSelectZone, 
  onViewDetails, 
  onReserve, 
  onRequestVisitorAccess,
  onNavigatePublic
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let zoomLevel = 1;

  function render() {
    const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

    const isAuthorized = selectedZone && currentUserSession && 
      (selectedZone.parkingType === 'EMPLOYEE' && selectedZone.allowedCompanies.includes(currentUserSession.companyId));
    const isVisitor = selectedZone && selectedZone.parkingType === 'VISITOR';

    container.innerHTML = `
      <div class="map-wrapper" id="pvt-map-wrapper">
        <svg class="map-svg-canvas" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet" id="pvt-map-canvas-svg">
          <defs>
            <pattern id="pvt-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.08"/>
            </pattern>
            <filter id="pvt-marker-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.35)"/>
            </filter>
          </defs>

          <!-- Background Canvas -->
          <rect width="1000" height="750" fill="var(--bg-map-canvas)" />
          <rect width="1000" height="750" fill="url(#pvt-grid-pattern)" style="color: var(--text-primary);" />

          <!-- Tech Parks & SEZ Districts -->
          <path d="M 60 70 Q 260 40 420 110 T 470 340 L 70 310 Z" fill="var(--bg-map-building)" opacity="0.6"/>
          <path d="M 510 50 L 890 80 L 930 370 L 590 350 Z" fill="var(--bg-map-building)" opacity="0.6"/>
          <path d="M 110 410 L 470 390 L 430 690 L 90 670 Z" fill="var(--bg-map-building)" opacity="0.6"/>
          <path d="M 550 420 L 950 400 L 920 710 L 570 690 Z" fill="var(--bg-map-building)" opacity="0.6"/>

          <!-- Green Zones -->
          <path d="M 310 170 Q 370 140 410 210 T 350 290 Z" fill="var(--bg-map-park)" opacity="0.8"/>
          <path d="M 670 490 Q 770 470 810 550 T 710 630 Z" fill="var(--bg-map-park)" opacity="0.8"/>

          <!-- Water Canal -->
          <path d="M 0 520 C 300 480, 450 580, 1000 460 L 1000 520 C 450 640, 300 540, 0 580 Z" fill="var(--bg-map-water)" opacity="0.75"/>

          <!-- Avenues -->
          <path d="M 0 160 L 1000 160" stroke="var(--bg-map-road)" stroke-width="26" stroke-linecap="round"/>
          <path d="M 0 160 L 1000 160" stroke="#6366f1" stroke-width="2" stroke-dasharray="8 8" opacity="0.6"/>

          <path d="M 0 380 L 1000 380" stroke="var(--bg-map-road)" stroke-width="32" stroke-linecap="round"/>
          <path d="M 0 380 L 1000 380" stroke="#6366f1" stroke-width="2" stroke-dasharray="10 10" opacity="0.7"/>

          <path d="M 0 620 L 1000 620" stroke="var(--bg-map-road)" stroke-width="24" stroke-linecap="round"/>

          <path d="M 220 0 L 220 750" stroke="var(--bg-map-road)" stroke-width="24" stroke-linecap="round"/>
          <path d="M 500 0 L 500 750" stroke="var(--bg-map-road)" stroke-width="34" stroke-linecap="round"/>
          <path d="M 500 0 L 500 750" stroke="#6366f1" stroke-width="2" stroke-dasharray="10 10" opacity="0.7"/>
          <path d="M 780 0 L 780 750" stroke="var(--bg-map-road)" stroke-width="26" stroke-linecap="round"/>

          <!-- Secondary Roads -->
          <path d="M 80 0 L 80 750" stroke="var(--bg-map-road)" stroke-width="12" opacity="0.7"/>
          <path d="M 360 0 L 360 750" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 640 0 L 640 750" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 910 0 L 910 750" stroke="var(--bg-map-road)" stroke-width="12" opacity="0.7"/>
          <path d="M 0 280 L 1000 280" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>
          <path d="M 0 490 L 1000 490" stroke="var(--bg-map-road)" stroke-width="14" opacity="0.8"/>

          <!-- Corporate Transit Loop -->
          <path d="M 0 340 C 400 340, 620 200, 1000 120" fill="none" stroke="#06b6d4" stroke-width="4" stroke-dasharray="6 4" opacity="0.85"/>

          <!-- User Location -->
          <g transform="translate(490, 390)">
            <circle r="22" fill="rgba(79, 70, 229, 0.25)" class="marker-pulse-ring"/>
            <circle r="9" fill="#4f46e5" stroke="#ffffff" stroke-width="3"/>
            <text y="-14" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-weight="700" font-family="Plus Jakarta Sans">You Are Here</text>
          </g>

          <!-- Private Parking Markers -->
          <g id="pvt-map-markers-group">
            ${zones.map(zone => {
              const posX = zone.mapX * 10;
              const posY = zone.mapY * 7.5;
              const isSelected = zone.id === selectedZoneId;

              let markerColor = '#10b981'; // high
              let haloColor = 'rgba(16, 185, 129, 0.4)';
              if (zone.availabilityStatus === 'MEDIUM') {
                markerColor = '#f59e0b';
                haloColor = 'rgba(245, 158, 11, 0.4)';
              } else if (zone.availabilityStatus === 'LOW') {
                markerColor = '#ef4444';
                haloColor = 'rgba(239, 68, 68, 0.4)';
              }

              return `
                <g class="map-marker ${isSelected ? 'active-marker' : ''}" data-id="${zone.id}" transform="translate(${posX}, ${posY})">
                  <circle r="${isSelected ? '28' : '16'}" fill="${haloColor}" class="marker-pulse-ring"/>
                  <circle r="${isSelected ? '16' : '13'}" fill="${markerColor}" stroke="#ffffff" stroke-width="${isSelected ? '3.5' : '2.5'}" filter="url(#pvt-marker-glow)" class="marker-pin"/>
                  <text y="4" text-anchor="middle" fill="#ffffff" font-size="${isSelected ? '11' : '9'}" font-weight="900" font-family="Plus Jakarta Sans" pointer-events="none">🏢</text>
                  
                  <g transform="translate(0, ${isSelected ? '-24' : '-20'})" pointer-events="none">
                    <rect x="-34" y="-12" width="68" height="18" rx="9" fill="var(--bg-surface)" stroke="${markerColor}" stroke-width="1.5" filter="url(#pvt-marker-glow)"/>
                    <text y="1" text-anchor="middle" fill="var(--text-primary)" font-size="8.5" font-weight="800" font-family="Plus Jakarta Sans">${zone.companyName} • ${zone.availableSpaces} bays</text>
                  </g>
                </g>
              `;
            }).join('')}
          </g>
        </svg>

        <!-- Map Navigation Controls -->
        <div class="map-controls">
          <button type="button" class="map-ctrl-btn" id="pvt-map-btn-zoom-in" title="Zoom In">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button type="button" class="map-ctrl-btn" id="pvt-map-btn-zoom-out" title="Zoom Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button type="button" class="map-ctrl-btn" id="pvt-map-btn-recenter" title="Recenter to Location">
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
            <span>Limited (5-20)</span>
          </div>
          <div class="legend-item">
            <span class="status-dot" style="background:#ef4444;"></span>
            <span>Low (<5)</span>
          </div>
        </div>

        <!-- Selected Parking Preview Popup Overlay -->
        ${selectedZone ? `
          <div class="map-preview-popup" id="pvt-map-preview-popup">
            <div class="preview-top">
              <div class="card-badges">
                <span class="badge badge-public" style="font-size:0.68rem; padding: 2px 6px;">${selectedZone.companyName}</span>
                <span class="status-indicator ${selectedZone.availabilityStatus === 'HIGH' ? 'status-high' : selectedZone.availabilityStatus === 'MEDIUM' ? 'status-med' : 'status-low'}" style="font-size:0.72rem; padding: 2px 8px;">
                  <span class="status-dot"></span>
                  ${selectedZone.availableSpaces} Available
                </span>
              </div>
              <button type="button" class="preview-close" id="pvt-preview-close-btn" title="Close Preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <h4 class="preview-title">${selectedZone.name}</h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">${selectedZone.address}</p>

            <div class="preview-details-grid">
              <div><strong>Distance:</strong> ${selectedZone.distanceKm} km (~${selectedZone.walkingMinutes} min walk)</div>
              <div><strong>Rate:</strong> ₹${selectedZone.pricePerHour}/hr</div>
              <div style="grid-column: span 2; color: var(--primary-600); font-size: 0.78rem;">
                ${isAuthorized ? '✓ Verified Employee Access' : isVisitor ? 'ℹ Visitor Access Required' : '🔒 Authorization Clearance Required'}
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button type="button" class="btn btn-secondary btn-sm" id="pvt-map-preview-details" style="flex:1;">Details</button>
              ${isAuthorized ? `
                <button type="button" class="btn btn-primary btn-sm" id="pvt-map-preview-reserve" style="flex:1.2;">Reserve</button>
              ` : isVisitor ? `
                <button type="button" class="btn btn-primary btn-sm" id="pvt-map-preview-visitor" style="flex:1.2; background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);">Visitor Pass</button>
              ` : `
                <button type="button" class="btn btn-outline btn-sm" id="pvt-map-preview-public" style="flex:1.2;">Public Bays</button>
              `}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Marker click
    container.querySelectorAll('.map-marker').forEach(marker => {
      marker.addEventListener('click', () => {
        const id = marker.getAttribute('data-id');
        onSelectZone(id);
      });
    });

    // Close preview
    const closeBtn = document.getElementById('pvt-preview-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const popup = document.getElementById('pvt-map-preview-popup');
        if (popup) popup.style.display = 'none';
      });
    }

    // Action buttons inside preview
    const detailsBtn = document.getElementById('pvt-map-preview-details');
    if (detailsBtn && selectedZone) {
      detailsBtn.addEventListener('click', () => onViewDetails(selectedZone.id));
    }
    const reserveBtn = document.getElementById('pvt-map-preview-reserve');
    if (reserveBtn && selectedZone) {
      reserveBtn.addEventListener('click', () => onReserve(selectedZone.id));
    }
    const visitorBtn = document.getElementById('pvt-map-preview-visitor');
    if (visitorBtn && selectedZone) {
      visitorBtn.addEventListener('click', () => onRequestVisitorAccess(selectedZone.id));
    }
    const publicBtn = document.getElementById('pvt-map-preview-public');
    if (publicBtn) {
      publicBtn.addEventListener('click', onNavigatePublic);
    }

    // Zoom buttons
    const zoomIn = document.getElementById('pvt-map-btn-zoom-in');
    const zoomOut = document.getElementById('pvt-map-btn-zoom-out');
    const recenter = document.getElementById('pvt-map-btn-recenter');
    const svgEl = document.getElementById('pvt-map-canvas-svg');

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
