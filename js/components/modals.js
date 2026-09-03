/**
 * Modals Component: Zone Details & Smart Reservation with QR Pass Generator
 */

export function initModals() {
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

  // Global ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  return {
    openDetailsModal: (zone, onProceedReserve) => {
      closeModal();

      const modalHtml = `
        <div class="modal-overlay active" id="details-modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <div>
                <span class="badge badge-public" style="margin-bottom: 4px;">Public Parking • ${zone.zoneCode}</span>
                <h3 class="modal-title">${zone.name}</h3>
              </div>
              <button type="button" class="modal-close" id="modal-btn-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="modal-body">
              <!-- Location and Rating -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 0.875rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${zone.address}
                </span>
                <span style="font-size: 0.875rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ${zone.rating} (${zone.reviewsCount} reviews)
                </span>
              </div>

              <!-- Capacity & Occupancy Overview -->
              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 600; font-size: 0.875rem;">Real-Time Capacity</span>
                  <span style="font-weight: 700; color: var(--status-high-text);">${zone.availableSpaces} Available / ${zone.totalSpaces} Total</span>
                </div>
                <div class="progress-track" style="margin-bottom: 12px;">
                  <div class="progress-bar progress-high" style="width: ${(zone.availableSpaces / zone.totalSpaces) * 100}%;"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; font-size: 0.8125rem;">
                  <div style="background: var(--bg-surface); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted);">Standard Bays</div>
                    <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">${zone.totalSpaces - (zone.evSpaces || 0)}</div>
                  </div>
                  <div style="background: var(--bg-surface); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted);">EV Charging</div>
                    <div style="font-weight: 700; font-size: 1rem; color: var(--accent-cyan);">${zone.evSpaces || 0}</div>
                  </div>
                  <div style="background: var(--bg-surface); padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="color: var(--text-muted);">Accessible</div>
                    <div style="font-weight: 700; font-size: 1rem; color: var(--primary-600);">4</div>
                  </div>
                </div>
              </div>

              <!-- Tariff Breakdown -->
              <h4 style="font-size: 0.9375rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Standard Municipal Tariff</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; text-align: center;">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">First Hour</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-600);">₹${zone.tariff.firstHour}</div>
                </div>
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; text-align: center;">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Subsequent Hrs</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">₹${zone.tariff.subsequentPerHour}/hr</div>
                </div>
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; text-align: center;">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Full Day Pass</div>
                  <div style="font-size: 1.25rem; font-weight: 800; color: var(--status-high-text);">₹${zone.tariff.fullDayPass}</div>
                </div>
              </div>

              <!-- Amenities List -->
              <h4 style="font-size: 0.9375rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">Amenities & Security</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${zone.amenities.map(a => `
                  <span style="padding: 5px 12px; font-size: 0.8125rem; background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-full); color: var(--text-secondary); display: flex; align-items: center; gap: 5px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ${a}
                  </span>
                `).join('')}
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="modal-btn-cancel">Close</button>
              <button type="button" class="btn btn-primary" id="modal-btn-proceed">Reserve Slot in ${zone.zoneCode}</button>
            </div>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modalHtml;

      document.getElementById('modal-btn-close').addEventListener('click', closeModal);
      document.getElementById('modal-btn-cancel').addEventListener('click', closeModal);
      document.getElementById('details-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'details-modal-overlay') closeModal();
      });
      document.getElementById('modal-btn-proceed').addEventListener('click', () => {
        closeModal();
        if (onProceedReserve) onProceedReserve(zone.id);
      });
    },

    openReservationModal: (zone) => {
      closeModal();

      let selectedDuration = 2; // hours
      let hourlyRate = zone.pricePerHour;

      const modalHtml = `
        <div class="modal-overlay active" id="reserve-modal-overlay">
          <div class="modal-content" id="reserve-modal-box">
            <div class="modal-header">
              <div>
                <span class="badge badge-public" style="margin-bottom: 4px;">Instant Public Reservation</span>
                <h3 class="modal-title">Book Parking Slot</h3>
              </div>
              <button type="button" class="modal-close" id="modal-reserve-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="modal-body" id="reserve-step-body">
              <!-- Zone Details strip -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 18px;">
                <div>
                  <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${zone.name}</div>
                  <div style="font-size: 0.8125rem; color: var(--text-muted);">${zone.address}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary-600);">₹${hourlyRate}/hr</div>
                  <div style="font-size: 0.75rem; color: var(--status-high-text); font-weight: 600;">${zone.availableSpaces} bays left</div>
                </div>
              </div>

              <!-- Vehicle Plate Input -->
              <div class="input-group" style="margin-bottom: 14px;">
                <label class="input-label" for="res-plate">Vehicle Registration Number</label>
                <div class="input-wrapper">
                  <span class="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
                  </span>
                  <input type="text" id="res-plate" class="input-control input-with-icon" placeholder="e.g. KA-01-AB-1234" value="KA-01-MJ-5890" style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;" />
                </div>
              </div>

              <!-- Duration Selector -->
              <div class="input-group" style="margin-bottom: 16px;">
                <label class="input-label">Select Parking Duration</label>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;" id="duration-grid">
                  <button type="button" class="btn btn-secondary btn-sm duration-btn" data-hours="1">1 Hour</button>
                  <button type="button" class="btn btn-secondary btn-sm duration-btn active" data-hours="2" style="border-color: var(--primary-500); background: var(--primary-50); color: var(--primary-600);">2 Hours</button>
                  <button type="button" class="btn btn-secondary btn-sm duration-btn" data-hours="3">3 Hours</button>
                  <button type="button" class="btn btn-secondary btn-sm duration-btn" data-hours="5">5 Hours</button>
                </div>
              </div>

              <!-- Payment Breakdown Box -->
              <div style="border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; background: var(--bg-surface-subtle);">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 6px; color: var(--text-secondary);">
                  <span>Base Fare (${selectedDuration} hrs × ₹${hourlyRate}):</span>
                  <span id="res-base-fare">₹${selectedDuration * hourlyRate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 8px; color: var(--text-secondary);">
                  <span>Civic SmartPark Sensor Fee:</span>
                  <span>₹0 (Free Public Tier)</span>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 8px; display: flex; justify-content: space-between; font-size: 1rem; font-weight: 800; color: var(--text-primary);">
                  <span>Total Payable:</span>
                  <span id="res-total-fare" style="color: var(--primary-600);">₹${selectedDuration * hourlyRate}</span>
                </div>
              </div>

              <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Guaranteed slot held for 20 minutes from booking time with QR auto-entry.
              </div>
            </div>

            <div class="modal-footer" id="reserve-footer">
              <button type="button" class="btn btn-secondary" id="modal-reserve-cancel">Cancel</button>
              <button type="button" class="btn btn-primary" id="modal-confirm-pay">Confirm & Generate QR Pass</button>
            </div>
          </div>
        </div>
      `;

      modalContainer.innerHTML = modalHtml;

      // Duration buttons handler
      const durationBtns = modalContainer.querySelectorAll('.duration-btn');
      const baseFareEl = document.getElementById('res-base-fare');
      const totalFareEl = document.getElementById('res-total-fare');

      durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          durationBtns.forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = '';
            b.style.background = '';
            b.style.color = '';
          });
          btn.classList.add('active');
          btn.style.borderColor = 'var(--primary-500)';
          btn.style.background = 'var(--primary-50)';
          btn.style.color = 'var(--primary-600)';
          selectedDuration = parseInt(btn.getAttribute('data-hours'), 10);
          const total = selectedDuration * hourlyRate;
          baseFareEl.textContent = `₹${total}`;
          totalFareEl.textContent = `₹${total}`;
        });
      });

      document.getElementById('modal-reserve-close').addEventListener('click', closeModal);
      document.getElementById('modal-reserve-cancel').addEventListener('click', closeModal);
      document.getElementById('reserve-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'reserve-modal-overlay') closeModal();
      });

      // Confirm & Generate QR Pass
      document.getElementById('modal-confirm-pay').addEventListener('click', () => {
        const plateInput = document.getElementById('res-plate');
        const plateNumber = plateInput ? plateInput.value.trim().toUpperCase() : 'KA-01-MJ-5890';
        const reservationId = 'SP-' + Math.floor(100000 + Math.random() * 900000);
        const bayNumber = 'B-' + Math.floor(10 + Math.random() * 80);

        const bodyEl = document.getElementById('reserve-step-body');
        const footerEl = document.getElementById('reserve-footer');

        bodyEl.innerHTML = `
          <div style="text-align: center; padding: 12px 0;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: var(--status-high-bg); border: 2px solid var(--status-high-border); color: var(--status-high-text); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">Public Parking Pass Confirmed!</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 18px;">Show this digital QR pass at the boom barrier scanner for contactless entry.</p>

            <!-- Digital QR Pass Card -->
            <div style="background: var(--bg-surface-subtle); border: 2px solid var(--primary-500); border-radius: var(--radius-xl); padding: 20px; max-width: 320px; margin: 0 auto 16px auto; box-shadow: var(--shadow-lg);">
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">SmartPark Digital Entry Pass</div>
              <div style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 14px;">${zone.name}</div>
              
              <!-- Simulated QR Code SVG -->
              <div style="background: #ffffff; padding: 12px; border-radius: var(--radius-md); display: inline-block; box-shadow: var(--shadow-sm); margin-bottom: 12px;">
                <svg width="140" height="140" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#ffffff"/>
                  <!-- Position Markers -->
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a"/>
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff"/>
                  <rect x="18" y="18" width="8" height="8" fill="#0f172a"/>

                  <rect x="66" y="10" width="24" height="24" fill="#0f172a"/>
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff"/>
                  <rect x="74" y="18" width="8" height="8" fill="#0f172a"/>

                  <rect x="10" y="66" width="24" height="24" fill="#0f172a"/>
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff"/>
                  <rect x="18" y="74" width="8" height="8" fill="#0f172a"/>

                  <!-- Data Matrix Dots -->
                  <rect x="42" y="12" width="6" height="6" fill="#0f172a"/>
                  <rect x="52" y="18" width="6" height="6" fill="#0f172a"/>
                  <rect x="40" y="28" width="6" height="6" fill="#0f172a"/>
                  <rect x="48" y="38" width="8" height="8" fill="#0f172a"/>
                  <rect x="20" y="44" width="6" height="6" fill="#0f172a"/>
                  <rect x="30" y="52" width="6" height="6" fill="#0f172a"/>
                  <rect x="66" y="44" width="6" height="6" fill="#0f172a"/>
                  <rect x="78" y="52" width="6" height="6" fill="#0f172a"/>
                  <rect x="44" y="66" width="8" height="8" fill="#0f172a"/>
                  <rect x="60" y="70" width="6" height="6" fill="#0f172a"/>
                  <rect x="74" y="80" width="6" height="6" fill="#0f172a"/>
                  <rect x="52" y="82" width="6" height="6" fill="#0f172a"/>
                </svg>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8125rem; text-align: left; border-top: 1px solid var(--border-color); padding-top: 10px;">
                <div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">VEHICLE</div>
                  <div style="font-weight: 700; color: var(--text-primary);">${plateNumber}</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">ASSIGNED BAY</div>
                  <div style="font-weight: 800; color: var(--primary-600);">${bayNumber}</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">DURATION</div>
                  <div style="font-weight: 700; color: var(--text-primary);">${selectedDuration} Hours</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">PASS ID</div>
                  <div style="font-weight: 700; color: var(--text-primary);">${reservationId}</div>
                </div>
              </div>
            </div>
          </div>
        `;

        footerEl.innerHTML = `
          <button type="button" class="btn btn-secondary" id="modal-pass-print">Print / Save Pass</button>
          <button type="button" class="btn btn-primary" id="modal-pass-done">Done</button>
        `;

        document.getElementById('modal-pass-done').addEventListener('click', closeModal);
        document.getElementById('modal-pass-print').addEventListener('click', () => {
          window.print();
        });
      });
    }
  };
}
