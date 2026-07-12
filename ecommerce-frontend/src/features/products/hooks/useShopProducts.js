// features/products/useShopProducts.js
//
// A HOOK, not a context — no Provider needed. Each component that calls
// this gets its own independent query, scoped to whatever shopId it
// passes in. That's correct here: only the shop dashboard page needs
// this data, nothing else in the app reads "this specific shop's
// products" simultaneously.

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_SHOP_PRODUCTS = gql`
  query ShopProducts($shopId: ID!) {
    getShopProducts(shopId: $shopId) {
      id
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

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function useShopProducts(shopId) {
  const { loading, error, data, refetch } = useQuery(GET_SHOP_PRODUCTS, {
    variables: { shopId },
    skip: !shopId,
  });

  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);

  // IMPORTANT: this key must match the query field name EXACTLY —
  // `data` comes back shaped like { getShopProducts: [...] }, because
  // that's the field name used in the query above. Reading `data.shopProducts`
  // (a field that was never queried) would silently always be undefined.
  const products = data?.getShopProducts ?? [];

  const deleteProduct = async (productId) => {
    try {
      await deleteProductMutation({ variables: { id: productId } });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    products,
    loading,
    error: error?.message ?? "",
    fetchProducts: refetch,
    deleteProduct,
  };
}