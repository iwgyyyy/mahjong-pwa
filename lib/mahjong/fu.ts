import { isMenzenHand } from "@/lib/mahjong/state";
import type { CalculatorState, FuLine, HandDivision, MeldGroup, TileCode } from "@/lib/mahjong/types";

function isHonor(tile: TileCode) {
  return tile.endsWith("z");
}

function isTerminal(tile: TileCode) {
  return !isHonor(tile) && (tile.startsWith("1") || tile.startsWith("9"));
}

function isTerminalOrHonor(tile: TileCode) {
  return isHonor(tile) || isTerminal(tile);
}

function isValuePair(tile: TileCode, state: CalculatorState) {
  if (tile === "5z" || tile === "6z" || tile === "7z") {
    return 2;
  }

  const roundMap = { east: "1z", south: "2z" } as const;
  const seatMap = { east: "1z", south: "2z", west: "3z", north: "4z" } as const;
  let result = 0;
  if (tile === roundMap[state.conditions.roundWind]) {
    result += 2;
  }
  if (tile === seatMap[state.conditions.seatWind]) {
    result += 2;
  }
  return result;
}

function getMeldFu(group: MeldGroup, treatAsOpen = group.open) {
  if (group.kind === "sequence") {
    return 0;
  }
  if (group.kind === "pair") {
    return 0;
  }

  const baseTile = group.tiles[0];
  const yaochu = isTerminalOrHonor(baseTile);
  if (group.kind === "triplet") {
    if (treatAsOpen) {
      return yaochu ? 4 : 2;
    }
    return yaochu ? 8 : 4;
  }

  if (treatAsOpen) {
    return yaochu ? 16 : 8;
  }
  return yaochu ? 32 : 16;
}

function getWaitFu(division: HandDivision) {
  const winningTile = division.winningTile;
  if (division.winningTarget.kind === "pair") {
    return 2;
  }

  const group = division.closedGroups[division.winningTarget.index];
  if (group.kind === "sequence") {
    const values = group.tiles.map((tile) => Number(tile[0])).sort((a, b) => a - b);
    if (winningTile === group.tiles[1]) {
      return 2;
    }
    if (values[0] === 1 && winningTile === group.tiles[2]) {
      return 2;
    }
    if (values[2] === 9 && winningTile === group.tiles[0]) {
      return 2;
    }
    return 0;
  }

  return 0;
}

export function calculateFu(state: CalculatorState, division: HandDivision | null, isChiitoitsu: boolean, yakuNames: Set<string>) {
  if (isChiitoitsu) {
    return {
      fu: 25,
      breakdown: [{ label: "七对子固定", value: 25 }] satisfies FuLine[],
    };
  }

  if (!division) {
    return {
      fu: 0,
      breakdown: [] as FuLine[],
    };
  }

  const lines: FuLine[] = [{ label: "底符", value: 20 }];
  const isMenzen = isMenzenHand(state.melds);
  const isPinfu = yakuNames.has("平和");

  if (state.conditions.winningMethod === "ron" && isMenzen) {
    lines.push({ label: "门前荣和", value: 10 });
  }

  if (state.conditions.winningMethod === "tsumo" && !isPinfu) {
    lines.push({ label: "自摸", value: 2 });
  }

  const pairTile = division.pair[0];
  if (pairTile.endsWith("z")) {
    const pairFu = isValuePair(pairTile, state);
    if (pairFu > 0) {
      lines.push({ label: "雀头役牌", value: pairFu });
    }
  }

  const winningGroup =
    division.winningTarget.kind === "group" ? division.closedGroups[division.winningTarget.index] : null;

  for (const group of division.groups) {
    const treatAsOpen =
      group.open || (state.conditions.winningMethod === "ron" && winningGroup === group && group.kind === "triplet");
    const value = getMeldFu(group, treatAsOpen);
    if (value > 0) {
      lines.push({
        label: `${treatAsOpen ? "明" : "暗"}${group.kind === "kan" ? "杠" : "刻"}(${isTerminalOrHonor(group.tiles[0]) ? "幺九" : "中张"})`,
        value,
      });
    }
  }

  const waitFu = getWaitFu(division);
  if (!isPinfu && waitFu > 0) {
    lines.push({ label: "待张", value: waitFu });
  }

  const rawFu = lines.reduce((sum, line) => sum + line.value, 0);
  if (isPinfu && state.conditions.winningMethod === "tsumo") {
    return { fu: 20, breakdown: [{ label: "平和自摸固定", value: 20 }] satisfies FuLine[] };
  }

  let fu = Math.ceil(rawFu / 10) * 10;
  if (!isMenzen && state.conditions.winningMethod === "ron" && rawFu === 20) {
    fu = 30;
  }
  if (yakuNames.has("平和") && state.conditions.winningMethod === "ron" && isMenzen) {
    fu = 30;
  }

  return { fu, breakdown: lines };
}
