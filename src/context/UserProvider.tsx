import type { ReactNode } from "react";
import { UserContext } from "@/context";
import { FAVORITES_KEY, type ImageCell, movieGenres, tvGenres, USERNAME_KEY } from "@/core";
import { useLocalStorage } from "@/hooks";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userName, setUserName] = useLocalStorage<string>(USERNAME_KEY, "User");
  const [favoritesStorage, setFavoritesStorage] = useLocalStorage<[number, ImageCell][]>(FAVORITES_KEY, []);
  const [cartStorage, setCartStorage] = useLocalStorage<[number, ImageCell][]>("cart", []);
  const [movieGenrePref, setMovieGenrePref] = useLocalStorage<string[]>(
    "movieGenres",
    movieGenres.map((genre) => genre.slug),
  );
  const [tvGenrePref, setTvGenrePref] = useLocalStorage<string[]>(
    "tvGenres",
    tvGenres.map((genre) => genre.slug),
  );

  const favorites = new Map(favoritesStorage);
  const cart = new Map(cartStorage);

  const toggleFavorite = (item: ImageCell) => {
    const map = new Map(favorites);
    if (map.has(item.id)) {
      map.delete(item.id);
    } else {
      map.set(item.id, item);
    }
    setFavoritesStorage(Array.from(map.entries()));
  };

  const addToCart = (item: ImageCell) => {
    const map = new Map(cart);
    map.set(item.id, item);
    setCartStorage(Array.from(map.entries()));
  };

  const removeFromCart = (id: number) => {
    const map = new Map(cart);
    map.delete(id);
    setCartStorage(Array.from(map.entries()));
  };

  const clearCart = () => {
    setCartStorage([]);
  };

  const clearFavoritesByType = (mediaType: "movie" | "tv") => {
    const newFavorites = Array.from(favoritesStorage).filter(([_, item]) => item.media !== mediaType);
    setFavoritesStorage(newFavorites);
  };

  return (
    <UserContext.Provider
      value={{
        addToCart,
        cart,
        clearCart,
        clearFavoritesByType,
        favorites,
        movieGenrePref,
        removeFromCart,
        setMovieGenrePref,
        setTvGenrePref,
        setUserName,
        toggleFavorite,
        tvGenrePref,
        userName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
