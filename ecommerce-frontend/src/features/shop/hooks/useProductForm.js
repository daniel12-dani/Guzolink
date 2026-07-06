import { useState, useEffect, useMemo } from "react";
import { useCategories } from "../../categories/category.context";

/**
 * Hook encapsulating product form state and logic.
 * Returns state, handlers, and derived data for use in UI component.
 */
export function useProductForm({ shop, onAddItem }) {
  const { productCategories } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    sizes: [],
    color: "",
    stock: "",
    description: "",
    image: "",
    sku: "",
    tags: "",
    featured: false,
    freeShipping: false,
  });
  const [message, setMessage] = useState("");

  // Determine filtered categories based on shop type
  const filteredCategories = useMemo(() => {
    if (!shop?.category?.name) return productCategories;
    const shopCat = shop.category.name.toLowerCase();
    if (shopCat === "clothing") {
      return productCategories.filter((c) =>
        ["clothing", "men", "women", "kids"].includes(c.name.toLowerCase())
      );
    }
    if (shopCat === "jewelry") {
      return productCategories.filter((c) =>
        ["jewelry", "accessories"].includes(c.name.toLowerCase())
      );
    }
    if (shopCat === "electronics") {
      return productCategories.filter((c) => c.name.toLowerCase() === "electronics");
    }
    return productCategories;
  }, [productCategories, shop]);

  // Ensure selected category stays valid when filter changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      const stillValid = filteredCategories.some((c) => c._id === formData.category);
      if (!stillValid) {
        setFormData((prev) => ({ ...prev, category: filteredCategories[0]._id }));
      }
    }
  }, [filteredCategories, formData.category]);

  const shopCatName = shop?.category?.name?.toLowerCase() || "";
  const isClothing = shopCatName === "clothing";
  const isJewelry = shopCatName === "jewelry";

  const sizeOptions = useMemo(() => {
    if (isClothing) return ["XS", "S", "M", "L", "XL", "XXL"];
    if (isJewelry) return ["5", "6", "7", "8", "9", "10", "One Size"];
    return [];
  }, [isClothing, isJewelry]);

  const sizeLabel = isClothing
    ? "Sizes (select any)"
    : isJewelry
    ? "Ring Sizes (select any)"
    : "";

  const colorLabel = isJewelry ? "Material / Color" : "Color";
  const colorPlaceholder = isJewelry
    ? "Gold, Silver, Platinum"
    : isClothing
    ? "Black, Blue"
    : "Black, White, Silver";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox" && name === "featured") {
      setFormData((p) => ({ ...p, featured: checked }));
      return;
    }
    if (type === "checkbox" && name === "freeShipping") {
      setFormData((p) => ({ ...p, freeShipping: checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const has = prev.sizes.includes(size);
      return { ...prev, sizes: has ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size] };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.price) {
      setMessage("Please provide at least a name and price.");
      return;
    }
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      color: formData.color,
      stock: Number(formData.stock || 0),
      badge: formData.featured ? "Featured" : "New",
      image: formData.image,
      sku: formData.sku || `SKU-${Date.now()}`,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      sizes: formData.sizes,
      freeShipping: formData.freeShipping,
    };
    onAddItem(payload);
    setMessage(`${payload.name} has been added to the shop.`);
    // Reset form
    setFormData({
      name: "",
      price: "",
      category: filteredCategories[0]?._id || "",
      sizes: [],
      color: "",
      stock: "",
      description: "",
      image: "",
      sku: "",
      tags: "",
      featured: false,
      freeShipping: false,
    });
  };

  return {
    formData,
    setFormData,
    message,
    filteredCategories,
    sizeOptions,
    sizeLabel,
    colorLabel,
    colorPlaceholder,
    handleChange,
    toggleSize,
    handleSubmit,
  };
}
