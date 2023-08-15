import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkCons } from "../utils";

const Collei: DefaultAppCharacter = {
  code: 55,
  name: "Collei",
  icon: "a/a2/Collei_Icon",
  sideIcon: "0/04/Collei_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [821, 17, 50],
    [2108, 43, 129],
    [2721, 56, 167],
    [4076, 83, 250],
    [4512, 92, 277],
    [5189, 106, 318],
    [5770, 118, 354],
    [6448, 132, 396],
    [6884, 140, 422],
    [7561, 154, 464],
    [7996, 163, 491],
    [8674, 177, 532],
    [9110, 186, 559],
    [9787, 200, 601],
  ],
  bonusStat: { type: "atk_", value: 6 },
  activeTalents: {
    NAs: {
      name: "Supplicant's Bowmanship",
    },
    ES: {
      name: "Floral Brush",
      image: "8/88/Talent_Floral_Brush",
    },
    EB: {
      name: "Trump-Card Kitty",
      image: "2/2e/Talent_Trump-Card_Kitty",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 43.6 },
      { name: "2-Hit", multFactors: 42.66 },
      { name: "3-Hit", multFactors: 54.09 },
      { name: "4-Hit", multFactors: 68.03 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [{ name: "Skill DMG", multFactors: 151.2 }],
    EB: [
      { name: "Explosion DMG", multFactors: 201.82 },
      { name: "Leap DMG", multFactors: 43.25 },
      { name: "Mini Cuilein-Anbar (C6)", multFactors: 200, attPatt: "none" },
    ],
  },
  passiveTalents: [
    { name: "Floral Sidewinder", image: "c/cf/Talent_Floral_Sidewinder" },
    { name: "The Languid Wood", image: "c/cb/Talent_The_Languid_Wood" },
    {
      name: "Gliding Champion of Sumeru",
      image: "d/d3/Talent_Gliding_Champion_of_Sumeru",
    },
  ],
  constellation: [
    {
      name: "Beginnings Determined at the Roots",
      image: "b/b7/Constellation_Deepwood_Patrol",
    },
    {
      name: "Through Hill and Copse",
      image: "d/d8/Constellation_Through_Hill_and_Copse",
    },
    { name: "Scent of Summer", image: "a/ac/Constellation_Scent_of_Summer" },
    {
      name: "Gift of the Woods",
      image: "8/85/Constellation_Gift_of_the_Woods",
    },
    { name: "All Embers", image: "7/77/Constellation_All_Embers" },
    {
      name: "Forest of Falling Arrows",
      image: "b/b8/Constellation_Forest_of_Falling_Arrows",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `When in the party and not on the field, Collei's {Energy Recharge}#[gr] is increased by {20%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "er_", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `Using Trump-Card Kitty [EB] will increase all nearby characters' {Elemental Mastery}#[gr] (excluding
      Collei) by {60}#[b,gr] for 12s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "em", 60),
    },
  ],
};

export default Collei as AppCharacter;