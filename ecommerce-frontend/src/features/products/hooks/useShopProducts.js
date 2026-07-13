// features/products/hooks/useShopProducts.js
//
// A HOOK, not a context. Owns everything scoped to ONE shop's products:
// reading them, creating one, deleting one. Home's useProducts.js stays
// separate and read-only because it's a different scope entirely
// (every product across every shop, not one shop's CRUD).

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

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

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $price: Float!
    $stock: Int!
    $category: ID!
    $shop: ID!
    $image: String
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      stock: $stock
      category: $category
      shop: $shop
      image: $image
    ) {
      id
      name
      description
      price
      stock
      category
      shop
      image
      createdAt
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export default function useShopProducts(shopId) {
  const { loading, error, data, refetch } = useQuery(GET_SHOP_PRODUCTS, {
    variables: { shopId },
    skip: !shopId,
  });

  // Separate from `loading` on purpose: `loading` is Apollo's own
  // first-load flag. isRefreshing drives just a refresh button's
  // spinner, same reasoning as ShopContext's isRefreshing — a manual
  // refresh shouldn't replace the whole grid with "Loading products...".
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [executeCreateProduct, { loading: isCreating, error: createError }] =
    useMutation(CREATE_PRODUCT);
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);

  const products = data?.getShopProducts ?? [];

  // Cleans/casts form field types (strings -> Float/Int) before sending.
  const createProduct = async (productFields) => {
    const result = await executeCreateProduct({
      variables: {
        ...productFields,
        price: parseFloat(productFields.price),
        stock: parseInt(productFields.stock, 10),
      },
    });
    refetch(); // pick up the new product in this shop's list
    return result;
  };

  const deleteProduct = async (productId) => {
    try {
      await deleteProductMutation({ variables: { id: productId } });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const refreshProducts = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    products,
    loading,
    isRefreshing,
    error: error?.message ?? "",
    fetchProducts: refreshProducts,

    createProduct,
    isCreating,
    createError: createError?.message ?? "",

    deleteProduct,
  };
}
