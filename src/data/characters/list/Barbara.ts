import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Barbara: DefaultAppCharacter = {
  code: 15,
  name: "Barbara",
  icon: "6/6a/Barbara_Icon",
  sideIcon: "3/39/Barbara_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Barbara as AppCharacter;
