import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Mika: DefaultAppCharacter = {
  code: 67,
  name: "Mika",
  icon: "d/dd/Mika_Icon",
  sideIcon: "8/84/Mika_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Mika as AppCharacter;
