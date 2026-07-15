// features/products/hooks/useProducts.js
//
// Read-only, on purpose. The home page only ever browses the catalog —
// it never creates or deletes a product, so this hook shouldn't know
// how to do either. Creating belongs to whichever page/shop actually
// creates a product (see useCreateProduct.js, used by CreateProduct.jsx).

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";

const PAGE_SIZE = 6;

const GET_PRODUCTS = gql`
  query GetProducts($page: Int!, $limit: Int!) {
    products(page: $page, limit: $limit) {
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

  const { loading, error, data, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { page: 1, limit: PAGE_SIZE },
  });

  useEffect(() => {
    const batch = data?.products;
    if (!batch) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(batch);
    setHasMore(batch.length === PAGE_SIZE);
  }, [data]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const { data } = await fetchMore({
        variables: { page: nextPage, limit: PAGE_SIZE },
      });
      const batch = data?.products ?? [];
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