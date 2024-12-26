"use client";

import React from "react";
import { ReviewsProvider } from "./context/ReviewsContext";
import Dashboard from "./components/Dashboard";

const HomePage = () => {
  return (
    <ReviewsProvider>
        <Dashboard />
    </ReviewsProvider>
  );
};

export default HomePage;
