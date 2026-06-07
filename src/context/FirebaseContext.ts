import { createContext } from "react";
import type { FirebaseContextType } from "@/core";

export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);
