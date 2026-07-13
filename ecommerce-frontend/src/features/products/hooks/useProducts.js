// features/products/hooks/useProducts.js
//
// Read-only, on purpose. The home page only ever browses the catalog —
// it never creates or deletes a product, so this hook shouldn't know
// how to do either. Creating belongs to whichever page/shop actually
// creates a product (see useCreateProduct.js, used by CreateProduct.jsx).

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

const PAGE_SIZE = 6;

const GET_ALL_SHOP_PRODUCTS = gql`
  query GetAllShopProducts($page: Int!, $limit: Int!) {
    getAllShopProducts(page: $page, limit: $limit) {
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

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { loading, error, fetchMore } = useQuery(GET_ALL_SHOP_PRODUCTS, {
    variables: { page: 1, limit: PAGE_SIZE },
    onCompleted: (data) => {
      const batch = data?.getAllShopProducts ?? [];
      setProducts(batch);
      setHasMore(batch.length === PAGE_SIZE);
    },
  });

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const { data } = await fetchMore({
        variables: { page: nextPage, limit: PAGE_SIZE },
      });
      const batch = data?.getAllShopProducts ?? [];
      setProducts((prev) => [...prev, ...batch]);
      setHasMore(batch.length === PAGE_SIZE);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    products,
    loading,
    isLoadingMore,
    hasMore,
    loadMore,
    error: error?.message ?? "",
  };
}