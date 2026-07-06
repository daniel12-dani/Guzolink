import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

const GET_SHOP_PRODUCTS = gql`
  query ShopProducts($shopId: ID!) {
    shopProducts(shopId: $shopId) {
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

  const products = data?.shopProducts ?? [];

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
