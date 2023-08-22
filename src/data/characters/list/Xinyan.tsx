import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Xinyan: DefaultAppCharacter = {
  code: 27,
  name: "Xinyan",
  icon: "2/24/Xinyan_Icon",
  sideIcon: "e/ec/Xinyan_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [939, 21, 67],
    [2413, 54, 172],
    [3114, 69, 222],
    [4665, 103, 333],
    [5163, 115, 368],
    [5939, 132, 423],
    [6604, 147, 471],
    [7379, 164, 526],
    [7878, 175, 562],
    [8653, 192, 617],
    [9151, 203, 652],
    [9927, 220, 708],
    [10425, 231, 743],
    [11201, 249, 799],
  ],
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 76.54 },
      { name: "2-Hit", multFactors: 73.96 },
      { name: "3-Hit", multFactors: 95.46 },
      { name: "4-Hit", multFactors: 115.84 },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 62.55 },
      { name: "Charged Attack Final", multFactors: 113.09 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Swing DMG", multFactors: 169.6 },
      { name: "DoT", multFactors: 33.6 },
      {
        name: "Shield Level 1 DMG Absorption",
        type: "shield",
        multFactors: { root: 104.04, attributeType: "def" },
        flatFactor: 501,
      },
      {
        name: "Shield Level 2 DMG Absorption",
        type: "shield",
        multFactors: { root: 122.4, attributeType: "def" },
        flatFactor: 589,
      },
      {
        name: "Shield Level 3 DMG Absorption",
        type: "shield",
        multFactors: { root: 144, attributeType: "def" },
        flatFactor: 693,
      },
    ],
    EB: [
      { id: "EB.0", name: "Physical Burst DMG", attElmt: "phys", multFactors: 340.8 },
      { name: "Pyro DoT", multFactors: 40 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Dance on Fire",
    },
    ES: {
      name: "Sweeping Fervor",
      image: "8/85/Talent_Sweeping_Fervor",
    },
    EB: {
      name: "Riff Revolution",
      image: "0/06/Talent_Riff_Revolution",
    },
  },
  passiveTalents: [
    {
      name: `"The Show Goes On, Even Without an Audience..."`,
      image: `b/b0/Talent_"The_Show_Goes_On%2C_Even_Without_An_Audience..."`,
    },
    { name: `"...Now That's Rock 'N' Roll!"`, image: "e/e5/Talent_%22...Now_That%27s_Rock_%27N%27_Roll%21%22" },
    { name: "A Rad Recipe", image: "3/39/Talent_A_Rad_Recipe" },
  ],
  constellation: [
    { name: "Fatal Acceleration", image: "7/7e/Constellation_Fatal_Acceleration" },
    { name: "Impromptu Opening", image: "4/45/Constellation_Impromptu_Opening" },
    { name: "Double-Stop", image: "e/e3/Constellation_Double-Stop" },
    { name: "Wildfire Rhythm", image: "6/6f/Constellation_Wildfire_Rhythm" },
    { name: "Screamin' for an Encore", image: "1/18/Constellation_Screamin%27_for_an_Encore" },
    {
      name: "Rockin' in a Flaming World",
      image: "4/40/Constellation_Rockin%27_in_a_Flaming_World",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Riff Revolution's {[EB] Physical CRIT Rate}#[gr] is increased by {100%}#[b,gr].`,
      isGranted: checkCons[2],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.C2, "EB.0", "cRate_", 100));
      },
    },
    {
      src: EModSrc.C6,
      description: `Xinyan's {Charged Attacks DMG}#[gr] is increased by {50%}#[b,gr] of her {DEF}#[gr].`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.flat", Math.round(totalAttr.def / 2), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Characters shielded by Sweeping Fervor [ES] deal {15%}#[b,gr] increased {Physical DMG}#[gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "phys", 15),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Upon scoring a CRIT Hit, increases {ATK SPD}#[gr] of Xinyan's {Normal and Charged Attacks}#[gr]
      by {12%}#[b,gr] for 5s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", ["naAtkSpd_", "caAtkSpd_"], 12),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      description: `Sweeping Fervor's swing DMG decreases opponent's {Physical RES}#[gr] by {15%}#[b,gr] for 12s.`,
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "phys", 15),
    },
  ],
};

export default Xinyan as AppCharacter;
