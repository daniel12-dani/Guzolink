# Recommended Target Shape**

I would refactor the frontend into a feature-first structure, not a single “context” bucket. The cleanest version for this app would look like this:

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
    hooks/
  features/
    auth/
      api/
      hooks/
      components/
      pages/
    catalog/
      api/
      hooks/
      components/
      pages/
    cart/
      hooks/
      components/
      pages/
    shop-admin/
      components/
      pages/
  assets/
  styles/
```

The main idea is: each domain owns its own state, API calls, and UI. Auth should not live in the same module as cart or products. Product catalog should not also own localStorage for user sessions. Shared code should be limited to reusable UI and low-level utilities.

**Refactor Plan**

Current state: the frontend has one provider in src/main.jsx wrapping the entire app, and that provider exposes too many unrelated concerns from src/context/products.js. The page components are relatively clean, but they depend on a very broad context surface.

Target state: the app keeps a small root provider, but the business logic is split into focused modules. Auth becomes its own feature, cart becomes its own feature, catalog becomes its own feature, and shared components only consume the specific state they need.

### Context Map

| File | Purpose | Changes Needed |
|---|---|---|
| src/context/products.js | Currently mixes products, cart, auth, persistence, and API calls | Split into feature-specific state modules or hooks |
| src/main.jsx | Mounts the single provider | Replace with composed providers or a thin app-level provider |
| src/pages/Login.jsx | Auth form | Move to auth feature and consume auth hook/service |
| src/pages/Signup.jsx | Auth form | Move to auth feature and consume auth hook/service |
| src/components/Navbar.jsx | Reads cart/user/logout | Switch to smaller auth/cart hooks |
| src/pages/Cart.jsx | Reads cart state | Use cart hook only |
| src/pages/Products.jsx | Reads catalog plus admin-ish actions | Split product catalog UI from shop-admin tools |
| src/feat-form/ShopForm.jsx | Add-item form | Move into shop-admin feature |
| src/feat-form/ShopRequestPanel.jsx | Request form | Move into shop-admin feature |
| backend/src/routes/main.js | Backend route grouping | Use as the organizational model for the frontend |

### Execution Plan

#### Phase 1: Decide the domain boundaries
- [x] Step 1.1: Define the frontend domains as `auth`, `catalog`, `cart`, and `shop-admin`
- [x] Step 1.2: Decide whether to keep context or move to hooks + small services
- [x] Verify: Each current function in src/context/products.js maps to exactly one domain

#### Phase 1 Evaluation

The current umbrella context in src/context/products.js breaks down cleanly into the following ownership model:

| Function / State | Domain | Notes |
|---|---|---|
| user, signup, login, logout | auth | Owns backend auth calls and session storage |
| products, addProduct, updateProduct, deleteProduct | catalog | Owns product list and product management actions |
| cart, addToCart, removeFromCart, updateQuantity, clearCart, total | cart | Owns shopping-cart state and derived totals |
| localStorage access | shared | Move to reusable storage helpers |
| fetch calls | shared/auth | Move to a shared API client, with auth-specific endpoints in the auth feature |

Decision: use feature-specific hooks and small services, not one shared context. A thin app-level provider is still fine, but it should compose focused providers instead of storing all business logic in one module.

Phase 1 is now complete because the frontend boundaries are defined and the migration direction is fixed.

#### Phase 2: Introduce shared infrastructure
- [x] Step 2.1: Add a shared API client for backend access
- [x] Step 2.2: Add shared storage helpers for token/user/cart persistence
- [x] Step 2.3: Add an app-level provider composition file
- [x] Verify: App still renders with the new provider composition

#### Phase 2 Result

The frontend now has these shared building blocks:

- [src/shared/lib/apiClient.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/shared/lib/apiClient.js) for backend requests
- [src/shared/lib/storage.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/shared/lib/storage.js) for localStorage access
- [src/app/providers/AppProviders.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/app/providers/AppProviders.jsx) as the root provider composition layer

The existing umbrella context still owns business state, but it now depends on shared utilities instead of reaching directly into fetch and localStorage.

#### Phase 3: Split feature state
- [x] Step 3.1: Extract auth state and API calls into `features/auth`
- [x] Step 3.2: Extract cart state into `features/cart`
- [x] Step 3.3: Extract product/catalog state into `features/catalog`
- [x] Verify: Login, signup, cart, and product pages still work independently

#### Phase 3 Result

The frontend now has separate state modules for each main domain:

- [src/features/auth/auth.context.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/auth/auth.context.js) owns user session state and auth API calls
- [src/features/cart/cart.context.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/cart/cart.context.js) owns cart state and derived totals
- [src/features/catalog/catalog.context.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/catalog/catalog.context.js) owns product list and product actions

The compatibility layer in [src/context/products.js](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/context/products.js) still exists so the remaining catalog pages can keep working until phase 4 moves the UI into matching feature folders.

#### Phase 4: Move UI into matching features
- [x] Step 4.1: Move src/pages/Login.jsx and src/pages/Signup.jsx into `features/auth/pages`
- [x] Step 4.2: Move src/pages/Products.jsx and product-related UI into `features/catalog`
- [x] Step 4.3: Move src/feat-form/ShopForm.jsx and src/feat-form/ShopRequestPanel.jsx into `features/shop-admin`
- [x] Verify: Route imports still resolve and the app builds

#### Phase 4 Result

The frontend UI now lives in feature-owned folders:

- [src/features/auth/pages/Login.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/auth/pages/Login.jsx)
- [src/features/auth/pages/Signup.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/auth/pages/Signup.jsx)
- [src/features/catalog/pages/Products.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/catalog/pages/Products.jsx)
- [src/features/catalog/pages/ProductDetails.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/catalog/pages/ProductDetails.jsx)
- [src/features/catalog/components/ProductCard.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/catalog/components/ProductCard.jsx)
- [src/features/shop-admin/components/ShopForm.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/shop-admin/components/ShopForm.jsx)
- [src/features/shop-admin/components/ShopRequestPanel.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/features/shop-admin/components/ShopRequestPanel.jsx)

The app router now imports these feature pages directly, and the old page/component files were removed so the old structure no longer acts as a second source of truth.

#### Phase 5: Replace the umbrella context
- [x] Step 5.1: Remove direct consumers from `useProducts`
- [x] Step 5.2: Replace `useProducts` with `useAuth`, `useCart`, and `useCatalog`
- [x] Step 5.3: Keep a temporary compatibility adapter only if needed
- [x] Verify: Lint and build pass after the migration

#### Phase 5 Result

The compatibility bridge has been removed. The app shell now composes the feature providers directly in [src/app/providers/AppProviders.jsx](/home/fraold/Develop_and_Code/StandardProjects/MyProjects/Guzolink/ecommerce-frontend/src/app/providers/AppProviders.jsx), and the old umbrella context is no longer needed.

#### Phase 6: Cleanup
- [ ] Step 6.1: Delete deprecated `context/products.js` once nothing imports it
- [ ] Step 6.2: Rename confusing files and folders to match ownership
- [ ] Step 6.3: Update README with the new frontend structure
- [ ] Verify: No dead imports or stale paths remain

### Rollback Plan
If a step breaks the app:
1. Restore the previous `ProductsProvider` wrapper in src/main.jsx
2. Repoint consumers back to src/context/products.js while the split is finished

### Risks
- The biggest risk is breaking every consumer at once, so this should be migrated feature by feature rather than in one sweep.
- Session storage keys may change, so auth/cart persistence needs a compatibility window.
- The current `user` shape is already shifting from `name` to `username`, so the new auth module should standardize that early.
- The product admin UI in src/pages/Products.jsx is really a separate feature from browsing products, so it should be split carefully to avoid duplicate state.

If you want, I can turn this into a concrete file-by-file migration plan next, with the exact new folders and the order I’d move each file.