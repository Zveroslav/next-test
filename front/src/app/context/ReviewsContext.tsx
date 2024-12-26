"use client"

import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Pagination, Review } from "../types";
import { decodeSortingFromBase64 } from "../utils/base64";
import { apiURL } from "../controller";
import { useSearchParams } from "next/navigation";

interface FetchReviewParams {author?: string, sorting?: string, rating?: string}
interface ReviewsContextProps {
  reviews: Review[];
  pagination: Pagination;
  loading: boolean;
  error?: string;
  filters: ColumnFiltersState;
  sorting: SortingState;
  page: number;
  fetchReviews: (page?: number, params?: FetchReviewParams) => void;
  deleteReview: (id: number) => void;
  setLoading: (load: boolean) => void;
  setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setReviews: (params: Review[]) => void;
}

const ReviewsContext = createContext<ReviewsContextProps | undefined>(undefined);

const parseUrlParams = (searchParams: URLSearchParams) => {
  const filters = {
    author: searchParams.get("author") || "",
    rating: searchParams.getAll("rating").map((r) => parseInt(r, 10)),
  };

  const sorting = searchParams.get("sorting")
    ? decodeSortingFromBase64(searchParams.get("sorting") || "")
    : [];

  const page = Number(searchParams.get("page")) > 0
    ? Number(searchParams.get("page"))
    : 1;

  return { filters: [{id: 'author', value: filters.author}, {id: 'rating', value: filters.rating}], sorting, page };
};

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const { filters: initialFilters, sorting: initialSorting, page: initialPage } = parseUrlParams(searchParams);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: initialPage, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [page, setPage] = useState<number>(pagination.currentPage);


  const fetchReviews = async (page?: number, params: FetchReviewParams = {}) => {
    setError(undefined)
    if (!page) return
    setLoading(true);

    try {
      const response = await axios.get(`${apiURL}/reviews`, {
        params: { page, ...params },
      });

      setReviews(response.data.reviews);
      setPagination({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
      setLoading(false);
    } catch (error) {
      setError("Error fetching reviews")

      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: number) => {
    setLoading(true);

    try {
      await axios.delete(`${apiURL}/reviews/${id}`);

    } catch (error) {
      setError("Error delete review")

      console.error("Error delete review:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ReviewsContext.Provider value={{
      reviews, pagination, loading, fetchReviews, deleteReview, error, filters,
      setFilters,
      sorting,
      setLoading,
      setSorting,
      page,
      setPage,
      setReviews,
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviewsContext = (): ReviewsContextProps => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviewsContext must be used within a ReviewProvider");
  }
  return context || {};
};
