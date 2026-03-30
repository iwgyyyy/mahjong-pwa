"use client";

import Image from "next/image";
import { PhotoView } from "react-photo-view";
import { cn } from "@/lib/utils";

type ZoomableDocImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  wrapperClassName?: string;
  fill?: boolean;
  loading?: "eager" | "lazy";
};

export function ZoomableDocImage({
  src,
  alt,
  width = 800,
  height = 600,
  sizes,
  className,
  wrapperClassName,
  fill = false,
  loading = "lazy",
}: ZoomableDocImageProps) {
  return (
    <PhotoView src={src}>
      {fill ? (
        <div className={cn("relative h-full w-full cursor-zoom-in", wrapperClassName)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={loading}
            className={cn("object-contain", className)}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          style={{ width: "100%", height: "auto" }}
          className={cn("h-auto w-full cursor-zoom-in object-contain", className)}
        />
      )}
    </PhotoView>
  );
}
