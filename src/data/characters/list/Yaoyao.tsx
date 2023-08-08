import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
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
  stats: [
    [1030, 18, 63],
    [2647, 46, 162],
    [3417, 59, 209],
    [5118, 88, 313],
    [5665, 98, 346],
    [6516, 113, 398],
    [7245, 125, 443],
    [8096, 140, 495],
    [8643, 149, 528],
    [9493, 164, 580],
    [10040, 174, 613],
    [10891, 188, 665],
    [11438, 198, 699],
    [12289, 212, 751],
  ],
  bonusStat: { type: "hp_", value: 6 },
  activeTalents: {
    NAs: {
      name: "Toss 'N' Turn Spear",
    },
    ES: {
      name: "Raphanus Sky Cluster",
      image: "2/25/Talent_Raphanus_Sky_Cluster",
    },
    EB: {
      name: "Moonjade Descent",
      image: "c/ca/Talent_Moonjade_Descent",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 51 },
      { name: "2-Hit", multFactors: 47.44 },
      { name: "3-Hit", multFactors: [31.38, 32.95] },
      { name: "4-Hit", multFactors: 77.93 },
    ],
    CA: [{ name: "Charged Attack", multFactors: 112.66 }],
    PA: MEDIUM_PAs,
    ES: [
      { name: "White Jade Radish DMG", multFactors: 29.92 },
      {
        name: "White Jade Radish Healing",
        type: "healing",
        multFactors: { root: 1.71, attributeType: "hp" },
        flatFactor: 165,
      },
      {
        name: "Radish Extra Healing per sec (A4)",
        type: "healing",
        multFactors: { root: 0.8, attributeType: "hp", scale: 0 },
      },
      {
        name: "Mega Radish DMG (C6)",
        multFactors: { root: 75, scale: 0 },
      },
      {
        name: "Mega Radish Healing (C6)",
        type: "healing",
        multFactors: { root: 7.5, attributeType: "hp", scale: 0 },
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 114.56 },
      { name: "Adeptal Legacy Radish DMG", multFactors: 72.16 },
      {
        name: "Adeptal Legacy Radish Healing",
        type: "healing",
        multFactors: { root: 2.02, attributeType: "hp" },
        flatFactor: 194,
      },
    ],
  },
  passiveTalents: [
    { name: "Starscatter", image: "d/d5/Talent_Starscatter" },
    { name: "In Others' Shoes", image: "a/ab/Talent_In_Others%27_Shoes" },
    { name: "Tailing on Tiptoes", image: "8/89/Talent_Tailing_on_Tiptoes" },
  ],
  constellation: [
    { name: "Adeptus' Tutelage", image: "2/2a/Constellation_Adeptus%27_Tutelage" },
    { name: "Innocent", image: "3/3d/Constellation_Innocent" },
    { name: "Loyal and Kind", image: "6/66/Constellation_Loyal_and_Kind" },
    { name: "Winsome", image: "3/39/Constellation_Winsome" },
    { name: "Compassionate", image: "3/3d/Constellation_Compassionate" },
    { name: "Beneficent", image: "0/02/Constellation_Beneficent" },
  ],
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
