import { Review } from "@/app/types";

export const ViewReview = ({ review, onEdit }: { review: Review; onEdit: () => void }) => {    
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h1 className="text-xl font-bold mb-2">{review.title}</h1>

            <time className="text-gray-500 text-sm block mb-2" dateTime={review.createdAt}>
                Created at: {new Date(review.createdAt).toLocaleString()}
            </time>

            <div className="text-gray-700 mb-4">
                <p className="font-medium">Author:</p>
                <p>{review.author}</p>
            </div>

            <div className="text-gray-700 mb-4">
                <p className="font-medium">Rating:</p>
                <p>{review.rating} ★</p>
            </div>

            <div className="text-gray-700 mb-4">
                <p className="font-medium">Content:</p>
                <p>{review.content}</p>
            </div>

            <button
                onClick={onEdit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Edit
            </button>
        </div>
    )
};