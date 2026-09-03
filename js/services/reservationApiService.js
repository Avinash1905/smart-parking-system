/**
 * SmartPark Reservation Domain API Service
 * Handles booking creation, user reservations list, and check-in / check-out operations.
 */

import { apiClient } from './apiClient.js';

export const reservationApiService = {
  async createReservation(bookingPayload) {
    return await apiClient.post('/api/reservations', bookingPayload);
  },

  async getUserReservations(userId = 'usr-tcs-01') {
    return await apiClient.get('/api/reservations/my', { user_id: userId });
  }
};

export const violationApiService = {
  async getViolations(status = 'ALL') {
    return await apiClient.get('/api/violations', { status });
  },

  async createViolation(violationPayload, adminId = 'adm-001') {
    return await apiClient.post('/api/violations', { ...violationPayload, admin_id: adminId });
  },

  async updateViolationStatus(violationId, newStatus, adminId = 'adm-001') {
    return await apiClient.patch(`/api/violations/${violationId}/status`, { status: newStatus, admin_id: adminId });
  }
};
