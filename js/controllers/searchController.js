/**
 * SmartPark Client Search & Spatial Filter Controller
 * Manages search input debouncing, filter parameter encoding, and reactive list rendering.
 */

import { appStore } from '../state/appState.js';

export class SearchController {
  constructor() {
    this.debounceTimer = null;
  }

  async executeSearch(filters = {}) {
    const currentState = appStore.getState();
    const queryParams = new URLSearchParams({
      lat: filters.lat || 12.9716,
      lon: filters.lon || 77.5946,
      max_dist: filters.radiusKm || currentState.searchFilters.radiusKm || 15,
      category: filters.category || currentState.searchFilters.category || 'ALL',
      sort: filters.sortBy || currentState.searchFilters.sortBy || 'RECOMMENDED'
    });

    if (filters.maxPrice) queryParams.set('max_price', filters.maxPrice);
    if (filters.requireEv) queryParams.set('ev', 'true');
    if (filters.requireRoof) queryParams.set('roof', 'true');

    try {
      const res = await fetch(`/api/parking/public?${queryParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn('[SearchController] API lookup failed, falling back to local dataset:', e);
    }
    return [];
  }

  debounceSearch(callback, delayMs = 300) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(callback, delayMs);
  }
}

export const searchController = new SearchController();
