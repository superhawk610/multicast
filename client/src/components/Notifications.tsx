import * as React from 'react';
import { useMessages } from '../hooks/useMessages';

import { MessageList } from './MessageList';

const Notifications = () => {
  const messages = useMessages();

  return <MessageList compact messages={messages} />;
};

export { Notifications };
