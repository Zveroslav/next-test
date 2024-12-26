"use client";

import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useReviewItemContext } from "@/app/context/ReviewItemContext";
import { LoadErrorBoundaries } from "@/app/components/LoadErrorBoundaries";

interface FormData {
  title: string;
  content: string;
  rating: number;
  author: string;
}

const CreateReviewPage = () => {
  const { addReview, loading, error, setError } = useReviewItemContext()
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating, {
      shouldValidate: true,
    });
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(Number(rating));
  };

  const onSubmit = useCallback(async (data: FormData) => {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }
    try {
      const result = await addReview({ ...data })
      if (!result) {
        setError("An error occurred. Please try again.");
        return;
      }
      setTimeout(() => router.push(`/review/${result?.id}`), 500)
    } catch (err) {
      setError(err as string || "An error occurred. Please try again.");
    }
  }, [addReview, router, setError]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="font-bold mb-4 text-2xl">
        Create New Review
      </h1>

      <LoadErrorBoundaries error={error} loading={loading}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* Title */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full border rounded p-2"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author
            </label>
            <input
              id="author"
              type="text"
              {...register("author", { required: "Author is required" })}
              className="w-full border rounded p-2"
            />
            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Rating (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={() => handleRatingHover(0)}
                  className={`text-3xl ${hoveredRating >= star || selectedRating >= star
                    ? "text-yellow-500"
                    : "text-gray-300"
                    }`}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              id="content"
              {...register("content", { required: "Content is required" })}
              className="w-full border rounded p-2"
              rows={4}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Review
            </button>
          </div>
        </form>
      </LoadErrorBoundaries>
    </div>
  );
};

export default CreateReviewPage;
