import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { CartOverlay, LinkGroup, Modal } from "@/components";
import {
  calculatePrice,
  formatPrice,
  getImageUrl,
  type ImageCell,
  MOVIE_ENDPOINT,
  type MovieResponse,
  ORIGINAL_IMAGE_BASE_URL,
  TV_ENDPOINT,
  type TvDetailsResponse,
} from "@/core";
import { useFirebaseContext, useTmdb } from "@/hooks";

export const MovieView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { cart, addToCart, removeFromCart, favorites, toggleFavorite } = useFirebaseContext();

  const isMovie = location.pathname.includes("/movie/");
  const { data } = useTmdb<MovieResponse | TvDetailsResponse>(`${isMovie ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id ?? ""}`, {
    append_to_response: "videos",
  });

  const title = data ? (isMovie ? (data as MovieResponse).title : (data as TvDetailsResponse).name) : "";
  const tagline = data ? (isMovie ? (data as MovieResponse).tagline : (data as TvDetailsResponse).tagline) : "";
  const backdropUrl = data?.backdrop_path ? `${ORIGINAL_IMAGE_BASE_URL}${data.backdrop_path}` : "";
  const posterUrl = getImageUrl(data?.poster_path ?? "");
  const releaseDate = isMovie ? (data as MovieResponse)?.release_date : null;
  const price = isMovie && releaseDate ? calculatePrice(releaseDate) : null;

  const imageCell: ImageCell = {
    id: data?.id || 0,
    imageUrl: posterUrl,
    media: "movie",
    primaryText: title,
    releaseDate: releaseDate || undefined,
  };

  return (
    <Modal onClick={() => navigate(-1)}>
      <div className="flex h-[90vh] flex-col">
        {!data ? (
          <p className="p-6 text-center text-gray-400">Loading...</p>
        ) : (
          <>
            <div className="h-60 shrink-0 rounded-t-2xl bg-center bg-cover" style={{ backgroundImage: `url(${backdropUrl})` }} />

            <div className="flex flex-1 overflow-hidden">
              <div className="w-80 shrink-0 p-6">
                <img alt={title} className="w-full rounded-xl object-cover" src={posterUrl} />
              </div>

              <div className="flex flex-1 flex-col overflow-hidden p-6 pl-0">
                <div className="shrink-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="font-bold text-3xl">{title}</h1>
                    {isMovie && (
                      <div className="flex flex-col items-end gap-1">
                        <CartOverlay
                          addToCart={addToCart}
                          cart={cart}
                          favorites={favorites}
                          item={imageCell}
                          media="movie"
                          removeFromCart={removeFromCart}
                          toggleFavorite={toggleFavorite}
                        />
                        {price && <p className="font-semibold text-[#e6aace]">{formatPrice(price)}</p>}
                      </div>
                    )}
                  </div>
                  {tagline && <p className="text-gray-400 text-sm italic">{tagline}</p>}

                  <LinkGroup
                    options={
                      isMovie
                        ? [
                            { label: "Summary", to: "summary" },
                            { label: "Credits", to: "credits" },
                            { label: "Trailers", to: "trailers" },
                            { label: "Reviews", to: "reviews" },
                          ]
                        : [
                            { label: "Summary", to: "summary" },
                            { label: "Seasons", match: ["/tv/:id/seasons"], to: "seasons" },
                            { label: "Credits", to: "credits" },
                            { label: "Trailers", to: "trailers" },
                            { label: "Reviews", to: "reviews" },
                          ]
                    }
                  />
                </div>

                <div className="mt-6 flex-1 overflow-y-auto pr-4">
                  <Outlet />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
