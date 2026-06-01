import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, FavoritesOverlay, ImageGrid } from "@/components";
import { useUserContext } from "@/hooks";

export const FavoritesView = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, cart, removeFromCart, clearFavoritesByType } = useUserContext();
  const [type, setType] = useState<"movie" | "tv">("movie");
  const filteredItems = Array.from(favorites.values()).filter((item) => item.media === type);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Favorites</h1>
        <ButtonGroup
          onClick={(value) => setType(value as "movie" | "tv")}
          options={[
            { label: "Movies", value: "movie" },
            { label: "TV", value: "tv" },
          ]}
          value={type}
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">{type === "movie" ? "Movies" : "TV Shows"}</h2>
        {filteredItems.length > 0 && (
          <button
            className="rounded-md bg-red-500 px-4 py-2 font-semibold text-sm text-white transition hover:bg-red-600"
            onClick={() => clearFavoritesByType(type)}
          >
            Clear
          </button>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <ImageGrid
          images={filteredItems}
          onClick={(item) => navigate(item.showId ? `/tv/${item.showId}/seasons` : `/${type}/${item.id}/summary`)}
        >
          {(item) => (
            <div className="absolute top-1 right-1 z-10">
              <FavoritesOverlay
                cart={cart}
                favorites={favorites}
                item={item}
                media={type}
                removeFromCart={removeFromCart}
                toggleFavorite={toggleFavorite}
              />
            </div>
          )}
        </ImageGrid>
      ) : (
        <p className="mt-10 text-center text-gray-400">You have no favorite {type === "movie" ? "movies" : "TV shows"} yet.</p>
      )}
    </section>
  );
};
