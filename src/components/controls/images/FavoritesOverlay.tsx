import { FaHeart, FaRegHeart } from "@/components";
import { ICON_SIZE, type ImageCell, type Media } from "@/core";

type FavoritesOverlayProps = {
  item: ImageCell;
  favorites: Map<number, ImageCell>;
  cart: Map<number, ImageCell>;
  toggleFavorite: (item: ImageCell) => void;
  removeFromCart: (id: number) => void;
  media: Media;
  className?: string;
};

export const FavoritesOverlay = ({
  item,
  favorites,
  cart,
  toggleFavorite,
  removeFromCart,
  media,
  className = "",
}: FavoritesOverlayProps) => (
  <button
    className={`rounded-full bg-black/50 p-2 backdrop-blur-sm transition hover:bg-black/70 ${className}`}
    onClick={(event) => {
      event.stopPropagation();
      if (cart.has(item.id)) {
        removeFromCart(item.id);
      }
      const favoriteItem = { ...item, media };
      toggleFavorite(favoriteItem);
    }}
  >
    {favorites.has(item.id) ? (
      <FaHeart className="text-[#e6aace]" size={ICON_SIZE} />
    ) : (
      <FaRegHeart className="text-white" size={ICON_SIZE} />
    )}
  </button>
);
