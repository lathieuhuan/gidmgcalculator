import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
// import { EModAffect } from "@Src/constants";
// import { applyModifier, makeModApplier } from "@Src/utils/calculation";
// import { EModSrc } from "../constants";
// import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Albedo: DefaultAppCharacter = {
  code: 29,
  name: "Albedo",
  icon: "3/30/Albedo_Icon",
  sideIcon: "3/34/Albedo_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
};

export default Albedo as AppCharacter;
