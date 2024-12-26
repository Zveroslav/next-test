import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Dashboard from "../app/components/Dashboard";

// Mock the necessary hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the ReviewsContext
const mockContextValue = {
  reviews: [],
  pagination: { totalPages: 1 },
  deleteReview: jest.fn(),
  error: null,
  loading: false,
  setPage: jest.fn(),
  filters: [],
  sorting: [],
  page: 1,
  setFilters: jest.fn(),
  setSorting: jest.fn(),
  setReviews: jest.fn(),
};

jest.mock("../app/context/ReviewsContext", () => ({
  useReviewsContext: () => mockContextValue,
}));

jest.mock("../app/hooks/useReviewsEffects", () => ({
  useReviewsEffects: jest.fn(),
}));

describe("Dashboard", () => {
  test("renders Dashboard component", () => {
    render(<Dashboard />);
    expect(screen.getByText("Reviews Dashboard")).toBeInTheDocument();
  });
});