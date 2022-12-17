import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Calculators/utils";
import { checkCons } from "../utils";

const Qiqi: DataCharacter = {
  code: 7,
  name: "Qiqi",
  icon: "d/d5/Character_Qiqi_Thumb",
  sideIcon: "1/1c/Character_Qiqi_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "sword",
  stats: [
    [963, 22, 72],
    [2498, 58, 186],
    [3323, 77, 248],
    [4973, 115, 371],
    [5559, 129, 415],
    [6396, 148, 477],
    [7178, 167, 535],
    [8023, 186, 598],
    [8610, 200, 642],
    [9463, 220, 706],
    [10050, 223, 749],
    [10912, 253, 814],
    [11499, 267, 857],
    [12368, 287, 922],
  ],
  bonusStat: { type: "healBn", value: 5.5 },
  NAsConfig: {
    name: "Ancient Sword Art",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 37.75 },
        { name: "2-Hit", multBase: 38.87 },
        { name: "3-Hit (1/2)", multBase: 24.17 },
        { name: "4-Hit (1/2)", multBase: 24.68 },
        { name: "5-Hit", multBase: 63.04 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack (1/2)", multBase: 64.33 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Adeptus Art: Herald of Frost",
      image: "7/7f/Talent_Adeptus_Art_Herald_of_Frost",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multBase: 96 },
        { name: "Herald DMG", multBase: 36 },
        {
          name: "Regen. on Hit",
          notAttack: "healing",
          baseStatType: "atk",
          multBase: 10.56,
          multType: 2,
          flat: { base: 67, type: 3 },
        },
        {
          name: "Continuous Regen.",
          notAttack: "healing",
          baseStatType: "atk",
          multBase: 69.6,
          multType: 2,
          flat: { base: 451, type: 3 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "30s" },
      // ],
    },
    EB: {
      name: "Adeptus Art: Preserver of Fortune",
      image: "7/7c/Talent_Adeptus_Art_Preserver_of_Fortune",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multBase: 284.8 },
        {
          name: "Healing",
          notAttack: "healing",
          baseStatType: "atk",
          multBase: 90,
          multType: 2,
          flat: { base: 577, type: 3 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Life-Prolonging Methods", image: "b/b5/Talent_Life-Prolonging_Methods" },
    { name: "A Glimpse into Arcanum", image: "f/f8/Talent_A_Glimpse_Into_Arcanum" },
    { name: "Former Life Memories", image: "5/5e/Talent_Former_Life_Memories" },
  ],
  constellation: [
    { name: "Ascetics of Frost", image: "1/10/Constellation_Ascetics_of_Frost" },
    { name: "Frozen to the Bone", image: "b/ba/Constellation_Frozen_to_the_Bone" },
    { name: "Ascendant Praise", image: "c/c6/Constellation_Ascendant_Praise" },
    { name: "Divine Suppression", image: "6/61/Constellation_Divine_Suppression" },
    { name: "Crimson Lotus Bloom", image: "e/ec/Constellation_Crimson_Lotus_Bloom" },
    { name: "Rite of Resurrection", image: "b/b9/Constellation_Rite_of_Resurrection" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          Qiqi's <Green>Normal and Charged Attack DMG</Green> against opponents affected by Cryo is
          increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", ["NA.pct", "CA.pct"], 15),
    },
  ],
};

export default Qiqi;
