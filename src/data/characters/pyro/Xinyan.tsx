import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

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
      desc: () => (
        <>
          Riff Revolution's <Green>[EB] Physical CRIT Rate</Green> is increased by <Green b>100%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C2, "EB.0", "cRate_", 100));
      },
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Xinyan's <Green>Charged Attacks DMG</Green> is increased by <Green b>50%</Green> of her <Green>DEF</Green>.
        </>
      ),
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
      desc: () => (
        <>
          Characters shielded by Sweeping Fervor [ES] deal <Green b>15%</Green> increased <Green>Physical DMG</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "phys", 15),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Upon scoring a CRIT Hit, increases <Green>ATK SPD</Green> of Xinyan's{" "}
          <Green>Normal and Charged Attacks</Green> by <Green b>12%</Green> for 5s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", ["naAtkSpd_", "caAtkSpd_"], 12),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Sweeping Fervor's swing DMG decreases opponent's <Green>Physical RES</Green> by <Green b>15%</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "phys", 15),
    },
  ],
};

export default Xinyan as AppCharacter;
