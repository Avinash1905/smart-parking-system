/**
 * SmartPark Multi-Tier Deck & Floor Level Visual Picker Component
 * Facilitates intuitive switching across multi-level structures (Basement B1/B2, Ground, Upper Decks L1/L2).
 */

window.MultiFloorDeckPicker = {
  render(containerId, currentFloor = 0, onFloorChange = null) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="deck-picker-bar" style="display: flex; gap: 8px; background: #0f172a; padding: 6px; border-radius: 8px; border: 1px solid #1e293b; align-items: center;">
        <span style="font-size: 0.8rem; color: #94a3b8; padding: 0 8px; font-weight: 600;">LEVEL:</span>
        <button class="floor-btn ${currentFloor === -1 ? 'active' : ''}" data-floor="-1" 
                style="padding: 6px 14px; border-radius: 6px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: 600; background: ${currentFloor === -1 ? '#3b82f6' : '#1e293b'}; color: #fff;">
          B1 (Underground)
        </button>
        <button class="floor-btn ${currentFloor === 0 ? 'active' : ''}" data-floor="0" 
                style="padding: 6px 14px; border-radius: 6px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: 600; background: ${currentFloor === 0 ? '#3b82f6' : '#1e293b'}; color: #fff;">
          G (Ground / Street)
        </button>
        <button class="floor-btn ${currentFloor === 1 ? 'active' : ''}" data-floor="1" 
                style="padding: 6px 14px; border-radius: 6px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: 600; background: ${currentFloor === 1 ? '#3b82f6' : '#1e293b'}; color: #fff;">
          L1 (Upper Deck 1)
        </button>
        <button class="floor-btn ${currentFloor === 2 ? 'active' : ''}" data-floor="2" 
                style="padding: 6px 14px; border-radius: 6px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: 600; background: ${currentFloor === 2 ? '#3b82f6' : '#1e293b'}; color: #fff;">
          L2 (Rooftop Solar)
        </button>
      </div>
    `;

    el.querySelectorAll('.floor-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const floor = parseInt(e.currentTarget.getAttribute('data-floor'), 10);
        if (typeof onFloorChange === 'function') {
          onFloorChange(floor);
        } else if (window.Toast) {
          window.Toast.show(`Viewing parking bay grid for Floor level ${btn.innerText.trim()}.`, 'info');
        }
      });
    });
  }
};
