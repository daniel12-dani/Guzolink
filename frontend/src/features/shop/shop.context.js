import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  createElement,
} from "react";

import { request } from "../../shared/lib/apiClient.js";
import { useAuth } from "../auth/auth.context.js";
import { storage } from "../../shared/lib/storage.js";

const ShopContext = createContext(null);

function ShopProvider({ children }) {
  const { token, isAuthLoading } = useAuth();

  // --- Caching strategy: "stale-while-revalidate" -----------------------
  // Unlike the user object (which barely changes and we trust once
  // validated), a shop list changes constantly — other merchants add
  // shops, products get added/removed. So we DON'T just trust the cache
  // like AuthContext does with the user. Instead:
  //   1. Seed state from storage so the dashboard renders instantly on
  //      return visits instead of showing a spinner every time.
  //   2. ALWAYS refetch in the background regardless of whether we had
  //      a cache, and overwrite state + cache with whatever comes back.
  // The cache is purely for "don't make them stare at a blank screen
  // while we check" — it is never treated as trustworthy on its own.
  const [shops, setShops] = useState(() => storage.shops.get() || []);

  // Only show the full-page loading state if we have NOTHING cached yet.
  const [isLoading, setIsLoading] = useState(() => storage.shops.get() === null);

  // Separate from isLoading on purpose: this drives a small spinner on
  // the "Refresh" button, NOT a full-page loading screen. If we replaced
  // the whole shop list with "Loading..." every time the merchant hits
  // refresh, they'd lose their place and the UI would feel like it broke
  // — bad UX even though the underlying fetch logic is identical.
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [shopError, setShopError] = useState(null);

  // A ref (not state) that tracks whether this component is still
  // mounted. We use this instead of a per-effect `cancelled` flag
  // because fetchShops is also called manually (e.g. a refresh button)
  // outside of the effect — a single ref covers both cases cleanly.
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // `silent` distinguishes "the merchant explicitly asked to refresh"
  // (silent: true, drives the small button spinner) from "this is the
  // very first load, we have nothing to show yet" (silent: false, drives
  // the full-page loading state).
  const fetchShops = async ({ silent = false } = {}) => {
    if (silent) setShopError(null);
    if (silent) setIsRefreshing(true);

    try {
      const data = await request("/api/shops");
      if (!isMountedRef.current) return; // component unmounted mid-request

      if (data.success) {
        const freshShops = data.shops || [];
        setShops(freshShops);
        storage.shops.set(freshShops); // update cache for next visit
        setShopError(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error fetching shops:", err.message);
      setShopError(err.message || "Failed to load shops");
    } finally {
      if (!isMountedRef.current) {
        return 
      };
      setIsLoading(false);
      if (silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return; // wait for auth to resolve first
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Cache-first: if we already have shops (from a previous visit,
    // restored into state at initialization), trust them and skip the
    // network call entirely. This is what actually fixes the "shouldn't
    // refetch every dashboard visit" complaint — the merchant hits the
    // Refresh button (see MyShops.jsx) whenever they want fresh data,
    // rather than us guessing when to re-verify in the background.
    if (shops.length > 0) {
      setIsLoading(false);
      return;
    }

    fetchShops(); // first-ever load, nothing cached — show full loading state
  }, [isAuthLoading, token]);

  const createShop = async (shopInfo) => {
    try {
      const data = await request("/api/shops", {
        method: "POST",
        body: JSON.stringify(shopInfo),
      });
      if (data.success) {
        setShops((prev) => {
          const next = [...prev, data.shop];
          storage.shops.set(next); // keep cache in sync with state
          return next;
        });
        return {
          success: true,
          shop: data.shop,
          message: data.message || "Shop created successfully",
        };
      }
      return { success: false, message: data.message || "Failed to create shop" };
    } catch (err) {
      console.error("Error creating shop:", err.message);
      return { success: false, message: err.message || "Failed to create shop" };
    }
  };

  const deleteShop = async (id) => {
    try {
      const data = await request(`/api/shops/${id}`, { method: "DELETE" });
      if (data.success) {
        setShops((prev) => {
          const next = prev.filter((s) => s._id !== id);
          storage.shops.set(next); // keep cache in sync with state
          return next;
        });
      } else {
        console.error("Error deleting shop:", data.message);
      }
    } catch (err) {
      console.error("Error deleting shop:", err);
    }
  };

  const fetchSingleShop = async (id) => {
    setShopError(null);
    try {
      const data = await request(`/api/shops/${id}`);
      if (data.success) {
        return { success: true, shop: data.shop };
      } else {
        setShopError(data.message || "Failed to load shop");
        return { success: false, message: data.message || "Failed to load shop" };
      }
    } catch (err) {
      console.error("Error fetching shop:", err.message);
      setShopError(err.message || "Failed to load shop");
    }
  };

  const value = useMemo(
    () => ({
      shops,
      shopError,
      isLoading,
      isRefreshing,
      fetchShops,
      createShop,
      deleteShop,
      fetchSingleShop,
    }),
    [shops, isLoading, isRefreshing, shopError],
  );

  return createElement(ShopContext.Provider, { value }, children);
}

function useShops() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShops must be used within a ShopProvider");
  }
  return context;
}

export { ShopProvider, useShops };