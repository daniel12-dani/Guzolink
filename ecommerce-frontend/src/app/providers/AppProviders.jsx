import { AuthProvider } from "../../features/auth/auth.context";
import { CartProvider } from "../../features/cart/cart.context";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

export default AppProviders;
