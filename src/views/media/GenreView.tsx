import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup, FavoritesOverlay, ImageGrid, Pagination } from "@/components";
import {
  calculatePrice,
  formatPrice,
  GENRE_ENDPOINT,
  type GenreResponse,
  getImageUrl,
  type ImageCell,
  movieGenres,
  tvGenres,
} from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const GenreView = () => {
  const navigate = useNavigate();
  const { type: urlType = "movies", genreSlug = "action" } = useParams();
  const type = urlType as "movies" | "tv";
  const [page, setPage] = useState(1);
  const { favorites, toggleFavorite, moviePreferences, tvPreferences, cart, removeFromCart } = useFirebaseContext();
  const genres =
    type === "movies"
      ? movieGenres.filter((genre) => moviePreferences.length === 0 || moviePreferences.includes(genre.slug))
      : tvGenres.filter((genre) => tvPreferences.length === 0 || tvPreferences.includes(genre.slug));

  const selectedGenre = genres.find((genre) => genre.slug === genreSlug)?.value ?? genres[0]?.value;

  const { data } = useTmdb<GenreResponse>(`${GENRE_ENDPOINT}/${type === "movies" ? "movie" : "tv"}`, { page, with_genres: selectedGenre });

  const gridData: ImageCell[] = (data?.results ?? []).map((result) => {
    const isMovie = type === "movies";
    const mediaType = isMovie ? "movie" : "tv";

    return {
      id: result.id,
      imageUrl: getImageUrl(result.poster_path ?? ""),
      media: mediaType,
      primaryText: result.title || result.name || "",
      releaseDate: isMovie ? result.release_date : undefined,
      secondaryText: isMovie && result.release_date ? formatPrice(calculatePrice(result.release_date)) : undefined,
    };
  });

  return (
    <section className="mx-auto max-w-400 space-y-5 p-5">
      <ButtonGroup
        onClick={(value) => {
          const newType = value as "movies" | "tv";
          const newGenres = newType === "movies" ? movieGenres : tvGenres;
          setPage(1);
          navigate(`/genre/${newType}/${newGenres[0].slug}`);
        }}
        options={[
          { label: "Movies", value: "movies" },
          { label: "TV", value: "tv" },
        ]}
        value={type}
      />

      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre.value}
            onClick={() => {
              navigate(`/genre/${type}/${genre.slug}`);
              setPage(1);
            }}
            variant={selectedGenre === genre.value ? "primary" : "grey"}
          >
            {genre.label}
          </Button>
        ))}
      </div>

      {!data ? (
        <p className="text-center text-gray-400">Loading genres...</p>
      ) : (
        <>
          <ImageGrid images={gridData} onClick={(image: ImageCell) => navigate(`/${image.media}/${image.id}`)}>
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
          <Pagination maxPages={data.total_pages} onClick={setPage} page={page} />
        </>
      )}
    </section>
  );
};
