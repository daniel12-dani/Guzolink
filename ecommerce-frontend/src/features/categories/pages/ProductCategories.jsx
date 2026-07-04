import { Link } from "react-router-dom";
import ShopCard from "../components/ShopCard";
import useShops from "../hooks/useShops";

function MyShops() {
  const { shops, error, handleDelete } = useShops();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Shops</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default MyShops;
