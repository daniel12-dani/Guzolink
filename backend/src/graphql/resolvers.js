import Product from "../models/product.model.js";
import Shop from "../models/shop.model.js";

export const resolvers = {
  // Queries
  allShopProducts: async () => {
    return await Product.find();
  },
  shopProducts: async ({ shopId }) => {
    return await Product.find({ shop: shopId });
  },

  // Mutations
  createProduct: async ({ input }, { user }) => {
    if (!user) throw new Error("Unauthenticated");
    const { name, price, category, shop: shopId, description, stock, image } = input;
    if (!name || !price || !category || !shopId) {
      throw new Error("Name, price, category, and shop are required");
    }
    const existingShop = await Shop.findOne({ _id: shopId, owner: user.id });
    if (!existingShop) {
      throw new Error("Unauthorized or shop does not exist");
    }
    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      shop: shopId,
      image,
    });
    return product;
  },

  updateProduct: async ({ id, input }, { user }) => {
    if (!user) throw new Error("Unauthenticated");
    const product = await Product.findById(id).populate("shop");
    if (!product) throw new Error("Product not found");
    if (String(product.shop.owner) !== String(user.id)) {
      throw new Error("Unauthorized to update this product");
    }
    return await Product.findByIdAndUpdate(id, input, { new: true });
  },

  deleteProduct: async ({ id }, { user }) => {
    if (!user) throw new Error("Unauthenticated");
    const product = await Product.findById(id).populate("shop");
    if (!product) throw new Error("Product not found");
    if (String(product.shop.owner) !== String(user.id)) {
      throw new Error("Unauthorized to delete this product");
    }
    await Product.findByIdAndDelete(id);
    return true;
  },
};
