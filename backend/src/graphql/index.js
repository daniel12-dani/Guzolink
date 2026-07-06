import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

// Create GraphQL handler with context containing authenticated user (if any)
export const graphqlHandler = createHandler({
  schema,
  rootValue: resolvers,
  context: (request) => {
    // Express adds `user` via IsLoggedIn middleware for REST routes; for GraphQL we need to extract token manually?
    // For simplicity, we reuse the same middleware by attaching user to request earlier if needed.
    return { user: request.user };
  },
});
