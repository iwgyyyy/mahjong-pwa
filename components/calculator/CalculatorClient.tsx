"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { HandTiles } from "@/components/calculator/HandTiles";
import { MeldSection } from "@/components/calculator/MeldSection";
import { WinningTile } from "@/components/calculator/WinningTile";
import { TileKeyboard } from "@/components/calculator/TileKeyboard";
import { GameConditions } from "@/components/calculator/GameConditions";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { buildCalculationSummary, getHandLimit, getUsedTileCounts } from "@/lib/mahjong/calculator";
import { DEFAULT_STATE, TILE_ORDER, type CalculatorState, type MeldType, type TileCode, type Wind } from "@/lib/mahjong/types";

const TILE_INDEX = new Map(TILE_ORDER.map((tile, index) => [tile, index]));

function makeMeldId() {
  return `meld-${Math.random().toString(36).slice(2, 10)}`;
}

function sortTiles(tiles: TileCode[]) {
  return [...tiles].sort((left, right) => (TILE_INDEX.get(left) ?? 0) - (TILE_INDEX.get(right) ?? 0));
}

function isChiSequence(tiles: TileCode[]) {
  if (tiles.length !== 3 || tiles.some((tile) => tile.endsWith("z"))) {
    return false;
  }

  const suit = tiles[0]?.slice(1);
  if (!tiles.every((tile) => tile.slice(1) === suit)) {
    return false;
  }

  const values = tiles.map((tile) => Number(tile[0])).sort((a, b) => a - b);
  return values[1] === values[0] + 1 && values[2] === values[1] + 1;
}

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
}

export function CalculatorClient() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);
  const [pendingChiTiles, setPendingChiTiles] = useState<TileCode[]>([]);
  const [mobileKeyboardVisible, setMobileKeyboardVisible] = useState(false);

  const usedTileCounts = getUsedTileCounts(state);
  const remainingMap = new Map<TileCode, number>();
  for (const [tile, count] of usedTileCounts) {
    remainingMap.set(tile, Math.max(0, 4 - count));
  }

  const handLimit = getHandLimit(state.melds);
  const summary = buildCalculationSummary(state);
  const isMenzen = state.melds.length === 0;
  const activeMeldId = state.activeArea.type === "meld" ? state.activeArea.meldId : null;
  const activeDoraSlot = state.activeArea.type === "dora" ? state.activeArea : null;
  const requiredTileCount =
    state.activeArea.type === "meld"
      ? state.pendingMeldType === "pon"
        ? 3
        : state.pendingMeldType === "open-kan" || state.pendingMeldType === "closed-kan"
          ? 4
          : 1
      : 1;

  function patchConditions(updater: (current: CalculatorState["conditions"]) => CalculatorState["conditions"]) {
    setState((current) => ({ ...current, conditions: updater(current.conditions) }));
  }

  function closeMobileKeyboard() {
    setMobileKeyboardVisible(false);
  }

  function activateArea(activeArea: CalculatorState["activeArea"]) {
    setState((current) => ({ ...current, activeArea }));
    if (isMobileViewport()) {
      setMobileKeyboardVisible(true);
    }
  }

  function handleSpecialToggle(key: keyof CalculatorState["conditions"]["special"]) {
    patchConditions((current) => {
      const nextSpecial = { ...current.special, [key]: !current.special[key] };

      if (key === "riichi" && nextSpecial.riichi) {
        nextSpecial.doubleRiichi = false;
      }
      if (key === "doubleRiichi" && nextSpecial.doubleRiichi) {
        nextSpecial.riichi = false;
      }
      if (!nextSpecial.riichi && !nextSpecial.doubleRiichi) {
        nextSpecial.ippatsu = false;
      }
      if (key === "haitei" && nextSpecial.haitei) {
        nextSpecial.houtei = false;
      }
      if (key === "houtei" && nextSpecial.houtei) {
        nextSpecial.haitei = false;
      }
      if (key === "tenho" && nextSpecial.tenho) {
        nextSpecial.chiho = false;
      }
      if (key === "chiho" && nextSpecial.chiho) {
        nextSpecial.tenho = false;
      }

      return { ...current, special: nextSpecial };
    });
  }

  function updateWinningMethod(method: "tsumo" | "ron") {
    patchConditions((current) => ({
      ...current,
      winningMethod: method,
      special: {
        ...current.special,
        haitei: method === "tsumo" ? current.special.haitei : false,
        houtei: method === "ron" ? current.special.houtei : false,
      },
    }));
  }

  function createMeld(type: MeldType) {
    const id = makeMeldId();
    setPendingChiTiles([]);

    if (type === "chi") {
      setState((current) => ({
        ...current,
        pendingMeldType: type,
        activeArea: { type: "meld", meldId: id },
      }));
      if (isMobileViewport()) {
        setMobileKeyboardVisible(true);
      }
      return;
    }

    setState((current) => ({
      ...current,
      melds: [...current.melds, { id, type, tiles: [] }],
      pendingMeldType: type,
      activeArea: { type: "meld", meldId: id },
      conditions: {
        ...current.conditions,
        special: {
          ...current.conditions.special,
          riichi: false,
          doubleRiichi: false,
          ippatsu: false,
        },
      },
    }));
    if (isMobileViewport()) {
      setMobileKeyboardVisible(true);
    }
  }

  function handleTilePick(tile: TileCode) {
    if (state.activeArea.type !== "dora" && (remainingMap.get(tile) ?? 4) < requiredTileCount) {
      return;
    }

    if (state.activeArea.type === "meld" && isMobileViewport()) {
      closeMobileKeyboard();
    }

    setState((current) => {
      if (current.activeArea.type === "hand") {
        if (current.handTiles.length >= getHandLimit(current.melds)) {
          return current;
        }

        return { ...current, handTiles: sortTiles([...current.handTiles, tile]) };
      }

      if (current.activeArea.type === "winning") {
        return { ...current, winningTile: tile };
      }

      if (current.activeArea.type === "dora") {
        const key = current.activeArea.kind === "dora" ? "doraIndicators" : "uraDoraIndicators";
        const nextIndicators = [...current[key]];
        nextIndicators[current.activeArea.slotIndex] = tile;
        return { ...current, [key]: nextIndicators };
      }

      const meldId = current.activeArea.meldId;
      const targetIndex = current.melds.findIndex((meld) => meld.id === meldId);

      if (current.pendingMeldType === "chi") {
        const nextPending = [...pendingChiTiles, tile];
        setPendingChiTiles(nextPending);

        if (nextPending.length < 3) {
          return current;
        }

        if (!isChiSequence(nextPending)) {
          setPendingChiTiles([]);
          return current;
        }

        setPendingChiTiles([]);
        return {
          ...current,
          melds: [...current.melds, { id: meldId, type: "chi", tiles: sortTiles(nextPending) }],
          pendingMeldType: null,
          activeArea: { type: "hand" },
          conditions: {
            ...current.conditions,
            special: {
              ...current.conditions.special,
              riichi: false,
              doubleRiichi: false,
              ippatsu: false,
            },
          },
        };
      }

      if (targetIndex === -1 || !current.pendingMeldType) {
        return current;
      }

      const count = current.pendingMeldType === "pon" ? 3 : 4;
      const nextMelds = [...current.melds];
      nextMelds[targetIndex] = {
        ...nextMelds[targetIndex],
        tiles: Array.from({ length: count }, () => tile),
      };

      return {
        ...current,
        melds: nextMelds,
        pendingMeldType: null,
        activeArea: { type: "hand" },
        conditions: {
          ...current.conditions,
          special: {
            ...current.conditions.special,
            riichi: false,
            doubleRiichi: false,
            ippatsu: false,
          },
        },
      };
    });
  }

  function deleteMeld(meldId: string) {
    setPendingChiTiles([]);
    setState((current) => ({
      ...current,
      melds: current.melds.filter((meld) => meld.id !== meldId),
      activeArea:
        { type: "hand" },
      pendingMeldType: current.activeArea.type === "meld" && current.activeArea.meldId === meldId ? null : current.pendingMeldType,
    }));
  }

  return (
    <main
      className="app-shell min-h-screen w-full px-4 pt-6 md:px-6 md:py-8"
      style={{ paddingBottom: 24 }}
    >
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-card/90 px-4 py-5 shadow-sm md:px-8 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Riichi Utility</p>
              <h1 className="max-w-3xl text-2xl font-semibold tracking-tight md:text-5xl">
                立直麻将番符计算器
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                按设计稿完成前端输入流：场况、门前、副露、和了牌和固定键盘都在同页完成。结果区会自动给出场况役种预览与基础符示意。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/">返回首页</Link>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setState(DEFAULT_STATE)}>
                清空当前输入
              </Button>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 space-y-6">
            <HandTiles
              tiles={state.handTiles}
              maxTiles={handLimit}
              isActive={state.activeArea.type === "hand"}
              onSelectArea={() => activateArea({ type: "hand" })}
              onRemoveTile={(index) =>
                setState((current) => ({
                  ...current,
                  handTiles: current.handTiles.filter((_, tileIndex) => tileIndex !== index),
                }))
              }
            />

            <MeldSection
              melds={state.melds}
              activeMeldId={activeMeldId}
              pendingMeldType={state.pendingMeldType}
              onSelectMeld={(meldId) => activateArea({ type: "meld", meldId })}
              onCreateMeld={createMeld}
              onClearPending={() => {
                setPendingChiTiles([]);
                setState((current) => ({
                  ...current,
                  pendingMeldType: null,
                  activeArea: { type: "hand" },
                  melds: current.melds.filter((meld) => meld.tiles.length > 0),
                }));
              }}
              onDeleteMeld={deleteMeld}
            />

            <WinningTile
              winningTile={state.winningTile}
              winningMethod={state.conditions.winningMethod}
              isActive={state.activeArea.type === "winning"}
              onSelectArea={() => activateArea({ type: "winning" })}
              onChangeMethod={updateWinningMethod}
              onClear={() => setState((current) => ({ ...current, winningTile: null }))}
            />
            <div className="hidden md:block">
              <TileKeyboard
                remainingMap={remainingMap}
                requiredCount={requiredTileCount}
                onPickTile={handleTilePick}
              />
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <GameConditions
              conditions={state.conditions}
              isMenzen={isMenzen}
              doraIndicators={state.doraIndicators}
              uraDoraIndicators={state.uraDoraIndicators}
              activeDoraSlot={
                activeDoraSlot ? { kind: activeDoraSlot.kind, slotIndex: activeDoraSlot.slotIndex } : null
              }
              onRoundWindChange={(wind) => patchConditions((current) => ({ ...current, roundWind: wind }))}
              onSeatWindChange={(wind: Wind) => patchConditions((current) => ({ ...current, seatWind: wind }))}
              onDealerChange={(isDealer) => patchConditions((current) => ({ ...current, isDealer }))}
              onHonbaChange={(value) => patchConditions((current) => ({ ...current, honba: Math.max(0, value) }))}
              onSpecialToggle={handleSpecialToggle}
              onSelectDoraSlot={(kind, slotIndex) => activateArea({ type: "dora", kind, slotIndex })}
              onClearDoraSlot={(kind, slotIndex) =>
                setState((current) => {
                  const key = kind === "dora" ? "doraIndicators" : "uraDoraIndicators";
                  const nextIndicators = [...current[key]];
                  nextIndicators[slotIndex] = null;
                  return { ...current, [key]: nextIndicators };
                })
              }
            />
            <ResultPanel summary={summary} />
          </div>
        </div>

        <Drawer open={mobileKeyboardVisible} onOpenChange={setMobileKeyboardVisible} modal={false}>
          <DrawerContent className="md:hidden data-[vaul-drawer-direction=bottom]:max-h-[50dvh]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>选牌键盘</DrawerTitle>
              <DrawerDescription>移动端选牌键盘</DrawerDescription>
            </DrawerHeader>
            <div className="px-2 pb-[env(safe-area-inset-bottom)]">
              <TileKeyboard
                remainingMap={remainingMap}
                requiredCount={requiredTileCount}
                onPickTile={handleTilePick}
                mobile
                onClose={closeMobileKeyboard}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  );
}
