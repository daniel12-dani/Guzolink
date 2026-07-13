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

  // NOT using onCompleted here — that callback may not fire reliably on
  // every Apollo Client version (we already hit one API-surface surprise
  // with useMutation not existing on the main entry point). `data` is
  // the one part of useQuery's contract guaranteed to update whenever
  // the query resolves, in every version, so we sync from that instead.
  const { loading, error, data, fetchMore } = useQuery(GET_ALL_SHOP_PRODUCTS, {
    variables: { page: 1, limit: PAGE_SIZE },
  });
   useEffect(() => {
    const batch = data?.getAllShopProducts;
    if (!batch) return; // query hasn't resolved yet
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