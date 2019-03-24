import { Alert } from '../types';
import { publish, TOPICS } from './subscriptions.service';

const alerts: Alert[] = [];

export function getAllAlerts(): Alert[] {
  return alerts;
}

let id = 0;
export function createAlert({
  title = '',
  body = '',
  theme = 'is-primary',
  duration = 60 * 1000,
  device,
}: Partial<Alert> & { duration?: number; device?: string }): Alert {
  id++;
  const alert = {
    id,
    title,
    body,
    theme,
    devices: device ? [device] : null,
  };
  alerts.push(alert);
  publish(TOPICS.Alerts, { alerts });
  setTimeout(() => clearAlert(id), duration);
  return alert;
}

function clearAlert(id: number): void {
  const idx = alerts.findIndex(a => a.id === id);
  alerts.splice(idx, 1);
  publish(TOPICS.Alerts, { alerts });
}
