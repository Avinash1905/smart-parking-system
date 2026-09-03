/**
 * SmartPark Parking Domain API Service
 * Encapsulates all REST calls for public and private parking zones, slot matrices, and predictions.
 */

import { apiClient } from './apiClient.js';

export const parkingApiService = {
  async getPublicZones() {
    return await apiClient.get('/api/parking/public');
  },

  async getPrivateZones(userId = null) {
    const params = userId ? { user_id: userId } : {};
    return await apiClient.get('/api/parking/private', params);
  },

  async getZoneById(zoneId) {
    return await apiClient.get(`/api/parking/${zoneId}`);
  },

  async getZoneSlots(zoneId) {
    return await apiClient.get(`/api/parking/${zoneId}/slots`);
  },

  async getZonePrediction(zoneId) {
    return await apiClient.get(`/api/parking/${zoneId}/prediction`);
  },

  async getTopRecommendations(userId = null) {
    const params = userId ? { user_id: userId } : {};
    return await apiClient.get('/api/recommendations', params);
  },

  async createZone(zoneData, adminId = 'adm-001') {
    return await apiClient.post('/api/parking', { ...zoneData, admin_id: adminId });
  }
};
