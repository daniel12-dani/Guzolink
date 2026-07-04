import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { products as productCatalog } from "../data/products";
import { API_BASE_URL } from "../config/api";

const ProductsContext = createContext(null);

function ProductsProvider({ children }) {
  const [products, setProducts] = useState(productCatalog);
  const [cart, setCart] = useState(() => {
    const storedCart = window.localStorage.getItem("guzolink-cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem("guzolink-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    window.localStorage.setItem("guzolink-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("guzolink-user", JSON.stringify(user));
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...currentCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

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

  const signup = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
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

    window.localStorage.setItem("guzolink-token", data.bearerToken);
    setUser(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: data.message || "User registered successfully",
    };
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
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

    window.localStorage.setItem("guzolink-token", data.bearerToken);
    setUser(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: data.message || "Logged in successfully",
    };
  };

  const logout = () => {
    window.localStorage.removeItem("guzolink-token");
    setUser(null);
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      products,
      cart,
      user,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      login,
      signup,
      logout,
    }),
    [products, cart, user, total]
  );

  return createElement(
    ProductsContext.Provider,
    { value },
    children
  );
}

function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

export { ProductsProvider, useProducts };
