import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getMainDefinition } from 'apollo-utilities';

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

export function configureApolloClient() {
  const httpLink = new HttpLink({
    uri: `http://${host}:${port}`,
    credentials: 'same-origin',
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
  const client = new SubscriptionClient(`ws://${host}:${port}`, { reconnect: true });
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
        if (graphQLErrors) {
          graphQLErrors.forEach(err => console.log('[GraphQL error]:', err));
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      link,
    ]),
    cache: new InMemoryCache(),
  });
}
