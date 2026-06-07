import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ButtonGroup, FavoritesOverlay, ImageGrid } from "@/components";
import { calculatePrice, formatPrice, getImageUrl, type ImageCell, TRENDING_ENDPOINT, type TrendingResponse } from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const TrendingView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type, setType] = useState<"movies" | "tv">("movies");
  const [timeWindow, setTimeWindow] = useState<"day" | "week">((searchParams.get("interval") as "day" | "week") || "day");
  const { favorites, toggleFavorite, cart, removeFromCart } = useFirebaseContext();

  useEffect(() => {
    navigate(`/trending/${type}?interval=${timeWindow}`, { replace: true });
  }, [timeWindow, type, navigate]);

  const { data } = useTmdb<TrendingResponse>(`${TRENDING_ENDPOINT}/${type === "movies" ? "movie" : type}/${timeWindow}`, {});

  const gridData: ImageCell[] = (data?.results ?? []).slice(0, 20).map((result) => {
    const isMovie = result.media_type === "movie" || type === "movies";
    const mediaType = isMovie ? "movie" : "tv";
    const date = isMovie ? result.release_date : undefined;

    return {
      id: result.id,
      imageUrl: getImageUrl(result.poster_path ?? ""),
      media: mediaType,
      primaryText: result.title || result.name || "",
      releaseDate: date,
      secondaryText: date ? formatPrice(calculatePrice(date)) : "",
    };
  });

  return (
    <section className="mx-auto max-w-400 space-y-5 p-5">
      <div className="flex items-center justify-between">
        <ButtonGroup
          onClick={(value) => setType(value as "movies" | "tv")}
          options={[
            { label: "Movies", value: "movies" },
            { label: "TV", value: "tv" },
          ]}
          value={type}
        />

        <ButtonGroup
          onClick={(value) => setTimeWindow(value as "day" | "week")}
          options={[
            { label: "Today", value: "day" },
            { label: "Week", value: "week" },
          ]}
          value={timeWindow}
        />
      </div>

      {!data ? (
        <p className="text-center text-gray-400">Loading trending...</p>
      ) : (
        <ImageGrid
          images={gridData}
          onClick={(image: ImageCell) => {
            const item = data.results.find((result) => result.id === image.id);
            navigate(item?.media_type === "movie" ? `/movie/${image.id}` : `/tv/${image.id}`);
          }}
        >
          {(item) =>
            item.media === "movie" && (
              <div className="absolute top-1 right-1 z-10">
                <FavoritesOverlay
                  cart={cart}
                  favorites={favorites}
                  item={item}
                  media="movie"
                  removeFromCart={removeFromCart}
                  toggleFavorite={toggleFavorite}
                />
              </div>
            )
          }
        </ImageGrid>
      )}
    </section>
  );
};
