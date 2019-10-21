import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

export function configureApolloClient() {
  const httpLink = new HttpLink({
    uri: `http://${host}:${port}`,
    credentials: 'same-origin',
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${host}:${port}`,
    options: {
      reconnect: true,
    },
  });

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
