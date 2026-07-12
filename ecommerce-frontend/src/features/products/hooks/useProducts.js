// features/products/hooks/useProducts.js
//
// This is now the ONLY place that fetches "all products" — it replaces
// what used to be split across Home's preview (first 3) and the separate
// Products.jsx page (the full list). One hook, one page, paginated.
//
// Pagination is handled with plain React state rather than leaning on
// Apollo's automatic cache merging — simpler to reason about, and not
// tied to a specific Apollo Client version's fetchMore/merge behavior.

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

  // If the last batch we got back was a full page, there's PROBABLY more
  // to load — we don't know the exact total without a totalCount field
  // from the backend, but this heuristic is good enough for a "Load
  // more" button: once a batch comes back shorter than PAGE_SIZE, we
  // know we've hit the end.
  const [hasMore, setHasMore] = useState(true);

  // isLoadingMore is separate from the initial `loading` below for the
  // same UX reason as ShopContext's isRefreshing: clicking "Load more"
  // should show a small spinner on the button, not wipe out the grid
  // of products already on screen.
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
    loading, // true only on the very first page load
    isLoadingMore, // true only while "Load more" is in flight
    hasMore,
    loadMore,
    error: error?.message ?? "",
  };
}