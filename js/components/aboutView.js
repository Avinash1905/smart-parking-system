/**
 * About Page View Component
 * Explains SmartPark architecture, 5-step workflow, ML predictive intelligence,
 * Public vs Private parking features, and core platform benefits.
 */

export function renderAboutView(containerId, onNavigate) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <!-- 1. About Hero Section -->
    <section class="about-hero">
      <div class="about-pill">
        <span class="pulse-dot" style="width: 6px; height: 6px;"></span>
        Next-Generation Urban Mobility Platform
      </div>
      <h1 class="about-title">
        Parking Made <span class="hero-gradient-text">Smarter</span>
      </h1>
      <p class="about-subtitle">
        SmartPark helps drivers find available parking, understand occupancy, and make smarter parking decisions using real-time IoT sensor streams and predictive intelligence.
      </p>
      <div>
        <button type="button" class="btn btn-primary btn-lg" id="about-hero-cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Find Available Parking
        </button>
      </div>
    </section>

    <!-- 2. What is SmartPark? Section -->
    <section class="about-overview-card">
      <div class="overview-grid">
        <div>
          <span class="badge badge-public" style="margin-bottom: 8px;">Product Architecture</span>
          <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">What is SmartPark?</h2>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
            SmartPark is an intelligent civic and corporate parking platform designed to eliminate urban parking friction. By synchronizing live IoT ground sensors, automated ANPR boom gates, and predictive algorithms, drivers navigate directly to vacant bays without circling blocks.
          </p>
          <ul class="overview-features-list">
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> Real-Time Spot Availability
            </li>
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> AI Occupancy Predictions
            </li>
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> Public Municipal Parking
            </li>
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> Corporate Employee Access
            </li>
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> Contactless Digital QR Passes
            </li>
            <li class="overview-feature-item">
              <span class="feature-check-icon">✓</span> EV Fast Charging Locator
            </li>
          </ul>
        </div>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 14px;">Platform Performance & Scale</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
            <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary-600);">85%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Circling Time Reduced</div>
            </div>
            <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--status-high-text);">99.9%</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Sensor Telemetry Uptime</div>
            </div>
            <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--accent-cyan);">15+</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Integrated City Zones</div>
            </div>
            <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 1.75rem; font-weight: 800; color: #f59e0b;">< 2 sec</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">QR Barrier Clearance</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. How SmartPark Works (5-Step Workflow) -->
    <section class="workflow-section">
      <div class="workflow-header">
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">How SmartPark Works</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">Frictionless 5-step parking journey from search to barrier exit</p>
      </div>

      <div class="workflow-grid">
        <div class="workflow-step-card">
          <div class="workflow-num">01</div>
          <h3 class="workflow-step-title">Search</h3>
          <p class="workflow-step-desc">Enter your destination, landmark, or campus to discover nearby parking facilities.</p>
        </div>

        <div class="workflow-step-card">
          <div class="workflow-num">02</div>
          <h3 class="workflow-step-title">Check Availability</h3>
          <p class="workflow-step-desc">Inspect real-time open slots, standard vs EV spaces, and distance in meters.</p>
        </div>

        <div class="workflow-step-card">
          <div class="workflow-num">03</div>
          <h3 class="workflow-step-title">Smart Match</h3>
          <p class="workflow-step-desc">Compare tariffs, walking times, and 30-minute machine learning occupancy predictions.</p>
        </div>

        <div class="workflow-step-card">
          <div class="workflow-num">04</div>
          <h3 class="workflow-step-title">Reserve</h3>
          <p class="workflow-step-desc">Lock in a guaranteed parking bay with vehicle registration and instant pass clearance.</p>
        </div>

        <div class="workflow-step-card">
          <div class="workflow-num">05</div>
          <h3 class="workflow-step-title">Park</h3>
          <p class="workflow-step-desc">Scan your digital QR pass at the boom barrier scanner for contactless entry.</p>
        </div>
      </div>
    </section>

    <!-- 4. Smart Parking Intelligence Section -->
    <section style="margin-bottom: 48px;">
      <div style="text-align: center; margin-bottom: 28px;">
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">Smarter Parking Intelligence</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">Advanced data engines turning raw sensor signals into actionable arrival insights</p>
      </div>

      <div class="intelligence-grid">
        <div class="intel-card">
          <div class="intel-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
          </div>
          <h3 class="intel-title">Real-Time Availability</h3>
          <p class="intel-desc">Live occupancy streams updated sub-second via magnetic road studs and ANPR cameras.</p>
        </div>

        <div class="intel-card">
          <div class="intel-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <h3 class="intel-title">Occupancy Prediction</h3>
          <p class="intel-desc">Forecasts whether a parking lot will fill up in 15, 30, or 60 minutes based on historical ingress trends.</p>
        </div>

        <div class="intel-card">
          <div class="intel-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3 class="intel-title">Smart Recommendation</h3>
          <p class="intel-desc">Ranks the best parking zone factoring walking duration, cost, charging availability, and security.</p>
        </div>

        <div class="intel-card">
          <div class="intel-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h3 class="intel-title">Live Dynamic Updates</h3>
          <p class="intel-desc">Automatic rerouting suggestions if your destination zone reaches critical capacity while in transit.</p>
        </div>
      </div>
    </section>

    <!-- 5. Public + Private Parking Comparison Section -->
    <section class="comparison-section">
      <div class="comparison-card">
        <div>
          <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-600);"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
            Public Parking
          </h3>
          <p>
            Municipal and commercial open parking lots accessible to all citizens and visitors. View real-time tariffs, walk times, and EV charging points.
          </p>
        </div>
        <button type="button" class="btn btn-secondary" id="about-btn-explore-public">
          Explore Public Parking →
        </button>
      </div>

      <div class="comparison-card">
        <div>
          <h3>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--status-high-text);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Private & Corporate Parking
          </h3>
          <p>
            Company-reserved and restricted facility parking for verified employees (TCS, Infosys, Wipro) and pre-cleared visitor permit holders.
          </p>
        </div>
        <button type="button" class="btn btn-secondary" id="about-btn-explore-private">
          Explore Corporate Parking →
        </button>
      </div>
    </section>

    <!-- 6. Bottom CTA Card -->
    <section class="about-cta-card">
      <h2 class="about-cta-title">Ready for Hassle-Free Parking?</h2>
      <p class="about-cta-desc">Join thousands of drivers making smarter, faster parking decisions across the city every day.</p>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary btn-lg" id="about-cta-find">
          Find Parking Near Me
        </button>
        <button type="button" class="btn btn-secondary btn-lg" id="about-cta-login">
          Sign In to Dashboard
        </button>
      </div>
    </section>
  `;

  // Attach Navigation Listeners
  document.getElementById('about-hero-cta').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('about-btn-explore-public').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('about-btn-explore-private').addEventListener('click', () => onNavigate('#/parking/private'));
  document.getElementById('about-cta-find').addEventListener('click', () => onNavigate('#/parking/public'));
  document.getElementById('about-cta-login').addEventListener('click', () => onNavigate('#/login'));
}
