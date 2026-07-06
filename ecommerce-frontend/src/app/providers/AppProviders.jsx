import { AuthProvider } from "../../features/auth/auth.context";
import { CartProvider } from "../../features/cart/cart.context";
import { CategoryProvider } from "../../features/categories/category.context";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CategoryProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default AppProviders;
