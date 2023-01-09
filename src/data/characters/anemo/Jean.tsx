import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const Jean: DataCharacter = {
  code: 2,
  name: "Jean",
  icon: "8/89/Character_Jean_Thumb",
  sideIcon: "9/9e/Character_Jean_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "anemo",
  weaponType: "sword",
  stats: [
    [1144, 19, 60],
    [2967, 48, 155],
    [3948, 64, 206],
    [5908, 96, 309],
    [6605, 108, 345],
    [7599, 124, 397],
    [8528, 139, 446],
    [9533, 155, 499],
    [10230, 166, 535],
    [11243, 183, 588],
    [11940, 194, 624],
    [12965, 211, 67],
    [13662, 222, 715],
    [14695, 239, 769],
  ],
  bonusStat: { type: "healBn", value: 5.5 },
  NAsConfig: {
    name: "Favonius Bladework",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 48.33 },
        { name: "2-Hit", multFactors: 45.58 },
        { name: "3-Hit", multFactors: 60.29 },
        { name: "4-Hit", multFactors: 65.88 },
        { name: "5-Hit", multFactors: 79.21 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 162.02 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Gale Blade",
      image: "2/24/Talent_Gale_Blade",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multFactors: 292 }],
      // getExtraStats: () => [
      //   { name: "Stamina Consumption", value: "20 per Second" },
      //   { name: "Max Duration", value: "5s" },
      //   { name: "CD", value: "6s" },
      // ],
    },
    EB: {
      name: "Dandelion Breeze",
      image: "e/ef/Talent_Dandelion_Breeze",
      xtraLvAtCons: 3,
      stats: [
        { name: "Burst DMG", multFactors: 424.8 },
        { name: "Entering/Exiting DMG", multFactors: 78.4 },
        {
          name: "Activation Healing",
          notAttack: "healing",
          multFactors: { root: 251.2, attributeType: "atk" },
          flatFactor: 1540,
        },
        {
          name: "Continuous Regen.",
          notAttack: "healing",
          multFactors: { root: 25.12, attributeType: "atk" },
          flatFactor: 154,
        },
      ],
      // getExtraStats: () => [{ name: "CD", value: "20s" }],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Wind Companion", image: "7/79/Talent_Wind_Companion" },
    { name: "Let the Wind Lead", image: "1/1d/Talent_Let_the_Wind_Lead" },
    { name: "Guiding Breeze", image: "c/cc/Talent_Guiding_Breeze" },
  ],
  constellation: [
    { name: "Spiraling Tempest", image: "a/ad/Constellation_Spiraling_Tempest" },
    { name: "People's Aegis", image: "4/49/Constellation_People%27s_Aegis" },
    {
      name: "When the West Wind Arises",
      image: "a/a7/Constellation_When_the_West_Wind_Arises",
    },
    { name: "Lands of Dandelion", image: "b/b1/Constellation_Lands_of_Dandelion" },
    { name: "Outbursting Gust", image: "a/a0/Constellation_Outbursting_Gust" },
    {
      name: "Lion's Fang, Fair Protector of Mondstadt",
      image: "e/e4/Constellation_Lion%27s_Fang%2C_Fair_Protector_of_Mondstadt",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      desc: () => (
        <>
          Increases the pulling speed of Gale Blade [ES] after holding for more than 1s, and
          increases the <Green>DMG</Green> dealt by <Green b>40%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", "ES.pct", 40),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C2,
      desc: () => (
        <>
          When Jean picks up an Elemental Orb/Particle, all party members have their{" "}
          <Green>Movement SPD</Green> and <Green>ATK SPD</Green> increased by <Green b>15%</Green>{" "}
          for 15s.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "naAtkSpd", 15),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Within the field of Dandelion Breeze [EB], all opponents have their{" "}
          <Green>Anemo RES</Green> decreased by <Green b>40%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "anemo", 40),
    },
  ],
};

export default Jean;
