import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const HuTao: DefaultAppCharacter = {
  code: 31,
  name: "Hu Tao",
  icon: "e/e9/Hu_Tao_Icon",
  sideIcon: "8/8c/Hu_Tao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default HuTao as AppCharacter;
