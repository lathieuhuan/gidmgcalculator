import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Xingqiu: DefaultAppCharacter = {
  code: 17,
  name: "Xingqiu",
  icon: "d/d4/Xingqiu_Icon",
  sideIcon: "f/fc/Xingqiu_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `Decreases the {Hydro RES}#[k] of opponents hit by sword rain attacks by {15%}#[v] for 4s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 15),
    },
  ],
};

export default Xingqiu as AppCharacter;
