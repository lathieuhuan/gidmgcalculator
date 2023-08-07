import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Rosaria: DefaultAppCharacter = {
  code: 32,
  name: "Rosaria",
  icon: "3/35/Rosaria_Icon",
  sideIcon: "0/0e/Rosaria_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
  activeTalents: {
    NAs: {
      name: "Spear of the Church",
    },
    ES: {
      name: "Ravaging Confession",
      image: "c/ce/Talent_Ravaging_Confession",
    },
    EB: {
      name: "Rites of Termination",
      image: "2/26/Talent_Rites_of_Termination",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 52.46 },
      { name: "2-Hit", multFactors: 51.6 },
      { name: "3-Hit (1/2)", multFactors: 31.82 },
      { name: "4-Hit", multFactors: 69.66 },
      { name: "5-Hit", multFactors: [41.62, 43] },
    ],
    CA: [{ name: "Charged Attack", multFactors: 136.74 }],
    PA: MEDIUM_PAs,
    ES: [{ name: "Skill DMG", multFactors: [58.4, 136] }],
    EB: [
      { name: "Skill DMG", multFactors: [104, 152] },
      { name: "Ice Lance DoT", multFactors: 132 },
    ],
  },
  passiveTalents: [
    { name: "Regina Probationum", image: "e/e3/Talent_Regina_Probationum" },
    { name: "Shadow Samaritan", image: "5/53/Talent_Shadow_Samaritan" },
    { name: "Night Walk", image: "c/c8/Talent_Night_Walk" },
  ],
  constellation: [
    {
      name: "Unholy Revelation",
      image: "f/f9/Constellation_Unholy_Revelation",
    },
    {
      name: "Land Without Promise",
      image: "1/1d/Constellation_Land_Without_Promise",
    },
    { name: "The Wages of Sin", image: "3/31/Constellation_The_Wages_of_Sin" },
    { name: "Painful Grace", image: "5/57/Constellation_Painful_Grace" },
    { name: "Last Rites", image: "8/88/Constellation_Last_Rites" },
    {
      name: "Divine Retribution",
      image: "b/bd/Constellation_Divine_Retribution",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `When Rosaria strikes an opponent from behind using Ravaging Confession [ES], her {CRIT Rate}#[gr]
      increased by {12%}#[b,gr] for 5s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `Casting Rites of Termination [EB] increases {CRIT Rate}#[gr] of all nearby party members (excluding
      Rosaria) by {15%}#[b,gr] of Rosaria's {CRIT Rate}#[gr] for 10s. Maximum {15%}#[r].`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          label: "CRIT Rate",
          type: "text",
          max: 100,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = Math.round((inputs[0] || 0) * 15) / 100;
        applyModifier(desc, totalAttr, "cRate_", buffValue, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `When Rosaria deals a CRIT Hit, her {Normal Attack Speed and DMG}#[gr] increases by {10%}#[b,gr]
      for 4s.`,
      isGranted: checkCons[1],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "NA.pct_", 10, tracker);
        applyModifier(desc, totalAttr, "naAtkSpd_", 10, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      description: `Rites of Termination's [EB] attack decreases opponents' {Physical RES}#[gr] by {20%}#[b,gr] for 10s.`,
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "phys", 20),
    },
  ],
};

export default Rosaria as AppCharacter;
