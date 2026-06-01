import { useNavigate, useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { getImageUrl, type ImageCell, PERSON_ENDPOINT, type PersonCareerResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const CareerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useTmdb<PersonCareerResponse>(`${PERSON_ENDPOINT}/${id ?? ""}/movie_credits`, {});

  const gridData: ImageCell[] = (data?.cast ?? []).map((item) => ({
    id: item.id,
    imageUrl: getImageUrl(item.poster_path ?? ""),
    primaryText: item.title || item.name || "",
    secondaryText: item.character,
  }));

  return (
    <div className="space-y-6 p-6 pt-8">
      <h2 className="font-bold text-2xl text-[#f0f4ef]">Career</h2>
      {!data ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <ImageGrid images={gridData} onClick={(image: ImageCell) => navigate(`/movie/${image.id}`)} />
      )}
    </div>
  );
};
