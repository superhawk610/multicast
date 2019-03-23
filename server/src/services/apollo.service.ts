import { join } from 'path';
import * as request from 'request-promise-native';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Query } from '../resolvers/Query';
import { Mutation } from '../resolvers/Mutation';
import { Subscription } from '../resolvers/Subscription';

import {
  PORT,
  DISABLE_PLAYGROUND,
  PLAYGROUND_URL,
  SANDBOX,
} from './config.service';
import { initializeDatabase } from './initialize-database.service';
import { startScanning } from './scan-devices.service';

import { authMiddleware } from '../middleware/auth.middleware';
import { fallbackMiddleware } from '../middleware/fallback.middleware';

const typeDefs = importSchema(join(__dirname, '..', 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

export async function startServer(fallback = false) {
  const db = fallback ? null : await initializeDatabase();
  if (db) startScanning();
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: SANDBOX
      ? []
      : fallback
      ? [authMiddleware, fallbackMiddleware]
      : [authMiddleware],
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
      };
    },
  });

  // setup __proxy route for stripping problematic iframe headers
  server.express.get('/__proxy', (req, res) => {
    const { url } = req.query;
    request(url)
      .on('response', res => {
        delete res.headers['x-frame-options'];
        delete res.headers['content-security-policy'];
      })
      .pipe(res);
  });

  // listen on the provided PORT
  server.start(
    { port: PORT, playground: DISABLE_PLAYGROUND ? false : PLAYGROUND_URL },
    () => {
      const playgroundMessage = DISABLE_PLAYGROUND
        ? 'disabled'
        : `http://localhost:${PORT}${PLAYGROUND_URL}`;
      console.log();
      console.log('  ---');
      console.log(`  Server is running on http://localhost:${PORT}`);
      console.log(`  GraphQL playground: ${playgroundMessage}`);
      console.log('  ---');
      console.log();
    },
  );
}
