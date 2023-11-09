import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Charlotte: DefaultAppCharacter = {
  code: 79,
  name: "Charlotte",
  icon: "d/d2/Charlotte_Icon",
  sideIcon: "8/81/Charlotte_Side_Icon",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      description: `For each Fontainian party member other than herself, Charlotte gains a {5%}#[b,gr]
      {Healing Bonus}#[gr]. For each non-Fontainian party member, Charlotte gains a {5%}#[b,gr] {Cryo DMG Bonus}#[gr].`,
      applyFinalBuff: (obj) => {
        const numOfFontainians = obj.partyData.reduce((total, teammate) => {
          return total + (teammate?.nation === "fontaine" ? 1 : 0);
        }, 0);
        const cryoBonus = (obj.partyData.filter(Boolean).length - numOfFontainians) * 5;
        applyModifier(obj.desc, obj.totalAttr, ["healB_", "cryo"], [numOfFontainians * 5, cryoBonus], obj.tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When using Framing: Freezing Point Composition [ES], when Monsieur Verite hits 1/2/3 (or more)
      opponents, Charlotte's {ATK}#[gr] will be increased by {10%}#[b,gr]/{20%}#[b,gr]/{30%}#[b,gr] for 12s.`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          label: "Opponents hit",
          max: 3,
        },
      ],
      applyBuff: (obj) => {
        const stacks = obj.inputs[0] || 0;
        applyModifier(obj.desc, obj.totalAttr, "atk_", stacks * 10, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Still Photo: Comprehensive Confirmation [EB] hits an opponent marked by Speedy Silhouette or
      Focused Impression [~ES], it will deal {10%}#[b,gr] {more DMG}#[gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 10),
    },
  ],
};

export default Charlotte as AppCharacter;
