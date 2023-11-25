import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Klee: DefaultAppCharacter = {
  code: 23,
  name: "Klee",
  icon: "9/9c/Klee_Icon",
  sideIcon: "b/ba/Klee_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Klee as AppCharacter;
