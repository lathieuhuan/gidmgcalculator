import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Xingqiu: DefaultAppCharacter = {
  code: 17,
  name: "Xingqiu",
  icon: "d/d4/Xingqiu_Icon",
  sideIcon: "f/fc/Xingqiu_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Xingqiu as AppCharacter;
