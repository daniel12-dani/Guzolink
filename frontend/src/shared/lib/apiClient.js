import { API_BASE_URL } from "../../config/api";
import { storage } from "./storage.js";

export async function request(path, options = {}) {
  const token = storage.token.get();

  console.log("Our api base url", API_BASE_URL);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  // eslint-disable-next-line 
  let data = null;

  try {
    data = await response.json();
  } catch {
    const error = new Error("Failed to parse response as JSON");
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}