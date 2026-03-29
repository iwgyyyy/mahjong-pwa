"use client";

import { RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { PhotoProvider as PhotoProviderBase } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  return (
    <PhotoProviderBase
      toolbarRender={({ rotate, scale, onRotate, onScale }) => (
        <div className="mr-2 flex items-center gap-4">
          <RotateCcwIcon className="size-4 cursor-pointer" onClick={() => onRotate(rotate + 90)} />
          <ZoomInIcon className="size-4 cursor-pointer" onClick={() => onScale(scale + 1)} />
          <ZoomOutIcon className="size-4 cursor-pointer" onClick={() => onScale(scale - 1)} />
        </div>
      )}
    >
      {children}
    </PhotoProviderBase>
  );
}
