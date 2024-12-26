"use client";

import {
    useReactTable,
    getCoreRowModel,
    Table,
    ColumnDef,
} from "@tanstack/react-table";
import { useReviewsContext } from "../context/ReviewsContext";
import { useRouter } from "next/navigation";
import { Filters } from "./Filters";
import { LoadErrorBoundaries } from "./LoadErrorBoundaries";
import { ReviewsTable } from "./ReviewsTable";
import { useReviewsEffects } from "../hooks/useReviewsEffects";
import { columns } from "../controller";
import { Review } from "../types";

const Dashboard = () => {
    useReviewsEffects();
    const {
        reviews,
        pagination,
        deleteReview,
        error,
        loading,
        setPage,
        filters,
        sorting,
        page,
        setFilters,
        setSorting,
        setReviews,
    } = useReviewsContext();
    const router = useRouter();

    const table = useReactTable({
        data: reviews as any,
        columns,
        state: {
            columnFilters: filters,
            sorting,
        },
        onColumnFiltersChange: setFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    const handleAddReview = () => {
        router.push("/review/new");
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                deleteReview(id);
                alert("Review deleted successfully!");
                setReviews(  reviews.filter( (f) => f.id !== id))
            } catch (error) {
                console.error("Failed to delete review:", error);
                alert("Failed to delete the review.");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Reviews Dashboard</h1>
            <div className="mb-4 flex justify-between items-center">
                <div className="mt-0 py-2 rounded-md">
                    <Filters table={table as Table<ColumnDef<Review & { delete: string; }>>} />
                </div>
                <button
                    onClick={handleAddReview}
                    className="mt-0 px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Add New Review
                </button>
            </div>
            <div className="overflow-x-auto mb-4">
                <LoadErrorBoundaries error={error} loading={loading || !reviews}>
                    {reviews.length === 0 && <h3 className="text-center">Rewiews not found</h3> ||
                        <ReviewsTable table={table as Table<ColumnDef<Review & { delete: string; }>>} handleDelete={handleDelete} />}
                </LoadErrorBoundaries>
            </div>
            <div className="flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {pagination.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
