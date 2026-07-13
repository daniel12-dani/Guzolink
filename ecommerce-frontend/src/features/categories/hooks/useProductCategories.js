// features/products/hooks/useProductCategories.js
//
// REST, not GraphQL — categories still live on the REST side of your
// app (confirmed by /api/product-category showing up in your server
// logs). Same three-state shape as everything else: loading/data/error.

import { useEffect, useState } from "react";
import { request } from "../../../shared/lib/apiClient";

export default function useProductCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await request("/api/product-category");
        if (cancelled) return;
        // NOTE: confirm the actual response key here — adjust
        // `data.categories` to whatever your endpoint really returns
        // (could be `data.productCategories`, etc).
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}