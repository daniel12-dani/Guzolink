import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "../../../shared/lib/apiClient";
import useShopProducts from "../../products/hooks/useShopProducts";

function ShopDashboard() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [shopError, setShopError] = useState("");
  
  const { products, loading: productsLoading, error: productsError, deleteProduct } = useShopProducts(shopId);

  useEffect(() => {
    (async () => {
      try {
        const data = await request(`/api/shop/${shopId}`);
        if (data.success) setShop(data.shop);
        else setShopError(data.message);
      } catch (e) {
        setShopError(e.message);
      }
    })();
  }, [shopId]);

  if (shopError) return <p className="p-6 text-red-600">{shopError}</p>;
  if (!shop) return <p className="p-6 text-white">Loading…</p>;

  return (
    <div className="mx-auto max-w-7xl p-6 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-800 p-8 shadow-sm">
        <Link to="/shops" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to shops
        </Link>
        <h2 className="text-3xl font-bold text-white mb-2">{shop.name}</h2>
        <p className="text-slate-300 mb-6">{shop.description}</p>

        <Link
          to={`/shop/${shopId}/product/create`}
          className="inline-flex items-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-white mb-4">Manage Products</h3>
        
        {productsLoading ? (
          <p className="text-slate-300">Loading products...</p>
        ) : productsError ? (
          <p className="text-red-400">{productsError}</p>
        ) : products.length === 0 ? (
          <p className="text-slate-400">No products found. Create your first product above!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                  <p className="text-sm text-slate-400 mb-2">{product.category?.name || product.category} • ${product.price}</p>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-4">{product.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-500/40 transition"
                  >
                    Delete
                  </button>
                  {/* Edit can be added later */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopDashboard;
