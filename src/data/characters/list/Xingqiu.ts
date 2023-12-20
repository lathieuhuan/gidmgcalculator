import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

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
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      description: `Xingqiu gains a {20%}#[v] {Hydro DMG Bonus}#[k].`,
      applyBuff: makeModApplier("totalAttr", "hydro", 20),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `During Guhua Sword: Raincutter [EB], Guhua Sword: Fatal Rainscreen {[ES] DMG}#[k] is increased by
      {50%}#[v].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.multPlus", 50),
    },
  ],
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
