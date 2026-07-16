import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../../auth/auth.context.js";
import { useShops } from "../shop.context.js";
import { useCategories } from "../../categories/category.context.js";
import ShopFormUi from "../components/ShopForm.jsx";

function CreateShop() {
  const user = useAuth()?.user;
  const { createShop } = useShops();
  const { shopCategories = [] } = useCategories();
  const navigate = useNavigate();

  const [shopDetails, setShopDetails] = useState({
    name: "",
    description: "",
    contact: "",
    category: "", // Leave blank initially
    location: "",
    posterimage: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!shopDetails.name || !shopDetails.contact) {
      setError("Name and contact are required.");
      return;
    }

    // FIX: If the user didn't touch the dropdown, fall back to the first available category
    const finalCategory = shopDetails.category || shopCategories[0]?._id || "";

    const payload = {
      ...shopDetails,
      category: finalCategory,
    };
    try {
      const shopCreationData = await createShop(payload);

      if (shopCreationData.success) {
        setMessage(`Shop "${shopDetails.name}" created successfully!`);
        navigate(`/profile/${user?.id || user?._id}`);
      } else {
        setError(
          shopCreationData.message ||
            "Unable to create shop. Please try again.",
        );
      }
    } catch (err) {
      // 3. THIS CATCHES THE "Shop with this name already exists" THROWN ERROR!
      console.error("Caught form submission error:", err);

      // Read the exact message thrown from your apiClient / backend
      setError(
        err.message || "An unexpected error occurred while creating the shop.",
      );
    }
  };

  // Determine what value the UI dropdown should show
  const currentCategoryValue =
    shopDetails.category || shopCategories[0]?._id || "";

  return (
    <ShopFormUi
      shopDetails={{
        ...shopDetails,
        category: currentCategoryValue, // Ensures UI visual match
      }}
      shopCategories={shopCategories}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      message={message}
      error={error}
    />
  );
}

export default CreateShop;
