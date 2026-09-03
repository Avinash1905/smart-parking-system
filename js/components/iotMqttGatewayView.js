/**
 * SmartPark IoT MQTT Telemetry Gateway View Component
 * Visualizes live MQTT message streams, QOS 1 packet delivery acknowledgments, and hardware stud battery status.
 */

import { showToast } from './toast.js';

export function renderIotMqttGatewayView(containerId = "main-content-view") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="view-header" style="margin-bottom: 20px;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px 0;">
        📡 Edge Sensor Mesh &amp; MQTT Gateway
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
        Real-time telemetry stream from 240 wireless ultrasonic studs and environmental sniffers.
      </p>
    </div>

    <!-- Live Telemetry Stream Box -->
    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 24px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0;">Live MQTT Packet Stream</h3>
        <span class="badge badge-public" style="background: rgba(16,185,129,0.15); color: var(--status-high-text);">
          ● Broker Connected (14.2ms avg latency)
        </span>
      </div>

      <div style="background: #0f172a; color: #38bdf8; font-family: monospace; font-size: 0.78rem; padding: 16px; border-radius: var(--radius-lg); height: 180px; overflow-y: auto;">
        <div>[MQTT] TOPIC: smartpark/zones/zone-pub-01/sensors/SNS-01/telemetry | STATE: OCCUPIED | BATT: 98% | RSSI: -64dBm</div>
        <div>[MQTT] TOPIC: smartpark/zones/zone-pub-01/sensors/SNS-02/telemetry | STATE: VACANT   | BATT: 95% | RSSI: -62dBm</div>
        <div>[MQTT] TOPIC: smartpark/zones/zone-pub-01/sensors/SNS-03/telemetry | STATE: OCCUPIED | BATT: 97% | RSSI: -68dBm</div>
        <div>[MQTT] TOPIC: smartpark/zones/zone-pub-01/sensors/ANPR-01/events   | DETECT: KA-01-MJ-5890 | CONFIDENCE: 98.4%</div>
      </div>
    </div>
  `;
}
