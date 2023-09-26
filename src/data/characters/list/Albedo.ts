import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

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
      description: `{Transient Blossoms}#[gr] deal {25%}#[b,gr] more {DMG}#[gr] to opponents whose HP is below 50%.`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A1, "ES.0", "pct_", 25));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      description: `Using Rite of Progeniture: Tectonic Tide [EB] increases the {Elemental Mastery}#[gr] of nearby party
      members by {125}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "em", 125),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Rite of Progeniture: Tectonic Tide [EB] consumes all stacks of Fatal Reckoning. Each stack increases
      Albedo's {[EB] DMG}#[gr] by {30%}#[b,gr] of his {DEF}#[gr]. Max {4}#[r] stacks.`,
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
      description: `Active party members within the Solar Isotoma [ES] field have their {Plunging Attack DMG}#[gr]
      increased by {30%}#[b,gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "PA.pct_", 30),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Active party members within the Solar Isotoma [ES] field who are protected by a shield created by
      Crystallize have their {DMG}#[gr] increased by {17%}#[b,gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 17),
    },
  ],
};

export default Albedo as AppCharacter;
