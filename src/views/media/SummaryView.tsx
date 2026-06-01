import { useLocation, useParams } from "react-router-dom";
import { DetailItem } from "@/components/site/DetailItem";
import { MOVIE_ENDPOINT, type MovieResponse, TV_ENDPOINT, type TvDetailsResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const SummaryView = () => {
  const { id } = useParams();
  const isMovie = useLocation().pathname.includes("/movie/");

  const { data } = useTmdb<MovieResponse | TvDetailsResponse>(`${isMovie ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id ?? ""}`, {});

  const formatRuntime = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  const movie = data as MovieResponse;
  const tv = data as TvDetailsResponse;

  return !data ? (
    <p className="text-center text-gray-400">Loading summary...</p>
  ) : (
    <div className="space-y-3">
      <p className="max-w-4xl text-gray-300 text-sm leading-7 md:text-base">{data.overview}</p>

      <div className="border-gray-700 border-t pt-3">
        <div className="grid grid-cols-2 gap-3">
          <DetailItem label="Release" value={isMovie ? movie.release_date || "TBA" : tv.first_air_date || "TBA"} />
          <DetailItem
            label={isMovie ? "Runtime" : "Status"}
            value={isMovie ? (movie.runtime ? formatRuntime(movie.runtime) : "TBA") : tv.status || "TBA"}
          />
          <DetailItem
            label={isMovie ? "Genres" : "Seasons"}
            value={
              isMovie
                ? movie.genres
                  ? movie.genres.map((g) => g.name).join(", ")
                  : "N/A"
                : tv.seasons?.filter((s) => s.season_number > 0).length
            }
          />
          <DetailItem
            label={isMovie ? "Rating" : "Episodes"}
            value={
              isMovie
                ? `${Math.round(movie.vote_average * 10)}%`
                : (tv.number_of_episodes ?? tv.seasons?.reduce((total, s) => total + s.episode_count, 0) ?? 0)
            }
          />
        </div>
      </div>
    </div>
  );
};
