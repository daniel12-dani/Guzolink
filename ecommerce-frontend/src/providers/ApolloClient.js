import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { API_BASE_URL } from "../config/api.js";
import { storage } from "../shared/lib/storage.js";

console.log("The api request is is being sent to : ", API_BASE_URL);

const httpLink = new HttpLink({
  uri: `${API_BASE_URL}/api/products`,
  credentials: "include",

  // Custom fetch so we can attach the Authorization header on every
  // single request. `storage.token.get()` is called INSIDE this
  // function (not hoisted above it) so it always reads the current
  // token at request time — same principle as apiClient.js, which
  // already does this correctly for REST. Apollo doesn't get this for
  // free just because REST has it; it's a separate HTTP client and
  // needed its own wiring.
  fetch: (uri, options) => {
    const token = storage.token.get();
    return fetch(uri, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});