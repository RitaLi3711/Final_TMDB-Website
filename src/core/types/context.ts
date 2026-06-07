import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { ImageCell } from "@/core";

export type FirebaseContextType = {
  auth: Auth;
  firestore: Firestore;
  user: User | null;
  favorites: Map<number, ImageCell>;
  setUser: (user: User | null) => void;
  refreshUser: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  toggleFavorite: (image: ImageCell) => Promise<void>;
};
