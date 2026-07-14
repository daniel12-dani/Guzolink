// shared/lib/tokenUtils.js
//
// Helpers for reading and validating a JWT on the frontend.
//
// IMPORTANT theory note: this is a UX convenience only. We use it to avoid
// firing requests we already know will fail, and to show a clean "session
// expired" state instead of a confusing 401 in the console. It is NOT
// security — we can't verify the token's signature here because we don't
// have the secret key. The backend's authMiddleware is the only place that
// actually decides whether a token is trustworthy. Never skip that check
// on the backend just because the frontend also checks.

/**
 * Decodes the payload of a JWT WITHOUT verifying its signature.
 * A JWT is just base64-encoded JSON with a signature glued on, so reading
 * the payload doesn't require any library or secret — we just need the
 * middle segment (header.PAYLOAD.signature).
 */
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    // Malformed token (corrupted, tampered, or not a JWT at all).
    // Treat it exactly like "no token" rather than throwing.
    return null;
  }
}

/**
 * Returns true if the token is missing, malformed, or past its `exp` claim.
 * `exp` in a JWT is a Unix timestamp in SECONDS, so we multiply by 1000
 * to compare against Date.now() (which is in milliseconds).
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) return true; // no exp claim at all = treat as invalid
  return payload.exp * 1000 < Date.now();
}
