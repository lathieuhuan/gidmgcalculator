import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const Xingqiu: DataCharacter = {
  code: 17,
  name: "Xingqiu",
  icon: "4/4a/Character_Xingqiu_Thumb",
  sideIcon: "4/4e/Character_Xingqiu_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "hydro",
  weapon: "sword",
  stats: [
    [857, 17, 64],
    [2202, 43, 163],
    [2842, 56, 211],
    [4257, 84, 316],
    [4712, 93, 349],
    [5420, 107, 402],
    [6027, 119, 447],
    [6735, 133, 499],
    [7190, 142, 533],
    [7897, 156, 585],
    [8352, 165, 619],
    [9060, 179, 671],
    [9514, 188, 705],
    [10222, 202, 758],
  ],
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Guhua Style",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 46.61 },
        { name: "2-Hit", multBase: 47.64 },
        { name: "3-Hit (1/2)", multBase: 28.55 },
        { name: "4-Hit", multBase: 55.99 },
        { name: "5-Hit (1/2)", multBase: 35.86 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: [47.3, 56.16] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Guhua Sword: Fatal Rainscreen",
      image: "5/5d/Talent_Guhua_Sword_Fatal_Rainscreen",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multBase: [168, 191.2] }],
      // getExtraStats: (lv) => [
      //   { name: "DMG Redution Ratio", value: Math.min(19 + lv, 29) + "%" },
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "21s" },
      // ],
    },
    EB: {
      name: "Guhua Sword: Raincutter",
      image: "2/23/Talent_Guhua_Sword_Raincutter",
      xtraLvAtCons: 3,
      stats: [{ name: "Sword Rain", multBase: 54.27 }],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Hydropathic", image: "f/f6/Talent_Hydropathic" },
    { name: "Blades Amidst Raindrops", image: "9/90/Talent_Blades_Amidst_Raindrops" },
    { name: "Flash of Genius", image: "b/bb/Talent_Flash_of_Genius" },
  ],
  constellation: [
    { name: "The Scent Remained", image: "6/6c/Constellation_The_Scent_Remained" },
    { name: "Rainbow Upon the Azure Sky", image: "a/a5/Constellation_Rainbow_Upon_the_Azure_Sky" },
    { name: "Weaver of Verses", image: "3/3e/Constellation_Weaver_of_Verses" },
    { name: "Evilsoother", image: "e/e6/Constellation_Evilsoother" },
    { name: "Embrace of Rain", image: "9/9b/Constellation_Embrace_of_Rain" },
    {
      name: "Hence, Call Them My Own Verses",
      image: "9/91/Constellation_Hence%2C_Call_Them_My_Own_Verses",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      desc: () => (
        <>
          Xingqiu gains a <Green b>20%</Green> <Green>Hydro DMG Bonus</Green>.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "hydro", 20),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C4,
      desc: () => (
        <>
          Throughout the duration of Guhua Sword: Raincutter, the <Green>DMG</Green> dealt by{" "}
          <Green>Guhua Sword: Fatal Rainscreen</Green> is increased by <Green b>50%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", "ES.specialMult", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      desc: () => (
        <>
          Decreases the <Green>Hydro RES</Green> of opponents hit by sword rain attacks by{" "}
          <Green b>15%</Green> for 4s.
        </>
      ),
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 15),
    },
  ],
};

export default Xingqiu;
