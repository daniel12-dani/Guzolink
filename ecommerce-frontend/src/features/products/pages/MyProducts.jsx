import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../shared/lib/apiClient";

function MyShops() {
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Shops</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {shops.map(shop => (
          <div key={shop._id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{shop.name}</h3>
            <p>{shop.description}</p>
            <Link
              to={`/shop/${shop._id}`}
              className="text-amber-600 underline mt-2 inline-block"
            >
              Manage shop
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyShops;
