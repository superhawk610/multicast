import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo-hooks';
import { configureApolloClient } from './configureApollo';

import './index.scss';

import { App } from './components/App';

import { AppProvider } from './AppProvider';

const client = configureApolloClient();

render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <AppProvider>
        <App />
      </AppProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
