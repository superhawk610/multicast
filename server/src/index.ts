import { GraphQLServer } from 'graphql-yoga';
import { initializeDatabase } from './initializeDatabase';
import { importSchema } from 'graphql-import';
import { join } from 'path';
import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { authMiddleware } from './middleware/auth.middleware';

const typeDefs = importSchema(join(__dirname, 'schema.graphql'));

const resolvers = {
  Query,
  Mutation,
};

(async () => {
  const db = await initializeDatabase();
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
  server.start(() => console.log('Server is running on localhost:4000'));
})();
