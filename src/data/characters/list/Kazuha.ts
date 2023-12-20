import type { AppCharacter, DefaultAppCharacter, ModifierInput, TotalAttribute } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, NCPA_PERCENTS } from "../constants";
import { checkAscs, checkCons } from "../utils";

const ascs4BuffValue = (fromSelf: boolean, totalAttr: TotalAttribute, inputs: ModifierInput[]) => {
  const EM = fromSelf ? totalAttr.em : inputs[1] || 0;
  return round(+EM * 0.04, 2);
};

const Kazuha: DefaultAppCharacter = {
  code: 35,
  name: "Kazuha",
  icon: "e/e3/Kaedehara_Kazuha_Icon",
  sideIcon: "c/cc/Kaedehara_Kazuha_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      description: `Upon triggering a Swirl, Kazuha will grant all party members a {0.04%}#[v]
      {Elemental DMG Bonus}#[k] to the element absorbed by Swirl for every point of {Elemental Mastery}#[k] he has
      for 8s.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        { label: "Element Swirled", type: "anemoable" },
        { label: "Elemental Mastery", type: "text", max: 9999, for: "teammate" },
      ],
      applyFinalBuff: ({ fromSelf, totalAttr, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        const buffValue = ascs4BuffValue(fromSelf, totalAttr, inputs);
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      description: `Kazuha Slash's [EB] field increases the {Elemental Mastery}#[k] of him and characters within the
      field by {200}#[v].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `After using Chihayaburu [ES] or Kazuha Slash [EB], Kazuha gains an {Anemo Infusion}#[anemo] for 5s.
      Each point of {Elemental Mastery}#[k] will increase Kazuha's {Normal, Charged, and Plunging Attack DMG}#[k] by
      {0.2%}#[v].`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const buffValue = Math.round(totalAttr.em * 0.2);
        applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], buffValue, tracker);
      },
      infuseConfig: {
        overwritable: true,
      },
    },
  ],
};

export default Kazuha as AppCharacter;
