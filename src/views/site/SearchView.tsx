import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFrown, FavoritesOverlay, ImageGrid, Pagination } from "@/components";
import { calculatePrice, formatPrice, getImageUrl, type ImageCell, RATE_LIMIT_DELAY, SEARCH_ENDPOINT, type SearchResponse } from "@/core";
import { useDebounce, useTmdb, useUserContext } from "@/hooks";

export const SearchView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "movie";
  const [page, setPage] = useState(1);
  const debounced = useDebounce(query, RATE_LIMIT_DELAY);
  const { data } = useTmdb<SearchResponse>(`${SEARCH_ENDPOINT}/${type}`, { page, query: debounced });
  const { favorites, toggleFavorite, cart, removeFromCart } = useUserContext();

  const gridData: ImageCell[] = (data?.results ?? []).map((item) => {
    const releaseDate = type === "movie" ? (item as { release_date?: string }).release_date : undefined;
    return {
      id: item.id,
      imageUrl: getImageUrl(item.poster_path ?? item.profile_path ?? ""),
      media: type === "movie" ? "movie" : "tv",
      primaryText: item.name ?? item.title ?? "Untitled",
      ...(type === "movie" && {
        releaseDate,
        secondaryText: releaseDate ? formatPrice(calculatePrice(releaseDate)) : undefined,
      }),
    };
  });

  return (
    <section className="mx-auto max-w-400 space-y-5 p-5">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-2xl text-white">Search for:</h1>
        <span className="text-2xl text-gray-400">{query || ""}</span>
      </div>

      {!data ? (
        <p className="text-center text-[#f0f4ef]">Loading...</p>
      ) : data.results.length ? (
        <>
          <ImageGrid images={gridData} onClick={(image: ImageCell) => navigate(`/${type}/${image.id}`)}>
            {(item) =>
              type === "movie" && (
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
          <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
        </>
      ) : (
        <div className="py-12 text-center">
          <FaFrown className="mx-auto mb-4 h-16 w-16 text-gray-600" />
          <p className="text-gray-400 text-lg">No search results found</p>
        </div>
      )}
    </section>
  );
};
