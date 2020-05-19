import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.scss';

import { App } from './components/App';
import { AppProvider, AppContext } from './AppProvider';
import { APPLICATION_BASE } from './constants';

render(
  <BrowserRouter basename={APPLICATION_BASE}>
    <AppProvider>
      <AppContext.Consumer>
        {({ client }) => (
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        )}
      </AppContext.Consumer>
    </AppProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
