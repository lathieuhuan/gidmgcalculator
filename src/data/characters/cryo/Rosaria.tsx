import type { DataCharacter } from "@Src/types";
import { Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/calculators/utils";
import { checkAscs, checkCons } from "../utils";

const Rosaria: DataCharacter = {
  code: 32,
  name: "Rosaria",
  icon: "f/f6/Character_Rosaria_Thumb",
  sideIcon: "0/08/Character_Rosaria_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weapon: "polearm",
  stats: [
    [1030, 20, 60],
    [2647, 52, 163],
    [3417, 67, 197],
    [5118, 100, 296],
    [5665, 111, 327],
    [6516, 127, 376],
    [7245, 141, 418],
    [8096, 158, 468],
    [8643, 169, 499],
    [9493, 185, 548],
    [10040, 196, 580],
    [10891, 213, 629],
    [11438, 223, 661],
    [12289, 240, 710],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Spear of the Church",
    caStamina: 25,
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 52.46 },
        { name: "2-Hit", baseMult: 51.6 },
        { name: "3-Hit (1/2)", baseMult: 31.82 },
        { name: "4-Hit", baseMult: 69.66 },
        { name: "5-Hit", baseMult: [41.62, 43] },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 136.74 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Ravaging Confession",
      image: "c/ce/Talent_Ravaging_Confession",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: [58.4, 136] }],
      // getExtraStats: () => [{ name: "CD", value: "6s" }],
    },
    EB: {
      name: "Rites of Termination",
      image: "2/26/Talent_Rites_of_Termination",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseMult: [104, 152] },
        { name: "Ice Lance DoT", baseMult: 132 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "8s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Regina Probationum", image: "e/e3/Talent_Regina_Probationum" },
    { name: "Shadow Samaritan", image: "5/53/Talent_Shadow_Samaritan" },
    { name: "Night Walk", image: "c/c8/Talent_Night_Walk" },
  ],
  constellation: [
    { name: "Unholy Revelation", image: "f/f9/Constellation_Unholy_Revelation" },
    { name: "Land Without Promise", image: "1/1d/Constellation_Land_Without_Promise" },
    { name: "The Wages of Sin", image: "3/31/Constellation_The_Wages_of_Sin" },
    { name: "Painful Grace", image: "5/57/Constellation_Painful_Grace" },
    { name: "Last Rites", image: "8/88/Constellation_Last_Rites" },
    { name: "Divine Retribution", image: "b/bd/Constellation_Divine_Retribution" },
  ],
  buffs: [
    {
      index: 0,
      src: EModifierSrc.A1,
      desc: () => (
        <>
          When Rosaria strikes an opponent from behind using Ravaging Confession, her{" "}
          <Green>CRIT Rate</Green> increased by <Green b>12%</Green> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "cRate", 12),
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: ({ inputs }) => (
        <>
          Casting Rites of Termination increases <Green>CRIT Rate</Green> of all nearby party
          members by <Green b>15%</Green> of Rosaria's <Green>CRIT Rate</Green> for 10s.{" "}
          <Red>CRIT Rate Bonus: {Math.round(+inputs![0] * 1.5) / 10}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.TEAMMATE,
      inputConfig: {
        labels: ["CRIT Rate"],
        renderTypes: ["text"],
        maxValues: [100],
        initialValues: [5],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = Math.round(+inputs![0] * 1.5) / 10;
        applyModifier(desc, totalAttr, "cRate", buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModifierSrc.C1,
      desc: () => (
        <>
          When Rosaria deals a CRIT Hit, her <Green>ATK SPD</Green> and{" "}
          <Green>Normal Attack DMG</Green> increases by <Green b>10%</Green> for 4s.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct", 10, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd", 10, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Rites of Termination's attack decreases opponents' <Green>Physical RES</Green> by{" "}
          <Green b>20%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resisReduct", "phys", 20),
    },
  ],
};

export default Rosaria;
