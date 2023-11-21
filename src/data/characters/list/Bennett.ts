import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Bennett: DefaultAppCharacter = {
  code: 19,
  name: "Bennett",
  icon: "7/79/Bennett_Icon",
  sideIcon: "0/01/Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Bennett as AppCharacter;
