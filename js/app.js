/**
 * SmartPark Main Application Controller
 * Coordinates Full-Stack REST API & Database, Public & Private Parking Multi-Tier Access Control,
 * Separate Login & Signup, User Dashboard with Vehicle Garage & Bay Selector, IoT Sensor Simulator,
 * SVG Analytics Dashboard, and Admin Suite.
 */

import { PUBLIC_PARKING_ZONES, PUBLIC_PARKING_SUMMARY } from './data/parkingZonesData.js';
import { 
  PRIVATE_PARKING_ZONES, 
  PRIVATE_PARKING_SUMMARY 
} from './data/privateParkingData.js';
import { authService } from './data/authService.js';
import { adminService } from './data/adminService.js';
import { parkingApiService } from './services/parkingApiService.js';
import { showToast } from './components/toast.js';
import { runAuthTestSuite } from './components/authTestSuite.js';

import { initThemeManager } from './components/themeManager.js';
import { renderSummaryStats } from './components/summaryStats.js';
import { initSearchFilterBar } from './components/searchFilterBar.js';
import { renderParkingList, renderLoadingState, renderErrorState } from './components/parkingList.js';
import { initParkingMap } from './components/parkingMap.js';
import { renderPredictionSection } from './components/predictionSection.js';
import { initModals } from './components/modals.js';
import { initNotificationCenter, openNotificationDrawer } from './components/notificationCenter.js';

// Private Parking Components
import { renderPrivateSummaryStats } from './components/privateSummaryStats.js';
import { initPrivateSearchFilter } from './components/privateSearchFilter.js';
import { renderPrivateParkingList } from './components/privateParkingList.js';
import { initPrivateParkingMap } from './components/privateParkingMap.js';
import { renderPrivateRecommendation } from './components/privateRecommendation.js';
import { openVisitorRequestModal } from './components/visitorAccessModal.js';

// Separate Login, Signup, Dashboard & About Components
import { renderLoginView } from './components/authView.js';
import { renderSignupView } from './components/signupView.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderAboutView } from './components/aboutView.js';

// Admin Components
import { renderAdminView } from './components/adminView.js';

class SmartParkApp {
  constructor() {
    // Public State
    this.publicZones = [...PUBLIC_PARKING_ZONES];
    this.filteredPublicZones = [...PUBLIC_PARKING_ZONES];
    this.selectedPublicZoneId = this.publicZones[0].id;
    this.publicMapInstance = null;
    this.publicFilterState = {
      query: '',
      date: '',
      time: '',
      vehicleType: 'car',
      activeFilter: 'all',
      sortBy: 'distance'
    };

    // Private State
    this.currentUser = authService.getCurrentUser();
    this.privateZones = [...PRIVATE_PARKING_ZONES];
    this.filteredPrivateZones = [...PRIVATE_PARKING_ZONES];
    this.selectedPrivateZoneId = this.privateZones[0].id;
    this.privateMapInstance = null;
    this.privateFilterState = {
      query: '',
      company: 'ALL',
      parkingType: 'ALL',
      activeFilter: 'all',
      sortBy: 'distance'
    };

    this.modals = null;
  }

  init() {
    // 1. Run Automated Test Suite
    const suite = runAuthTestSuite();
    console.log(`[SmartPark Auth Suite] Passed: ${suite.allPassed} (${suite.results.filter(r => r.passed).length}/${suite.results.length} tests passed)`);

    // 2. Initialize Theme Manager
    initThemeManager();

    // 3. Modals
    this.modals = initModals();

    // 4. Navigation & Routing
    this.initNavigation();

    // 5. User Profile Switcher Controls
    this.initUserProfileControls();

    // 6. Visitor Banner Triggers
    const visitorBannerBtn = document.getElementById('btn-banner-visitor-request');
    if (visitorBannerBtn) {
      visitorBannerBtn.addEventListener('click', () => {
        openVisitorRequestModal();
      });
    }

    // 7. Notification Bell Trigger
    const notifBell = document.getElementById('navbar-notif-bell');
    if (notifBell) {
      notifBell.addEventListener('click', () => {
        openNotificationDrawer();
      });
    }

    // 8. Listen for Auth State Changes
    window.addEventListener('smartpark_auth_changed', (e) => {
      const { user } = e.detail;
      this.currentUser = user;
      this.updateNavbarAuthUI();
      this.updateProfileBannerUI();
      this.applyPrivateFilters();
    });

    // 9. Listen for Admin Updates (Locations / Companies / Sensor events)
    window.addEventListener('smartpark_locations_updated', () => {
      this.applyPublicFilters();
      this.applyPrivateFilters();
    });

    // 10. Initial Mounts
    this.mountPublicParkingPage();
    this.mountPrivateParkingPage();
    this.updateNavbarAuthUI();
  }

  initNavigation() {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('navbar-nav-menu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-open');
      });
    }

    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  updateNavbarAuthUI() {
    const navAuthContainer = document.getElementById('nav-auth-container');
    const navDashboard = document.getElementById('nav-link-dashboard');
    const navItemAdmin = document.getElementById('nav-item-admin');
    const isAuth = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();
    const user = authService.getCurrentUser();

    if (navItemAdmin) {
      navItemAdmin.style.display = isAuth && isAdmin ? 'block' : 'none';
    }

    if (navDashboard) {
      if (!isAuth) {
        navDashboard.innerHTML = `Dashboard <span style="font-size:0.7rem;opacity:0.7;">🔒</span>`;
      } else {
        navDashboard.innerHTML = `Dashboard`;
      }
    }

    if (navAuthContainer) {
      if (isAuth && user) {
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U';
        const firstName = user.name ? user.name.split(' ')[0] : 'User';

        navAuthContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" id="nav-btn-profile" style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 22px; height: 22px; border-radius: 50%; background: ${user.role === 'ADMIN' ? '#10b981' : 'var(--primary-600)'}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800;">${initials}</span>
              <span>${firstName}</span>
            </button>
            <button type="button" class="btn btn-ghost btn-sm" id="nav-btn-logout" title="Sign Out" style="padding: 6px 8px; color: var(--text-muted);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        `;

        document.getElementById('nav-btn-profile').addEventListener('click', () => {
          if (user.role === 'ADMIN') {
            this.navigateTo('#/admin');
          } else {
            this.navigateTo('#/dashboard');
          }
        });

        document.getElementById('nav-btn-logout').addEventListener('click', () => {
          authService.logout();
          showToast("You have been signed out.", "info");
          this.navigateTo('#/login');
        });
      } else {
        navAuthContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-ghost btn-sm" id="nav-btn-signin" style="font-weight: 700;">
              Sign In
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="nav-btn-signup">
              Create Account
            </button>
          </div>
        `;

        document.getElementById('nav-btn-signin').addEventListener('click', () => {
          this.navigateTo('#/login');
        });
        document.getElementById('nav-btn-signup').addEventListener('click', () => {
          this.navigateTo('#/signup');
        });
      }
    }
  }

  handleRoute() {
    const hash = window.location.hash || '#/parking/public';
    
    const homeView = document.getElementById('view-home');
    const publicParkingView = document.getElementById('view-public-parking');
    const privateParkingView = document.getElementById('view-private-parking');
    const loginView = document.getElementById('view-login');
    const signupView = document.getElementById('view-signup');
    const dashboardView = document.getElementById('view-dashboard');
    const aboutView = document.getElementById('view-about');
    const adminView = document.getElementById('view-admin');

    const modeBadge = document.getElementById('navbar-mode-badge');
    const navHome = document.getElementById('nav-link-home');
    const navParking = document.getElementById('nav-link-parking');
    const dropPublic = document.getElementById('drop-link-public');
    const dropPrivate = document.getElementById('drop-link-private');
    const navAbout = document.getElementById('nav-link-about');
    const navDashboard = document.getElementById('nav-link-dashboard');
    const navAdmin = document.getElementById('nav-link-admin');

    // Hide all views first
    [homeView, publicParkingView, privateParkingView, loginView, signupView, dashboardView, aboutView, adminView].forEach(v => {
      if (v) v.style.display = 'none';
    });

    // Reset active nav indicators
    [navHome, navParking, dropPublic, dropPrivate, navAbout, navDashboard, navAdmin].forEach(link => {
      if (link) link.classList.remove('active');
    });

    // ROUTE: ADMIN CONSOLE
    if (hash.startsWith('#/admin')) {
      if (adminView) {
        adminView.style.display = 'block';
        let subTab = 'overview';
        if (hash.includes('parking')) subTab = 'parking';
        else if (hash.includes('companies')) subTab = 'companies';
        else if (hash.includes('violations')) subTab = 'violations';
        else if (hash.includes('sensors')) subTab = 'sensors';
        else if (hash.includes('analytics')) subTab = 'analytics';

        renderAdminView('view-admin', subTab, (target) => this.navigateTo(target));
      }
      if (navAdmin) navAdmin.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'ADMIN';
        modeBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        modeBadge.style.color = 'var(--status-high-text)';
      }
      window.scrollTo(0, 0);
    }
    // ROUTE: HOME
    else if (hash === '#home' || hash === '#/') {
      if (homeView) homeView.style.display = 'block';
      if (navHome) navHome.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'SMART';
        modeBadge.style.background = 'rgba(79, 70, 229, 0.1)';
        modeBadge.style.color = 'var(--primary-600)';
      }
      window.scrollTo(0, 0);
    } 
    // ROUTE: DEDICATED LOGIN
    else if (hash.includes('login')) {
      if (loginView) {
        loginView.style.display = 'block';
        renderLoginView(
          'view-login', 
          (user) => {
            this.currentUser = user;
            if (user.role === 'ADMIN') {
              this.navigateTo('#/admin');
            } else {
              this.navigateTo('#/dashboard');
            }
          },
          () => this.navigateTo('#/signup')
        );
      }
      if (modeBadge) modeBadge.textContent = 'SIGN IN';
      window.scrollTo(0, 0);
    }
    // ROUTE: DEDICATED SIGNUP
    else if (hash.includes('signup')) {
      if (signupView) {
        signupView.style.display = 'block';
        renderSignupView(
          'view-signup',
          (user) => {
            this.currentUser = user;
            this.navigateTo('#/dashboard');
          },
          () => this.navigateTo('#/login')
        );
      }
      if (modeBadge) modeBadge.textContent = 'SIGN UP';
      window.scrollTo(0, 0);
    }
    // ROUTE: USER DASHBOARD (PROTECTED)
    else if (hash.includes('dashboard')) {
      if (!authService.isAuthenticated()) {
        showToast("Please sign in to access your User Dashboard.", "warning");
        this.navigateTo('#/login');
        return;
      }
      if (dashboardView) {
        dashboardView.style.display = 'block';
        const user = authService.getCurrentUser() || this.currentUser;
        renderDashboardView(
          'view-dashboard',
          user,
          (target) => this.navigateTo(target),
          (id) => this.openPublicDetails(id),
          (id) => this.openPublicReserve(id),
          () => {
            authService.logout();
            this.navigateTo('#/login');
          }
        );
      }
      if (navDashboard) navDashboard.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'USER';
        modeBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        modeBadge.style.color = 'var(--status-high-text)';
      }
      window.scrollTo(0, 0);
    }
    // ROUTE: ABOUT PAGE
    else if (hash.includes('about')) {
      if (aboutView) {
        aboutView.style.display = 'block';
        renderAboutView('view-about', (target) => this.navigateTo(target));
      }
      if (navAbout) navAbout.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'ABOUT';
        modeBadge.style.background = 'rgba(6, 182, 212, 0.15)';
        modeBadge.style.color = 'var(--accent-cyan)';
      }
      window.scrollTo(0, 0);
    }
    // ROUTE: PRIVATE PARKING
    else if (hash.includes('private')) {
      if (privateParkingView) privateParkingView.style.display = 'block';
      if (navParking) navParking.classList.add('active');
      if (dropPrivate) dropPrivate.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'PRIVATE';
        modeBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        modeBadge.style.color = 'var(--status-high-text)';
      }
      this.applyPrivateFilters();
      window.scrollTo(0, 0);
    } 
    // ROUTE: PUBLIC PARKING (DEFAULT)
    else {
      if (publicParkingView) publicParkingView.style.display = 'block';
      if (navParking) navParking.classList.add('active');
      if (dropPublic) dropPublic.classList.add('active');
      if (modeBadge) {
        modeBadge.textContent = 'PUBLIC';
        modeBadge.style.background = 'rgba(79, 70, 229, 0.1)';
        modeBadge.style.color = 'var(--primary-600)';
      }
      this.applyPublicFilters();
      window.scrollTo(0, 0);
    }
  }

  navigateTo(target) {
    window.location.hash = target;
  }

  initUserProfileControls() {
    const profileSelect = document.getElementById('pvt-profile-select');
    if (!profileSelect) return;

    profileSelect.addEventListener('change', (e) => {
      const email = e.target.value;
      const pass = email.includes('admin') ? 'SmartParkAdmin@123' : 'SmartPark@123';
      const result = authService.login(email, pass);
      if (result.success) {
        this.currentUser = result.user;
        showToast(`Switched active session to ${result.user.name}`, 'info', 2000);
        this.updateProfileBannerUI();
        this.applyPrivateFilters();
      }
    });
  }

  updateProfileBannerUI() {
    const avatarEl = document.getElementById('pvt-profile-avatar');
    const nameEl = document.getElementById('pvt-profile-name');
    const badgeEl = document.getElementById('pvt-profile-badge');
    const metaEl = document.getElementById('pvt-profile-meta');

    const user = authService.getCurrentUser();

    if (!user) {
      if (nameEl) nameEl.textContent = "Guest Visitor (Logged Out)";
      if (avatarEl) avatarEl.textContent = "G";
      if (badgeEl) {
        badgeEl.textContent = "Sign In Required";
        badgeEl.className = "badge badge-type-visitor";
      }
      if (metaEl) metaEl.textContent = "Please sign in to check your corporate access.";
      return;
    }

    if (avatarEl && nameEl && badgeEl && metaEl) {
      const initials = user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U';
      avatarEl.textContent = initials;
      nameEl.textContent = user.name;

      if (user.role === 'ADMIN') {
        badgeEl.style.display = 'inline-flex';
        badgeEl.innerHTML = `Admin`;
        badgeEl.className = 'verification-tag';
        metaEl.textContent = `Role: System Administrator • Universal Clearance Active`;
      } else if (user.companyVerified && user.companyName) {
        badgeEl.style.display = 'inline-flex';
        badgeEl.innerHTML = `
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Verified
        `;
        badgeEl.className = 'verification-tag';
        metaEl.textContent = `Company: ${user.companyName} • ID: ${user.employeeId || 'Verified'}`;
      } else {
        badgeEl.style.display = 'inline-flex';
        badgeEl.innerHTML = `Public Citizen`;
        badgeEl.className = 'badge badge-public';
        metaEl.textContent = `Status: Unaffiliated User • No Corporate Clearance`;
      }
    }
  }

  /* ========================================== */
  /* PUBLIC PARKING LOGIC                       */
  /* ========================================== */
  mountPublicParkingPage() {
    renderSummaryStats('parking-summary-container', PUBLIC_PARKING_SUMMARY);

    initSearchFilterBar('search-filter-container', (newState) => {
      this.publicFilterState = { ...this.publicFilterState, ...newState };
      this.applyPublicFilters();
    });

    this.loadPublicZones();
  }

  async loadPublicZones() {
    renderLoadingState('parking-list-container');
    try {
      const response = await parkingApiService.getPublicZones();
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        const defaultCoords = [
          { x: 32, y: 42 }, { x: 58, y: 34 }, { x: 74, y: 55 }, { x: 44, y: 68 },
          { x: 18, y: 28 }, { x: 62, y: 18 }, { x: 82, y: 38 }, { x: 25, y: 62 }
        ];

        this.publicZones = response.data.map((z, idx) => {
          const total = Number(z.total_spaces || z.totalSpaces || 100);
          const avail = Number(z.available_spaces !== undefined ? z.available_spaces : (z.availableSpaces !== undefined ? z.availableSpaces : 50));
          const occPct = Math.round(((total - avail) / Math.max(total, 1)) * 100);
          const coord = defaultCoords[idx % defaultCoords.length];

          return {
            id: z.id || `zone-${idx}`,
            name: z.name || 'Municipal Parking Facility',
            type: z.category || 'PUBLIC',
            category: z.category || 'PUBLIC',
            zoneCode: z.zone_code || z.zoneCode || `PUB-0${idx + 1}`,
            address: z.address || 'Central City Hub',
            city: z.city || 'Bengaluru',
            latitude: Number(z.latitude || 12.9716),
            longitude: Number(z.longitude || 77.5946),
            mapX: Number(z.map_x !== undefined ? z.map_x : (z.mapX !== undefined ? z.mapX : coord.x)),
            mapY: Number(z.map_y !== undefined ? z.map_y : (z.mapY !== undefined ? z.mapY : coord.y)),
            totalSpaces: total,
            availableSpaces: avail,
            occupiedSpaces: total - avail,
            occupancyPercent: occPct,
            pricePerHour: Number(z.price_per_hour !== undefined ? z.price_per_hour : (z.pricePerHour || 20)),
            distanceKm: Number(z.distance_km !== undefined ? z.distance_km : (z.distanceKm || 1.2)),
            walkingMinutes: Number(z.walking_minutes !== undefined ? z.walking_minutes : (z.walkingMinutes || 5)),
            availabilityStatus: occPct >= 85 ? 'LOW' : (occPct >= 65 ? 'MEDIUM' : 'HIGH'),
            evCharging: Boolean(z.ev_spaces > 0 || z.evCharging),
            evSpaces: Number(z.ev_spaces || z.evSpaces || 0),
            open24x7: Boolean(z.open_24x7 !== undefined ? z.open_24x7 : true),
            securityGuardOnSite: Boolean(z.security_guard_on_site !== undefined ? z.security_guard_on_site : true),
            anprCameraInstalled: Boolean(z.anpr_camera_installed !== undefined ? z.anpr_camera_installed : true),
            coveredRoof: Boolean(z.covered_roof !== undefined ? z.covered_roof : true),
            rating: Number(z.rating || 4.8),
            reviewsCount: Number(z.total_reviews || 120),
            amenities: ["CCTV Surveillance", "EV Fast Charging", "Covered Bay", "24/7 Access"],
            tariff: {
              firstHour: Number(z.price_per_hour || 20),
              subsequentPerHour: Number(z.price_per_hour || 20),
              fullDayPass: Number(z.price_per_hour || 20) * 6
            },
            forecast: {
              current: occPct,
              plus10m: Math.min(100, occPct + 4),
              plus20m: Math.min(100, occPct + 8),
              plus30m: Math.min(100, occPct + 12)
            },
            predictedFullInMinutes: Math.max(15, Math.round((avail / Math.max(total, 1)) * 90)),
            predictionMessage: occPct < 65 ? 'High availability for the next 45 minutes' : 'Optimal arrival within next 15 minutes'
          };
        });

        // Sync summary statistics dynamically
        const totalAvail = this.publicZones.reduce((acc, z) => acc + z.availableSpaces, 0);
        const totalCap = this.publicZones.reduce((acc, z) => acc + z.totalSpaces, 0);
        const avgOcc = Math.round(((totalCap - totalAvail) / Math.max(totalCap, 1)) * 100);

        renderSummaryStats('parking-summary-container', {
          totalAvailableSpaces: totalAvail,
          totalPublicZones: this.publicZones.length,
          currentlyOccupiedPercent: avgOcc,
          activeParkingAreas: this.publicZones.length
        });
      }
    } catch (err) {
      console.warn("[SmartPark API Fallback to Local Zones]:", err.message);
    } finally {
      this.applyPublicFilters();
    }
  }

  applyPublicFilters() {
    let results = [...this.publicZones];

    if (this.publicFilterState.query) {
      const q = this.publicFilterState.query.toLowerCase();
      results = results.filter(z => 
        z.name.toLowerCase().includes(q) || 
        z.address.toLowerCase().includes(q) ||
        z.zoneCode.toLowerCase().includes(q)
      );
    }

    if (this.publicFilterState.vehicleType === 'ev') {
      results = results.filter(z => z.evCharging);
    }

    switch (this.publicFilterState.activeFilter) {
      case 'available-now':
        results = results.filter(z => z.availableSpaces >= 10);
        break;
      case 'nearest':
        results = results.filter(z => z.distanceKm <= 2.0);
        break;
      case 'lowest-price':
        results = results.filter(z => z.pricePerHour <= 20);
        break;
      case 'ev-charging':
        results = results.filter(z => z.evCharging);
        break;
      case 'open-24x7':
        results = results.filter(z => z.open24x7);
        break;
      default:
        break;
    }

    switch (this.publicFilterState.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'availability':
        results.sort((a, b) => b.availableSpaces - a.availableSpaces);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
      default:
        results.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
    }

    this.filteredPublicZones = results;

    if (results.length > 0 && !results.some(z => z.id === this.selectedPublicZoneId)) {
      this.selectedPublicZoneId = results[0].id;
    }

    this.renderPublicListAndMap();

    const currentZone = this.publicZones.find(z => z.id === this.selectedPublicZoneId) || results[0];
    if (currentZone) {
      renderPredictionSection('prediction-section-container', currentZone);
    }

    const availableEl = document.getElementById('kpi-available-count');
    if (availableEl) {
      const filteredTotalAvailable = results.reduce((acc, z) => acc + z.availableSpaces, 0);
      availableEl.textContent = filteredTotalAvailable;
    }

    const countEl = document.getElementById('results-count-text');
    if (countEl) {
      countEl.textContent = `Showing ${results.length} Public Parking Zones`;
    }
  }

  renderPublicListAndMap() {
    renderParkingList(
      'parking-list-container',
      this.filteredPublicZones,
      this.selectedPublicZoneId,
      (zoneId) => this.selectPublicZone(zoneId, true),
      (zoneId) => this.openPublicDetails(zoneId),
      (zoneId) => this.openPublicReserve(zoneId)
    );

    this.publicMapInstance = initParkingMap(
      'parking-map-container',
      this.filteredPublicZones,
      this.selectedPublicZoneId,
      (zoneId) => this.selectPublicZone(zoneId, false),
      (zoneId) => this.openPublicDetails(zoneId),
      (zoneId) => this.openPublicReserve(zoneId)
    );
  }

  selectPublicZone(zoneId, scrollToCard = false) {
    this.selectedPublicZoneId = zoneId;
    const selectedZone = this.publicZones.find(z => z.id === zoneId);
    if (!selectedZone) return;

    const cards = document.querySelectorAll('#parking-list-container .parking-card');
    cards.forEach(card => {
      if (card.getAttribute('data-id') === zoneId) {
        card.classList.add('selected');
        if (scrollToCard) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        card.classList.remove('selected');
      }
    });

    if (this.publicMapInstance) {
      this.publicMapInstance.update(zoneId);
    }

    renderPredictionSection('prediction-section-container', selectedZone);
  }

  openPublicDetails(zoneId) {
    const zone = this.publicZones.find(z => z.id === zoneId);
    if (zone && this.modals) {
      this.modals.openDetailsModal(zone, (id) => this.openPublicReserve(id));
    }
  }

  openPublicReserve(zoneId) {
    const zone = this.publicZones.find(z => z.id === zoneId);
    if (zone && this.modals) {
      this.modals.openReservationModal(zone);
    }
  }

  /* ========================================== */
  /* PRIVATE PARKING LOGIC                      */
  /* ========================================== */
  mountPrivateParkingPage() {
    renderPrivateSummaryStats('pvt-summary-container', PRIVATE_PARKING_SUMMARY);

    initPrivateSearchFilter('pvt-search-filter-container', (newState) => {
      this.privateFilterState = { ...this.privateFilterState, ...newState };
      this.applyPrivateFilters();
    });

    this.renderPrivateListAndMap();

    const user = authService.getCurrentUser() || this.currentUser;
    const selectedZone = this.privateZones.find(z => z.id === this.selectedPrivateZoneId) || this.privateZones[0];
    renderPrivateRecommendation(
      'pvt-recommendation-container',
      selectedZone,
      user,
      (id) => this.openPrivateReserve(id),
      () => this.navigateTo('#/parking/public')
    );

    renderPredictionSection('pvt-prediction-container', selectedZone);
  }

  applyPrivateFilters() {
    let results = [...this.privateZones];
    const user = authService.getCurrentUser();

    if (this.privateFilterState.query) {
      const q = this.privateFilterState.query.toLowerCase();
      results = results.filter(z => 
        z.name.toLowerCase().includes(q) || 
        z.address.toLowerCase().includes(q) ||
        z.companyName.toLowerCase().includes(q)
      );
    }

    if (this.privateFilterState.company && this.privateFilterState.company !== 'ALL') {
      results = results.filter(z => z.companyId === this.privateFilterState.company);
    }

    if (this.privateFilterState.parkingType && this.privateFilterState.parkingType !== 'ALL') {
      results = results.filter(z => z.parkingType === this.privateFilterState.parkingType);
    }

    // Filter by Accessible To Me
    if (this.privateFilterState.activeFilter === 'authorized') {
      results = results.filter(z => {
        if (!user) return false;
        const decision = authService.canAccessLocation(z, user);
        return decision.allowed;
      });
    } else if (this.privateFilterState.activeFilter === 'visitor') {
      results = results.filter(z => z.parkingType === 'VISITOR');
    } else if (this.privateFilterState.activeFilter === 'nearest') {
      results = results.filter(z => z.distanceKm <= 2.0);
    } else if (this.privateFilterState.activeFilter === 'ev-charging') {
      results = results.filter(z => z.evCharging);
    }

    switch (this.privateFilterState.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'availability':
        results.sort((a, b) => b.availableSpaces - a.availableSpaces);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
      default:
        results.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
    }

    this.filteredPrivateZones = results;

    if (results.length > 0 && !results.some(z => z.id === this.selectedPrivateZoneId)) {
      this.selectedPrivateZoneId = results[0].id;
    }

    this.renderPrivateListAndMap();

    const selectedZone = this.privateZones.find(z => z.id === this.selectedPrivateZoneId) || results[0];
    if (selectedZone) {
      renderPrivateRecommendation(
        'pvt-recommendation-container',
        selectedZone,
        user,
        (id) => this.openPrivateReserve(id),
        () => this.navigateTo('#/parking/public')
      );
      renderPredictionSection('pvt-prediction-container', selectedZone);
    }

    const availableEl = document.getElementById('kpi-pvt-available-count');
    if (availableEl) {
      const filteredTotalAvailable = results.reduce((acc, z) => acc + z.availableSpaces, 0);
      availableEl.textContent = filteredTotalAvailable;
    }

    const countEl = document.getElementById('pvt-results-count-text');
    if (countEl) {
      countEl.textContent = `Showing ${results.length} Private Parking Facilities`;
    }
  }

  renderPrivateListAndMap() {
    const user = authService.getCurrentUser();

    renderPrivateParkingList(
      'pvt-parking-list-container',
      this.filteredPrivateZones,
      this.selectedPrivateZoneId,
      user,
      (zoneId) => this.selectPrivateZone(zoneId, true),
      (zoneId) => this.openPrivateDetails(zoneId),
      (zoneId) => this.openPrivateReserve(zoneId),
      (zoneId) => openVisitorRequestModal(zoneId),
      () => this.navigateTo('#/parking/public'),
      () => this.navigateTo('#/login'),
      () => this.navigateTo('#/signup')
    );

    this.privateMapInstance = initPrivateParkingMap(
      'pvt-parking-map-container',
      this.filteredPrivateZones,
      this.selectedPrivateZoneId,
      user,
      (zoneId) => this.selectPrivateZone(zoneId, false),
      (zoneId) => this.openPrivateDetails(zoneId),
      (zoneId) => this.openPrivateReserve(zoneId),
      (zoneId) => openVisitorRequestModal(zoneId),
      () => this.navigateTo('#/parking/public')
    );
  }

  selectPrivateZone(zoneId, scrollToCard = false) {
    this.selectedPrivateZoneId = zoneId;
    const selectedZone = this.privateZones.find(z => z.id === zoneId);
    if (!selectedZone) return;

    const cards = document.querySelectorAll('#pvt-parking-list-container .parking-card');
    cards.forEach(card => {
      if (card.getAttribute('data-id') === zoneId) {
        card.classList.add('selected');
        if (scrollToCard) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        card.classList.remove('selected');
      }
    });

    if (this.privateMapInstance) {
      this.privateMapInstance.update(zoneId);
    }

    const user = authService.getCurrentUser();
    renderPrivateRecommendation(
      'pvt-recommendation-container',
      selectedZone,
      user,
      (id) => this.openPrivateReserve(id),
      () => this.navigateTo('#/parking/public')
    );

    renderPredictionSection('pvt-prediction-container', selectedZone);
  }

  openPrivateDetails(zoneId) {
    const zone = this.privateZones.find(z => z.id === zoneId);
    if (zone && this.modals) {
      this.modals.openDetailsModal(zone, (id) => this.openPrivateReserve(id));
    }
  }

  openPrivateReserve(zoneId) {
    const zone = this.privateZones.find(z => z.id === zoneId);
    if (zone && this.modals) {
      this.modals.openReservationModal(zone);
    }
  }
}

// Bootstrap
function bootstrap() {
  try {
    const app = new SmartParkApp();
    window.smartParkApp = app;
    app.init();
  } catch (err) {
    console.error("[SmartPark Bootstrap Error]:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
