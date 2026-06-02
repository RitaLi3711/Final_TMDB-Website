import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonGroup, FavoritesOverlay, ImageGrid, Pagination } from "@/components";
import { calculatePrice, formatPrice, getImageUrl, type ImageCell, MOVIE_ENDPOINT, type MoviesResponse } from "@/core";
import { useTmdb, useUserContext } from "@/hooks";

export const MoviesView = () => {
  const { interval } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const category = interval ?? "now_playing";
  const { data } = useTmdb<MoviesResponse>(`${MOVIE_ENDPOINT}/${category}`, { page });
  const { favorites, toggleFavorite, cart, removeFromCart } = useUserContext();

  const gridData: ImageCell[] = (data?.results ?? []).map((result) => ({
    id: result.id,
    imageUrl: getImageUrl(result.poster_path ?? ""),
    media: "movie",
    primaryText: result.original_title || "",
    releaseDate: result.release_date,
    secondaryText: formatPrice(calculatePrice(result.release_date)),
  }));

  return (
    <section className="mx-auto max-w-400 space-y-5 p-5">
      <ButtonGroup
        onClick={(value) => {
          setPage(1);
          navigate(`/movies/category/${value}`);
        }}
        options={[
          { label: "Now Playing", value: "now_playing" },
          { label: "Popular", value: "popular" },
          { label: "Top Rated", value: "top_rated" },
          { label: "Upcoming", value: "upcoming" },
        ]}
        value={category}
      />
      {!data ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <>
          <ImageGrid images={gridData} onClick={(image: ImageCell) => navigate(`/movie/${image.id}`)}>
            {(item) => (
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
            )}
          </ImageGrid>
          <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
        </>
      )}
    </section>
  );
};
