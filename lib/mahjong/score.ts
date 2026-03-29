import type { WinningMethod } from "@/lib/mahjong/types";

function ceilTo100(value: number) {
  return Math.ceil(value / 100) * 100;
}

export function getBasicPoints(han: number, fu: number) {
  if (han <= 0) {
    return 0;
  }
  if (han >= 13) {
    return 8000 * Math.floor(han / 13);
  }
  if (han >= 11) {
    return 6000;
  }
  if (han >= 8) {
    return 4000;
  }
  if (han >= 6) {
    return 3000;
  }
  const raw = fu * 2 ** (han + 2);
  return han >= 5 || raw >= 2000 ? 2000 : raw;
}

export function getScoreTitle(han: number, basicPoints: number) {
  if (han >= 13) {
    return basicPoints >= 16000 ? `${Math.floor(basicPoints / 8000)}倍役满` : "役满";
  }
  if (basicPoints >= 6000) {
    return "三倍满";
  }
  if (basicPoints >= 4000) {
    return "倍满";
  }
  if (basicPoints >= 3000) {
    return "跳满";
  }
  if (basicPoints >= 2000) {
    return "满贯";
  }
  return "和牌";
}

export function formatPoints(
  basicPoints: number,
  isDealer: boolean,
  method: WinningMethod,
  honba: number
) {
  if (basicPoints <= 0) {
    return "无役";
  }

  if (method === "ron") {
    const total = ceilTo100(basicPoints * (isDealer ? 6 : 4)) + honba * 300;
    return `${total} 点（${isDealer ? "庄家" : "闲家"}荣和）`;
  }

  if (isDealer) {
    const each = ceilTo100(basicPoints * 2) + honba * 100;
    return `每家 ${each} 点（庄家自摸）`;
  }

  const dealerPay = ceilTo100(basicPoints * 2) + honba * 100;
  const nonDealerPay = ceilTo100(basicPoints) + honba * 100;
  return `${dealerPay}/${nonDealerPay} 点（闲家自摸）`;
}
