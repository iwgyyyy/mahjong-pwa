import type { CalculatorState, GameConditions, Meld, SpecialConditions } from "@/lib/mahjong/types";

export function hasOpenMelds(melds: Meld[]) {
  return melds.some((meld) => meld.type === "chi" || meld.type === "pon" || meld.type === "open-kan");
}

export function isMenzenHand(melds: Meld[]) {
  return !hasOpenMelds(melds);
}

export function normalizeSpecialConditions(
  conditions: GameConditions,
  melds: Meld[]
): SpecialConditions {
  const isMenzen = isMenzenHand(melds);
  const special = { ...conditions.special };

  if (!isMenzen) {
    special.riichi = false;
    special.doubleRiichi = false;
    special.ippatsu = false;
    special.tenho = false;
    special.chiho = false;
  }

  if (!special.riichi && !special.doubleRiichi) {
    special.ippatsu = false;
  }

  if (conditions.winningMethod !== "tsumo") {
    special.haitei = false;
    special.rinshan = false;
    special.tenho = false;
    special.chiho = false;
  }

  if (conditions.winningMethod !== "ron") {
    special.houtei = false;
    special.chankan = false;
  }

  if (special.rinshan) {
    special.chankan = false;
  }
  if (special.chankan) {
    special.rinshan = false;
  }

  if (special.haitei) {
    special.houtei = false;
  }
  if (special.houtei) {
    special.haitei = false;
  }

  if (!conditions.isDealer) {
    special.tenho = false;
  }
  if (conditions.isDealer) {
    special.chiho = false;
  }

  if (special.tenho) {
    special.chiho = false;
  }
  if (special.chiho) {
    special.tenho = false;
  }

  return special;
}

export function normalizeCalculatorState(state: CalculatorState): CalculatorState {
  return {
    ...state,
    conditions: {
      ...state.conditions,
      special: normalizeSpecialConditions(state.conditions, state.melds),
    },
  };
}
