import type { ReactNode } from "react";
import type { ImageCell } from "@/core";

type ImageGridProps = {
  images: ImageCell[];
  onClick?: (image: ImageCell) => void;
  children?: (image: ImageCell) => ReactNode;
};

export const ImageGrid = ({ images, onClick, children }: ImageGridProps) => {
  return (
    <div className="grid w-full grid-cols-5 gap-5">
      {images.map((image) => (
        <div
          className={`relative overflow-hidden rounded-lg bg-gray-800 ${onClick ? "cursor-pointer transition hover:scale-[1.02]" : ""}`}
          key={image.id}
          onClick={() => onClick?.(image)}
        >
          {children?.(image)}
          {image.imageUrl ? (
            <img alt={image.primaryText} className="aspect-2/3 w-full object-cover" src={image.imageUrl} />
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center bg-gray-700">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="p-3 text-center">
            <p className="truncate font-semibold text-[#f0f4ef] text-sm">{image.primaryText}</p>
            {image.secondaryText && <p className="text-gray-400 text-xs">{image.secondaryText}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
