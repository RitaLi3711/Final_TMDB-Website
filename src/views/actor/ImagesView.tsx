import { useParams } from "react-router-dom";
import { ImageGrid } from "@/components";
import { getImageUrl, type ImageCell, PERSON_ENDPOINT, type PersonImagesResponse } from "@/core";
import { useTmdb } from "@/hooks";

export const ImagesView = () => {
  const { id } = useParams();
  const { data } = useTmdb<PersonImagesResponse>(`${PERSON_ENDPOINT}/${id ?? ""}/images`, {});

  const gridData: ImageCell[] = (data?.profiles ?? []).map((img, index) => ({
    id: index,
    imageUrl: getImageUrl(img.file_path ?? ""),
    primaryText: "",
  }));

  return (
    <div className="space-y-6 p-6 pt-8">
      <h2 className="font-bold text-2xl text-[#f0f4ef]">Images</h2>
      {!data ? (
        <p className="text-center text-gray-400">Loading images...</p>
      ) : !data.profiles?.length ? (
        <p className="text-center text-gray-400">No images available.</p>
      ) : (
        <ImageGrid images={gridData} />
      )}
    </div>
  );
};
