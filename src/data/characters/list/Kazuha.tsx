import type { AppCharacter, DefaultAppCharacter, ModifierInput, TotalAttribute } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons } from "../utils";

const ascs4BuffValue = (fromSelf: boolean, totalAttr: TotalAttribute, inputs: ModifierInput[]) => {
  const EM = fromSelf ? totalAttr.em : inputs[1] || 0;
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
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
  activeTalents: {
    NAs: {
      name: "Garyuu Bladework",
    },
    ES: {
      name: "Chihayaburu",
      image: "2/22/Talent_Chihayaburu",
    },
    EB: {
      name: "Kazuha Slash",
      image: "0/06/Talent_Kazuha_Slash",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.98 },
      { name: "2-Hit", multFactors: 45.24 },
      { name: "3-Hit", multFactors: [25.8, 30.96] },
      { name: "4-Hit", multFactors: 60.72 },
      { name: "5-Hit (1/3)", multFactors: 25.37 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [43, 74.65],
      },
    ],
    PA: [
      {
        name: "Plunging Attack: Midare Ranzan",
        attElmt: "anemo",
        multFactors: 81.83,
      },
      { name: "Plunge DMG", multFactors: 81.83 },
      { name: "Low Plunge", multFactors: 163.63 },
      { name: "High Plunge", multFactors: 204.39 },
    ],
    ES: [
      { name: "Press DMG", multFactors: 192 },
      { name: "Hold DMG", multFactors: 260.8 },
    ],
    EB: [
      { name: "Slashing DMG", multFactors: 262.4 },
      { name: "DoT", multFactors: 120 },
      { name: "Additional Elemental DMG", multFactors: 36, attElmt: "various" },
    ],
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
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      description: `Upon triggering a Swirl, Kazuha will grant all party members a {0.04%}#[b,gr]
      {Elemental DMG Bonus}#[gr] to the element absorbed by Swirl for every point of {Elemental Mastery}#[gr] he has
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
      description: `Kazuha Slash's [EB] field increases the {Elemental Mastery}#[gr] of him and characters within the
      field by {200}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "em", 200),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `After using Chihayaburu [ES] or Kazuha Slash [EB], Kazuha gains an {Anemo Infusion}#[anemo] for 5s.
      Each point of {Elemental Mastery}#[gr] will increase Kazuha's {Normal, Charged, and Plunging Attack DMG}#[gr] by
      {0.2%}#[b,gr].`,
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