import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Xingqiu: DefaultAppCharacter = {
  code: 17,
  name: "Xingqiu",
  icon: "d/d4/Xingqiu_Icon",
  sideIcon: "f/fc/Xingqiu_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 46.61 },
      { name: "2-Hit", multFactors: 47.64 },
      { name: "3-Hit (1/2)", multFactors: 28.55 },
      { name: "4-Hit", multFactors: 55.99 },
      { name: "5-Hit (1/2)", multFactors: 35.86 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [47.3, 56.16],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: [168, 191.2],
      },
    ],
    EB: [
      {
        name: "Sword Rain",
        multFactors: 54.27,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Guhua Style",
    },
    ES: {
      name: "Guhua Sword: Fatal Rainscreen",
      image: "5/5d/Talent_Guhua_Sword_Fatal_Rainscreen",
    },
    EB: {
      name: "Guhua Sword: Raincutter",
      image: "2/23/Talent_Guhua_Sword_Raincutter",
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
    { name: "Hence, Call Them My Own Verses", image: "9/91/Constellation_Hence%2C_Call_Them_My_Own_Verses" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      description: `Xingqiu gains a {20%}#[b,gr] {Hydro DMG Bonus}#[gr].`,
      applyBuff: makeModApplier("totalAttr", "hydro", 20),
    },
  ],
  buffs: [
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `During Guhua Sword: Raincutter [EB], Guhua Sword: Fatal Rainscreen {[ES] DMG}#[gr] is increased by
      {50%}#[b,gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "ES.multPlus", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `Decreases the {Hydro RES}#[gr] of opponents hit by sword rain attacks by {15%}#[b,gr] for 4s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 15),
    },
  ],
};

export default Xingqiu as AppCharacter;
