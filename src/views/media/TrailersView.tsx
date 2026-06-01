import { useLocation, useParams } from "react-router-dom";
import { MOVIE_ENDPOINT, type TrailerResponse, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const TrailersView = () => {
  const { id } = useParams();
  const location = useLocation();
  const endpoint = location.pathname.includes("/movie/") ? MOVIE_ENDPOINT : TV_ENDPOINT;
  const { data } = useTmdb<TrailerResponse>(`${endpoint}/${id ?? ""}`, { append_to_response: "videos" });

  const trailers = data?.videos?.results?.filter((video) => video.site === "YouTube" && video.type === "Trailer") || [];

  return (
    <div className="space-y-6">
      {!data ? (
        <p className="text-center text-gray-400">Loading trailers...</p>
      ) : trailers.length === 0 ? (
        <p className="text-center text-gray-400">No trailers available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {trailers.map((trailer) => (
            <div className="aspect-video w-full" key={trailer.key}>
              <iframe
                allowFullScreen
                className="h-full w-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
