import { useEffect, useState } from "react";
import { request } from "../../../shared/lib/apiClient";

export default function useShopProducts(shopId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await request(`/api/product/shop/${shopId}`);
      if (data.success) {
        setProducts(data.products);
      } else {
        // If 404, it means no products yet, which is fine
        if (data.message.includes("No products found")) {
          setProducts([]);
        } else {
          setError(data.message);
        }
      }
    } catch (e) {
      if (e.message.includes("404")) {
        setProducts([]);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchProducts();
    }
  }, [shopId]);

  const deleteProduct = async (productId) => {
    try {
      const data = await request(`/api/product/${productId}`, {
        method: "DELETE",
      });
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId && p.id !== productId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return { products, loading, error, fetchProducts, deleteProduct };
}
