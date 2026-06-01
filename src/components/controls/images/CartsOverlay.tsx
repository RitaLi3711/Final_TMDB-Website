import { PiShoppingCartSimple, PiShoppingCartSimpleFill } from "@/components";
import { ICON_SIZE, type ImageCell, type Media } from "@/core";

type CartOverlayProps = {
  item: ImageCell;
  cart: Map<number, ImageCell>;
  favorites: Map<number, ImageCell>;
  addToCart: (item: ImageCell) => void;
  removeFromCart: (id: number) => void;
  toggleFavorite: (item: ImageCell) => void;
  media: Media;
  className?: string;
};

export const CartOverlay = ({
  item,
  cart,
  favorites,
  addToCart,
  removeFromCart,
  toggleFavorite,
  media,
  className = "",
}: CartOverlayProps) => (
  <button
    className={`rounded-full bg-black/50 p-2 backdrop-blur-sm transition hover:bg-black/70 ${className}`}
    onClick={(event) => {
      event.stopPropagation();
      if (cart.has(item.id)) {
        removeFromCart(item.id);
      } else {
        if (favorites.has(item.id)) {
          toggleFavorite(item);
        }
        const cartItem = { ...item, media };
        addToCart(cartItem);
      }
    }}
  >
    {cart.has(item.id) ? (
      <PiShoppingCartSimpleFill className="text-[#e6aace]" size={ICON_SIZE} />
    ) : (
      <PiShoppingCartSimple className="text-white" size={ICON_SIZE} />
    )}
  </button>
);
