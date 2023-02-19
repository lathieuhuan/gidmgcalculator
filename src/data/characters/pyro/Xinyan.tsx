import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Xinyan: DataCharacter = {
  code: 27,
  name: "Xinyan",
  // icon: "9/9d/Character_Xinyan_Thumb",
  icon: "2/24/Xinyan_Icon",
  sideIcon: "3/32/Character_Xinyan_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "claymore",
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
  bonusStat: { type: "atk_", value: 6 },
  NAsConfig: {
    name: "Dance on Fire",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 76.54 },
        { name: "2-Hit", multFactors: 73.96 },
        { name: "3-Hit", multFactors: 95.46 },
        { name: "4-Hit", multFactors: 115.84 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 62.55 },
        { name: "Charged Attack Final", multFactors: 113.09 },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Sweeping Fervor",
      image: "8/85/Talent_Sweeping_Fervor",
      stats: [
        { name: "Swing DMG", multFactors: 169.6 },
        { name: "DoT", multFactors: 33.6 },
        {
          name: "Shield Level 1 DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 104.04, attributeType: "def" },
          flatFactor: 501,
        },
        {
          name: "Shield Level 2 DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 122.4, attributeType: "def" },
          flatFactor: 589,
        },
        {
          name: "Shield Level 3 DMG Absorption",
          notAttack: "shield",
          multFactors: { root: 144, attributeType: "def" },
          flatFactor: 693,
        },
      ],
      // getExtraStats: () => [
      //   { name: "Shield Duration", value: "12s" },
      //   { name: "CD", value: "18s" },
      // ],
    },
    EB: {
      name: "Riff Revolution",
      image: "0/06/Talent_Riff_Revolution",
      stats: [
        {
          name: "Physical Burst DMG",
          attElmt: "phys",
          multFactors: 340.8,
          getTalentBuff: ({ char }) => talentBuff([checkCons[2](char), "cRate_", [false, 2], 100]),
        },
        { name: "Pyro DoT", multFactors: 40 },
      ],
      // getExtraStats: () => [
      //   { name: "Duration", value: "2s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    {
      name: `"The Show Goes On, Even Without an Audience..."`,
      image: `b/b0/Talent_"The_Show_Goes_On%2C_Even_Without_An_Audience..."`,
    },
    {
      name: `"...Now That's Rock 'N' Roll!"`,
      image: "e/e5/Talent_%22...Now_That%27s_Rock_%27N%27_Roll%21%22",
    },
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
      desc: () => (
        <>
          Riff Revolution's <Green>[EB] Physical CRIT Rate</Green> is increased by{" "}
          <Green b>100%</Green>.
        </>
      ),
      isGranted: checkCons[2],
    },
    {
      src: EModSrc.C6,
      desc: () => (
        <>
          Xinyan's <Green>Charged Attacks DMG</Green> is increased by <Green b>50%</Green> of her{" "}
          <Green>DEF</Green>.
        </>
      ),
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
      desc: () => (
        <>
          Characters shielded by Sweeping Fervor [ES] deal <Green b>15%</Green> increased{" "}
          <Green>Physical DMG</Green>.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "phys", 15),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Upon scoring a CRIT Hit, increases <Green>ATK SPD</Green> of Xinyan's{" "}
          <Green>Normal and Charged Attacks</Green> by <Green b>12%</Green> for 5s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", ["naAtkSpd_", "caAtkSpd_"], 12),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Sweeping Fervor's swing DMG decreases opponent's <Green>Physical RES</Green> by{" "}
          <Green b>15%</Green> for 12s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "phys", 15),
    },
  ],
};

export default Xinyan;
