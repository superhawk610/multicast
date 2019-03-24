import { useQueryThenSubscription } from './useQueryThenSubscription';

import { getInjected } from '../getInjected';

import { ALERTS } from '../graphql/queries';
import { SUB_ALERTS } from '../graphql/subscriptions';

import { Alert } from '../types';

const device = getInjected('device', null);

export function useAlerts() {
  const { data, loading, error } = useQueryThenSubscription<Alert>(
    ALERTS,
    SUB_ALERTS,
    'alerts',
  );

  const alerts = device
    ? data.filter(a => !a.devices || a.devices.indexOf(device) > -1)
    : data;

  return { alerts, loading, error };
}
