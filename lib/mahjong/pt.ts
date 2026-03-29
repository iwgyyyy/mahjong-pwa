export type PtPlayerKey = "east" | "south" | "west" | "north";

export type PtInput = {
  returnPoints: number;
  startPoints: number;
  umaHigh: number;
  umaLow: number;
  players: Array<{
    key: PtPlayerKey;
    label: string;
    points: number;
    seatOrder: number;
  }>;
};

export type PtResultRow = {
  key: PtPlayerKey;
  label: string;
  points: number;
  rank: 1 | 2 | 3 | 4;
  rankBonus: number;
  basePt: number;
  totalPt: number;
};

export function getOka(startPoints: number, returnPoints: number) {
  return ((returnPoints - startPoints) * 4) / 1000;
}

export function getRankBonus(
  rank: 1 | 2 | 3 | 4,
  startPoints: number,
  returnPoints: number,
  umaHigh: number,
  umaLow: number
) {
  const oka = getOka(startPoints, returnPoints);

  if (rank === 1) {
    return oka + umaHigh;
  }
  if (rank === 2) {
    return umaLow;
  }
  if (rank === 3) {
    return -umaLow;
  }
  return -umaHigh;
}

export function calculatePt(input: PtInput) {
  const rankedPlayers = [...input.players].sort((left, right) => {
    if (left.points !== right.points) {
      return right.points - left.points;
    }

    return left.seatOrder - right.seatOrder;
  });

  return rankedPlayers.map((player, index) => {
    const rank = (index + 1) as 1 | 2 | 3 | 4;
    const basePt = (player.points - input.returnPoints) / 1000;
    const rankBonus = getRankBonus(rank, input.startPoints, input.returnPoints, input.umaHigh, input.umaLow);

    return {
      key: player.key,
      label: player.label,
      points: player.points,
      rank,
      rankBonus,
      basePt,
      totalPt: basePt + rankBonus,
    } satisfies PtResultRow;
  });
}

export function formatPt(value: number) {
  if (Number.isInteger(value)) {
    return `${value > 0 ? "+" : ""}${value}`;
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}
