import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const YunJin: DefaultAppCharacter = {
  code: 48,
  name: "Yun Jin",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "f/fb/Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default YunJin as AppCharacter;
