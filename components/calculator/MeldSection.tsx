import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Meld, MeldType } from "@/lib/mahjong/types";
import { TileImage } from "@/components/calculator/TileImage";

type MeldSectionProps = {
  melds: Meld[];
  activeMeldId: string | null;
  pendingMeldType: MeldType | null;
  onSelectMeld: (meldId: string) => void;
  onCreateMeld: (type: MeldType) => void;
  onClearPending: () => void;
  onDeleteMeld: (meldId: string) => void;
};

const MELD_LABELS: Record<MeldType, string> = {
  chi: "吃",
  pon: "碰",
  "open-kan": "明杠",
  "closed-kan": "暗杠",
};

const MELD_TYPES: MeldType[] = ["chi", "pon", "open-kan", "closed-kan"];

export function MeldSection({
  melds,
  activeMeldId,
  pendingMeldType,
  onSelectMeld,
  onCreateMeld,
  onClearPending,
  onDeleteMeld,
}: MeldSectionProps) {
  return (
    <Card className="panel-surface min-w-0">
      <CardHeader className="border-b border-border/70">
        <CardTitle>副露区</CardTitle>
        <CardDescription>先选副露类型，再从下方键盘选牌。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {MELD_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={pendingMeldType === type ? "default" : "outline"}
              onClick={() => onCreateMeld(type)}
            >
              + {MELD_LABELS[type]}
            </Button>
          ))}
          {pendingMeldType ? (
            <Button type="button" variant="ghost" onClick={onClearPending}>
              取消添加
            </Button>
          ) : null}
        </div>

        {pendingMeldType ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/8 p-3 text-sm text-muted-foreground">
            正在添加 <span className="font-medium text-foreground">{MELD_LABELS[pendingMeldType]}</span>。
            {pendingMeldType === "chi"
              ? " 吃需要连续三张同花色牌。"
              : " 选择一张牌后会自动补全该副露。"}
          </div>
        ) : null}

        <div className="grid gap-3">
          {melds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              还没有副露。门前和了时，立直与一发等条件才可启用。
            </div>
          ) : null}

          {melds.map((meld) => (
            <div
              key={meld.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectMeld(meld.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectMeld(meld.id);
                }
              }}
              className={cn(
                "flex min-w-0 items-start justify-between gap-3 rounded-2xl border p-3 text-left transition-colors",
                activeMeldId === meld.id ? "border-ring bg-muted" : "border-border bg-background/80"
              )}
            >
              <div className="min-w-0 space-y-3">
                <Badge variant="outline">{MELD_LABELS[meld.type]}</Badge>
                <div className="flex flex-wrap gap-2">
                  {meld.tiles.map((tile, index) => (
                    <TileImage
                      key={`${meld.id}-${tile}-${index}`}
                      tile={tile}
                      compact
                      faceDown={meld.type === "closed-kan" && (index === 0 || index === meld.tiles.length - 1)}
                    />
                  ))}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteMeld(meld.id);
                }}
              >
                删除
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
