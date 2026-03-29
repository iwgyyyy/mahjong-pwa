import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { TileImage } from "@/components/calculator/TileImage";
import type { GameConditions as GameConditionsType, TileCode, Wind } from "@/lib/mahjong/types";

type GameConditionsProps = {
  conditions: GameConditionsType;
  isMenzen: boolean;
  doraIndicators: Array<TileCode | null>;
  uraDoraIndicators: Array<TileCode | null>;
  activeDoraSlot: { kind: "dora" | "ura"; slotIndex: number } | null;
  onRoundWindChange: (wind: "east" | "south") => void;
  onSeatWindChange: (wind: Wind) => void;
  onDealerChange: (isDealer: boolean) => void;
  onHonbaChange: (value: number) => void;
  onSpecialToggle: (key: keyof GameConditionsType["special"]) => void;
  onSelectDoraSlot: (kind: "dora" | "ura", slotIndex: number) => void;
  onClearDoraSlot: (kind: "dora" | "ura", slotIndex: number) => void;
};

const SPECIAL_TOGGLES: Array<{ key: keyof GameConditionsType["special"]; label: string }> = [
  { key: "riichi", label: "立直" },
  { key: "doubleRiichi", label: "双立直" },
  { key: "ippatsu", label: "一发" },
  { key: "rinshan", label: "岭上开花" },
  { key: "chankan", label: "抢杠" },
  { key: "haitei", label: "海底摸月" },
  { key: "houtei", label: "河底捞鱼" },
];

export function GameConditions({
  conditions,
  isMenzen,
  doraIndicators,
  uraDoraIndicators,
  activeDoraSlot,
  onRoundWindChange,
  onSeatWindChange,
  onDealerChange,
  onHonbaChange,
  onSpecialToggle,
  onSelectDoraSlot,
  onClearDoraSlot,
}: GameConditionsProps) {
  const riichiLocked = !isMenzen;
  const method = conditions.winningMethod;

  return (
    <Card className="panel-surface min-w-0">
      <CardHeader className="border-b border-border/70">
        <CardTitle>场况条件</CardTitle>
        <CardDescription>场风、自风、本场与特殊条件都在这里联动控制。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">场风</p>
          <ToggleGroup
            type="single"
            value={conditions.roundWind}
            onValueChange={(value) => {
              if (value === "east" || value === "south") {
                onRoundWindChange(value);
              }
            }}
            variant="outline"
            className="w-full flex-wrap"
          >
            <ToggleGroupItem value="east">东场</ToggleGroupItem>
            <ToggleGroupItem value="south">南场</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">自风</p>
          <ToggleGroup
            type="single"
            value={conditions.seatWind}
            onValueChange={(value) => {
              if (value === "east" || value === "south" || value === "west" || value === "north") {
                onSeatWindChange(value);
              }
            }}
            variant="outline"
            className="w-full flex-wrap"
          >
            <ToggleGroupItem value="east">东</ToggleGroupItem>
            <ToggleGroupItem value="south">南</ToggleGroupItem>
            <ToggleGroupItem value="west">西</ToggleGroupItem>
            <ToggleGroupItem value="north">北</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">自风只参与自风牌役牌判定。</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">身份</p>
          <ToggleGroup
            type="single"
            value={conditions.isDealer ? "dealer" : "non-dealer"}
            onValueChange={(value) => {
              if (value === "dealer") {
                onDealerChange(true);
              }
              if (value === "non-dealer") {
                onDealerChange(false);
              }
            }}
            variant="outline"
            className="w-full flex-wrap"
          >
            <ToggleGroupItem value="dealer">庄家</ToggleGroupItem>
            <ToggleGroupItem value="non-dealer">闲家</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">身份只影响庄家/闲家的点数计算，不影响场风牌和自风牌判定。</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">本场数</p>
          <Input
            type="number"
            min={0}
            value={conditions.honba}
            onChange={(event) => onHonbaChange(Number(event.target.value) || 0)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">特殊条件</p>
          <div className="flex flex-wrap gap-2">
            {SPECIAL_TOGGLES.map((item) => {
              const disabled =
                (riichiLocked && (item.key === "riichi" || item.key === "doubleRiichi" || item.key === "ippatsu")) ||
                (item.key === "ippatsu" && !conditions.special.riichi && !conditions.special.doubleRiichi) ||
                (item.key === "rinshan" && method !== "tsumo") ||
                (item.key === "chankan" && method !== "ron") ||
                (item.key === "haitei" && method !== "tsumo") ||
                (item.key === "houtei" && method !== "ron");

              return (
                <Button
                  key={item.key}
                  type="button"
                  variant={conditions.special[item.key] ? "default" : "outline"}
                  disabled={disabled}
                  onClick={() => onSpecialToggle(item.key)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            门前清自摸和会在结果区自动识别，不需要手动勾选。
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">宝牌指示牌</p>
          <div className="-mx-1 overflow-x-auto py-2">
            <div className="flex w-max gap-3 px-2">
            {doraIndicators.map((tile, slotIndex) => (
              <div key={`dora-${slotIndex}`} className="space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectDoraSlot("dora", slotIndex)}
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-background/70",
                    activeDoraSlot?.kind === "dora" &&
                      activeDoraSlot.slotIndex === slotIndex &&
                      "border-ring ring-2 ring-ring"
                  )}
                >
                  {tile ? (
                    <TileImage tile={tile} />
                  ) : (
                    <span className="text-xs text-muted-foreground">{`宝牌 ${slotIndex + 1}`}</span>
                  )}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearDoraSlot("dora", slotIndex)}
                >
                  清空
                </Button>
              </div>
            ))}
            </div>
          </div>
          {(conditions.special.riichi || conditions.special.doubleRiichi) ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">里宝牌指示牌</p>
              <div className="-mx-1 overflow-x-auto py-2">
                <div className="flex w-max gap-3 px-2">
                {uraDoraIndicators.map((tile, slotIndex) => (
                  <div key={`ura-${slotIndex}`} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectDoraSlot("ura", slotIndex)}
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-background/70",
                        activeDoraSlot?.kind === "ura" &&
                          activeDoraSlot.slotIndex === slotIndex &&
                          "border-ring ring-2 ring-ring"
                      )}
                    >
                      {tile ? (
                        <TileImage tile={tile} />
                      ) : (
                        <span className="text-xs text-muted-foreground">{`里宝牌 ${slotIndex + 1}`}</span>
                      )}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearDoraSlot("ura", slotIndex)}
                    >
                      清空
                    </Button>
                  </div>
                ))}
                </div>
              </div>
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            宝牌与里宝牌都固定显示 5 个位置，便于录入他家开杠后新增的指示牌。
          </p>
        </div>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost">
              更多极少用条件
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant={conditions.special.tenho ? "default" : "outline"}
              onClick={() => onSpecialToggle("tenho")}
              disabled={!isMenzen || method !== "tsumo" || !conditions.isDealer}
            >
              天和
            </Button>
            <Button
              type="button"
              variant={conditions.special.chiho ? "default" : "outline"}
              onClick={() => onSpecialToggle("chiho")}
              disabled={!isMenzen || method !== "tsumo" || conditions.isDealer}
            >
              地和
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
