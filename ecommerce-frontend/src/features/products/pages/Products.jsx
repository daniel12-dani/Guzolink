import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../catalog.context";
import ShopForm from "../../shop/components/ShopForm";
import ShopRequestPanel from "../../shop/components/ShopRequestPanel";

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useCatalog();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "", stock: "" });

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = (productId) => {
    updateProduct(productId, {
      name: editForm.name,
      price: Number(editForm.price),
      category: editForm.category,
      stock: Number(editForm.stock || 0),
    });
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Shop</p>
        <h1 className="text-3xl font-bold text-slate-900">Discover the essentials</h1>
        <p className="max-w-2xl text-slate-600">
          Add, update, view, and remove items with the built-in management tools.
        </p>
      </div>

      <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ShopForm onAddItem={addProduct} />
        <ShopRequestPanel />
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Manage items</h2>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
              {editingId === product.id ? (
                <div className="grid gap-3 md:grid-cols-4">
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="rounded-xl border border-slate-300 px-3 py-2" />
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="rounded-xl border border-slate-300 px-3 py-2" />
                  <input name="category" value={editForm.category} onChange={handleEditChange} className="rounded-xl border border-slate-300 px-3 py-2" />
                  <input type="number" name="stock" value={editForm.stock} onChange={handleEditChange} className="rounded-xl border border-slate-300 px-3 py-2" />
                  <div className="md:col-span-4 flex gap-2">
                    <button onClick={() => saveEdit(product.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
                    <button onClick={() => setEditingId(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-600">{product.category} • ${product.price} • Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(product)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Update</button>
                    <button onClick={() => deleteProduct(product.id)} className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
