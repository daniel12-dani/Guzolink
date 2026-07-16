import { Link } from "react-router-dom";

function ShopCard({ shop, onDelete, isOwner }) {
  return (
    <div className="relative w-64 justify-items-center rounded-xl overflow-hidden shadow-lg transform transition-shadow duration-300 hover:scale-[1.01]">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={shop.posterimage || "https://picsum.photos/200/300"}
          alt={shop.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Prevents infinite loops if the fallback fails
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placeholder.com";
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
          <Link
            to={`/shops/${shop._id}/edit`}
            className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-slate-900 font-medium hover:bg-amber-400 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(shop._id)}
            className="inline-flex items-center rounded-lg bg-red-500/20 px-4 py-2 text-red-300 font-medium hover:bg-red-500/40 transition"
          >
            Delete
          </button>
        </div>)}
      </div>
    </div>
  );
}

export default ShopCard;
