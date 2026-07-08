import { GraphQLID, GraphQLList, GraphQLString } from "graphql";
import ProductType from "../types/product.type.js";
import { ProductResolvers } from "../resolvers/product.resolver.js";

const ProductQueries = {
  getAllShopProducts: {
    type: new GraphQLList(ProductType),
    args: {
      id: { type: GraphQLID },
    },
    resolve: ProductResolvers.getAllShopProducts,
  },
  getShopProducts: {
    type: ProductType,
    args: {
      shopId: { type: GraphQLID },
    },
    resolve: ProductResolvers.shopProducts,
  },

};

export default ProductQueries;
