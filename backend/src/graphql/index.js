import { createHandler } from "graphql-http/lib/use/express";
// Adjust this path to wherever VerifyToken actually lives in your project
// (same file used by your REST authMiddleware).
import { VerifyToken } from "../middlewares/auth.middleware.js";

import { ProductRootSchema } from "./schema.js";

// Create GraphQL handler with context containing the authenticated user
// (if any). Unlike REST routes, nothing upstream has already verified
// the token for us here — graphql-http's context function receives the
// raw request, it doesn't inherit req.user from Express middleware
// unless that middleware genuinely ran first ON THIS ROUTE. So this
// does the same verification authMiddleware.js does for REST, just
// inline, reusing VerifyToken so the secret-resolution logic (including
// the JW_SECRET/JWT_SECRET fallback) only lives in one place.
export const ProductRoute = createHandler({
  schema: ProductRootSchema,
  context: (request) => {
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return { user: null }; // no token — resolvers that need auth will throw their own error
    }

    try {
      const decoded = VerifyToken(token); // throws on invalid/expired
      return { user: decoded }; // { id, email, role } — matches product.resolver.js expectations
    } catch (err) {
      // expired or invalid token — treat as unauthenticated rather
      // than crashing the whole request
      console.log(err)
      return { user: null };
    }
  },
});