import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TILE_ORDER, type TileCode } from "@/lib/mahjong/types";
import { TileImage } from "@/components/calculator/TileImage";

type TileKeyboardProps = {
  remainingMap: Map<TileCode, number>;
  requiredCount?: number;
  onPickTile: (tile: TileCode) => void;
  mobile?: boolean;
  onClose?: () => void;
};

const TILE_ROWS = [
  TILE_ORDER.slice(0, 9),
  TILE_ORDER.slice(9, 18),
  TILE_ORDER.slice(18, 27),
  TILE_ORDER.slice(27),
];

export function TileKeyboard({
  remainingMap,
  requiredCount = 1,
  onPickTile,
  mobile = false,
  onClose,
}: TileKeyboardProps) {
  return (
    <Card
      className={cn(
        "panel-surface keyboard-shadow border-primary/10 bg-background/95 backdrop-blur",
        mobile && "max-h-[50dvh] rounded-b-none"
      )}
    >
      <CardHeader className="border-b border-border/70 px-3 py-3 md:px-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>选牌键盘</CardTitle>
            <CardDescription className={cn(mobile ? "block text-xs" : "hidden md:block")}>
              剩余张数会实时扣减，归零后不可再点。
            </CardDescription>
          </div>
          {mobile && onClose ? (
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              收起
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "space-y-2 px-2 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:space-y-3 md:px-4 md:pt-4 md:pb-4",
          mobile && "overflow-y-auto"
        )}
      >
        {TILE_ROWS.map((row, index) => (
          <div key={index} className="flex flex-wrap gap-1.5 md:gap-2">
            {row.map((tile) => {
              const remaining = remainingMap.get(tile) ?? 4;
              const disabled = remaining < requiredCount;

              return (
                <Button
                  key={tile}
                  type="button"
                  variant="ghost"
                  disabled={disabled}
                  className={cn(
                    "flex h-auto w-auto flex-col gap-0.5 rounded-xl border border-transparent bg-transparent p-0.5 md:gap-1 md:p-1",
                    disabled ? "hover:bg-transparent" : "hover:bg-transparent"
                  )}
                  onClick={() => onPickTile(tile)}
                >
                  <TileImage tile={tile} compact dimmed={disabled} />
                  <span className="text-xs text-muted-foreground">剩余 {remaining}</span>
                </Button>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
