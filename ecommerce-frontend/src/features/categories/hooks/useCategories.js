import { useEffect, useState } from "react";
import { request } from "../../../shared/lib/apiClient";

function useShops() {
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await request("/api/shop");
        if (data.success) setShops(data.shops);
        else setError(data.message);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      const data = await request(`/api/shop/${id}`, { method: "DELETE" });
      if (data.success) {
        setShops((prev) => prev.filter((s) => s._id !== id));
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return { shops, error, handleDelete };
}

export default useShops;
