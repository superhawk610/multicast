import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';
import { getInjected } from './getInjected';
import { AUTH_TOKEN, COLORS, APPLICATION_BASE } from './constants';
import * as badge from 'console-badge';

const upstream = getInjected('upstream', '');
const host = upstream[0] || process.env.SERVER_HOST;
const port = upstream[1] || process.env.SERVER_PORT;

function logError(tag: string, color: string, error: Error) {
  badge.error({
    leftText: tag,
    rightText: error.message,
    leftBgColor: color,
    rightBgColor: COLORS.greyLighter,
    rightTextColor: COLORS.greyDarker,
  });
}

export function configureApolloClient() {
  const token = localStorage.getItem(AUTH_TOKEN) || getInjected('token', null);

  const httpLink = new HttpLink({
    uri: `http://${host}:${port}`,
    credentials: 'same-origin',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  /**
   * TODO: when the React DevTools extension is enabled in Chrome, you will see
   * a set of warnings that looks something like the following:
   *
   * ```
   * WebSocket connection to 'ws://localhost:4000/' failed: WebSocket is closed before the connection is established.
   * ```
   *
   * Keep an eye on that issue and update accordingly.
   * ref: https://github.com/apollographql/subscriptions-transport-ws/issues/377
   */
  const client = new SubscriptionClient(`ws://${host}:${port}`, {
    reconnect: true,
    connectionParams: { token },
  });
  const wsLink = new WebSocketLink(client);

  const link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === 'OperationDefinition' && def.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        let unauthorized = false;

        if (graphQLErrors) {
          graphQLErrors.forEach(err => {
            if (/^401:/.test(err.message)) unauthorized = true;
            logError('GraphQL', COLORS.green, err);
          });
        }

        if (networkError) {
          if (/^401:/.test(networkError.message)) unauthorized = true;
          logError('Network', COLORS.red, networkError);
        }

        if (unauthorized && !window.location.pathname.match(/^\/login/)) {
          localStorage.removeItem(AUTH_TOKEN);
          window.location.replace(`${APPLICATION_BASE}/login`);
        }
      }),
      link,
    ]),
    cache: new InMemoryCache(),
  });
}
