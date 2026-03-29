import { TILE_ORDER, type HandDivision, type Meld, type MeldGroup, type TileCode } from "@/lib/mahjong/types";

type TileCounts = Map<TileCode, number>;
const TILE_INDEX = new Map(TILE_ORDER.map((tile, index) => [tile, index]));

function cloneCounts(counts: TileCounts) {
  return new Map(counts);
}

function sortTiles(tiles: TileCode[]) {
  return [...tiles].sort((left, right) => (TILE_INDEX.get(left) ?? 0) - (TILE_INDEX.get(right) ?? 0));
}

function makeClosedGroup(kind: MeldGroup["kind"], tiles: TileCode[]): MeldGroup {
  return {
    kind,
    tiles: sortTiles(tiles),
    open: false,
    source: "closed",
  };
}

export function countTiles(tiles: TileCode[]) {
  const counts = new Map<TileCode, number>();

  for (const tile of tiles) {
    counts.set(tile, (counts.get(tile) ?? 0) + 1);
  }

  return counts;
}

function countsEqual(left: TileCounts, right: TileCounts) {
  for (const tile of TILE_ORDER) {
    if ((left.get(tile) ?? 0) !== (right.get(tile) ?? 0)) {
      return false;
    }
  }

  return true;
}

export function meldToGroup(meld: Meld): MeldGroup {
  if (meld.type === "chi") {
    return { kind: "sequence", tiles: sortTiles(meld.tiles), open: true, source: "meld" };
  }
  if (meld.type === "pon") {
    return { kind: "triplet", tiles: sortTiles(meld.tiles), open: true, source: "meld" };
  }
  return {
    kind: "kan",
    tiles: sortTiles(meld.tiles),
    open: meld.type === "open-kan",
    source: "meld",
  };
}

function getSequenceTiles(tile: TileCode): TileCode[] | null {
  if (tile.endsWith("z")) {
    return null;
  }

  const suit = tile[1] as "m" | "p" | "s";
  const value = Number(tile[0]);
  if (value > 7) {
    return null;
  }

  return [`${value}${suit}`, `${value + 1}${suit}`, `${value + 2}${suit}`] as TileCode[];
}

function takeTriplet(counts: TileCounts, tile: TileCode) {
  if ((counts.get(tile) ?? 0) < 3) {
    return null;
  }
  const nextCounts = cloneCounts(counts);
  nextCounts.set(tile, (nextCounts.get(tile) ?? 0) - 3);
  return { counts: nextCounts, group: makeClosedGroup("triplet", [tile, tile, tile]) };
}

function takeSequence(counts: TileCounts, tile: TileCode) {
  const sequence = getSequenceTiles(tile);
  if (!sequence) {
    return null;
  }

  if (sequence.some((part) => (counts.get(part) ?? 0) <= 0)) {
    return null;
  }

  const nextCounts = cloneCounts(counts);
  for (const part of sequence) {
    nextCounts.set(part, (nextCounts.get(part) ?? 0) - 1);
  }

  return { counts: nextCounts, group: makeClosedGroup("sequence", sequence) };
}

function findFirstTile(counts: TileCounts) {
  return TILE_ORDER.find((tile) => (counts.get(tile) ?? 0) > 0) ?? null;
}

function normalizeCounts(counts: TileCounts) {
  for (const [tile, count] of counts.entries()) {
    if (count <= 0) {
      counts.delete(tile);
    }
  }
}

function searchMelds(counts: TileCounts): MeldGroup[][] {
  normalizeCounts(counts);
  const current = findFirstTile(counts);
  if (!current) {
    return [[]];
  }

  const results: MeldGroup[][] = [];
  const tripletResult = takeTriplet(counts, current);
  if (tripletResult) {
    for (const tail of searchMelds(tripletResult.counts)) {
      results.push([tripletResult.group, ...tail]);
    }
  }

  const sequenceResult = takeSequence(counts, current);
  if (sequenceResult) {
    for (const tail of searchMelds(sequenceResult.counts)) {
      results.push([sequenceResult.group, ...tail]);
    }
  }

  return results;
}

export function isChiitoitsu(tiles: TileCode[]) {
  if (tiles.length !== 14) {
    return false;
  }

  const counts = countTiles(tiles);
  return counts.size === 7 && [...counts.values()].every((count) => count === 2);
}

export function isKokushi(tiles: TileCode[]) {
  if (tiles.length !== 14) {
    return false;
  }

  const terminalsAndHonors = new Set<TileCode>([
    "1m",
    "9m",
    "1p",
    "9p",
    "1s",
    "9s",
    "1z",
    "2z",
    "3z",
    "4z",
    "5z",
    "6z",
    "7z",
  ]);
  const counts = countTiles(tiles);

  if (![...counts.keys()].every((tile) => terminalsAndHonors.has(tile))) {
    return false;
  }

  return terminalsAndHonors.size === counts.size && [...counts.values()].some((count) => count === 2);
}

export function divideClosedHand(
  handTiles: TileCode[],
  closedTiles: TileCode[],
  winningTile: TileCode,
  melds: Meld[]
) {
  const divisions: HandDivision[] = [];
  const counts = countTiles(closedTiles);
  const handCounts = countTiles(handTiles);
  const openGroups = melds.map(meldToGroup);

  for (const [tile, count] of counts.entries()) {
    if (count < 2) {
      continue;
    }

    const remainder = cloneCounts(counts);
    remainder.set(tile, count - 2);
    const pair = sortTiles([tile, tile]);
    const candidates = searchMelds(remainder);

    for (const candidate of candidates) {
      if (candidate.length + openGroups.length !== 4) {
        continue;
      }

      const fullGroups = [...candidate, ...openGroups];
      const pairCounts = countTiles(pair);
      if ((pairCounts.get(winningTile) ?? 0) > 0) {
        const pairRemainder = cloneCounts(counts);
        pairRemainder.set(winningTile, (pairRemainder.get(winningTile) ?? 0) - 1);
        normalizeCounts(pairRemainder);

        if (countsEqual(pairRemainder, handCounts)) {
          divisions.push({
            pair,
            closedGroups: candidate,
            groups: fullGroups,
            winningTile,
            winningTarget: { kind: "pair" },
          });
        }
      }

      candidate.forEach((group, index) => {
        if (!group.tiles.includes(winningTile)) {
          return;
        }

        const groupRemainder = cloneCounts(counts);
        groupRemainder.set(winningTile, (groupRemainder.get(winningTile) ?? 0) - 1);
        normalizeCounts(groupRemainder);

        if (!countsEqual(groupRemainder, handCounts)) {
          return;
        }

        divisions.push({
          pair,
          closedGroups: candidate,
          groups: fullGroups,
          winningTile,
          winningTarget: { kind: "group", index },
        });
      });
    }
  }

  return divisions;
}
