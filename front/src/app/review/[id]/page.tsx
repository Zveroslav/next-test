"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Review } from "@/app/types";
import { EditReview } from "./components/EditReview";
import { ViewReview } from "./components/ViewReview";
import { useReviewItemContext } from "@/app/context/ReviewItemContext";
import { LoadErrorBoundaries } from "@/app/components/LoadErrorBoundaries";

const ReviewPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateReview, review, loading, error, setError, getReview } = useReviewItemContext()
  const params = useParams();

  useEffect(() => {
    setError(undefined);
    if (Number(params.id) === review?.id) {
      return;
    } else if (Number(params.id) > 0 && Number(params.id) !== Number(review?.id)) {
       getReview(Number(params.id));
       return;
    } else {
      setError('Incorrect ID in the URL');
      return;
    }
  }, [params.id, getReview, review?.id, setError]);

  const handleUpdate = useCallback(async (data: Review) => {
    updateReview(review?.id as number, data).then(() => setIsEditing(false))
  }, [review, updateReview, setIsEditing]);


  return (
    <div className="max-w-lg mx-auto p-4">
      <LoadErrorBoundaries error={error} loading={loading}>
        {isEditing ? (
          !!review && <EditReview
            review={review}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            loading={loading}
          />
        ) : (
          !!review && <ViewReview review={review} onEdit={() => setIsEditing(true)} />
        )}
      </LoadErrorBoundaries>
    </div>
  );
};

export default ReviewPage;
