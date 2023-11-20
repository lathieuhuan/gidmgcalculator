import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Layla: DefaultAppCharacter = {
  code: 61,
  name: "Layla",
  icon: "1/1a/Layla_Icon",
  sideIcon: "2/23/Layla_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Layla as AppCharacter;
