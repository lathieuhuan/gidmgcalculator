import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const Qiqi: DataCharacter = {
  code: 7,
  name: "Qiqi",
  icon: "b/b3/Qiqi_Icon",
  sideIcon: "e/ef/Qiqi_Side_Icon",
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
  bonusStat: { type: "healB_", value: 5.5 },
  NAsConfig: {
    name: "Ancient Sword Art",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 37.75 },
        { name: "2-Hit", multFactors: 38.87 },
        { name: "3-Hit (1/2)", multFactors: 24.17 },
        { name: "4-Hit (1/2)", multFactors: 24.68 },
        { name: "5-Hit", multFactors: 63.04 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack (1/2)", multFactors: 64.33 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Adeptus Art: Herald of Frost",
      image: "7/7f/Talent_Adeptus_Art_Herald_of_Frost",
      stats: [
        { name: "Skill DMG", multFactors: 96 },
        { name: "Herald DMG", multFactors: 36 },
        {
          name: "Regen. on Hit",
          notAttack: "healing",
          multFactors: { root: 10.56, attributeType: "atk" },
          flatFactor: 67,
        },
        {
          name: "Continuous Regen.",
          notAttack: "healing",
          multFactors: { root: 69.6, attributeType: "atk" },
          flatFactor: 451,
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
      stats: [
        { name: "Skill DMG", multFactors: 284.8 },
        {
          name: "Healing",
          notAttack: "healing",
          multFactors: 90,
          flatFactor: 577,
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
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Qiqi's <Green>Normal and Charged Attack DMG</Green> against opponents affected by Cryo is increased by{" "}
          <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 15),
    },
  ],
};

export default Qiqi;
