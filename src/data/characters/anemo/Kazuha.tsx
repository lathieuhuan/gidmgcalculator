import type { DataCharacter, ModifierInput, TotalAttribute } from "@Src/types";
import { Anemo, Green, Red } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS, VISION_TYPES } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
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
        { name: "1-Hit", baseMult: 44.98 },
        { name: "2-Hit", baseMult: 45.24 },
        { name: "3-Hit", baseMult: [25.8, 30.96] },
        { name: "4-Hit", baseMult: 60.72 },
        { name: "5-Hit (1/3)", baseMult: 25.37 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: [43, 74.65] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Chihayaburu",
      image: "2/22/Talent_Chihayaburu",
      xtraLvAtCons: 3,
      stats: [
        { name: "Press DMG", baseMult: 192 },
        { name: "Hold DMG", baseMult: 260.8 },
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
        { name: "Slashing DMG", baseMult: 262.4 },
        { name: "DoT", baseMult: 120 },
        { name: "Additional Elemental DMG", dmgTypes: ["EB", "various"], baseMult: 36 },
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
      index: 0,
      src: EModSrc.ES,
      desc: () => (
        <>
          Within 10s of remaining airborne after casting Chihayaburu, Kazuha can unleash a powerful
          Plunging Attack known as Midare Ranzan, <Green>converting</Green> his{" "}
          <Green>Plunging Attack DMG</Green> to <Anemo>Anemo DMG</Anemo>.
        </>
      ),
      affect: EModAffect.SELF,
      infuseConfig: {
        range: ["PA"],
        overwritable: false,
      },
    },
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
      inputConfig: {
        labels: ["Element Swirled", "Elemental Mastery"],
        selfLabels: ["Element Swirled"],
        renderTypes: ["anemoable", "text"],
        initialValues: [0, 0],
        maxValues: [0, 9999],
      },
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
          The Autumn Whirlwind field created by Kazuha Slash increases the{" "}
          <Green>Elemental Mastery</Green> of him and characters within the field by{" "}
          <Green b>200</Green>.
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
          5s. Additionally, each point of <Green>Elemental Mastery</Green> will increase the{" "}
          <Green>DMG</Green> dealt by Kazuha's <Green>Normal, Charged, and Plunging Attack</Green>{" "}
          by <Green b>0.2%</Green>. <Red>DMG Bonus: {Math.round(totalAttr.em * 0.2)}%.</Red>
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const bonusValue = Math.round(totalAttr.em * 0.2);
        applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], bonusValue, tracker);
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: true,
      },
    },
  ],
};

export default Kazuha;
