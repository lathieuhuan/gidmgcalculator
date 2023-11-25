import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Xiangling: DefaultAppCharacter = {
  code: 21,
  name: "Xiangling",
  icon: "3/39/Xiangling_Icon",
  sideIcon: "b/b0/Xiangling_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
};

export default Xiangling as AppCharacter;
