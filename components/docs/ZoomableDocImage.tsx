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
}: ZoomableDocImageProps) {
  return (
    <PhotoView src={src}>
      {fill ? (
        <div className={cn("relative h-full w-full cursor-zoom-in", wrapperClassName)}>
          <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-contain", className)} />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={cn("h-auto w-full cursor-zoom-in object-contain", className)}
        />
      )}
    </PhotoView>
  );
}
