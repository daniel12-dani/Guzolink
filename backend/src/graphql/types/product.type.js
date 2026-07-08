import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} from "graphql";
import User from "../../models/user.model.js";
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
    createdById: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.createdById);
      },
    },
  }),
});

export default ProductType;
