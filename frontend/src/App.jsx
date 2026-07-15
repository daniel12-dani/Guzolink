import { Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

// globals
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { client } from "./providers/ApolloClient.js";

// componenets
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";

// auth
import Login from "./features/auth/pages/Login.jsx";
import Signup from "./features/auth/pages/Signup.jsx";
import UpdateUserInfo from "./features/auth/pages/Update.jsx";
import Dashboard from "./features/auth/pages/Dashboard.jsx";

// shops
import MyShops from "./features/shop/pages/MyShops.jsx";
import CreateShop from "./features/shop/pages/CreateShop.jsx";
import ShopDashboard from "./features/shop/pages/ShopDashboard.jsx";
import ShopProducts from "./features/shop/pages/ShopProducts.jsx";

// products
import CreateProductCard from "./features/products/pages/CreateProduct.jsx";
// import ProductDetails from "./features/products/pages/ProductDetails";

// shoping and marketing
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";

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
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/update/:userId"
            element={
              <ProtectedRoute>
                <UpdateUserInfo />
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
            path="/shop/create"
            element={
              <ProtectedRoute>
                <CreateShop />
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
            path="/shop/:shopId/product"
            element={
              <ProtectedRoute>
                <ShopProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:shopId/product/create"
            element={
              <ProtectedRoute>
                <CreateProductCard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
