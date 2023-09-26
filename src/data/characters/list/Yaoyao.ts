import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkCons } from "../utils";

const Yaoyao: DefaultAppCharacter = {
  code: 66,
  name: "Yaoyao",
  icon: "8/83/Yaoyao_Icon",
  sideIcon: "3/39/Yaoyao_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "dendro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.PARTY,
      description: `When White Jade Radishes [~ES] explode, active characters within their AoE will gain {15%}#[b,gr]
      {Dendro DMG Bonus}#[gr] for 8s`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "dendro", 15),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `After using Raphanus Sky Cluster [ES] or Moonjade Descent [EB], Yaoyao's {Elemental Mastery}#[gr] will
      be increased based on {0.3%}#[b,gr] of her {Max HP}#[gr] for 8s. Max {120}#[r] Elemental Mastery.`,
      isGranted: checkCons[4],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const buffValue = Math.min(Math.round(totalAttr.hp * 0.003), 120);
        applyModifier(desc, totalAttr, "em", buffValue, tracker);
      },
    },
  ],
};

export default Yaoyao as AppCharacter;
