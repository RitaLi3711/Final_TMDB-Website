import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { ImageCell } from "@/core";

export type Purchase = {
  items: ImageCell[];
  total: number;
  date: string;
};

export type FirebaseContextType = {
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  userName: string;
  favorites: Map<number, ImageCell>;
  cart: Map<number, ImageCell>;
  movieGenrePref: string[];
  tvGenrePref: string[];
  setUser: (user: User | null) => void;
  setUserName: (name: string) => Promise<void>;
  setMovieGenrePref: (genres: string[]) => void;
  setTvGenrePref: (genres: string[]) => void;
  refreshUser: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  toggleFavorite: (image: ImageCell) => Promise<void>;
  addToCart: (item: ImageCell) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearFavoritesByType: (mediaType: "movie" | "tv") => Promise<void>;
  avatar: string;
  setAvatar: (avatar: string) => Promise<void>;
  purchases: Purchase[];
  completePurchase: (purchase: Purchase) => Promise<void>;
  loading: boolean;
};
