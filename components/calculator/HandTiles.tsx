import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TileCode } from "@/lib/mahjong/types";
import { TileImage } from "@/components/calculator/TileImage";

type HandTilesProps = {
  tiles: TileCode[];
  maxTiles: number;
  isActive: boolean;
  onSelectArea: () => void;
  onRemoveTile: (index: number) => void;
};

export function HandTiles({
  tiles,
  maxTiles,
  isActive,
  onSelectArea,
  onRemoveTile,
}: HandTilesProps) {
  const placeholders = Math.max(maxTiles - tiles.length, 0);

  return (
    <Card className={cn("panel-surface min-w-0", isActive && "ring-2 ring-ring")}>
      <CardHeader className="border-b border-border/70">
        <CardTitle>门前手牌</CardTitle>
        <CardDescription>点击区域激活输入，点击牌面可移除。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div
          role="button"
          tabIndex={0}
          onClick={onSelectArea}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectArea();
            }
          }}
          className="flex w-full flex-wrap gap-2 rounded-2xl border border-dashed border-border bg-background/70 p-3 text-left"
        >
          {tiles.map((tile, index) => (
            <Button
              key={`${tile}-${index}`}
              type="button"
              variant="ghost"
              size="icon-lg"
              className="h-auto w-auto p-0 hover:bg-transparent"
              onClick={(event) => {
                event.stopPropagation();
                onRemoveTile(index);
              }}
            >
              <TileImage tile={tile} />
            </Button>
          ))}
          {Array.from({ length: placeholders }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="flex h-16 w-11 items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 text-xs text-muted-foreground"
            >
              空位
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          当前 {tiles.length}/{maxTiles} 张。副露越多，门前区可输入的张数越少。
        </p>
      </CardContent>
    </Card>
  );
}
