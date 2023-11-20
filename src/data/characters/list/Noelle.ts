import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Noelle: DefaultAppCharacter = {
  code: 14,
  name: "Noelle",
  icon: "8/8e/Noelle_Icon",
  sideIcon: "1/15/Noelle_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Noelle as AppCharacter;
