import { API_BASE_URL } from "../../config/api";
import { storage } from "./storage.js";
export async function request(path, options = {}) {
  const token = storage.token.get();
  const { headers: extraHeaders, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(extraHeaders || {}),
    },
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