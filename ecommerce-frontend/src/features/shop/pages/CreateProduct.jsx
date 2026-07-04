import { useNavigate, useParams, Link } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { request } from "../../../shared/lib/apiClient";
import { useState } from "react";

function CreateProduct() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleAddItem = async (payload) => {
    try {
      // Add the shopId to the payload
      const finalPayload = { ...payload, shop: shopId };
      const data = await request("/api/product", {
        method: "POST",
        body: JSON.stringify(finalPayload),
      });

      if (data.success) {
        navigate(`/shop/${shopId}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to={`/shop/${shopId}`} className="text-sm font-medium text-amber-500 hover:text-amber-400">
          &larr; Back to Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-white">Create New Product</h1>
      </div>
      
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      <ProductForm onAddItem={handleAddItem} />
    </div>
  );
}

export default CreateProduct;
