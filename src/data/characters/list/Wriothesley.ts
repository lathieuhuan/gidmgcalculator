import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Wriothesley: DefaultAppCharacter = {
  code: 76,
  name: "Wriothesley",
  icon: "b/bb/Wriothesley_Icon",
  sideIcon: "d/d0/Wriothesley_Side_Icon",
  rarity: 5,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
};

export default Wriothesley as AppCharacter;
