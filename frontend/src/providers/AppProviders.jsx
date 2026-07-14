import { AuthProvider } from "../features/auth/auth.context.js";
import { ShopProvider } from "../features/shop/shop.context.js";
import { CartProvider } from "../features/cart/cart.context.js";
import { CategoryProvider } from "../features/categories/category.context.js";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ShopProvider>
      <CategoryProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CategoryProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

export default AppProviders;
