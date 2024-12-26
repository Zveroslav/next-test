import { Review } from "@/app/types";
import { useForm } from "react-hook-form";

export const EditReview = ({
    review,
    onSubmit,
    onCancel,
    loading,
  }: {
    review: Review;
    onSubmit: (data: Review) => void;
    onCancel: () => void;
    loading: boolean;
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Review>({ defaultValues: review });
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Edit Review</h1>
  
        <div>
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
  
        <div>
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
  
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Rating (1-5)
          </label>
          <input
            id="rating"
            type="number"
            {...register("rating", {
              required: "Rating is required",
              min: { value: 1, message: "Rating must be at least 1" },
              max: { value: 5, message: "Rating cannot exceed 5" },
            })}
            className="w-full border rounded p-2"
          />
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>
  
        <div>
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
  
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };