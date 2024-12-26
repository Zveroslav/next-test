"use client"

import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { Review } from "../types";
import { apiURL } from "../controller";

interface ReviewContextProps {
  review?: Review;
  loading: boolean;
  error?: string;
  addReview: (formInput: { rating: number; title: string; content: string; author: string; }) => Promise<Review | undefined>;
  updateReview: (id: number, updatedData: Review) => Promise<void>;
  getReview: (id: number) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ReviewItemContext = createContext<ReviewContextProps | undefined>(undefined);

export const ReviewItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [review, setReview] = useState<Review | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);  

  const addReview = async (formInput: { rating: number; title: string; content: string; author: string; }) => {
    setLoading(true);
    try {
      const response: { data: Review } = await axios.post(`${apiURL}/reviews`, formInput) as { data: Review };
      setReview(response.data);
      return response.data;
    } catch (e) {
      setError(e as string);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id: number, updatedData: Review) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiURL}/reviews/${id}`, updatedData);
      setReview(response.data);
    } catch (e) {
      setError(e as string);
    } finally {
      setLoading(false);
    }
  };

  const getReview = async (id: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/reviews/${id}`);
      setReview(response.data);
    } catch (e) {
      setError(e as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReviewItemContext.Provider value={{
      review,
      addReview,
      updateReview,
      getReview,
      setLoading,
      setError,
      loading,
      error,
    }}>
      {children}
    </ReviewItemContext.Provider>
  );
};

export const useReviewItemContext = (): ReviewContextProps => {
  const context = useContext(ReviewItemContext);
  if (!context) {
    throw new Error("useReviewContext must be used within a ReviewProvider");
  }
  return context;
};

