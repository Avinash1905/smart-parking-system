/**
 * SmartPark Security Enforcement & Citation Controller
 * Manages citation status updates, evidence verification, and vehicle hotlist alerts.
 */

import { showToast } from '../components/toast.js';

export class EnforcementController {
  static async resolveCitation(citationId, resolutionNotes = 'Fine collected via POS terminal.') {
    try {
      const res = await fetch('/api/violations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_id: citationId,
          status: 'RESOLVED',
          notes: resolutionNotes
        })
      });
      showToast(`Citation ${citationId} marked as RESOLVED.`, 'success', 3500);
      return { success: true };
    } catch (e) {
      showToast('Failed to update citation status.', 'error', 3500);
      return { success: false };
    }
  }
}
