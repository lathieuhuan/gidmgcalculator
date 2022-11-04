import type { DataCharacter, GetTalentBuffFn } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { charModIsInUse, checkAscs, checkCons, talentBuff } from "../utils";

const getA1TalentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls }) => {
  const isActivated = charModIsInUse(Ganyu.buffs!, char, selfBuffCtrls, 0);
  return talentBuff([isActivated, "cRate", [true, 1], 20]);
};

const Ganyu: DataCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "0/0a/Character_Ganyu_Thumb",
  sideIcon: "e/e1/Character_Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weapon: "bow",
  stats: [
    [763, 26, 49],
    [1978, 68, 127],
    [2632, 90, 169],
    [3939, 135, 253],
    [4403, 151, 283],
    [5066, 173, 326],
    [5686, 194, 366],
    [6355, 217, 409],
    [6820, 233, 439],
    [7495, 256, 482],
    [7960, 272, 512],
    [8643, 295, 556],
    [9108, 311, 586],
    [9797, 335, 630],
  ],
  bonusStat: { type: "cDmg", value: 9.6 },
  NAsConfig: {
    name: "Liutian Archery",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 31.73 },
        { name: "2-Hit", multBase: 35.6 },
        { name: "3-Hit", multBase: 45.49 },
        { name: "4-Hit", multBase: 45.49 },
        { name: "5-Hit", multBase: 48.25 },
        { name: "6-Hit", multBase: 57.62 },
      ],
    },
    CA: {
      stats: [
        { name: "Aimed Shot", multBase: 43.86 },
        {
          name: "Aimed Shot Charged Level 1",
          dmgTypes: ["CA", "cryo"],
          multBase: 124,
          multType: 2,
        },
        {
          name: "Frostflake Arrow",
          dmgTypes: ["CA", "cryo"],
          multBase: 128,
          multType: 2,
          getTalentBuff: getA1TalentBuff,
        },
        {
          name: "Frostflake Arrow Bloom",
          dmgTypes: ["CA", "cryo"],
          multBase: 217.6,
          multType: 2,
          getTalentBuff: getA1TalentBuff,
        },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Trail of the Qilin",
      image: "d/d1/Talent_Trail_of_the_Qilin",
      xtraLvAtCons: 5,
      stats: [
        { name: "Inherited HP", baseStatType: "hp", multBase: 120, multType: 2 },
        { name: "Skill DMG", multBase: 132 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "6s" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Celestial Shower",
      image: "4/47/Talent_Celestial_Shower",
      xtraLvAtCons: 3,
      stats: [{ name: "Ice shard DMG", multBase: 70.27 }],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Undivided Heart", image: "a/a3/Talent_Undivided_Heart" },
    {
      name: "Harmony between Heaven and Earth",
      image: "d/d4/Talent_Harmony_between_Heaven_and_Earth",
    },
    { name: "Preserved for the Hunt", image: "c/cf/Talent_Preserved_for_the_Hunt" },
  ],
  constellation: [
    { name: "Dew-Drinker", image: "7/74/Constellation_Dew-Drinker" },
    { name: "The Auspicious", image: "d/d9/Constellation_The_Auspicious" },
    { name: "Cloud-Strider", image: "b/bf/Constellation_Cloud-Strider" },
    { name: "Westward Sojourn", image: "e/e0/Constellation_Westward_Sojourn" },
    { name: "The Merciful", image: "5/57/Constellation_The_Merciful" },
    { name: "The Clement", image: "b/b5/Constellation_The_Clement" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: () => (
        <>
          After firing a Frostflake Arrow, the <Green>CRIT Rate</Green> of subsequent{" "}
          <Green>Frostflake Arrows</Green> and their resulting <Green>bloom effects</Green> is
          increased by <Green b>20%</Green> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
    },
    {
      index: 1,
      src: EModSrc.A4,
      desc: () => (
        <>
          Celestial Shower grants a <Green b>20%</Green> <Green>Cryo DMG Bonus</Green> to active
          members in the AoE.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.ACTIVE_UNIT,
      applyBuff: makeModApplier("totalAttr", "cryo", 20),
    },
    {
      index: 2,
      src: EModSrc.C4,
      desc: () => (
        <>
          Opponents within Celestial Shower take increased DMG. This effect strengthens over time.
          Increased <Green>DMG</Green> taken begins at <Green b>5%</Green> and increases by{" "}
          <Green b>5%</Green> every 3s, up to a maximum of <Green b>25%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      inputConfig: {
        selfLabels: ["Stacks"],
        labels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [5],
      },
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct", 5 * (inputs?.[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      desc: () => (
        <>
          Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease opponents'{" "}
          <Green>Cryo RES</Green> by <Green b>15%</Green> for 6s upon hit.
        </>
      ),
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "cryo", 15),
    },
  ],
};

export default Ganyu;
