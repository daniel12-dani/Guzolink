import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { products as productCatalog } from "../data/products";

const ProductsContext = createContext(null);

function ProductsProvider({ children }) {
  const [products] = useState(productCatalog);
  const [cart, setCart] = useState(() => {
    const storedCart = window.localStorage.getItem("guzolink-cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem("guzolink-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const storedUsers = window.localStorage.getItem("guzolink-users");
    return storedUsers ? JSON.parse(storedUsers) : [{ name: "Demo User", email: "demo@Guzolink.com", password: "123456" }];
  });

  useEffect(() => {
    window.localStorage.setItem("guzolink-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("guzolink-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem("guzolink-users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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

  const login = (email, password) => {
    const foundUser = registeredUsers.find((entry) => entry.email === email && entry.password === password);
    if (!foundUser) {
      return false;
    }

    setUser({ name: foundUser.name, email: foundUser.email });
    return true;
  };

  const signup = (name, email, password) => {
    const alreadyExists = registeredUsers.some((entry) => entry.email === email);
    if (alreadyExists) {
      return false;
    }

    const newUser = { name, email, password };
    setRegisteredUsers((currentUsers) => [...currentUsers, newUser]);
    setUser({ name, email });
    return true;
  };

  const logout = () => setUser(null);

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
