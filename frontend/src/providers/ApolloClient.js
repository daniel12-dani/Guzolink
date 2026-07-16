import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { Observable } from "rxjs"; // AC4 uses RxJS as its observable implementation now
import { API_BASE_URL } from "../config/api.js";
import { storage } from "../shared/lib/storage.js";

console.log("The api request is is being sent to : ", API_BASE_URL);

const REQUEST_TIMEOUT_MS = 15000;

const timeoutLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const timer = setTimeout(() => {
      observer.error(
        new Error(
          `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. The server may be slow or unreachable.`,
        ),
      );
    }, REQUEST_TIMEOUT_MS);

    const subscription = forward(operation).subscribe({
      next: (result) => {
        clearTimeout(timer);
        observer.next(result);
      },
      error: (err) => {
        clearTimeout(timer);
        observer.error(err);
      },
      complete: () => {
        clearTimeout(timer);
        observer.complete();
      },
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  });
});

const httpLink = new HttpLink({
  uri: `${API_BASE_URL}/api/products`,
  credentials: "include",
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
  link: ApolloLink.from([timeoutLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            // keyArgs: false means all `products(page, limit)` calls
            // write into ONE shared cache list, rather than caching a
            // separate list per page/limit combo (which is what caused
            // "existing 6, incoming 5" to look like a mismatch).
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              const page = args?.page ?? 1;
              const limit = args?.limit ?? 6;

              // page 1 = a fresh load or a cache-and-network revalidation
              // of the home page — replace entirely rather than append,
              // so a newly created product (or a deleted one) is reflected
              // instead of stacking onto stale cached entries.
              if (page === 1) return incoming;

              // page > 1 = fetchMore — append incoming to the tail
              const merged = existing.slice(0);
              const offset = (page - 1) * limit;
              for (let i = 0; i < incoming.length; i++) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});