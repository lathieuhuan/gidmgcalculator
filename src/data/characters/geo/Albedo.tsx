import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

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
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          <Green>Transient Blossoms</Green> deal <Green b>25%</Green> <Green>more DMG</Green> to opponents whose HP is
          below 50%.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A1, "ES.0", "pct_", 25));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Using Rite of Progeniture: Tectonic Tide [EB] increases the <Green>Elemental Mastery</Green> of nearby party
          members by <Green b>125</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "em", 125),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Transient Blossoms grant Albedo Fatal Reckoning for 30s. Unleashing Rite of Progeniture: Tectonic Tide [EB]
          consumes all stacks, each increases Albedo's <Green>[EB] DMG</Green> by <Green b>30%</Green> of his{" "}
          <Green>DEF</Green>. This effect stacks up to <Rose>4</Rose> times.
        </>
      ),
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyFinalBuff: ({ totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const buffValue = totalAttr.def * 0.3 * (inputs[0] | 0);
        applyModifier(desc, attPattBonus, "EB.flat", Math.round(buffValue), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Active party members within the Solar Isotoma [ES] field have their <Green>Plunging Attack DMG</Green>{" "}
          increased by <Green b>30%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "PA.pct_", 30),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      desc: () => (
        <>
          Active party members within the Solar Isotoma [ES] field who are protected by a shield created by Crystallize
          have their <Green>DMG</Green> increased by <Green b>17%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 17),
    },
  ],
};

export default Albedo as AppCharacter;
