import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";
import { GET_PRODUCTS } from "./useProducts.js";

const GET_SHOP_PRODUCTS = gql`
  query GetShopProducts($shopId: ID!) {
    shopProducts(shopId: $shopId) {
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

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $stock: Int
    $category: ID
    $image: String
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      stock: $stock
      category: $category
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
      updatedAt
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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [executeCreateProduct, { loading: isCreating, error: createError }] =
    useMutation(CREATE_PRODUCT);
  const [executeUpdateProduct, { loading: isUpdating, error: updateError }] =
    useMutation(UPDATE_PRODUCT);
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);

  const products = data?.shopProducts ?? [];

  const createProduct = async (productFields) => {
    const result = await executeCreateProduct({
      variables: {
        ...productFields,
        price: parseFloat(productFields.price),
        stock: parseInt(productFields.stock, 10),
      },
      refetchQueries: [
        { query: GET_PRODUCTS, variables: { page: 1, limit: 6 } },
      ],
    });
    refetch();
    return result;
  };

  // Only sends fields that were actually provided — matches the
  // resolver's "drop undefined args" cleanup, so a partial edit
  // (e.g. just price) doesn't accidentally overwrite other fields
  // with parsed NaN/empty values.
  const updateProduct = async (id, productFields) => {
    const variables = { id };
    if (productFields.name !== undefined) variables.name = productFields.name;
    if (productFields.description !== undefined)
      variables.description = productFields.description;
    if (productFields.price !== undefined)
      variables.price = parseFloat(productFields.price);
    if (productFields.stock !== undefined)
      variables.stock = parseInt(productFields.stock, 10);
    if (productFields.category !== undefined)
      variables.category = productFields.category;
    if (productFields.image !== undefined)
      variables.image = productFields.image;

    const result = await executeUpdateProduct({ variables });
    refetch(); // pick up the edited product in this shop's list
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

    updateProduct,
    isUpdating,
    updateError: updateError?.message ?? "",

    deleteProduct,
  };
}
