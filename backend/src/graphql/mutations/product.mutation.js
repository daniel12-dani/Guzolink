import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLID,
} from "graphql";
import ProductType from "../types/product.type.js";
import { ProductResolvers } from "../resolvers/product.resolver.js";
const ProductMutations = {
  name: "ProductMutations",
  fields: {
    // mutations
    createProduct: {
      type: ProductType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        stock: { type: new GraphQLNonNull(GraphQLInt) },
        category: { type: new GraphQLNonNull(GraphQLID) },
        shop: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: GraphQLString },
      },
      resolve: ProductResolvers.createProduct,
    },
    // deleteProduct: {
    //   type: ProductType, // or GraphQLBoolean, up to you
    //   args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    //   resolve: ProductResolvers.deleteProduct,
    // },
    // updateProduct: {
    //   type: ProductType,
    //   args: {
    //     id: { type: new GraphQLNonNull(GraphQLID) } /* ...other fields */,
    //   },
    //   resolve: ProductResolvers.updateProduct,
    // },
  },
};

export default ProductMutations;
