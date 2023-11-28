import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Gorou: DefaultAppCharacter = {
  code: 44,
  name: "Gorou",
  icon: "f/fe/Gorou_Icon",
  sideIcon: "7/7e/Gorou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "geo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Gorou as AppCharacter;
