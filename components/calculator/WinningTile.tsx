import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { TileCode, WinningMethod } from "@/lib/mahjong/types";
import { TileImage } from "@/components/calculator/TileImage";

type WinningTileProps = {
  winningTile: TileCode | null;
  winningMethod: WinningMethod;
  isActive: boolean;
  onSelectArea: () => void;
  onChangeMethod: (method: WinningMethod) => void;
  onClear: () => void;
};

export function WinningTile({
  winningTile,
  winningMethod,
  isActive,
  onSelectArea,
  onChangeMethod,
  onClear,
}: WinningTileProps) {
  return (
    <Card className={cn("panel-surface min-w-0", isActive && "ring-2 ring-ring")}>
      <CardHeader className="border-b border-border/70">
        <CardTitle>和了牌</CardTitle>
        <CardDescription>单独输入最后一张牌，并切换自摸 / 荣和。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSelectArea}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-background/70"
          >
            {winningTile ? (
              <TileImage tile={winningTile} />
            ) : (
              <span className="text-sm text-muted-foreground">选择牌面</span>
            )}
          </button>
          <Button type="button" variant="ghost" onClick={onClear} disabled={!winningTile}>
            清空和了牌
          </Button>
        </div>

        <ToggleGroup
          type="single"
          value={winningMethod}
          onValueChange={(value) => {
            if (value === "tsumo" || value === "ron") {
              onChangeMethod(value);
            }
          }}
          variant="outline"
          className="w-full flex-wrap"
        >
          <ToggleGroupItem value="tsumo">自摸</ToggleGroupItem>
          <ToggleGroupItem value="ron">荣和</ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
