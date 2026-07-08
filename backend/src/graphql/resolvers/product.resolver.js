import Product from "../../models/product.model.js";

export const ProductResolvers = {
  // ─── queries ────────────────────────────────────────────────
  getAllShopProducts: async () => {
    return await Product.find();
  },
  shopProducts: async (parent, { shopId }) => {
    return await Product.find({ shop: shopId });
  },

  // ─── mutations ──────────────────────────────────────────────
  createProduct: async (parent, args, { user }) => {
    if (!user) throw new Error("You are not authenticated");

    const {
      name,
      price,
      category,
      shop: shopId,
      description,
      stock,
      image,
    } = args;

    if (!name || !price || !category || !shopId) {
      throw new Error("Name, price, category, and shop are required");
    }

    return await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      shop: shopId,
      image,
      createdById: user._id || user.id,
    });
  },

  deleteProduct: async (parent, { id }, { user }) => {
    if (!user) throw new Error("You are not authenticated");

    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    // Only the product's creator (or an admin) may delete it.
    const isOwner =
      product.createdById?.toString() === (user._id || user.id)?.toString();
    if (!isOwner && user.role !== "admin") {
      throw new Error("You are not authorized to delete this product");
    }

    await Product.findByIdAndDelete(id);

    // Return the deleted document so the client can confirm what was removed.
    return product;
  },

  updateProduct: async (parent, args, { user }) => {
    if (!user) throw new Error("You are not authenticated");

    const { id, ...updates } = args;

    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    const isOwner =
      product.createdById?.toString() === (user._id || user.id)?.toString();
    if (!isOwner && user.role !== "admin") {
      throw new Error("You are not authorized to update this product");
    }

    // Drop any args the client didn't send (GraphQL passes them as undefined,
    // not omitted) so we don't overwrite existing fields with undefined.
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    return await Product.findByIdAndUpdate(id, cleanedUpdates, { new: true });
  },
};
