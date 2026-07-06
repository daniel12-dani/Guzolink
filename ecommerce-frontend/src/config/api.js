// VITE_API_URL is set per environment in .env / .env.local / .env.production
// Dev:  http://localhost:8000  (backend port)
// Prod: ""  (same-origin) or "https://api.yourdomain.com" (separate domain)
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
