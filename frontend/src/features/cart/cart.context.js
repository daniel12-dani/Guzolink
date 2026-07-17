import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../../shared/lib/storage.js";
import { useToast } from "../toast/toast.context.jsx";

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => storage.cart.get());
  const { showToast } = useToast();
  
  useEffect(() => {
    storage.cart.set(cart);
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      showToast(`${product.name} added to cart`, { type: "success" });
      return [...currentCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
    showToast("Item removed from cart", { type: "info" });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
    showToast("Cart updated", { type: "info" });
  };

  const clearCart = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cart, total]
  );

  return createElement(CartContext.Provider, { value }, children);
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export { CartProvider, useCart };
