import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Charlotte: DefaultAppCharacter = {
  code: 79,
  name: "Charlotte",
  icon: "d/d2/Charlotte_Icon",
  sideIcon: "8/81/Charlotte_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Charlotte as AppCharacter;
