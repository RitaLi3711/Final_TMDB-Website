import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonGroup, FaRegHeart, GiExitDoor, GoGear, LinkGroup, PiShoppingCartSimple, SearchBar } from "@/components";
import type { SearchType } from "@/core";
import { ICON_SIZE } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<SearchType>("movie");
  const { user, userName, favorites, cart } = useFirebaseContext();

  if (location.pathname === "/" || location.pathname === "/sign-in") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-[#344966] border-b bg-[#0d1821]">
      <div className="flex items-center justify-between gap-20 px-4 pt-4">
        <div className="flex items-center gap-4">
          <h1 className="cursor-pointer font-bold text-4xl text-[#f0f4ef]">TMDB Explorer</h1>
          <LinkGroup
            options={[
              { label: "Movies", match: ["/movies"], to: "/movies/category/now_playing" },
              { label: "TV", match: ["/tv"], to: "/tv/category/airing_today" },
              { label: "Trending", match: ["/trending"], to: "/trending/movies" },
              { label: "Genre", match: ["/genre"], to: "/genre/movies/action" },
            ]}
          />
        </div>

        <div className="flex items-center gap-4">
          <SearchBar
            onChange={(query) => {
              setQuery(query);
              navigate(`/search?q=${query}&type=${type}`);
            }}
            value={query}
          />
          <ButtonGroup
            onClick={(value: string) => {
              setType(value as SearchType);
              navigate(`/search?q=${query}&type=${value}`);
            }}
            options={[
              { label: "Movie", value: "movie" },
              { label: "TV", value: "tv" },
              { label: "Person", value: "person" },
            ]}
            value={type}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pt-2 pb-4">
        <div className="flex items-center gap-3 rounded-full border border-[#2f4663] bg-[#14253b] px-4 py-2">
          <img alt={userName} className="h-8 w-8 rounded-full" src={user?.photoURL ?? undefined} />
          <span className="font-semibold text-[#f8fafc] text-sm">Welcome, {userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/favorites")}>
            <FaRegHeart color="#f0f4ef" size={ICON_SIZE} />
            {favorites.size > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#BFCC94] font-bold text-[#0D1821] text-[10px]">
                {favorites.size}
              </span>
            )}
          </button>

          <button className="relative rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/cart")}>
            <PiShoppingCartSimple color="#f0f4ef" size={ICON_SIZE} />
            {cart.size > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#BFCC94] font-bold text-[#0D1821] text-[10px]">
                {cart.size}
              </span>
            )}
          </button>
          <button className="rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/settings")}>
            <GoGear color="#f0f4ef" size={ICON_SIZE} />
          </button>
          <button className="rounded-full p-2 transition hover:bg-gray-700" onClick={() => navigate("/sign-in")}>
            <GiExitDoor color="#f0f4ef" size={ICON_SIZE} />
          </button>
        </div>
      </div>
    </header>
  );
};
