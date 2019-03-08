import { join } from 'path';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Query } from '../resolvers/Query';
import { Mutation } from '../resolvers/Mutation';

import { PORT, DISABLE_PLAYGROUND, PLAYGROUND_URL } from './config.service';
import { initializeDatabase } from './initialize-database.service';
import { startScanning } from './scan-devices.service';

import { authMiddleware } from '../middleware/auth.middleware';
import { fallbackMiddleware } from '../middleware/fallback.middleware';

const typeDefs = importSchema(join(__dirname, '..', 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
};

export async function startServer(fallback = false) {
  const db = fallback ? null : await initializeDatabase();
  if (db) startScanning();
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: fallback
      ? [authMiddleware, fallbackMiddleware]
      : [authMiddleware],
    context: ({ request }) => {
      const authorization = request.headers.authorization || '';
      const [, token = null] = /^Bearer (.+)$/.exec(authorization) || [];

      return {
        db,
        user: { token },
      };
    },
  });
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
