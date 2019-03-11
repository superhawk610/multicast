import * as React from 'react';

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

interface Props {
  children: React.ReactNode;
}

const AppContext = React.createContext({} as ApplicationContext);

const context = createAppContext();

const AppProvider = ({ children }: Props) => {
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
    <AppContext.Provider value={{ ...context, dialog, showDialog, hideDialog }}>
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

  return {
    subscribeToMessages,
    showMessage,
  };
}

function noop() {}

export { AppContext, AppProvider };
