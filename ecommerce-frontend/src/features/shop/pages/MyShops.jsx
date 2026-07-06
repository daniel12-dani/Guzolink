import { Link } from "react-router-dom";
import ShopCard from "../components/ShopCard";
import useShops from "../hooks/useShops";

function MyShops() {
  const { shops, error, handleDelete } = useShops();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Shops</h2>
      <Link
        to="/shop/create"
        className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400 transition mb-4"
      >
        + Add New Shop
      </Link>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} onDelete={handleDelete} />
        ))}
      </div>

      {/* Merchant details section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-2">All Merchants</h3>
        <p className="text-slate-300">Merchant information will be displayed here.</p>
      </div>
    </div>
  );
}

export default MyShops;
