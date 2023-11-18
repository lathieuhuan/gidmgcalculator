import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Diona: DefaultAppCharacter = {
  code: 24,
  name: "Diona",
  icon: "4/40/Diona_Icon",
  sideIcon: "e/e1/Diona_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Diona as AppCharacter;
