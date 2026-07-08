import Product from "../../models/product.model.js";

export const ProductResolvers = {
  //   queries
  getAllShopProducts: async () => {
    return await Product.find();
  },
  shopProducts: async (parent, { shopId }) => {
    return await Product.find({ shop: shopId });
  },

  //   mutation
  createProduct: async (parents, args, {user }) => {
    try {
      if (!user) throw new Error("You are not AUTHENTICATED ");

      //   get the details from input
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

      //   save the product
      return await Product.create({
        name,
        description,
        price,
        stock: stock || 0,
        category,
        shop: shopId,
        image,
      });
    } catch (error) {
      console.log("Error while creating a product: ", error.message);
    }
  },
};
