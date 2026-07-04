import { useEffect, useState } from "react";
import { request } from "../../../shared/lib/apiClient";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await request("/api/product/all-shop-products");
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { products, loading, error };
}
