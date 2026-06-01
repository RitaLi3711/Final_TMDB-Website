import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { type CreditsResponse, getImageUrl, type ImageCell, MOVIE_ENDPOINT, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const CreditsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isMovie = location.pathname.includes("/movie/");

  const { data } = useTmdb<CreditsResponse>(`${isMovie ? MOVIE_ENDPOINT : TV_ENDPOINT}/${id ?? ""}/credits`, {});

  const gridData: ImageCell[] = (data?.cast ?? []).map((person) => ({
    id: person.id,
    imageUrl: getImageUrl(person.profile_path ?? ""),
    primaryText: person.name,
    secondaryText: person.character,
  }));

  return (
    <div className="p-6">
      {!data ? (
        <p className="text-center text-gray-400">Loading credits...</p>
      ) : !data.cast?.length ? (
        <p className="text-center text-gray-400">No credits available.</p>
      ) : (
        <ImageGrid images={gridData} onClick={(image: ImageCell) => navigate(`/person/${image.id}`)} />
      )}
    </div>
  );
};
