import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Xinyan: DefaultAppCharacter = {
  code: 27,
  name: "Xinyan",
  icon: "2/24/Xinyan_Icon",
  sideIcon: "e/ec/Xinyan_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Riff Revolution's {[EB] Physical CRIT Rate}#[gr] is increased by {100%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "EB.0", "cRate_", 100));
      },
    },
    {
      src: EModSrc.C6,
      description: `Xinyan's {Charged Attacks DMG}#[gr] is increased by {50%}#[b,gr] of her {DEF}#[gr].`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.flat", Math.round(totalAttr.def / 2), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Characters shielded by Sweeping Fervor [ES] deal {15%}#[b,gr] increased {Physical DMG}#[gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "phys", 15),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Upon scoring a CRIT Hit, increases {ATK SPD}#[gr] of Xinyan's {Normal and Charged Attacks}#[gr]
      by {12%}#[b,gr] for 5s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", ["naAtkSpd_", "caAtkSpd_"], 12),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Sweeping Fervor's swing DMG decreases opponent's {Physical RES}#[gr] by {15%}#[b,gr] for 12s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "phys", 15),
    },
  ],
};

export default Xinyan as AppCharacter;
