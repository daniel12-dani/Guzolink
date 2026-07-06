import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../../shared/lib/apiClient";
import { useAuth } from "../auth/auth.context";

const CategoryContext = createContext(null);

function CategoryProvider({ children }) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      // Fetch shop categories
      const shopData = await request("/api/shop-category");
      if (shopData.success) {
        setShopCategories(shopData.categories || []);
      } else {
        console.error("Failed to fetch shop categories:", shopData.message);
      }

      // Fetch product categories
      const productData = await request("/api/product-category");
      if (productData.success) {
        setProductCategories(productData.categories || []);
      } else {
        console.error("Failed to fetch product categories:", productData.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const value = useMemo(
    () => ({
      shopCategories,
      productCategories,
      loading,
      error,
      refetchCategories: fetchCategories,
    }),
    [shopCategories, productCategories, loading, error]
  );

  return createElement(CategoryContext.Provider, { value }, children);
}

function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}

export { CategoryProvider, useCategories };
