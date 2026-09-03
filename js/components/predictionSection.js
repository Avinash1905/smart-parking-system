/**
 * Smart Availability & AI Occupancy Prediction Section Component
 * Provides historical ML-driven occupancy forecasting with an interactive time slider
 */

export function renderPredictionSection(containerId, zone) {
  const container = document.getElementById(containerId);
  if (!container || !zone) return;

  const forecast = zone.forecast || {
    current: 65,
    plus10m: 72,
    plus20m: 80,
    plus30m: 88
  };

  function getBarClass(val) {
    if (val >= 90) return 'progress-low';
    if (val >= 70) return 'progress-med';
    return 'progress-high';
  }

  function getStatusText(val) {
    if (val >= 90) return '<span style="color:var(--status-low-text);">Critical Rush</span>';
    if (val >= 70) return '<span style="color:var(--status-med-text);">Moderate Traffic</span>';
    return '<span style="color:var(--status-high-text);">High Availability</span>';
  }

  container.innerHTML = `
    <div class="prediction-card">
      <div class="prediction-header">
        <div>
          <span class="prediction-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            AI Predictive Engine
          </span>
          <h3 class="prediction-title">Smart Availability & Occupancy Forecast: <span style="color: var(--primary-600);">${zone.name}</span></h3>
          <p class="prediction-subtitle">
            Based on real-time ANPR sensor streams, ingress rates, and historical hourly models. Expected occupancy evolution over the next hour.
          </p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.8125rem; font-weight: 600; color: var(--text-muted);">PREDICTED FULL IN</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: ${zone.predictedFullInMinutes <= 20 ? 'var(--status-low-text)' : 'var(--primary-600)'};">
            ~${zone.predictedFullInMinutes} mins
          </div>
        </div>
      </div>

      <!-- Forecast Timeline Grid -->
      <div class="prediction-timeline-grid">
        <!-- Current -->
        <div class="timeline-step-card active-forecast">
          <div class="timeline-time">Current State</div>
          <div class="timeline-occupancy">${forecast.current}%</div>
          <div class="timeline-bar-track">
            <div class="timeline-bar-fill ${getBarClass(forecast.current)}" style="width: ${forecast.current}%;"></div>
          </div>
          <div class="timeline-status-text">${getStatusText(forecast.current)}</div>
        </div>

        <!-- +10 Min -->
        <div class="timeline-step-card">
          <div class="timeline-time">+10 Minutes</div>
          <div class="timeline-occupancy">${forecast.plus10m}%</div>
          <div class="timeline-bar-track">
            <div class="timeline-bar-fill ${getBarClass(forecast.plus10m)}" style="width: ${forecast.plus10m}%;"></div>
          </div>
          <div class="timeline-status-text">${getStatusText(forecast.plus10m)}</div>
        </div>

        <!-- +20 Min -->
        <div class="timeline-step-card">
          <div class="timeline-time">+20 Minutes</div>
          <div class="timeline-occupancy">${forecast.plus20m}%</div>
          <div class="timeline-bar-track">
            <div class="timeline-bar-fill ${getBarClass(forecast.plus20m)}" style="width: ${forecast.plus20m}%;"></div>
          </div>
          <div class="timeline-status-text">${getStatusText(forecast.plus20m)}</div>
        </div>

        <!-- +30 Min -->
        <div class="timeline-step-card">
          <div class="timeline-time">+30 Minutes</div>
          <div class="timeline-occupancy">${forecast.plus30m}%</div>
          <div class="timeline-bar-track">
            <div class="timeline-bar-fill ${getBarClass(forecast.plus30m)}" style="width: ${forecast.plus30m}%;"></div>
          </div>
          <div class="timeline-status-text">${getStatusText(forecast.plus30m)}</div>
        </div>
      </div>

      <!-- Interactive Scrub Slider & AI Recommendation -->
      <div class="prediction-controls-row">
        <div class="forecast-slider-container">
          <span style="font-size: 0.8125rem; font-weight: 700; color: var(--text-primary); white-space: nowrap;">
            Simulate Arrival (+<span id="forecast-slider-val">15</span>m):
          </span>
          <input type="range" id="forecast-slider" class="forecast-slider" min="0" max="60" step="5" value="15" />
          <span id="forecast-sim-result" style="font-size: 0.8125rem; font-weight: 700; color: var(--primary-600); min-width: 90px;">
            ~${Math.min(99, Math.round(forecast.current + 15 * 0.7))}% Occupied
          </span>
        </div>

        <div class="ai-recommendation-box">
          <span class="ai-icon-sparkle">✦</span>
          <span>
            <strong>AI Recommendation:</strong> ${
              zone.availableSpaces > 25 
                ? 'Great window to park. Guaranteed bay availability if you arrive in the next 30 mins.'
                : 'High demand area. We suggest reserving a guaranteed slot right now to avoid queuing.'
            }
          </span>
        </div>
      </div>
    </div>
  `;

  // Slider event listener
  const slider = document.getElementById('forecast-slider');
  const sliderVal = document.getElementById('forecast-slider-val');
  const simResult = document.getElementById('forecast-sim-result');

  if (slider && sliderVal && simResult) {
    slider.addEventListener('input', (e) => {
      const minutes = parseInt(e.target.value, 10);
      sliderVal.textContent = minutes;
      const estimatedOcc = Math.min(100, Math.round(forecast.current + minutes * 0.65));
      simResult.textContent = `~${estimatedOcc}% Occupied`;
      if (estimatedOcc >= 90) {
        simResult.style.color = 'var(--status-low-text)';
      } else if (estimatedOcc >= 70) {
        simResult.style.color = 'var(--status-med-text)';
      } else {
        simResult.style.color = 'var(--status-high-text)';
      }
    });
  }
}
