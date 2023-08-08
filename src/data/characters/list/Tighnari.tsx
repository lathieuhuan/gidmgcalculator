import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Tighnari: DefaultAppCharacter = {
  code: 54,
  name: "Tighnari",
  icon: "8/87/Tighnari_Icon",
  sideIcon: "1/15/Tighnari_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
    
  },
  stats: [
    [845, 21, 49],
    [2191, 54, 127],
    [2915, 72, 169],
    [4362, 108, 253],
    [4877, 120, 283],
    [5611, 139, 326],
    [6297, 155, 366],
    [7038, 174, 409],
    [7553, 186, 439],
    [8301, 205, 482],
    [8816, 218, 512],
    [9573, 236, 556],
    [10087, 249, 586],
    [10850, 268, 630],
  ],
  bonusStat: {
    type: "dendro",
    value: 7.2,
  },
  calcListConfig: {
    CA: { multScale: 2 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.63 },
      { name: "2-Hit", multFactors: 41.97 },
      { name: "3-Hit (1/2)", multFactors: 26.45 },
      { name: "4-Hit", multFactors: 68.63 },
    ],
    CA: [
      { name: "Aimed Shot", multFactors: { root: 43.86, scale: 7 } },
      { name: "Level 1 Aimed Shot", subAttPatt: "FCA", multFactors: 124 },
      { name: "Wreath Arrow DMG", subAttPatt: "FCA", multFactors: 87.2 },
      {
        name: "Clusterbloom Arrow DMG",
        subAttPatt: "FCA",
        multFactors: 38.6,
      },
      {
        name: "Additional Clusterbloom Arrow DMG (C6)",
        subAttPatt: "FCA",
        multFactors: { root: 150, scale: 0 },
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 149.6,
      },
    ],
    EB: [
      { name: "Tanglevine Shaft DMG", multFactors: 55.62 },
      { name: "Secondary Tanglevine Shaft DMG", multFactors: 67.98 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Khanda Barrier-Buster",
    },
    ES: {
      name: "Vijnana-Phala Mine",
      image: "f/f9/Talent_Vijnana-Phala_Mine",
    },
    EB: {
      name: "Fashioner's Tanglevine Shaft",
      image: "3/30/Talent_Fashioner%27s_Tanglevine_Shaft",
    },
  },
  passiveTalents: [
    { name: "Keen Sight", image: "7/77/Talent_Keen_Sight" },
    { name: "Scholarly Blade", image: "e/e6/Talent_Scholarly_Blade" },
    { name: "Encyclopedic Knowledge", image: "e/ee/Talent_Encyclopedic_Knowledge" },
  ],
  constellation: [
    { name: "Beginnings Determined at the Roots", image: "2/2e/Constellation_Beginnings_Determined_at_the_Roots" },
    { name: "Origins Known From the Stem", image: "3/30/Constellation_Origins_Known_From_the_Stem" },
    { name: "Fortunes Read Amongst the Branches", image: "3/3a/Constellation_Fortunes_Read_Amongst_the_Branches" },
    { name: "Withering Glimpsed in the Leaves", image: "8/8b/Constellation_Withering_Glimpsed_in_the_Leaves" },
    { name: "Comprehension Amidst the Flowers", image: "1/10/Constellation_Comprehension_Amidst_the_Flowers" },
    { name: "Karma Adjudged From the Leaden Fruit", image: "f/f5/Constellation_Karma_Adjudged_From_the_Leaden_Fruit" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `For every point of Elemental Mastery Tighnari possesses, his {Charged Attack DMG}#[gr] and Fashioner's
      Tanglevine Shaft {[EB] DMG}#[gr] are increased by {0.08%}#[b,gr]. Max {80%}#[r].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ desc, totalAttr, attPattBonus, tracker }) => {
        const buffValue = Math.min(totalAttr.em, 1000) * 0.08;
        applyModifier(desc, attPattBonus, ["CA.pct_", "EB.pct_"], buffValue, tracker);
      },
    },
    {
      src: EModSrc.C1,
      description: `Tighnari's {Charged Attack CRIT Rate}#[gr] is increased by {15%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `After Tighnari fires a Wreath Arrow, his {Elemental Mastery}#[gr] is increased by {50}#[b,gr]
      for 4s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When there are opponents within Vijnana-Phala Mine [ES] field, Tighnari gains {20%}#[b,gr]
      {Dendro DMG Bonus}#[gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "dendro", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Fashioner's Tanglevine Shaft [EB] is unleashed, all party members gain {60}#[b,gr]
      {Elemental Mastery}#[gr] for 8s. If this skill triggers a Burning, Bloom, Aggravate, or Spread reaction, their
      {Elemental Mastery}#[gr] will be further increased by {60}#[b,gr].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Trigger reactions",
          type: "check",
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 60 + (inputs[0] === 1 ? 60 : 0), tracker);
      },
    },
  ],
};

export default Tighnari as AppCharacter;
