export type RuleImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type RuleItem = {
  title: string;
  description?: string;
  images?: RuleImage[];
};

export type RuleSection = {
  id: string;
  title: string;
  description?: string;
  items: RuleItem[];
};

export const TILE_CATEGORIES = [
  { name: "数牌", value: "万、筒、条" },
  { name: "风牌", value: "东（🀀）、南（🀁）、西（🀂）、北（🀃）" },
  { name: "三元牌", value: "白（🀄）、发（🀅）、中（🀆）" },
  { name: "老头牌", value: "一万、九万、一筒、九筒、一索、九索" },
  { name: "字牌", value: "风牌、三元牌" },
  { name: "幺九牌", value: "老头牌、风牌" },
] as const;

export const BASIC_IMAGES: RuleImage[] = [
  { src: "/docs/type-mahjong.png", alt: "牌种示意", width: 1299, height: 765 },
  { src: "/docs/type-card.png", alt: "面子、搭子、雀头示意", width: 1396, height: 756 },
];

export const MELD_RULES = [
  "鸣牌的面子需要放在副露区。暗杠也需要展示，但暗杠不计入副露，不破坏门前清。",
  "吃牌只能吃上家的牌，剩余牌为 0 时不能吃。吃牌后不能补杠或暗杠，无食替规则。",
  "碰牌可以碰任意一家打出的牌，剩余牌为 0 时不能碰。碰牌后不能补杠或暗杠，无食替规则。",
  "杠牌分为明杠与暗杠，明杠又分直杠与补杠，剩余牌为 0 时不能杠牌。",
  "杠牌需要翻取新杠宝指示牌。明杠在摸完岭上牌并打出后翻开；暗杠在摸岭上牌时同时翻开。",
  "暗杠不算副露，不破坏门前清，但会破坏天地和、双立直、一发以及四风连打等成立条件。",
  "立直状态下允许进行不改变听牌型的暗杠。",
  "明杠可以被抢杠和，暗杠通常不能被抢杠，只有国士无双例外；被抢杠时不翻新杠宝。",
  "杠牌可以连续进行，一家最多开杠四次；满足四杠流局条件时立刻流局。",
] as const;

export const DRAW_RULES = [
  "四杠流局：来自不同玩家的开杠累计四次，且最后一次开杠没有和牌或放铳，则立刻流局。",
  "四风连打：第一巡中四家打出相同风牌，算流局。",
  "不听罚符：荒牌流局时，未听牌者向听牌者支付点数。",
  "四家立直：场上四家全部立直，且最后一家没有放铳，则立刻流局。",
  "九种九牌：配牌结束且无人鸣牌时，手牌中有 9 种及以上幺九牌，可宣告流局。",
  "三家和了：同一张打牌被其他三家同时和牌，则立刻流局。",
] as const;

export const FURITEN_RULES = [
  "舍张振听：听牌张中包含自己打出过的牌，或舍牌中包含多面听的任意一张，只能靠改变听牌解除。",
  "同巡振听：本巡内别家打出可和之牌但自己未和，则本巡剩余时间内振听；自己下次打出牌后解除。",
  "立直振听：立直后若对可和之牌选择不和，会进入不可解除的振听状态。",
] as const;

export const QUICK_REFERENCE_IMAGES: RuleImage[] = [
  { src: "/docs/fu-calculate.png", alt: "符数计算表", width: 1613, height: 908 },
  { src: "/docs/score-dealer.png", alt: "庄家点数计算表", width: 1605, height: 910 },
  { src: "/docs/score-player.png", alt: "闲家点数计算表", width: 1616, height: 898 },
] as const;

export const YAKU_SECTIONS: RuleSection[] = [
  {
    id: "one-han",
    title: "一番",
    items: [
      { title: "立直", description: "门前清限定；立直后和牌可翻取里宝牌。", images: [{ src: "/docs/fan/20250702224310_5.png", alt: "立直" }] },
      { title: "断幺九", images: [{ src: "/docs/fan/20250702224310_6.png", alt: "断幺九" }] },
      { title: "门前清自摸", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_7.png", alt: "门前清自摸" }] },
      {
        title: "役牌",
        description: "自风牌、场风牌、三元牌刻子。",
        images: [
          { src: "/docs/fan/20250702224310_8.png", alt: "役牌示例一" },
          { src: "/docs/fan/20250702224310_9.png", alt: "役牌示例二" },
          { src: "/docs/fan/20250702224310_10.png", alt: "役牌示例三" },
        ],
      },
      { title: "平和", description: "门前清限定；四组顺子、非役牌雀头、两面听。", images: [{ src: "/docs/fan/20250702224310_11.png", alt: "平和" }] },
      { title: "一杯口", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_12.png", alt: "一杯口" }] },
      { title: "抢杠", images: [{ src: "/docs/fan/20250702224310_13.png", alt: "抢杠" }] },
      { title: "岭上开花", images: [{ src: "/docs/fan/20250702224310_14.png", alt: "岭上开花" }] },
      { title: "海底捞月", images: [{ src: "/docs/fan/20250702224310_15.png", alt: "海底捞月" }] },
      { title: "河底捞鱼", images: [{ src: "/docs/fan/20250702224310_16.png", alt: "河底捞鱼" }] },
      { title: "一发", description: "立直后无人鸣牌的一巡内和牌。", images: [{ src: "/docs/fan/20250702224310_17.png", alt: "一发" }] },
      { title: "宝牌", description: "非役，只提供额外番数。", images: [{ src: "/docs/fan/20250702224310_18.png", alt: "宝牌" }] },
      { title: "赤宝牌", description: "非役，只提供额外番数。", images: [{ src: "/docs/fan/20250702224310_19.png", alt: "赤宝牌" }] },
    ],
  },
  {
    id: "two-han",
    title: "两番",
    items: [
      { title: "两立直", description: "门前清限定；第一巡且轮到自己前无人鸣牌时立直。", images: [{ src: "/docs/fan/20250702224310_20.png", alt: "两立直" }] },
      { title: "三色同刻", images: [{ src: "/docs/fan/20250702224310_21.png", alt: "三色同刻" }] },
      { title: "三杠子", images: [{ src: "/docs/fan/20250702224310_22.png", alt: "三杠子" }] },
      { title: "对对和", images: [{ src: "/docs/fan/20250702224310_23.png", alt: "对对和" }] },
      { title: "三暗刻", images: [{ src: "/docs/fan/20250702224310_24.png", alt: "三暗刻" }] },
      { title: "小三元", images: [{ src: "/docs/fan/20250702224310_25.png", alt: "小三元" }] },
      { title: "混老头", description: "只包含老头牌和字牌。", images: [{ src: "/docs/fan/20250702224310_26.png", alt: "混老头" }] },
      { title: "七对子", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_27.png", alt: "七对子" }] },
      { title: "混全带幺九", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_28.png", alt: "混全带幺九" }] },
      { title: "一气通贯", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_29.png", alt: "一气通贯" }] },
      { title: "三色同顺", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_30.png", alt: "三色同顺" }] },
    ],
  },
  {
    id: "three-han",
    title: "三番",
    items: [
      { title: "二杯口", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_31.png", alt: "二杯口" }] },
      { title: "纯全带幺九", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_32.png", alt: "纯全带幺九" }] },
      { title: "混一色", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_33.png", alt: "混一色" }] },
    ],
  },
  {
    id: "six-han",
    title: "六番",
    items: [
      { title: "清一色", description: "副露减一番。", images: [{ src: "/docs/fan/20250702224310_34.png", alt: "清一色" }] },
    ],
  },
  {
    id: "mangan",
    title: "满贯",
    items: [
      { title: "流局满贯", description: "舍牌全为幺九牌且没有被鸣牌的情况下荒牌流局。", images: [{ src: "/docs/fan/20250702224310_35.png", alt: "流局满贯" }] },
    ],
  },
  {
    id: "yakuman",
    title: "役满",
    description: "役满之间可叠加，但只有满足役满条件的牌才按役满处理。",
    items: [
      { title: "天和", description: "庄家限定。", images: [{ src: "/docs/fan/20250702224310_36.png", alt: "天和" }] },
      { title: "地和", description: "子家限定。", images: [{ src: "/docs/fan/20250702224310_37.png", alt: "地和" }] },
      { title: "大三元", images: [{ src: "/docs/fan/20250702224310_38.png", alt: "大三元" }] },
      { title: "四暗刻", description: "门前清限定；荣和不算四暗刻。", images: [{ src: "/docs/fan/20250702224310_39.png", alt: "四暗刻" }] },
      { title: "字一色", images: [{ src: "/docs/fan/20250702224310_40.png", alt: "字一色" }] },
      { title: "绿一色", description: "只含索子 23468 与发财；不含发财也可成立。", images: [{ src: "/docs/fan/20250702224310_41.png", alt: "绿一色" }] },
      { title: "清老头", images: [{ src: "/docs/fan/20250702224310_42.png", alt: "清老头" }] },
      { title: "国士无双", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_43.png", alt: "国士无双" }] },
      { title: "小四喜", images: [{ src: "/docs/fan/20250702224310_44.png", alt: "小四喜" }] },
      { title: "四杠子", description: "一人开杠四次。", images: [{ src: "/docs/fan/20250702224310_45.png", alt: "四杠子" }] },
      { title: "九莲宝灯", images: [{ src: "/docs/fan/20250702224310_46.png", alt: "九莲宝灯" }] },
      { title: "累计役满", description: "和牌时番数达到 13 番或以上，按累计役满处理。" },
    ],
  },
  {
    id: "double-yakuman",
    title: "双倍役满",
    description: "双倍役满可与普通役满叠加。",
    items: [
      { title: "四暗刻单骑", description: "门前清限定。", images: [{ src: "/docs/fan/20250702224310_47.png", alt: "四暗刻单骑" }] },
      { title: "国士无双十三面", description: "门前清限定；不与国士无双叠加。", images: [{ src: "/docs/fan/20250702224310_48.png", alt: "国士无双十三面" }] },
      { title: "纯正九莲宝灯", description: "门前清限定；不与九莲宝灯叠加。", images: [{ src: "/docs/fan/20250702224310_49.png", alt: "纯正九莲宝灯" }] },
      { title: "大四喜", images: [{ src: "/docs/fan/20250702224310_50.png", alt: "大四喜" }] },
    ],
  },
] as const;
