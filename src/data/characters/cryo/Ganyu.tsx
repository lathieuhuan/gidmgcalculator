import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Ganyu: DefaultAppCharacter = {
  code: 28,
  name: "Ganyu",
  icon: "7/79/Ganyu_Icon",
  sideIcon: "3/3a/Ganyu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: { type: "cDmg_", value: 9.6 },
  activeTalents: {
    NAs: {
      name: "Liutian Archery",
    },
    ES: {
      name: "Trail of the Qilin",
      image: "d/d1/Talent_Trail_of_the_Qilin",
    },
    EB: {
      name: "Celestial Shower",
      image: "4/47/Talent_Celestial_Shower",
    },
  },
  calcListConfig: {
    CA: {
      multScale: 2,
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 31.73 },
      { name: "2-Hit", multFactors: 35.6 },
      { name: "3-Hit", multFactors: 45.49 },
      { name: "4-Hit", multFactors: 45.49 },
      { name: "5-Hit", multFactors: 48.25 },
      { name: "6-Hit", multFactors: 57.62 },
    ],
    CA: [
      { name: "Aimed Shot", multFactors: { root: 43.86, scale: 7 } },
      {
        name: "Aimed Shot Charged Level 1",
        subAttPatt: "FCA",
        multFactors: 124,
      },
      {
        id: "CA.0",
        name: "Frostflake Arrow",
        subAttPatt: "FCA",
        multFactors: 128,
      },
      {
        id: "CA.1",
        name: "Frostflake Arrow Bloom",
        subAttPatt: "FCA",
        multFactors: 217.6,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Inherited HP",
        type: "other",
        multFactors: { root: 120, attributeType: "hp" },
      },
      { name: "Skill DMG", multFactors: 132 },
    ],
    EB: [{ name: "Ice shard DMG", multFactors: 70.27 }],
  },
  passiveTalents: [
    { name: "Undivided Heart", image: "a/a3/Talent_Undivided_Heart" },
    {
      name: "Harmony between Heaven and Earth",
      image: "d/d4/Talent_Harmony_between_Heaven_and_Earth",
    },
    {
      name: "Preserved for the Hunt",
      image: "c/cf/Talent_Preserved_for_the_Hunt",
    },
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
      affect: EModAffect.SELF,
      description: `After firing a Frostflake Arrow, the {CRIT Rate}#[gr] of subsequent {Frostflake Arrows}#[gr] and
      their resulting {bloom effects}#[gr] is increased by {20%}#[b,gr] for 5s.`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A1, ["CA.0", "CA.1"], "cRate_", 20));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Celestial Shower [EB] grants a {20%}#[b,gr] {Cryo DMG Bonus}#[gr] to active members in the AoE.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "cryo", 20),
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `Opponents within Celestial Shower [EB] take increased DMG which begins at {5%}#[b,gr] and increases
      by {5%}#[b,gr] every 3s. Maximum {25%}#[r].`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C1,
      description: `Charge Level 2 Frostflake Arrows or Frostflake Arrow Blooms decrease opponents' {Cryo RES}#[gr] by
      {15%}#[b,gr] for 6s upon hit.`,
      isGranted: checkCons[1],
      applyDebuff: makeModApplier("resistReduct", "cryo", 15),
    },
  ],
};

export default Ganyu as AppCharacter;
