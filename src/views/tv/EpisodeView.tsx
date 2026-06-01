import { useNavigate, useParams } from "react-router-dom";
import { Button, FaArrowLeft, FaCalendarAlt, ImageGrid } from "@/components";
import { calculatePrice, formatPrice, getImageUrl, type ImageCell, type SeasonData, TV_ENDPOINT } from "@/core";
import { useTmdb } from "@/hooks";

export const EpisodeView = () => {
  const { id, seasonNumber } = useParams();
  const navigate = useNavigate();

  const { data } = useTmdb<SeasonData>(`${TV_ENDPOINT}/${id ?? ""}/season/${seasonNumber ?? ""}`, {});

  const gridData: ImageCell[] = (data?.episodes ?? []).map((episode) => ({
    id: episode.id,
    imageUrl: getImageUrl(episode.still_path ?? ""),
    primaryText: `Episode ${episode.episode_number}: ${episode.name}`,
    secondaryText: episode.air_date,
  }));

  return (
    <div className="p-6">
      <div className="mb-5">
        <Button onClick={() => navigate(-1)} variant="primary">
          <FaArrowLeft className="mr-2 inline" />
          Back
        </Button>
      </div>

      {!data ? (
        <p className="text-gray-400">Loading episodes...</p>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <h1 className="font-bold text-3xl">Season {seasonNumber}</h1>
              <h4 className="font-bold text-2xl text-[#e6aace]">{formatPrice(calculatePrice(data.air_date))}</h4>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FaCalendarAlt />
              <span>{data.air_date || "Date TBA"}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400">{data.overview || ""}</p>
            <h2 className="mt-8 font-bold text-2xl">Episodes</h2>
          </div>

          <ImageGrid images={gridData} />
        </>
      )}
    </div>
  );
};
