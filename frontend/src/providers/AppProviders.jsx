import { AuthProvider } from "../features/auth/auth.context.js";
import { ShopProvider } from "../features/shop/shop.context.js";
import { CartProvider } from "../features/cart/cart.context.js";
import { CategoryProvider } from "../features/categories/category.context.js";
import { ToastProvider } from "../features/toast/toast.context.jsx";


function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
      <ShopProvider>
      <CategoryProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CategoryProvider>
      </ShopProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default AppProviders;
