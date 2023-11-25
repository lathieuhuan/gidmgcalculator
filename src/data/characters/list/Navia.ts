import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Navia: DefaultAppCharacter = {
  code: 80,
  name: "Navia",
  icon: "",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "geo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Navia as AppCharacter;
