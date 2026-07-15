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
  cache: new InMemoryCache(),
});