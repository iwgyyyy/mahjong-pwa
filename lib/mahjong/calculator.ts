import { calculateFu } from "@/lib/mahjong/fu";
import { divideClosedHand, isChiitoitsu, isKokushi } from "@/lib/mahjong/parser";
import { getBasicPoints, formatPoints, getScoreTitle } from "@/lib/mahjong/score";
import { evaluateYaku } from "@/lib/mahjong/yaku";
import type {
  CalculationSummary,
  CalculatorState,
  FuLine,
  HandDivision,
  Meld,
  TileCode,
  YakuLine,
} from "@/lib/mahjong/types";

function getKanCount(melds: Meld[]) {
  return melds.filter((meld) => meld.type === "open-kan" || meld.type === "closed-kan").length;
}

export function getHandLimit(melds: Meld[]) {
  return 13 - melds.length * 3 - getKanCount(melds);
}

export function getUsedTileCounts(state: CalculatorState) {
  const counts = new Map<TileCode, number>();

  for (const tile of state.handTiles) {
    counts.set(tile, (counts.get(tile) ?? 0) + 1);
  }

  for (const meld of state.melds) {
    for (const tile of meld.tiles) {
      counts.set(tile, (counts.get(tile) ?? 0) + 1);
    }
  }

  if (state.winningTile) {
    counts.set(state.winningTile, (counts.get(state.winningTile) ?? 0) + 1);
  }

  return counts;
}

function getDisplayedHandLength(state: CalculatorState) {
  return state.handTiles.length;
}

function totalHan(yaku: YakuLine[]) {
  if (yaku.some((line) => line.yakuman)) {
    return yaku.filter((line) => line.yakuman).reduce((sum, line) => sum + line.han, 0);
  }
  return yaku.reduce((sum, line) => sum + line.han, 0);
}

function getDoraTile(indicator: TileCode): TileCode {
  const rank = Number(indicator[0]);
  const suit = indicator[1];

  if (suit === "m" || suit === "p" || suit === "s") {
    return `${rank === 9 ? 1 : rank + 1}${suit}` as TileCode;
  }

  if (indicator === "4z") {
    return "1z";
  }
  if (indicator === "7z") {
    return "5z";
  }

  return `${rank + 1}z` as TileCode;
}

function countMatchingDora(allTiles: TileCode[], indicators: Array<TileCode | null>) {
  let total = 0;

  for (const indicator of indicators) {
    if (!indicator) {
      continue;
    }
    const doraTile = getDoraTile(indicator);
    total += allTiles.filter((tile) => tile === doraTile).length;
  }

  return total;
}

function getDoraLines(state: CalculatorState, closedTiles: TileCode[]) {
  const allTiles = [...closedTiles, ...state.melds.flatMap((meld) => meld.tiles)];
  const doraCount = countMatchingDora(allTiles, state.doraIndicators);
  const uraCount =
    state.conditions.special.riichi || state.conditions.special.doubleRiichi
      ? countMatchingDora(allTiles, state.uraDoraIndicators)
      : 0;

  const lines: YakuLine[] = [];
  if (doraCount > 0) {
    lines.push({ name: "宝牌", han: doraCount });
  }
  if (uraCount > 0) {
    lines.push({ name: "里宝牌", han: uraCount });
  }
  return lines;
}

function compareCandidates(left: Candidate, right: Candidate) {
  if (left.basicPoints !== right.basicPoints) {
    return right.basicPoints - left.basicPoints;
  }
  if (left.han !== right.han) {
    return right.han - left.han;
  }
  return right.fu - left.fu;
}

type Candidate = {
  division: HandDivision | null;
  yaku: YakuLine[];
  han: number;
  fu: number;
  fuBreakdown: FuLine[];
  basicPoints: number;
};

export function buildCalculationSummary(state: CalculatorState): CalculationSummary {
  const handLimit = getHandLimit(state.melds);

  if (getDisplayedHandLength(state) !== handLimit) {
    return {
      status: "incomplete",
      message: `门前手牌还差 ${Math.max(handLimit - state.handTiles.length, 0)} 张，当前上限 ${handLimit} 张。`,
    };
  }

  if (!state.winningTile) {
    return {
      status: "incomplete",
      message: "请选择和了牌，结果区才会开始计算。",
    };
  }

  const closedTiles = [...state.handTiles, state.winningTile];
  if (closedTiles.length + state.melds.reduce((sum, meld) => sum + meld.tiles.length, 0) !== 14) {
    return {
      status: "incomplete",
      message: "当前总牌数不是 14 张，无法完成和牌计算。",
    };
  }

  const kokushi = isKokushi(closedTiles) && state.melds.length === 0;
  const chiitoi = isChiitoitsu(closedTiles) && state.melds.length === 0;
  const divisions = divideClosedHand(closedTiles, state.winningTile, state.melds);

  const candidates: Candidate[] = [];
  const doraLines = getDoraLines(state, closedTiles);
  const doraHan = totalHan(doraLines);

  if (kokushi) {
    const yaku = evaluateYaku({
      state,
      division: null,
      closedTiles,
      isChiitoitsu: false,
      isKokushi: true,
    });
    const han = totalHan(yaku) + doraHan;
    const basicPoints = getBasicPoints(han, 0);
    candidates.push({
      division: null,
      yaku: [...yaku, ...doraLines],
      han,
      fu: 0,
      fuBreakdown: [],
      basicPoints,
    });
  }

  if (chiitoi) {
    const yaku = evaluateYaku({
      state,
      division: null,
      closedTiles,
      isChiitoitsu: true,
      isKokushi: false,
    });
    const baseHan = totalHan(yaku);
    if (baseHan > 0) {
      const han = baseHan + doraHan;
      const fuResult = calculateFu(state, null, true, new Set(yaku.map((line) => line.name)));
      const basicPoints = getBasicPoints(han, fuResult.fu);
      candidates.push({
        division: null,
        yaku: [...yaku, ...doraLines],
        han,
        fu: fuResult.fu,
        fuBreakdown: fuResult.breakdown,
        basicPoints,
      });
    }
  }

  for (const division of divisions) {
    const yaku = evaluateYaku({
      state,
      division,
      closedTiles,
      isChiitoitsu: false,
      isKokushi: false,
    });
    const baseHan = totalHan(yaku);
    if (baseHan <= 0) {
      continue;
    }
    const han = baseHan + doraHan;

    const fuResult = calculateFu(state, division, false, new Set(yaku.map((line) => line.name)));
    const basicPoints = getBasicPoints(han, fuResult.fu);
    candidates.push({
      division,
      yaku: [...yaku, ...doraLines],
      han,
      fu: fuResult.fu,
      fuBreakdown: fuResult.breakdown,
      basicPoints,
    });
  }

  if (candidates.length === 0) {
    return {
      status: "incomplete",
      message: "当前输入还没有形成可和牌型，或没有成立任何役种。",
    };
  }

  candidates.sort(compareCandidates);
  const best = candidates[0];
  const isDealer = state.conditions.isDealer;
  const subtitle = `${isDealer ? "庄家" : "闲家"}${state.conditions.winningMethod === "tsumo" ? "自摸" : "荣和"} · ${state.conditions.honba} 本场`;
  const title = getScoreTitle(best.han, best.basicPoints);

  return {
    status: "ready",
    title,
    subtitle,
    han: best.han,
    fu: best.fu,
    basicPoints: best.basicPoints,
    pointsLabel: formatPoints(best.basicPoints, isDealer, state.conditions.winningMethod, state.conditions.honba),
    yaku: best.yaku,
    fuBreakdown: best.fuBreakdown,
    note:
      "已接入实际拆牌、役种、符数、基本点与宝牌指示牌计算。当前仍未包含赤宝牌、流局满贯与少数地方规则分歧。",
  };
}
