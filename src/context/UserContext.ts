import type { User } from "firebase/auth";
import { createContext } from "react";

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
