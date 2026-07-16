import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../../shared/lib/apiClient.js";
import { useAuth } from "../auth/auth.context.js";

const CategoryContext = createContext(null);

function CategoryProvider({ children }) {
  const [shopCategories, setShopCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creatingProductCategory, setCreatingProductCategory] = useState(false);
  const [creatingShopCategory, setCreatingShopCategory] = useState(false);

  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const shopData = await request("/api/shopCategory");
      if (shopData.success) {
        setShopCategories(shopData.categories || []);
      } else {
        console.error("Failed to fetch shop categories:", shopData.message);
      }

      const productData = await request("/api/productCategory");
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

  // Creates a new shop category and appends it to state so the UI
  // updates immediately without a full refetch. Returns the created
  // category so the caller (the shop form) can auto-select it.
  
  // 1.shop also needs its own category
  const createShopCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Category name can't be empty");
    }

    // Avoid duplicate POSTs for a name that already exists
    const existing = shopCategories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    setCreatingShopCategory(true);
    try {
      const data = await request("/api/shopCategory", {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      });

      if (!data.success || !data.category) {
        throw new Error(data.message || "Failed to create category");
      }

      setShopCategories((prev) => [...prev, data.category]);
      return data.category;
    } finally {
      setCreatingShopCategory(false);
    }
  };


  // 2. product needs its own category
  const createProductCategory = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Category name can't be empty");
    }

    // Avoid duplicate POSTs for a name that already exists
    const existing = productCategories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) return existing;

    setCreatingProductCategory(true);
    try {
      const data = await request("/api/productCategory", {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      });

      if (!data.success || !data.category) {
        throw new Error(data.message || "Failed to create product category");
      }

      setProductCategories((prev) => [...prev, data.category]);
      return data.category;
    } finally {
      setCreatingProductCategory(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchCategories();
  }, [user]);

  const value = useMemo(
    () => ({
      shopCategories,
      productCategories,
      loading,
      error,
      creatingShopCategory,
      creatingProductCategory,
      refetchCategories: fetchCategories,
      createShopCategory,
      createProductCategory,
    }),
    [shopCategories, productCategories, loading, error, creatingShopCategory, creatingProductCategory]
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