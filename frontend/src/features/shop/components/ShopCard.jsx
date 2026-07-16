import { Link } from "react-router-dom";
import EditShopModal from "../components/EditShopModal.jsx";
import ConfirmModal from "../../../components/ConfirmModal.jsx";
import { useState } from "react";
import { useShops } from "../shop.context.js";

function ShopCard({ shop, isOwner }) {
  const { updateShop, isUpdatingShop, updateShopError, deleteShop } =
    useShops();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteShop(pendingDelete._id);
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Professional URL Resolver
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://picsum.photos/200/300";
    const productionBackendUrl = import.meta.env.VITE_API_URL || "";
    return `${productionBackendUrl}${imagePath}`;
  };

  // console.log("ShopCard rendering with shop image:", shop.posterImage, "isOwner:", isOwner);

  return (
    <div className="relative w-64 justify-items-center rounded-xl overflow-hidden shadow-lg transform transition-shadow duration-300 hover:scale-[1.01]">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={getImageUrl(shop.posterImage)}
          alt={shop.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://picsum.photos/200/300";
          }}
        />
      </div>
      <div className="p-4 bg-white/10 backdrop-blur border-t border-white/10">
        <h3 className="text-xl font-semibold text-white">{shop.name}</h3>
        {shop.location && (
          <p className="text-sm text-slate-300">{shop.location}</p>
        )}
        {shop.contact && (
          <p className="text-sm font-medium text-amber-400 mt-1">
            {shop.contact}
          </p>
        )}
        <p className="mt-2 text-slate-200">{shop.description}</p>
        {shop.rating !== undefined && (
          <p className="mt-1 text-sm text-amber-500">Rating: {shop.rating}/5</p>
        )}

        {isOwner && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/shops/${shop._id}`}
              className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white font-medium hover:bg-white/30 transition"
            >
              Manage
            </Link>
            <button
              onClick={() => setEditingShop(shop)}
              className="inline-flex items-center rounded-lg bg-amber-500/20 px-4 py-2 text-amber-300 font-medium hover:bg-amber-500/40 transition"
            >
              Edit
            </button>
            <button
              onClick={() => setPendingDelete(shop)}
              className="inline-flex items-center rounded-lg bg-red-500/20 px-4 py-2 text-red-300 font-medium hover:bg-red-500/40 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete this shop?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        isDangerous
        isConfirming={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <EditShopModal
        open={!!editingShop}
        shop={editingShop}
        isUpdating={isUpdatingShop}
        updateError={updateShopError}
        onClose={() => setEditingShop(null)}
        onSave={(id, data) => updateShop(id, data)}
      />
    </div>
  );
}

export default ShopCard;