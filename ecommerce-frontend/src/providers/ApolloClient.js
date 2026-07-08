import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { API_BASE_URL } from "../config/api.js";
// import { storage } from "./storage";
console.log("The api request is is being sent to : ", API_BASE_URL);

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `${API_BASE_URL}/api/products`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
