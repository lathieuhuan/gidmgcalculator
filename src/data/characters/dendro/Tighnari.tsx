import type { DataCharacter } from "@Src/types";
import { Green, Rose } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const Tighnari: DataCharacter = {
  code: 54,
  name: "Tighnari",
  icon: "9/91/Character_Tighnari_Thumb",
  sideIcon: "a/a4/Character_Tighnari_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "dendro",
  weapon: "bow",
  stats: [
    [845, 21, 49],
    [2170, 54, 126],
    [2894, 71, 168],
    [4289, 106, 249],
    [4803, 119, 279],
    [5501, 136, 320],
    [6187, 153, 359],
    [6885, 170, 400],
    [7399, 183, 430],
    [8096, 200, 470],
    [8611, 213, 500],
    [9308, 230, 541],
    [9823, 243, 571],
    [10520, 260, 611],
  ],
  bonusStat: { type: "dendro", value: 7.2 },
  NAsConfig: {
    name: "Khanda Barrier-Buster",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 44.63 },
        { name: "2-Hit", multBase: 41.97 },
        { name: "3-Hit (1/2)", multBase: 26.45 },
        { name: "4-Hit", multBase: 68.63 },
      ],
    },
    CA: {
      stats: [
        { name: "Aimed Shot", multBase: 43.86 },
        { name: "Level 1 Aimed Shot", dmgTypes: ["CA", "dendro"], multBase: 124, multType: 2 },
        { name: "Wreath Arrow DMG", dmgTypes: ["CA", "dendro"], multBase: 87.2, multType: 2 },
        { name: "Clusterbloom Arrow DMG", dmgTypes: ["CA", "dendro"], multBase: 38.6, multType: 2 },
        {
          name: "Additional Clusterbloom Arrow DMG (C6)",
          isStatic: true,
          dmgTypes: ["CA", "dendro"],
          multBase: 150,
        },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Vijnana-Phala Mine",
      image: "f/f9/Talent_Vijnana-Phala_Mine",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multBase: 149.6 }],
      // getExtraStats: () => [
      //   { name: "Vijnana-Phala Field Duration", value: "8s" },
      //   { name: "Vijnana Penetrator Duration", value: "12s" },
      //   { name: "CD", value: "12s" },
      // ],
    },
    EB: {
      name: "Fashioner's Tanglevine Shaft",
      image: "3/30/Talent_Fashioner%27s_Tanglevine_Shaft",
      xtraLvAtCons: 3,
      stats: [
        { name: "Tanglevine Shaft DMG", multBase: 55.62 },
        { name: "Secondary Tanglevine Shaft DMG", multBase: 67.98 },
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
      desc: () => (
        <>
          After Tighnari fires a Wreath Arrow, his <Green>Elemental Mastery</Green> is increased by{" "}
          <Green b>50</Green> for 4s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "em", 50),
    },
    {
      index: 3,
      src: EModSrc.C2,
      desc: () => (
        <>
          When there are opponents within Vijnana-Phala Mine [ES] field, Tighnari gains{" "}
          <Green b>20%</Green> <Green>Dendro DMG Bonus</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "dendro", 20),
    },
    {
      index: 4,
      src: EModSrc.C4,
      desc: () => (
        <>
          When Fashioner's Tanglevine Shaft [EB] is unleashed, all party members gain{" "}
          <Green b>60</Green> <Green>Elemental Mastery</Green> for 8s. If this skill triggers a
          Burning, Bloom, Aggravate, or Spread reaction, their <Green>Elemental Mastery</Green> will
          be further increased by <Green b>60</Green>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      inputConfigs: [
        {
          label: "Trigger reactions",
          type: "check",
        },
      ],
      applyBuff: ({ desc, totalAttr, inputs, tracker }) => {
        applyModifier(desc, totalAttr, "em", 60 + (inputs?.[0] === 1 ? 60 : 0), tracker);
      },
    },
  ],
};

export default Tighnari;
