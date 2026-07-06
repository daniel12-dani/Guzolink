import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Product {
    _id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    category: ID!
    shop: ID!
    image: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    allShopProducts: [Product!]!
    shopProducts(shopId: ID!): [Product!]!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int
    category: ID!
    shop: ID!
    image: String
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`);
