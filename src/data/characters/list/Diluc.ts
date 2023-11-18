import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Diluc: DefaultAppCharacter = {
  code: 20,
  name: "Diluc",
  icon: "3/3d/Diluc_Icon",
  sideIcon: "6/67/Diluc_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Diluc as AppCharacter;
