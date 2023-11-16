import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
// import { EModAffect } from "@Src/constants";
// import { applyModifier, makeModApplier } from "@Src/utils/calculation";
// import { EModSrc } from "../constants";
// import { checkAscs, checkCons } from "../utils";

const YaeMiko: DefaultAppCharacter = {
  code: 49,
  name: "Yae Miko",
  icon: "b/ba/Yae_Miko_Icon",
  sideIcon: "9/97/Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default YaeMiko as AppCharacter;
