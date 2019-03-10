import { createContext } from 'react';

export interface ApplicationContext {
  subscribeToMessages: (observer: MessagesObserver) => Unsubscribe;
  showMessage: (options: Message) => void;
  dialog: Dialog;
  showDialog: (options?: Partial<Dialog>) => void;
  hideDialog: (confirmed: boolean) => void;
}

interface MessageMap {
  [id: string]: Message;
}

interface Message {
  id: number;
  body: string;
  duration: number;
}

type MessagesObserver = (messages: Message[]) => Unsubscribe;

type Unsubscribe = () => void;

interface Dialog {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  active: boolean;
}

const AppContext = createContext({} as ApplicationContext);

function noop() {}

export function createAppContext(): ApplicationContext {
  let id = 0;
  const messages = {} as MessageMap;
  let observers: MessagesObserver[] = [];

  // FIXME: this should probably be a state variable in App
  const dialog: Dialog = {
    title: '',
    body: '',
    onCancel: noop,
    onConfirm: noop,
    active: false,
  };

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

  function showMessage({ body, duration = 5000 }: Message) {
    id++;
    messages[id] = {
      id,
      body,
      duration,
    };
    notifyObservers();
  }

  function notifyObservers() {
    for (const observer of observers) {
      observer(Object.values(messages));
    }
  }

  function showDialog({
    title = 'Are you sure?',
    body = 'This action CANNOT be undone',
    onCancel = noop,
    onConfirm = noop,
  }: Partial<Dialog> = {}) {
    dialog.title = title;
    dialog.body = body;
    dialog.onCancel = onCancel;
    dialog.onConfirm = onConfirm;
    dialog.active = true;
  }

  function hideDialog(confirmed: boolean) {
    dialog.active = false;
    if (confirmed) dialog.onConfirm();
    else dialog.onCancel();
  }

  return {
    subscribeToMessages,
    showMessage,
    dialog,
    showDialog,
    hideDialog,
  };
}

export { AppContext };
