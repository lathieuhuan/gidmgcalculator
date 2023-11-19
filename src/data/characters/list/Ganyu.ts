import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Ganyu: DefaultAppCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "7/79/Ganyu_Icon",
  sideIcon: "3/3a/Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease opponents' {Cryo RES}#[k] by
      {15%}#[v] for 6s upon hit.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "cryo", 15),
    },
  ],
};

export default Ganyu as AppCharacter;
