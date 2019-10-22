import { join } from 'path';
import * as requestIp from 'request-ip';
import chalk from 'chalk';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { Subscription } from './resolvers/Subscription';

import proxy from './routers/proxy.router';
import client from './routers/client.router';

import { setConfig } from './services/config.service';
import { initializeDatabase } from './services/initialize-database.service';
import { startScanning } from './services/scan-devices.service';

import { authMiddleware } from './middleware/auth.middleware';
import { fallbackMiddleware } from './middleware/fallback.middleware';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

async function startServer(fallback, config) {
  const { PORT, DISABLE_PLAYGROUND, PLAYGROUND_URL, SANDBOX, API_KEY } = config;

  const db = fallback ? null : await initializeDatabase();
  const middlewares: any[] = [];
  if (!SANDBOX) {
    if (db) startScanning();
    middlewares.push(authMiddleware);
    if (fallback) middlewares.push(fallbackMiddleware);
  }

  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares,
    context: ({ request, connection }) => {
      const authorization = request
        ? request.headers.authorization
        : connection
        ? (connection as any).context.Authorization
        : '';
      const [, token = null] = /^Bearer (.+)$/.exec(authorization) || [];

      return {
        db,
        user: { token },
        // WebSocket connections just send an auth token upon initial connection
        // (authentication is handled in `subscriptions.onConnect` when calling
        // `server.start`). Since they don't have a token attached permanently,
        // we need to tell the auth middleware to allow these requests through.
        authorized: !request && Boolean(connection),
      };
    },
  });

  // attach client IP info to request object in handlers
  server.express.use(requestIp.mw());

  // setup __proxy route for stripping problematic iframe headers
  server.express.use('/__proxy', proxy);

  // serve client application with server info injected
  server.express.use('/web', client);

  // listen on the provided PORT
  server.start(
    {
      port: PORT,
      playground: DISABLE_PLAYGROUND ? false : PLAYGROUND_URL,
      subscriptions: {
        onConnect: ({ token }) => {
          if (!SANDBOX && token !== API_KEY) throw new Error('401: You must be logged in.');
        },
      },
    },
    () => {
      const playgroundMessage = chalk.white(
        DISABLE_PLAYGROUND ? 'disabled' : `http://localhost:${PORT}${PLAYGROUND_URL}`,
      );
      console.log(`${chalk.green(`
              ┌────────────────────┐
              │ MultiCast is live! │
              └────────────────────┘
`)}
    ${chalk.blue('https://superhawk610.github.io/multicast-site')}

              ${chalk.dim('Web UI:')} ${chalk.white(`http://localhost:${PORT}/web`)}
  ${chalk.dim('GraphQL Playground:')} ${chalk.white(playgroundMessage)}

`);
    },
  );
}

process.on('message', ({ __type, ...msg }) => {
  switch (__type) {
    case 'CONNECT': {
      setConfig(msg.config);
      startServer(msg.fallback, msg.config).catch(error => {
        if (process.send) process.send({ __type: 'FATAL', error });
        process.exit(1);
      });
      break;
    }
    // ignore parcel messages
    case undefined:
      break;
    default:
      console.info(`server process received message: ${__type}`);
      console.info(msg);
  }
});
