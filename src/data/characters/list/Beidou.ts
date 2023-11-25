import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Beidou: DefaultAppCharacter = {
  code: 6,
  name: "Beidou",
  icon: "e/e1/Beidou_Icon",
  sideIcon: "8/84/Beidou_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Beidou as AppCharacter;
