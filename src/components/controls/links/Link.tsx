import type { ReactNode } from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";

type LinkProps = {
  children: ReactNode;
  to: string;
  match?: string[];
  replace?: boolean;
};

export const Link = ({ children, to, match = [], replace = false }: LinkProps) => {
  const { pathname } = useLocation();

  const matched = match.some((pattern) => matchPath({ end: false, path: pattern }, pathname));

  return (
    <NavLink
      className={({ isActive }) =>
        `rounded-md border px-4 py-2 transition-all duration-200 ${
          isActive || matched
            ? "scale-105 border-[#e6aace] bg-[#e6aace] text-[#0d1821] shadow-lg"
            : "border-[#344966] bg-[#344966] text-[#f0f4ef] hover:border-[#bfcc94] hover:bg-[#2a3b52] hover:text-[#f0f4ef]"
        }`
      }
      end
      replace={replace}
      to={to}
    >
      {children}
    </NavLink>
  );
};
