import { Routes, Route } from "react-router-dom";
// globals
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "/graphql", credentials: "include" }),
  cache: new InMemoryCache(),
});

// auth
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";

// essentials
import CreateShop from "./features/shop/pages/CreateShop";
import MyShops from "./features/shop/pages/MyShops";
import ShopDashboard from "./features/shop/pages/ShopDashboard";
import CreateProduct from "./features/shop/pages/CreateProduct";
import Products from "./features/products/pages/Products";

import ProductDetails from "./features/products/pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/shop/create"
            element={
              <ProtectedRoute>
                <CreateShop />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shops"
            element={
              <ProtectedRoute>
                <MyShops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:shopId"
            element={
              <ProtectedRoute>
                <ShopDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:shopId/product/create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route path="/products" element={<Products />} />
        </Routes>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
