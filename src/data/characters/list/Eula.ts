import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Eula: DefaultAppCharacter = {
  code: 33,
  name: "Eula",
  icon: "a/af/Eula_Icon",
  sideIcon: "8/8d/Eula_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Eula as AppCharacter;
