import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO } from "../constants";
import { checkAscs, checkCons } from "../utils";

const DendroTraveler: DefaultAppCharacter = {
  code: 57,
  name: "Dendro Traveler",
  ...TRAVELER_INFO,
  vision: "dendro",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Every point of the Traveler's Elemental Mastery increases Razorgrass Blade {[ES] DMG}#[k] by
      {0.15%}#[v] and Surgent Manifestation {[EB] DMG}#[k] by {0.1%}#[v].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ desc, attPattBonus, totalAttr, tracker }) => {
        const buffValue1 = totalAttr.em * 0.15;
        const buffValue2 = totalAttr.em * 0.1;
        applyModifier(desc, attPattBonus, ["ES.pct_", "EB.pct_"], [buffValue1, buffValue2], tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Lea Lotus Lamp [~EB] will obtain 1 level of Overflowing Lotuslight every second, increasing the
      {Elemental Mastery}#[k] of active character(s) within its AoE by {6}#[v]. Maximum {10}#[m] stacks.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 10,
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 6 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Overflowing Lotuslight effect [A1] increases {Dendro DMG Bonus}#[k] by {12%}#[v]. If the Lamp
      has experienced a Lotuslight Transfiguration previously, the effect will also grant {12%}#[v] {DMG Bonus}#[k]
      for the {corresponding element}#[k].`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          label: "Element contact",
          type: "dendroable",
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        applyModifier(desc, totalAttr, ["dendro", VISION_TYPES[elmtIndex]], 12, tracker);
      },
    },
  ],
};

export default DendroTraveler as AppCharacter;
