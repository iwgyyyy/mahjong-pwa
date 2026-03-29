export type TileSuit = "m" | "p" | "s" | "z";

export type TileCode =
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${"m" | "p" | "s"}`
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7}${"z"}`;

export type Wind = "east" | "south" | "west" | "north";

export type WinningMethod = "tsumo" | "ron";

export type MeldType = "chi" | "pon" | "open-kan" | "closed-kan";

export type ActiveArea =
  | { type: "hand" }
  | { type: "winning" }
  | { type: "meld"; meldId: string }
  | { type: "dora"; kind: "dora" | "ura"; slotIndex: number };

export type SpecialConditions = {
  riichi: boolean;
  doubleRiichi: boolean;
  ippatsu: boolean;
  rinshan: boolean;
  chankan: boolean;
  haitei: boolean;
  houtei: boolean;
  tenho: boolean;
  chiho: boolean;
};

export type GameConditions = {
  roundWind: Extract<Wind, "east" | "south">;
  seatWind: Wind;
  isDealer: boolean;
  honba: number;
  winningMethod: WinningMethod;
  special: SpecialConditions;
};

export type Meld = {
  id: string;
  type: MeldType;
  tiles: TileCode[];
};

export type CalculatorState = {
  handTiles: TileCode[];
  melds: Meld[];
  winningTile: TileCode | null;
  doraIndicators: Array<TileCode | null>;
  uraDoraIndicators: Array<TileCode | null>;
  activeArea: ActiveArea;
  pendingMeldType: MeldType | null;
  conditions: GameConditions;
};

export type YakuLine = {
  name: string;
  han: number;
  yakuman?: boolean;
};

export type FuLine = {
  label: string;
  value: number;
};

export type CalculationSummary =
  | {
      status: "incomplete";
      message: string;
    }
  | {
      status: "ready";
      title: string;
      subtitle: string;
      han: number;
      fu: number;
      basicPoints: number;
      pointsLabel: string;
      yaku: YakuLine[];
      fuBreakdown: FuLine[];
      note: string;
    };

export type GroupKind = "sequence" | "triplet" | "kan" | "pair";

export type MeldGroup = {
  kind: GroupKind;
  tiles: TileCode[];
  open: boolean;
  source: "closed" | "meld";
};

export type HandDivision = {
  pair: TileCode[];
  closedGroups: MeldGroup[];
  groups: MeldGroup[];
  winningTile: TileCode;
  winningTarget: { kind: "pair" } | { kind: "group"; index: number };
};

export const TILE_ORDER: TileCode[] = [
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",
  "7m",
  "8m",
  "9m",
  "1p",
  "2p",
  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",
  "9p",
  "1s",
  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "1z",
  "2z",
  "3z",
  "4z",
  "5z",
  "6z",
  "7z",
];

export const HONOR_LABELS: Record<`${1 | 2 | 3 | 4 | 5 | 6 | 7}z`, string> = {
  "1z": "东",
  "2z": "南",
  "3z": "西",
  "4z": "北",
  "5z": "白",
  "6z": "发",
  "7z": "中",
};

export const DEFAULT_STATE: CalculatorState = {
  handTiles: [],
  melds: [],
  winningTile: null,
  doraIndicators: [null, null, null, null, null],
  uraDoraIndicators: [null, null, null, null, null],
  activeArea: { type: "hand" },
  pendingMeldType: null,
  conditions: {
    roundWind: "east",
    seatWind: "east",
    isDealer: true,
    honba: 0,
    winningMethod: "tsumo",
    special: {
      riichi: false,
      doubleRiichi: false,
      ippatsu: false,
      rinshan: false,
      chankan: false,
      haitei: false,
      houtei: false,
      tenho: false,
      chiho: false,
    },
  },
};
