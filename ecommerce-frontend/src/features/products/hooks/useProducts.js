import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_ALL_SHOP_PRODUCTS = gql`
  query GetAllShopProducts {
    allShopProducts {
      _id
      name
      description
      price
      stock
      category
      shop
      image
      createdAt
      updatedAt
    }
  }
`;

export default function useProducts() {
  const { loading, error, data } = useQuery(GET_ALL_SHOP_PRODUCTS);

  const products = data?.allShopProducts ?? [];

  return { products, loading, error };
}
