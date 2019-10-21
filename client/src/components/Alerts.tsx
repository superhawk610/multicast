import * as React from 'react';
import { useAlerts } from '../hooks/useAlerts';

import { MessageList } from './MessageList';

const Alerts = () => {
  const { alerts } = useAlerts();

  return <MessageList messages={alerts} />;
};

export { Alerts };
