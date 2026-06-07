import { useNavigate, useParams } from "react-router-dom";
import { CartOverlay, FavoritesOverlay, ImageGrid } from "@/components";
import { calculatePrice, formatPrice, getImageUrl, type ImageCell, TV_ENDPOINT, type TvDetailsResponse } from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const SeasonsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, cart, addToCart, removeFromCart } = useFirebaseContext();

  const { data } = useTmdb<TvDetailsResponse>(`${TV_ENDPOINT}/${id ?? ""}`, {});

  const filteredSeasons = (data?.seasons ?? []).filter((season) => season.season_number > 0);

  const gridData: ImageCell[] = filteredSeasons.map((season) => ({
    airDate: season.air_date || "",
    id: season.id,
    imageUrl: getImageUrl(season.poster_path ?? ""),
    media: "tv",
    primaryText: `${data?.name || "TV Show"} - Season ${season.season_number}`,
    season: season.season_number,
    secondaryText: formatPrice(calculatePrice(season.air_date || "")),
    showId: Number(id),
  }));

  return (
    <div className="space-y-6 p-6">
      <h2 className="font-bold text-2xl">Seasons</h2>

      {!data ? (
        <p className="text-gray-400">Loading seasons...</p>
      ) : (
        <ImageGrid
          images={gridData}
          onClick={(image: ImageCell) => {
            const season = filteredSeasons.find((s) => s.id === image.id);
            if (season && season.season_number > 0) navigate(`/tv/${data.id}/season/${season.season_number}`);
          }}
        >
          {(item) => (
            <div className="absolute top-1 right-1 left-1 z-10 flex justify-between">
              <FavoritesOverlay
                cart={cart}
                favorites={favorites}
                item={item}
                media="tv"
                removeFromCart={removeFromCart}
                toggleFavorite={toggleFavorite}
              />
              <CartOverlay
                addToCart={addToCart}
                cart={cart}
                favorites={favorites}
                item={item}
                media="tv"
                removeFromCart={removeFromCart}
                toggleFavorite={toggleFavorite}
              />
            </div>
          )}
        </ImageGrid>
      )}
    </div>
  );
};
