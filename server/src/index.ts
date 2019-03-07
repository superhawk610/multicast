import { join } from 'path';

import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';

import { initializeDatabase } from './services/initialize-database.service';
import { PORT, MULTICAST_HOME } from './services/config.service';

import { authMiddleware } from './middleware/auth.middleware';
import { Sequelize } from 'sequelize-typescript';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
};

async function startServer(fallback = false) {
  const db = fallback ? null : await initializeDatabase();
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: [authMiddleware],
    context: ({ request }) => {
      const token = request.headers.authorization || '';

      return {
        db,
        user: { token },
      };
    },
  });
  server.start({ port: PORT }, () =>
    console.log(`Server is running on localhost:${PORT}`),
  );
}

try {
  startServer();
} catch (err) {
  try {
    console.error('Failed to start server.');
    console.error(
      `Make sure ${MULTICAST_HOME} exists and is writable by this process.`,
    );
    console.error();
    console.error(err);
    startServer(true);
  } catch (_err) {
    console.error('Failed to start fallback server.');
    console.error();
    console.error(_err);
    process.exit(1);
  }
}
