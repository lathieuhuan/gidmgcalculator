import type { AppCharacter, DefaultAppCharacter } from "@Src/types";

const Zhongli: DefaultAppCharacter = {
  code: 25,
  name: "Zhongli",
  icon: "a/a6/Zhongli_Icon",
  sideIcon: "6/68/Zhongli_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Zhongli as AppCharacter;
