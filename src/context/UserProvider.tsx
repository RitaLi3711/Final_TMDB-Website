import type { User } from "firebase/auth";
import { type ReactNode, useState } from "react";
import { UserContext } from "@/context";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{
        setUser,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
