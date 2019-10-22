import * as React from 'react';
import { MessageTheme } from './components/Message';
import { configureApolloClient } from './configureApollo';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

export interface ApplicationContext {
  client: ApolloClient<NormalizedCacheObject>;
  reloadClient: () => void;
  subscribeToMessages: (observer: MessagesObserver) => Unsubscribe;
  showMessage: MessageDispatch;
  dialog: Dialog;
  showDialog: (options?: Partial<Dialog>) => void;
  hideDialog: (confirmed: boolean) => void;
}

interface MessageMap {
  [id: string]: Message;
}

export interface Message {
  id: number;
  title?: string;
  body: string;
  theme?: MessageTheme;
  duration: number;
}

interface MessageDispatch {
  (options: Partial<Message>): void;
  (message: string): void;
}

type MessagesObserver = (messages: Message[]) => void;

type Unsubscribe = () => void;

interface Dialog {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  active: boolean;
}

interface Props {
  children?: any;
}

const AppContext = React.createContext({} as ApplicationContext);

const context = createAppContext();

const AppProvider = ({ children }: Props) => {
  const [client, setClient] = React.useState(configureApolloClient());
  const reloadClient = () => setClient(configureApolloClient());

  const [dialog, setDialog] = React.useState<Dialog>({
    title: '',
    body: '',
    onCancel: noop,
    onConfirm: noop,
    active: false,
  });

  const showDialog = ({
    title = 'Are you sure?',
    body = 'This action CANNOT be undone',
    onCancel = noop,
    onConfirm = noop,
  }: Partial<Dialog> = {}) =>
    setDialog({
      title,
      body,
      onCancel,
      onConfirm,
      active: true,
    });

  const hideDialog = (confirmed: boolean) => {
    setDialog({ ...dialog, active: false });
    if (confirmed) dialog.onConfirm();
    else dialog.onCancel();
  };

  return (
    <AppContext.Provider
      value={{ ...context, client, reloadClient, dialog, showDialog, hideDialog }}
    >
      {children}
    </AppContext.Provider>
  );
};

function createAppContext() {
  let id = 0;
  const messages = {} as MessageMap;
  let observers: MessagesObserver[] = [];

  function subscribeToMessages(observer: MessagesObserver) {
    observers.push(observer);
    observer(Object.values(messages));

    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) return;

      subscribed = false;
      observers = observers.filter(o => o !== observer);
    };
  }

  function showMessage(message: Partial<Message> | string) {
    const messageId = id++;

    if (typeof message === 'string') {
      messages[messageId] = {
        id: messageId,
        body: message,
        duration: 5000,
      };
    } else {
      if (!message.body) {
        throw new Error(`no body provided for message: ${JSON.stringify(message)}`);
      }

      messages[messageId] = {
        id: messageId,
        title: message.title,
        body: message.body,
        theme: message.theme,
        duration: message.duration || 5000,
      };
    }

    setTimeout(() => {
      delete messages[messageId];
      notifyObservers();
    }, messages[messageId].duration);

    notifyObservers();
  }

  function notifyObservers() {
    for (const observer of observers) {
      observer(Object.values(messages));
    }
  }

  return {
    subscribeToMessages,
    showMessage,
  };
}

function noop() {}

export { AppContext, AppProvider };
