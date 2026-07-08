import { GraphQLID, GraphQLList, GraphQLString } from "graphql";
import ProductType from "../types/product.type.js";
import { ProductResolvers } from "../resolvers/product.resolver.js";

const ProductQueries = {
  getAllShopProduct: {
    type: new GraphQLList(ProductType),
    args: {
      id: { type: GraphQLID },
    },
    resolve: ProductResolvers.getAllShopProducts,
  },
  getShopProducts: {
    type: ProductType,
    args: {
      shopId: { type: GraphQLString },
    },
    resolve: ProductResolvers.shopProducts,
  },

};

export default ProductQueries;
