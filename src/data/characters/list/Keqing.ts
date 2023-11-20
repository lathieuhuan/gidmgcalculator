import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Keqing: DefaultAppCharacter = {
  code: 9,
  name: "Keqing",
  icon: "5/52/Keqing_Icon",
  sideIcon: "6/60/Keqing_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "electro",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Keqing as AppCharacter;
