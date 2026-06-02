import { createContext } from "react";
import type { ImageCell } from "@/core";

export type UserContextType = {
  userName: string;
  favorites: Map<number, ImageCell>;
  cart: Map<number, ImageCell>;
  movieGenrePref: string[];
  tvGenrePref: string[];
  setUserName: (userName: string) => void;
  setMovieGenrePref: (genres: string[]) => void;
  setTvGenrePref: (genres: string[]) => void;
  toggleFavorite: (item: ImageCell) => void;
  addToCart: (item: ImageCell) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  clearFavoritesByType: (mediaType: "movie" | "tv") => void;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);
