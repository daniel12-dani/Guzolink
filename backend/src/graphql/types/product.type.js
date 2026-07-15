import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} from "graphql";
import UserType from "./user.type.js";

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    category: { type: GraphQLID },
    shop: { type: GraphQLID },
    image: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    // renamed from createdById -> createdBy to match the actual field
    // name on the Product mongoose model (createdBy: { ref: "User" }).
    // parent.createdById was always undefined before this fix, so this
    // field silently resolved to null on every product.
    createdBy: {
      type: UserType,
      resolve(parent, args, context) {
        return context.userLoader.load(parent.createdBy);
      },
    },
  }),
});

export default ProductType;