/**
 * Access-Based Smart Recommendation Component for Private Parking
 * Generates dynamic recommendation cards based on user clearance status
 */

export function renderPrivateRecommendation(containerId, selectedZone, currentUserSession, onReserve, onNavigatePublic) {
  const container = document.getElementById(containerId);
  if (!container || !selectedZone) return;

  const isAuthorized = currentUserSession && selectedZone.parkingType === 'EMPLOYEE' && 
    selectedZone.allowedCompanies.includes(currentUserSession.companyId);

  if (isAuthorized) {
    container.innerHTML = `
      <div class="smart-recommendation-box smart-rec-authorized">
        <div class="rec-left-content">
          <span class="rec-badge-tag rec-badge-auth">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            94% Match • Recommended for You
          </span>
          <h3 class="rec-title">${selectedZone.name}</h3>
          <p class="rec-desc">
            ${selectedZone.availableSpaces} spaces available • ${selectedZone.distanceKm} km away (~${selectedZone.walkingMinutes} min walk). 
            <strong>${currentUserSession.companyId} Employee Access Verified</strong> (${currentUserSession.employeeId}).
          </p>
        </div>

        <div class="rec-action-wrapper">
          <button type="button" class="btn btn-primary" id="btn-rec-reserve">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Reserve Guaranteed Bay
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-rec-reserve').addEventListener('click', () => {
      onReserve(selectedZone.id);
    });
  } else {
    container.innerHTML = `
      <div class="smart-recommendation-box smart-rec-unauthorized">
        <div class="rec-left-content">
          <span class="rec-badge-tag rec-badge-unauth">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Company Authorization Required
          </span>
          <h3 class="rec-title">${selectedZone.name}</h3>
          <p class="rec-desc">
            This facility is restricted to verified ${selectedZone.companyName} personnel. If you are not an employee, you can explore nearby municipal public bays without restrictions.
          </p>
        </div>

        <div class="rec-action-wrapper">
          <button type="button" class="btn btn-primary" id="btn-rec-public">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            View Nearby Public Parking
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-rec-public').addEventListener('click', () => {
      onNavigatePublic();
    });
  }
}
