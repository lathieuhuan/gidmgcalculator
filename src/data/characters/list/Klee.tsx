import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Klee: DefaultAppCharacter = {
  code: 23,
  name: "Klee",
  icon: "9/9c/Klee_Icon",
  sideIcon: "b/ba/Klee_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [801, 24, 48],
    [2077, 63, 124],
    [2764, 84, 165],
    [4126, 125, 247],
    [4623, 140, 276],
    [5318, 161, 318],
    [5970, 180, 357],
    [6673, 202, 399],
    [7161, 216, 428],
    [7870, 238, 470],
    [8358, 253, 500],
    [9076, 274, 542],
    [9563, 289, 572],
    [10287, 311, 615],
  ],
  bonusStat: {
    type: "pyro",
    value: 7.2,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 72.16 },
      { name: "2-Hit", multFactors: 62.4 },
      { name: "3-Hit", multFactors: 89.92 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 157.36,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "Jumpy Dumpty", multFactors: 95.2 },
      { name: "Mine DMG", multFactors: 32.8 },
    ],
    EB: [
      { name: "Sparks 'n' Splash", multFactors: 42.64 },
      { name: "Total Max DMG", notOfficial: true, multFactors: 852 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Kaboom!",
    },
    ES: {
      name: "Jumpy Dumpty",
      image: "3/33/Talent_Jumpy_Dumpty",
    },
    EB: {
      name: "Sparks 'n' Splash",
      image: "6/64/Talent_Sparks_%27n%27_Splash",
    },
  },
  passiveTalents: [
    { name: "Pounding Surprise", image: "9/97/Talent_Pounding_Surprise" },
    { name: "Sparkling Burst", image: "9/90/Talent_Sparkling_Burst" },
    { name: "All Of My Treasures!", image: "a/ad/Talent_All_Of_My_Treasures%21" },
  ],
  constellation: [
    { name: "Chained Reactions", image: "a/ac/Constellation_Chained_Reactions" },
    { name: "Explosive Frags", image: "e/e0/Constellation_Explosive_Frags" },
    { name: "Exquisite Compound", image: "6/6f/Constellation_Exquisite_Compound" },
    { name: "Sparkly Explosion", image: "3/3a/Constellation_Sparkly_Explosion" },
    { name: "Nova Burst", image: "a/a7/Constellation_Nova_Burst" },
    { name: "Blazing Delight", image: "b/bb/Constellation_Blazing_Delight" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `Explosive Spark increases the next {Charged Attack DMG}#[gr] by {50%}#[b,gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 50),
    },
    {
      index: 1,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `When Sparks 'n' Splash [EB] is used, all party members will gain a {10%}#[b,gr]
      {Pyro DMG Bonus}#[gr] for 25s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "pyro", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `On hit, Jumpy Dumpty's [ES] mines decreases opponents' {DEF}#[gr] by {23%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 23),
    },
  ],
};

export default Klee as AppCharacter;