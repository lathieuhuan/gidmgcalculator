import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Thoma: DefaultAppCharacter = {
  code: 43,
  name: "Thoma",
  icon: "5/5b/Thoma_Icon",
  sideIcon: "e/e9/Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Thoma as AppCharacter;
