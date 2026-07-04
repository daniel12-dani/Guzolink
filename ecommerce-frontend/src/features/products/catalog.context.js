import { createContext, createElement, useContext, useMemo, useState } from "react";
import { products as productCatalog } from "../../data/products";

const CatalogContext = createContext(null);

function CatalogProvider({ children }) {
  const [products, setProducts] = useState(productCatalog);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      name: productData.name,
      price: Number(productData.price),
      category: productData.category || "General",
      description: productData.description || "",
      badge: productData.badge || "New",
      size: productData.size || "",
      color: productData.color || "",
      stock: Number(productData.stock || 0),
      image: productData.image || "",
      sku: productData.sku || "",
      tags: productData.tags || [],
      sizes: productData.sizes || [],
      featured: Boolean(productData.featured),
      freeShipping: Boolean(productData.freeShipping),
    };

    setProducts((currentProducts) => [newProduct, ...currentProducts]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts((currentProducts) =>
      currentProducts.map((item) => (item.id === productId ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== productId));
  };

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [products]
  );

  return createElement(CatalogContext.Provider, { value }, children);
}

function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}

export { CatalogProvider, useCatalog };
