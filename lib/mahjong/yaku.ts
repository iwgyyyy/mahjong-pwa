import type { CalculatorState, HandDivision, MeldGroup, TileCode, YakuLine } from "@/lib/mahjong/types";

type EvaluationContext = {
  state: CalculatorState;
  division: HandDivision | null;
  closedTiles: TileCode[];
  isChiitoitsu: boolean;
  isKokushi: boolean;
};

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
  if (!tile.endsWith("z")) {
    return false;
  }

  if (tile === "5z" || tile === "6z" || tile === "7z") {
    return true;
  }

  const roundMap = { east: "1z", south: "2z" } as const;
  const seatMap = { east: "1z", south: "2z", west: "3z", north: "4z" } as const;
  return tile === roundMap[state.conditions.roundWind] || tile === seatMap[state.conditions.seatWind];
}

function getWaitType(division: HandDivision): "ryanmen" | "kanchan" | "penchan" | "tanki" | "shanpon" {
  const tile = division.winningTile;
  if (division.pair[0] === tile) {
    return "tanki";
  }

  for (const group of division.closedGroups) {
    if (group.kind !== "sequence" || !group.tiles.includes(tile)) {
      continue;
    }

    const values = group.tiles.map((part) => Number(part[0])).sort((a, b) => a - b);
    if (tile === group.tiles[1]) {
      return "kanchan";
    }
    if (values[0] === 1 && tile === group.tiles[2]) {
      return "penchan";
    }
    if (values[2] === 9 && tile === group.tiles[0]) {
      return "penchan";
    }
    return "ryanmen";
  }

  return "shanpon";
}

function groupBaseTile(group: MeldGroup) {
  return group.tiles[0];
}

function allTiles(ctx: EvaluationContext) {
  return [...ctx.closedTiles, ...ctx.state.melds.flatMap((meld) => meld.tiles)];
}

function countTile(tiles: TileCode[], target: TileCode) {
  return tiles.filter((tile) => tile === target).length;
}

function isChuuren(tiles: TileCode[]) {
  if (tiles.length !== 14 || tiles.some((tile) => isHonor(tile))) {
    return false;
  }

  const suit = tiles[0]?.[1];
  if (!tiles.every((tile) => tile[1] === suit)) {
    return false;
  }

  const required = new Map<string, number>([
    ["1", 3],
    ["2", 1],
    ["3", 1],
    ["4", 1],
    ["5", 1],
    ["6", 1],
    ["7", 1],
    ["8", 1],
    ["9", 3],
  ]);

  for (const [rank, minimum] of required) {
    if (countTile(tiles, `${rank}${suit}` as TileCode) < minimum) {
      return false;
    }
  }

  return true;
}

function isJunseiChuuren(handTiles: TileCode[], winningTile: TileCode) {
  if (handTiles.length !== 13 || isHonor(winningTile) || handTiles.some((tile) => isHonor(tile))) {
    return false;
  }

  const suit = winningTile[1];
  if (!handTiles.every((tile) => tile[1] === suit)) {
    return false;
  }

  const basePattern = ["1", "1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "9", "9"];
  const normalized = [...handTiles].map((tile) => tile[0]).sort().join("");
  return normalized === [...basePattern].sort().join("");
}

function countSequences(groups: MeldGroup[], target: string) {
  return groups.filter((group) => group.kind === "sequence" && group.tiles.join(",") === target).length;
}

export function evaluateYaku(ctx: EvaluationContext) {
  const yaku: YakuLine[] = [];
  const { special, winningMethod } = ctx.state.conditions;
  const isMenzen = ctx.state.melds.length === 0;
  const groups = ctx.division?.groups ?? [];
  const tiles = allTiles(ctx);

  if (special.tenho) {
    yaku.push({ name: "天和", han: 13, yakuman: true });
  }
  if (special.chiho) {
    yaku.push({ name: "地和", han: 13, yakuman: true });
  }
  if (ctx.isKokushi) {
    const thirteenWait = new Set(ctx.state.handTiles).size === 13;
    yaku.push({
      name: thirteenWait ? "国士无双十三面" : "国士无双",
      han: thirteenWait ? 26 : 13,
      yakuman: true,
    });
    return yaku;
  }

  if (special.doubleRiichi) {
    yaku.push({ name: "双立直", han: 2 });
  } else if (special.riichi) {
    yaku.push({ name: "立直", han: 1 });
  }
  if (special.ippatsu) {
    yaku.push({ name: "一发", han: 1 });
  }
  if (winningMethod === "tsumo" && isMenzen && !ctx.isKokushi) {
    yaku.push({ name: "门前清自摸和", han: 1 });
  }
  if (special.rinshan) {
    yaku.push({ name: "岭上开花", han: 1 });
  }
  if (special.chankan) {
    yaku.push({ name: "抢杠", han: 1 });
  }
  if (special.haitei) {
    yaku.push({ name: "海底摸月", han: 1 });
  }
  if (special.houtei) {
    yaku.push({ name: "河底捞鱼", han: 1 });
  }

  if (ctx.isChiitoitsu) {
    yaku.push({ name: "七对子", han: 2 });
  }

  if (tiles.every((tile) => !isTerminalOrHonor(tile))) {
    yaku.push({ name: "断幺九", han: 1 });
  }

  if (tiles.every((tile) => isTerminalOrHonor(tile))) {
    yaku.push({ name: "混老头", han: 2 });
  }

  if (tiles.every((tile) => isHonor(tile))) {
    yaku.push({ name: "字一色", han: 13, yakuman: true });
  }
  if (tiles.every((tile) => isTerminal(tile))) {
    yaku.push({ name: "清老头", han: 13, yakuman: true });
  }
  if (tiles.every((tile) => ["2s", "3s", "4s", "6s", "8s", "6z"].includes(tile))) {
    yaku.push({ name: "绿一色", han: 13, yakuman: true });
  }

  const suits = new Set(tiles.filter((tile) => !isHonor(tile)).map((tile) => tile[1]));
  const hasHonors = tiles.some((tile) => isHonor(tile));
  if (suits.size === 1 && hasHonors) {
    yaku.push({ name: "混一色", han: isMenzen ? 3 : 2 });
  }
  if (suits.size === 1 && !hasHonors) {
    yaku.push({ name: "清一色", han: isMenzen ? 6 : 5 });
  }
  if (isMenzen && suits.size === 1 && !hasHonors && isChuuren(tiles)) {
    yaku.push({
      name: isJunseiChuuren(ctx.state.handTiles, ctx.state.winningTile!) ? "纯正九莲宝灯" : "九莲宝灯",
      han: isJunseiChuuren(ctx.state.handTiles, ctx.state.winningTile!) ? 26 : 13,
      yakuman: true,
    });
  }

  if (ctx.division) {
    const pairTile = ctx.division.pair[0];
    const sequenceGroups = groups.filter((group) => group.kind === "sequence");
    const tripletLikeGroups = groups.filter((group) => group.kind === "triplet" || group.kind === "kan");

    for (const dragon of ["5z", "6z", "7z"] as const) {
      const count = tripletLikeGroups.filter((group) => groupBaseTile(group) === dragon).length;
      if (count > 0) {
        yaku.push({ name: `${dragon === "5z" ? "白" : dragon === "6z" ? "发" : "中"}`, han: count });
      }
    }

    const roundMap = { east: "1z", south: "2z" } as const;
    const seatMap = { east: "1z", south: "2z", west: "3z", north: "4z" } as const;
    const roundWindTile = roundMap[ctx.state.conditions.roundWind];
    const seatWindTile = seatMap[ctx.state.conditions.seatWind];
    if (tripletLikeGroups.some((group) => groupBaseTile(group) === roundWindTile)) {
      yaku.push({ name: "场风牌", han: 1 });
    }
    if (tripletLikeGroups.some((group) => groupBaseTile(group) === seatWindTile)) {
      yaku.push({ name: "自风牌", han: 1 });
    }

    if (
      isMenzen &&
      sequenceGroups.length === 4 &&
      !isValuePair(pairTile, ctx.state) &&
      getWaitType(ctx.division) === "ryanmen"
    ) {
      yaku.push({ name: "平和", han: 1 });
    }

    const seenSequences = new Set(sequenceGroups.map((group) => group.tiles.join(",")));
    let duplicateSequenceCount = 0;
    for (const target of seenSequences) {
      const count = countSequences(groups, target);
      if (count >= 2) {
        duplicateSequenceCount += Math.floor(count / 2);
      }
    }
    if (isMenzen && duplicateSequenceCount >= 2) {
      yaku.push({ name: "二杯口", han: 3 });
    } else if (isMenzen && duplicateSequenceCount >= 1) {
      yaku.push({ name: "一杯口", han: 1 });
    }

    const sameStraightSuits = ["m", "p", "s"].filter((suit) =>
      ["1", "4", "7"].every((value) =>
        sequenceGroups.some((group) => group.tiles.join(",") === [`${value}${suit}`, `${Number(value) + 1}${suit}`, `${Number(value) + 2}${suit}`].join(","))
      )
    );
    if (sameStraightSuits.length > 0) {
      yaku.push({ name: "一气通贯", han: isMenzen ? 2 : 1 });
    }

    const sanshokuTargets = ["123", "234", "345", "456", "567", "678", "789"];
    if (
      sanshokuTargets.some((pattern) =>
        ["m", "p", "s"].every((suit) =>
          sequenceGroups.some(
            (group) =>
              group.tiles.join(",") ===
              [`${pattern[0]}${suit}`, `${pattern[1]}${suit}`, `${pattern[2]}${suit}`].join(",")
          )
        )
      )
    ) {
      yaku.push({ name: "三色同顺", han: isMenzen ? 2 : 1 });
    }

    if (
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].some((rank) =>
        ["m", "p", "s"].every((suit) => tripletLikeGroups.some((group) => groupBaseTile(group) === `${rank}${suit}`))
      )
    ) {
      yaku.push({ name: "三色同刻", han: 2 });
    }

    if (tripletLikeGroups.length === 4) {
      yaku.push({ name: "对对和", han: 2 });
    }

    const concealedTriplets = groups.filter((group) => {
      if (group.kind !== "triplet" && group.kind !== "kan") {
        return false;
      }
      if (!group.open) {
        if (winningMethod === "ron" && group.tiles.every((tile) => tile === ctx.division?.winningTile)) {
          return false;
        }
        return true;
      }
      return group.kind === "kan" && !group.open;
    }).length;

    if (concealedTriplets >= 3) {
      yaku.push({ name: "三暗刻", han: 2 });
    }

    const kanCount = groups.filter((group) => group.kind === "kan").length;
    if (kanCount >= 3) {
      yaku.push({ name: "三杠子", han: 2 });
    }
    if (kanCount === 4) {
      yaku.push({ name: "四杠子", han: 13, yakuman: true });
    }

    const honorTripletCount = ["5z", "6z", "7z"].filter((dragon) =>
      tripletLikeGroups.some((group) => groupBaseTile(group) === dragon)
    ).length;
    if (honorTripletCount >= 2 && pairTile && ["5z", "6z", "7z"].includes(pairTile)) {
      yaku.push({ name: "小三元", han: 2 });
    }
    if (honorTripletCount === 3) {
      yaku.push({ name: "大三元", han: 13, yakuman: true });
    }

    const windTripletCount = ["1z", "2z", "3z", "4z"].filter((wind) =>
      tripletLikeGroups.some((group) => groupBaseTile(group) === wind)
    ).length;
    if (windTripletCount === 4) {
      yaku.push({ name: "大四喜", han: 13, yakuman: true });
    } else if (windTripletCount === 3 && ["1z", "2z", "3z", "4z"].includes(pairTile)) {
      yaku.push({ name: "小四喜", han: 13, yakuman: true });
    }

    const halfOutside = groups.every((group) => group.tiles.some((tile) => isTerminalOrHonor(tile))) &&
      ctx.division.pair.some((tile) => isTerminalOrHonor(tile));
    const pureOutside = groups.every((group) => group.tiles.some((tile) => isTerminal(tile))) &&
      ctx.division.pair.every((tile) => isTerminal(tile));
    if (pureOutside) {
      yaku.push({ name: "纯全带幺九", han: isMenzen ? 3 : 2 });
    } else if (halfOutside) {
      yaku.push({ name: "混全带幺九", han: isMenzen ? 2 : 1 });
    }

    if (tripletLikeGroups.length === 4 && concealedTriplets === 4) {
      yaku.push({
        name: getWaitType(ctx.division) === "tanki" ? "四暗刻单骑" : "四暗刻",
        han: getWaitType(ctx.division) === "tanki" ? 26 : 13,
        yakuman: true,
      });
    }
  }

  return mergeYaku(yaku);
}

function mergeYaku(yaku: YakuLine[]) {
  const merged = new Map<string, YakuLine>();
  for (const line of yaku) {
    const existing = merged.get(line.name);
    if (existing) {
      existing.han += line.han;
      existing.yakuman = existing.yakuman || line.yakuman;
      continue;
    }
    merged.set(line.name, { ...line });
  }

  const values = [...merged.values()];
  if (values.some((line) => line.yakuman)) {
    return values.filter((line) => line.yakuman);
  }
  return values;
}

export function getDivisionWaitType(division: HandDivision) {
  return getWaitType(division);
}
