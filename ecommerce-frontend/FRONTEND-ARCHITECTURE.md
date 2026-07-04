# Frontend Architecture Plan

## Phase 1: Domain Boundaries

The current frontend has one broad context module that owns products, cart, auth, local storage, and API calls. That makes the code hard to reason about because unrelated state changes live in the same place.

The frontend should be split into these domains:

- `auth`: login, signup, token/session handling, current user state
- `catalog`: product listing, product details, product administration, product API access
- `cart`: cart items, quantity changes, totals, checkout handoff
- `shared`: reusable components, API client, storage helpers, route guards

## Target Folder Structure

```text
src/
  app/
    App.jsx
    routes.jsx
    providers/
      AppProviders.jsx
  shared/
    components/
      Navbar.jsx
      Footer.jsx
      ProtectedRoute.jsx
    lib/
      apiClient.js
      storage.js
  features/
    auth/
      api/
      hooks/
      pages/
    catalog/
      api/
      components/
      hooks/
      pages/
    cart/
      hooks/
      components/
      pages/
    shop-admin/
      components/
      pages/
```

## Ownership Rules

- `auth` owns `login`, `signup`, and `logout`.
- `catalog` owns `products`, product CRUD helpers, and product detail lookup.
- `cart` owns `cart`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, and totals.
- `shared` only contains code that is reused across multiple features.

## Migration Order

1. Create shared infrastructure first: API client and storage helpers.
2. Split auth logic out of the current context.
3. Split cart logic out of the current context.
4. Split catalog logic out of the current context.
5. Move UI files into matching feature folders.
6. Remove the old umbrella context after all imports are updated.

## Notes

- Keep `main.jsx` very small. Its only job should be mounting providers and the router.
- Avoid one giant context file in the future. If state is feature-specific, it should live with that feature.
- Standardize the user shape on `username`, not `name`, to match the backend.
- Prefer `VITE_API_URL` for backend configuration so local, dev, and production environments can differ cleanly.
