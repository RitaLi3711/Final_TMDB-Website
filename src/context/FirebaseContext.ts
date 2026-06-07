import type { FirebaseContextType } from "@/core";
import { createContext } from "react";

export const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);