/**
 * SmartPark Reactive Client State Management Store
 * Provides pub-sub event notifications, session storage caching, and reactive UI bindings.
 */

class AppStore {
  constructor() {
    this.state = {
      currentUser: null,
      authToken: null,
      activeView: 'home',
      searchFilters: {
        radiusKm: 15,
        category: 'ALL',
        maxPrice: null,
        requireEv: false,
        requireRoof: false,
        sortBy: 'RECOMMENDED'
      },
      currentZone: null,
      selectedSlot: null,
      userVehicles: [],
      userReservations: [],
      activeNotifications: [],
      realtimeConnected: true
    };
    this.subscribers = new Map();
    this.loadPersistedSession();
  }

  loadPersistedSession() {
    try {
      const savedUser = localStorage.getItem('smartpark_user');
      const savedToken = localStorage.getItem('smartpark_token');
      if (savedUser && savedToken) {
        this.state.currentUser = JSON.parse(savedUser);
        this.state.authToken = savedToken;
      }
    } catch (e) {
      console.warn('[SmartPark Store] Failed to load cached session:', e);
    }
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...partialState };

    if (partialState.currentUser !== undefined) {
      if (this.state.currentUser) {
        localStorage.setItem('smartpark_user', JSON.stringify(this.state.currentUser));
      } else {
        localStorage.removeItem('smartpark_user');
      }
    }

    if (partialState.authToken !== undefined) {
      if (this.state.authToken) {
        localStorage.setItem('smartpark_token', this.state.authToken);
      } else {
        localStorage.removeItem('smartpark_token');
      }
    }

    // Notify listeners
    this.notifySubscribers(prevState, this.state);
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);
    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      const list = this.subscribers.get(key).filter(cb => cb !== callback);
      this.subscribers.set(key, list);
    }
  }

  notifySubscribers(prevState, nextState) {
    this.subscribers.forEach((callbacks, key) => {
      callbacks.forEach(cb => {
        try {
          cb(nextState, prevState);
        } catch (err) {
          console.error(`[SmartPark Store] Subscriber error (${key}):`, err);
        }
      });
    });
  }

  isLoggedIn() {
    return !!this.state.currentUser;
  }

  isAdmin() {
    return this.state.currentUser && (this.state.currentUser.role === 'ADMIN' || this.state.currentUser.role === 'SUPER_ADMIN');
  }

  logout() {
    this.setState({
      currentUser: null,
      authToken: null,
      selectedSlot: null,
      currentZone: null
    });
  }
}

export const appStore = new AppStore();
