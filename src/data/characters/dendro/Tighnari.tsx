import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { CHARACTER_IMAGES } from "@Data/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Tighnari: DataCharacter = {
  code: 54,
  name: "Tighnari",
  // icon: "9/91/Character_Tighnari_Thumb",
  icon: CHARACTER_IMAGES.Tighnari,
  sideIcon: "a/a4/Character_Tighnari_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weaponType: "bow",
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
  bonusStat: { type: "dendro", value: 7.2 },
  NAsConfig: {
    name: "Khanda Barrier-Buster",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 44.63 },
        { name: "2-Hit", multFactors: 41.97 },
        { name: "3-Hit (1/2)", multFactors: 26.45 },
        { name: "4-Hit", multFactors: 68.63 },
      ],
    },
    CA: {
      stats: [
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
      multScale: 2,
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Vijnana-Phala Mine",
      image: "f/f9/Talent_Vijnana-Phala_Mine",
      stats: [{ name: "Skill DMG", multFactors: 149.6 }],
      // getExtraStats: () => [
      //   { name: "Vijnana-Phala Field Duration", value: "8s" },
      //   { name: "Vijnana Penetrator Duration", value: "12s" },
      //   { name: "CD", value: "12s" },
      // ],
    },
    EB: {
      name: "Fashioner's Tanglevine Shaft",
      image: "3/30/Talent_Fashioner%27s_Tanglevine_Shaft",
      stats: [
        { name: "Tanglevine Shaft DMG", multFactors: 55.62 },
        { name: "Secondary Tanglevine Shaft DMG", multFactors: 67.98 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Keen Sight", image: "7/77/Talent_Keen_Sight" },
    { name: "Scholarly Blade", image: "e/e6/Talent_Scholarly_Blade" },
    { name: "Encyclopedic Knowledge", image: "e/ee/Talent_Encyclopedic_Knowledge" },
  ],
  constellation: [
    {
      name: "Beginnings Determined at the Roots",
      image: "2/2e/Constellation_Beginnings_Determined_at_the_Roots",
    },
    {
      name: "Origins Known From the Stem",
      image: "3/30/Constellation_Origins_Known_From_the_Stem",
    },
    {
      name: "Fortunes Read Amongst the Branches",
      image: "3/3a/Constellation_Fortunes_Read_Amongst_the_Branches",
    },
    {
      name: "Withering Glimpsed in the Leaves",
      image: "8/8b/Constellation_Withering_Glimpsed_in_the_Leaves",
    },
    {
      name: "Comprehension Amidst the Flowers",
      image: "1/10/Constellation_Comprehension_Amidst_the_Flowers",
    },
    {
      name: "Karma Adjudged From the Leaden Fruit",
      image: "f/f5/Constellation_Karma_Adjudged_From_the_Leaden_Fruit",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          For every point of Elemental Mastery Tighnari possesses, his{" "}
          <Green>Charged Attack DMG</Green> and Fashioner's Tanglevine Shaft <Green>[EB] DMG</Green>{" "}
          are increased by <Green b>0.08%</Green>. Max <Rose>80%</Rose>.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ desc, totalAttr, attPattBonus, tracker }) => {
        const buffValue = Math.min(totalAttr.em, 1000) * 0.08;
        applyModifier(desc, attPattBonus, ["CA.pct", "EB.pct"], buffValue, tracker);
      },
    },
    {
      src: EModSrc.C1,
      desc: () => (
        <>
          Tighnari's <Green>Charged Attack CRIT Rate</Green> is increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate", 15),
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After Tighnari fires a Wreath Arrow, his <Green>Elemental Mastery</Green> is increased by{" "}
          <Green b>50</Green> for 4s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When there are opponents within Vijnana-Phala Mine [ES] field, Tighnari gains{" "}
          <Green b>20%</Green> <Green>Dendro DMG Bonus</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "dendro", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          When Fashioner's Tanglevine Shaft [EB] is unleashed, all party members gain{" "}
          <Green b>60</Green> <Green>Elemental Mastery</Green> for 8s. If this skill triggers a
          Burning, Bloom, Aggravate, or Spread reaction, their <Green>Elemental Mastery</Green> will
          be further increased by <Green b>60</Green>.
        </>
      ),
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

export default Tighnari;
