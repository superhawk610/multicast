import { useContext, useEffect, useState } from 'react';
import { AppContext, Message } from '../AppProvider';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { subscribeToMessages } = useContext(AppContext);
  useEffect(() => subscribeToMessages(setMessages), []);

  return messages;
}
