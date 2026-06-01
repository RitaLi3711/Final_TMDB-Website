import { useLocation, useParams } from "react-router-dom";
import { MOVIE_ENDPOINT, type ReviewsResponse, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const ReviewsView = () => {
  const { id } = useParams();
  const location = useLocation();
  const endpoint = location.pathname.includes("/movie/") ? MOVIE_ENDPOINT : TV_ENDPOINT;
  const { data } = useTmdb<ReviewsResponse>(`${endpoint}/${id ?? ""}/reviews`, {});

  return (
    <div className="mt-6 space-y-4">
      {!data ? (
        <p className="text-center text-gray-400">Loading reviews...</p>
      ) : !data.results?.length ? (
        <p className="text-center text-gray-400">No reviews available.</p>
      ) : (
        <div className="space-y-4">
          {data.results.slice(0, 5).map((review) => (
            <div className="rounded-xl border border-[#0d1821] bg-[#344966] p-5 shadow" key={review.id}>
              <p className="mb-2 text-[#bfcc94] text-sm">By {review.author}</p>
              <p className="line-clamp-6 text-[#f0f4ef] text-sm leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
