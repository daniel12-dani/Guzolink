// features/auth/AuthContext.js
//
// Owns everything about "who is logged in": the user object, the token,
// and whether we're still figuring that out on page load (isAuthLoading).
//
// Design rule this file follows: ONE useEffect PER RESPONSIBILITY.
//   - Effect 1 persists `user` to storage whenever it changes.
//   - Effect 2 restores auth state ONCE when the app mounts (bootstrap).
// Mixing these into a single effect is what caused the original bug —
// it's tempting to add an `if` branch for a second scenario into an
// existing effect, but that's usually the sign it should be its own effect.

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,

} from "react";
import {useNavigate} from "react-router-dom";
import { request } from "../../shared/lib/apiClient.js";
import { storage } from "../../shared/lib/storage.js";
import { isTokenExpired, decodeToken } from "../../shared/lib/tokenUtils.js";
import {client} from "../../providers/ApolloClient.js";
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.user.get());
  const navigate = useNavigate();
  // Any component that needs to know "has auth finished deciding yet?"
  // reads this. It MUST be set to false on every exit path of the
  // bootstrap effect below — otherwise consumers wait forever.
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // --- Effect 1: persistence -------------------------------------------
  // Whenever `user` changes (login, logout, profile update), mirror it
  // to storage. This does NOT run any network requests — it's a pure
  // side effect of state changing, nothing more.
  useEffect(() => {
    storage.user.set(user);
  }, [user]);

  // --- userprofile: declared ABOVE the bootstrap effect on purpose -----
  // (fixes the "accessed before declared" lint error — the effect below
  // references this, so source order should read top-to-bottom)
  const userprofile = async (userId) => {
    try {
      const data = await request(`/api/user/profile/${userId}`, {
        method: "GET",
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Unable to fetch user profile",
        };
      }

      return {
        success: true,
        user: data.user,
        message: data.message || "User profile fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to fetch user profile",
      };
    }
  };

  // --- Effect 2: bootstrap (runs once, on mount) ------------------------
  // This answers: "on a fresh page load, what auth state do we actually
  // have?" It only runs once ([] dependency array) because it's not
  // reacting to `user` changing — login/signup/logout already handle
  // setting `user` themselves, so re-running this on every user change
  // would be redundant and could re-trigger unwanted storage checks.
  //
  // All setState calls live inside resolveAuth, an async function that
  // the effect CALLS rather than setState happening directly in the
  // effect body. This satisfies the "no synchronous setState in effect
  // body" rule — the effect's job is just to kick off a sync with an
  // external system (localStorage + the profile API); the actual state
  // updates happen inside that async operation, same shape as any other
  // fetch-on-mount pattern (see ShopContext for the same structure).
  useEffect(() => {
    let cancelled = false; // guards against setting state after unmount

    async function resolveAuth() {
      const storedToken = storage.token.get();

      // Case 1: no token at all — definitely logged out, nothing to do.
      if (!storedToken) {
        if (!cancelled) setIsAuthLoading(false);
        return;
      }

      // Case 2: token exists but is expired — clear everything and treat
      // as logged out. This is the fix for "still logged in tomorrow".
      if (isTokenExpired(storedToken)) {
        storage.token.remove();
        storage.user.remove();
        storage.shops.set([]); // same reasoning as logout() — see there
        if (!cancelled) {
          setUser(null);
          setIsAuthLoading(false);
        }
        return;
      }

      // Case 3: token is valid, and we already restored a full user
      // object from storage.user.get() when this component first
      // initialized. Nothing further to do.
      if (user) {
        if (!cancelled) setIsAuthLoading(false);
        return;
      }

      // Case 4: token is valid but we have no user object (e.g.
      // storage.user was cleared independently of the token, or this is
      // a first-ever load with only a token present). Recover the
      // user's id straight from the token payload instead of needing it
      // passed in from somewhere else — the token already carries it.
      const payload = decodeToken(storedToken);
      const userId = payload?.userId || payload?.id;

      if (!userId) {
        // Token doesn't even carry an id we can use — treat as invalid.
        storage.token.remove();
        storage.user.remove();
        storage.shops.set([]);
        if (!cancelled) {
          setUser(null);
          setIsAuthLoading(false);
        }
        return;
      }

      const result = await userprofile(userId);
      if (cancelled) return;

      if (result.success) {
        const restoredUser = { ...result.user, token: storedToken };
        storage.user.set(restoredUser);
        setUser(restoredUser);
      } else {
        // Profile fetch failed (e.g. user deleted server-side) — clear
        // the stale token rather than leaving the app in a broken state.
        storage.token.remove();
        storage.user.remove();
        storage.shops.set([]);
        setUser(null);
      }
      setIsAuthLoading(false);
    }

    resolveAuth();

    return () => {
      cancelled = true;
    };
  }, []); // intentionally empty — see comment above

  const signup = async (username, email, password, phone, address) => {
    try {
      const data = await request("/api/user/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, phone, address }),
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Unable to create your account",
        };
      }

      const sessionUser = {
        id: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
        token: data.bearerToken,
      };

      storage.token.set(data.bearerToken);
      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
        message: data.message || "User registered successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to create your account",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await request("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }

      const sessionUser = {
        id: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
        token: data.bearerToken,
      };

      storage.token.set(data.bearerToken);
      await client.clearStore(); // Clear Apollo Client cache
      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
        message: data.message || "Logged in successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
      };
    }
  };

  const updateUser = async (username, phone, address, profileImage) => {
    try {
      const profile = profileImage ? profileImage : null;

      const updatedUserInfo = await request(`/api/user/update/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ username, phone, address, profile }),
      });

      if (!updatedUserInfo.success) {
        return {
          success: false,
          message: updatedUserInfo.message || "Unable to update your account",
        };
      }

      const updatedSessionUser = {
        id: updatedUserInfo.user?.id,
        username: updatedUserInfo.user?.username,
        email: updatedUserInfo.user?.email,
        role: updatedUserInfo.user?.role,
        // Keep the existing token unless the backend explicitly issued a
        // new one on this endpoint. Check with your backend team whether
        // /api/user/update returns a fresh bearerToken — if it does, use
        // it here; if not, this fallback to the current token is correct.
        token: updatedUserInfo.bearerToken || user.token,
      };

      storage.user.set(updatedSessionUser);
      if (updatedUserInfo.bearerToken) {
        storage.token.set(updatedUserInfo.bearerToken);
      }
      setUser(updatedSessionUser);

      return {
        success: true,
        user: updatedSessionUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Invalid operation",
      };
    }
  };

  const logout = async () => {
    storage.token.remove();
    storage.user.remove();
    // Also clear any other per-account caches (shops, etc). Without this,
    // if a different merchant logs in on the same browser, ShopContext's
    // cache-first logic would show them the PREVIOUS merchant's shops
    // until they happened to hit refresh — a real data-leak-shaped bug,
    // not just a stale-UI annoyance.
    storage.shops.set([]);
    await client.clearStore(); // Clear Apollo Client cache
    setUser(null);
    navigate("/");
  };

  // token is exposed separately from `user` because consumers like
  // ShopContext only need the token string for request headers — they
  // shouldn't have to reach into user.token everywhere.
  const value = useMemo(
    () => ({
      user,
      token: user?.token ?? storage.token.get(),
      isAuthLoading,
      signup,
      login,
      logout,
      updateUser,
      userprofile,
    }),
    [user, isAuthLoading],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
