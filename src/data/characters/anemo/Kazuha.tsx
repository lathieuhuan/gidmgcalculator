import type { DataCharacter, ModifierInput, TotalAttribute } from "@Src/types";
import { Anemo, Green, Red } from "@Src/styled-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { EModSrc } from "../constants";
import { round2 } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";
import { NCPA_PERCENTS } from "@Data/constants";

const ascs4BuffValue = (toSelf: boolean, totalAttr: TotalAttribute, inputs: ModifierInput[]) => {
  const EM = toSelf ? totalAttr.em : inputs[1] || 0;
  return round2(+EM * 0.04);
};

const Kazuha: DataCharacter = {
  code: 35,
  name: "Kazuha",
  GOOD: "KaedeharaKazuha",
  icon: "f/f0/Character_Kaedehara_Kazuha_Thumb",
  sideIcon: "1/16/Character_Kaedehara_Kazuha_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "anemo",
  weapon: "sword",
  stats: [
    [1039, 23, 63],
    [2695, 60, 163],
    [3586, 80, 217],
    [5366, 119, 324],
    [5999, 133, 363],
    [6902, 153, 417],
    [7747, 172, 468],
    [8659, 192, 523],
    [9292, 206, 562],
    [10213, 227, 617],
    [10846, 241, 656],
    [11777, 262, 712],
    [12410, 276, 750],
    [13348, 297, 807],
  ],
  bonusStat: { type: "em", value: 28.8 },
  NAsConfig: {
    name: "Garyuu Bladework",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 44.98 },
        { name: "2-Hit", multBase: 45.24 },
        { name: "3-Hit", multBase: [25.8, 30.96] },
        { name: "4-Hit", multBase: 60.72 },
        { name: "5-Hit (1/3)", multBase: 25.37 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: [43, 74.65] }] },
    PA: {
      stats: [
        { name: "Plunging Attack: Midare Ranzan", attElmt: "anemo", multBase: 81.83, multType: 7 },
        { name: "Plunge DMG", multBase: 81.83, multType: 7 },
        { name: "Low Plunge", multBase: 163.63, multType: 7 },
        { name: "High Plunge", multBase: 204.39, multType: 7 },
      ],
    },
    ES: {
      name: "Chihayaburu",
      image: "2/22/Talent_Chihayaburu",
      xtraLvAtCons: 3,
      stats: [
        { name: "Press DMG", multBase: 192 },
        { name: "Hold DMG", multBase: 260.8 },
      ],
      // getExtraStats: () => [
      //   { name: "Press CD", value: "6s" },
      //   { name: "Hold CD", value: "9s" },
      // ],
    },
    EB: {
      name: "Kazuha Slash",
      image: "0/06/Talent_Kazuha_Slash",
      xtraLvAtCons: 5,
      stats: [
        { name: "Slashing DMG", multBase: 262.4 },
        { name: "DoT", multBase: 120 },
        { name: "Additional Elemental DMG", attElmt: "various", multBase: 36 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Soumon Swordsmanship", image: "1/16/Talent_Soumon_Swordsmanship" },
    { name: "Poetics of Fuubutsu", image: "e/e4/Talent_Poetics_of_Fuubutsu" },
    { name: "Cloud Strider", image: "b/b1/Talent_Cloud_Strider" },
  ],
  constellation: [
    { name: "Scarlet Hills", image: "6/6b/Constellation_Scarlet_Hills" },
    { name: "Yamaarashi Tailwind", image: "f/f2/Constellation_Yamaarashi_Tailwind" },
    { name: "Maple Monogatari", image: "c/c3/Constellation_Maple_Monogatari" },
    { name: "Oozora Genpou", image: "0/07/Constellation_Oozora_Genpou" },
    { name: "Wisdom of Bansei", image: "f/f7/Constellation_Wisdom_of_Bansei" },
    { name: "Crimson Momiji", image: "8/87/Constellation_Crimson_Momiji" },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C4,
      desc: ({ toSelf, totalAttr, inputs = [] }) => {
        const elmtIndex = inputs[0] || 0;
        return (
          <>
            Upon triggering a Swirl, Kazuha will grant all party members a <Green b>0.04%</Green>{" "}
            <Green>Elemental DMG Bonus</Green> to the element absorbed by Swirl for every point of{" "}
            <Green>Elemental Mastery</Green> he has for 8s.{" "}
            <Red className="capitalize">
              {VISION_TYPES[elmtIndex]} DMG Bonus: {ascs4BuffValue(toSelf, totalAttr, inputs || [])}
              %.
            </Red>
          </>
        );
      },
      isGranted: checkAscs[4],
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Element Swirled", type: "anemoable" },
        { label: "Elemental Mastery", type: "text", max: 9999, for: "teammate" },
      ],
      applyBuff: ({ toSelf, totalAttr, inputs = [], desc, tracker }) => {
        const elmtIndex = inputs[0] || 0;
        const buffValue = ascs4BuffValue(toSelf, totalAttr, inputs);
        applyModifier(desc, totalAttr, VISION_TYPES[elmtIndex], buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      desc: () => (
        <>
          Kazuha Slash's [EB] field increases the <Green>Elemental Mastery</Green> of him and
          characters within the field by <Green b>200</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      desc: ({ totalAttr }) => (
        <>
          After using Chihayaburu or Kazuha Slash, Kazuha gains an <Anemo>Anemo Infusion</Anemo> for
          5s. Each point of <Green>Elemental Mastery</Green> will increase Kazuha's{" "}
          <Green>Normal, Charged, and Plunging Attack DMG</Green> by <Green b>0.2%</Green>.{" "}
          <Red>DMG Bonus: {Math.round(totalAttr.em * 0.2)}%.</Red>
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
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

export default Kazuha;
