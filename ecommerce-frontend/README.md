# Guzolink Frontend

E-commerce frontend built with React + Vite, featuring a modular architecture organized by domain.

## Architecture

The frontend is structured as feature modules, each owning its own state, API calls, and UI:

```
src/
  app/
    App.jsx
    providers/
      AppProviders.jsx         # Root provider composition
  shared/
    components/               # Reusable UI components
    lib/
      apiClient.js           # Shared API request helper
      storage.js             # Shared localStorage helpers
  features/
    auth/                     # Authentication feature
      auth.context.js         # Auth state and login/signup logic
      pages/
        Login.jsx
        Signup.jsx
    catalog/                  # Product catalog feature
      catalog.context.js      # Product state management
      components/
        ProductCard.jsx
      pages/
        Products.jsx
        ProductDetails.jsx
    cart/                     # Shopping cart feature
      cart.context.js         # Cart state and operations
    shop-admin/              # Shop administration tools
      components/
        ShopForm.jsx
        ShopRequestPanel.jsx
  pages/                      # Shared page layouts
    Home.jsx
    Cart.jsx
    Checkout.jsx
```

## State Management

Each feature module owns its state and exports a hook:

- `useAuth()` - login, signup, logout, user state
- `useCatalog()` - products, product CRUD
- `useCart()` - cart items, add/remove, totals

This eliminates tight coupling and makes features independently testable and scalable.

## Running the App

```bash
npm install
npm run dev                   # Start dev server (connects to backend at http://localhost:9000)
VITE_API_URL=http://api.example.com npm run build  # Build with custom API endpoint
```

Demo credentials:
- Email: demo@guzolink.com
- Password: 123456
