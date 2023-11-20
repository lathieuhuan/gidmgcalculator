import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Yaoyao: DefaultAppCharacter = {
  code: 66,
  name: "Yaoyao",
  icon: "8/83/Yaoyao_Icon",
  sideIcon: "3/39/Yaoyao_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "dendro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Yaoyao as AppCharacter;
