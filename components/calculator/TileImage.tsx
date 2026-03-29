import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TileCode } from "@/lib/mahjong/types";

type TileImageProps = {
  tile: TileCode;
  compact?: boolean;
  dimmed?: boolean;
  faceDown?: boolean;
};

const TILE_ASSET_MAP: Record<TileCode, string> = {
  "1m": "/tiles/Man1.svg",
  "2m": "/tiles/Man2.svg",
  "3m": "/tiles/Man3.svg",
  "4m": "/tiles/Man4.svg",
  "5m": "/tiles/Man5.svg",
  "6m": "/tiles/Man6.svg",
  "7m": "/tiles/Man7.svg",
  "8m": "/tiles/Man8.svg",
  "9m": "/tiles/Man9.svg",
  "1p": "/tiles/Pin1.svg",
  "2p": "/tiles/Pin2.svg",
  "3p": "/tiles/Pin3.svg",
  "4p": "/tiles/Pin4.svg",
  "5p": "/tiles/Pin5.svg",
  "6p": "/tiles/Pin6.svg",
  "7p": "/tiles/Pin7.svg",
  "8p": "/tiles/Pin8.svg",
  "9p": "/tiles/Pin9.svg",
  "1s": "/tiles/Sou1.svg",
  "2s": "/tiles/Sou2.svg",
  "3s": "/tiles/Sou3.svg",
  "4s": "/tiles/Sou4.svg",
  "5s": "/tiles/Sou5.svg",
  "6s": "/tiles/Sou6.svg",
  "7s": "/tiles/Sou7.svg",
  "8s": "/tiles/Sou8.svg",
  "9s": "/tiles/Sou9.svg",
  "1z": "/tiles/Ton.svg",
  "2z": "/tiles/Nan.svg",
  "3z": "/tiles/Shaa.svg",
  "4z": "/tiles/Pei.svg",
  "5z": "/tiles/Haku.svg",
  "6z": "/tiles/Hatsu.svg",
  "7z": "/tiles/Chun.svg",
};

export function TileImage({ tile, compact = false, dimmed = false, faceDown = false }: TileImageProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 transition-opacity shadow",
        compact ? "h-16 w-12" : "h-16 w-11",
        dimmed && "opacity-45 grayscale"
      )}
    >
      {faceDown ? (
        <Image
          src="/tiles/Back.svg"
          alt={`${tile}-back`}
          fill
          sizes={compact ? "40px" : "44px"}
          className="object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          unoptimized
        />
      ) : (
        <>
          <Image
            src="/tiles/Front.svg"
            alt={`${tile}-front`}
            fill
            sizes={compact ? "40px" : "44px"}
            className="object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
            unoptimized
          />
          <Image
            src={TILE_ASSET_MAP[tile]}
            alt={tile}
            fill
            sizes={compact ? "40px" : "44px"}
            className="object-contain scale-80"
            unoptimized
          />
        </>
      )}
    </div>
  );
}
