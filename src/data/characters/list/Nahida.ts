import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Nahida: DefaultAppCharacter = {
  code: 62,
  name: "Nahida",
  icon: "f/f9/Nahida_Icon",
  sideIcon: "2/22/Nahida_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 50,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Nahida as AppCharacter;
