import { Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

// globals
import ProtectedRoute from "./components/ProtectedRoute";
import { client } from "./providers/ApolloClient.js";

// componenets
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// auth
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import UpdateUserInfo from "./features/auth/pages/Update";
import Dashboard from "./features/auth/pages/Dashboard";

// shops
import MyShops from "./features/shop/pages/MyShops";
import CreateShop from "./features/shop/pages/CreateShop";
import ShopDashboard from "./features/shop/pages/ShopDashboard";

// products
import Products from "./features/products/pages/Products";
// import CreateProduct from "./features/shop/pages/CreateProduct";
// import ProductDetails from "./features/products/pages/ProductDetails";

// shoping and marketing
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";

function App() {
  ``;
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
            path="shops"
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

          {/* <Route
            path="/shop/:shopId/product/create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          /> */}

          <Route path="/products" element={<Products />} />
        </Routes>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
