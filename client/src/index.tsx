import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import ApolloClient from 'apollo-boost';

import './index.scss';

import { App } from './components/App';

import { AppContext, createAppContext } from './AppContext';

const client = new ApolloClient({ uri: 'http://localhost:4000' });

const appContext = createAppContext();

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <AppContext.Provider value={appContext}>
        <App />
      </AppContext.Provider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
