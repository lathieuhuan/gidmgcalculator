import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { CHARACTER_IMAGES } from "@Data/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Klee: DataCharacter = {
  code: 23,
  name: "Klee",
  // icon: "c/c3/Character_Klee_Thumb",
  icon: CHARACTER_IMAGES.Klee,
  sideIcon: "c/c2/Character_Klee_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "catalyst",
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
  bonusStat: { type: "pyro", value: 7.2 },
  NAsConfig: {
    name: "Kaboom!",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 72.16 },
        { name: "2-Hit", multFactors: 62.4 },
        { name: "3-Hit", multFactors: 89.92 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 157.36 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Jumpy Dumpty",
      image: "3/33/Talent_Jumpy_Dumpty",
      xtraLvAtCons: 3,
      stats: [
        { name: "Jumpy Dumpty", multFactors: 95.2 },
        { name: "Mine DMG", multFactors: 32.8 },
      ],
      // getExtraStats: () => [
      //   { name: "Mine Durtion", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
    },
    EB: {
      name: "Sparks 'n' Splash",
      image: "6/64/Talent_Sparks_%27n%27_Splash",
      xtraLvAtCons: 5,
      stats: [
        { name: "Sparks 'n' Splash", multFactors: 42.64 },
        { name: "Total Max DMG", isNotOfficial: true, multFactors: 852 },
      ],
      // getExtraStats: () => [
      //   { name: "Durtion", value: "10s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
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
      desc: () => (
        <>
          Explosive Spark is consumed by the next <Green>Charged Attacks</Green>, which costs no
          Stamina and deals <Green b>50%</Green> increased <Green>DMG</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", "CA.pct", 50),
    },
    {
      index: 1,
      src: EModSrc.C6,
      desc: () => (
        <>
          When Sparks 'n' Splash [EB] is used, all party members will gain a <Green b>10%</Green>{" "}
          <Green>Pyro DMG Bonus</Green> for 25s.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "pyro", 10),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          On hit, Jumpy Dumpty's [ES] mines decreases opponents' <Green>DEF</Green> by{" "}
          <Green b>23%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "def", 23),
    },
  ],
};

export default Klee;
