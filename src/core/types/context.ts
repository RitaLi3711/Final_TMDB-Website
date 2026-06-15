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
  moviePreferences: string[];
  tvPreferences: string[];
  setUser: (user: User | null) => void;
  setUserName: (name: string) => void;
  setMoviePreferences: (genres: string[]) => Promise<void>;
  setTvPreferences: (genres: string[]) => Promise<void>;
  refreshUser: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  toggleFavorite: (image: ImageCell) => void;
  addToCart: (item: ImageCell) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  clearFavoritesByType: (mediaType: "movie" | "tv") => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  purchases: Purchase[];
  completePurchase: (purchase: Purchase) => Promise<void>;
  loading: boolean;
  logout: () => Promise<void>;
};
