import type { AppCharacter, DefaultAppCharacter, ModifierInput, TotalAttribute } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Anemo, Green, Red } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const ascs4BuffValue = (toSelf: boolean, totalAttr: TotalAttribute, inputs: ModifierInput[]) => {
  const EM = toSelf ? totalAttr.em : inputs[1] || 0;
  return round(+EM * 0.04, 2);
};

const Kazuha: DefaultAppCharacter = {
  code: 35,
  name: "Kazuha",
  GOOD: "KaedeharaKazuha",
  icon: "e/e3/Kaedehara_Kazuha_Icon",
  sideIcon: "c/cc/Kaedehara_Kazuha_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "sword",
  EBcost: 60,
  buffs: [
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      desc: ({ toSelf, totalAttr, inputs }) => {
        const elmtIndex = inputs[0] || 0;
        return (
          <>
            Upon triggering a Swirl, Kazuha will grant all party members a <Green b>0.04%</Green>{" "}
            <Green>Elemental DMG Bonus</Green> to the element absorbed by Swirl for every point of{" "}
            <Green>Elemental Mastery</Green> he has for 8s.{" "}
            <Red className="capitalize">
              {VISION_TYPES[elmtIndex]} DMG Bonus: {ascs4BuffValue(toSelf, totalAttr, inputs)}
              %.
            </Red>
          </>
        );
      },
      isGranted: checkAscs[4],
      inputConfigs: [
        { label: "Element Swirled", type: "anemoable" },
        { label: "Elemental Mastery", type: "text", max: 9999, for: "teammate" },
      ],
      applyFinalBuff: ({ toSelf, totalAttr, inputs, desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        const buffValue = ascs4BuffValue(toSelf, totalAttr, inputs);
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Kazuha Slash's [EB] field increases the <Green>Elemental Mastery</Green> of him and characters within the
          field by <Green b>200</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: ({ totalAttr }) => (
        <>
          After using Chihayaburu [ES] or Kazuha Slash [EB], Kazuha gains an <Anemo>Anemo Infusion</Anemo> for 5s. Each
          point of <Green>Elemental Mastery</Green> will increase Kazuha's{" "}
          <Green>Normal, Charged, and Plunging Attack DMG</Green> by <Green b>0.2%</Green>.{" "}
          <Red>DMG bonus: {Math.round(totalAttr.em * 0.2)}%.</Red>
        </>
      ),
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
