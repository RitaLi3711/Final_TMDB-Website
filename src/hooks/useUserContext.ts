import { useContext } from "react";
import { UserContext, type UserContextType } from "@/context";

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a StoreProvider");
  }
  return context;
};
