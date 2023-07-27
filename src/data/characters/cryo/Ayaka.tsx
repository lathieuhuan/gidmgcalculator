import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Cryo, Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Ayaka: DefaultAppCharacter = {
  code: 37,
  name: "Ayaka",
  GOOD: "KamisatoAyaka",
  icon: "5/51/Kamisato_Ayaka_Icon",
  sideIcon: "2/2b/Kamisato_Ayaka_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1001, 27, 61],
    [2597, 69, 158],
    [3455, 92, 211],
    [5170, 138, 315],
    [5779, 154, 352],
    [6649, 177, 405],
    [7462, 198, 455],
    [8341, 222, 509],
    [8951, 238, 546],
    [9838, 262, 600],
    [10448, 278, 637],
    [11345, 302, 692],
    [11954, 318, 729],
    [12858, 342, 784],
  ],
  bonusStat: { type: "cDmg_", value: 9.6 },
  activeTalents: {
    NAs: {
      name: "Kamisato Art: Kabuki",
    },
    ES: {
      name: "Kamisato Art: Hyouka",
      image: "5/56/Talent_Kamisato_Art_Hyouka",
    },
    EB: {
      name: "Kamisato Art: Soumetsu",
      image: "1/11/Talent_Kamisato_Art_Soumetsu",
    },
    altSprint: {
      name: "Kamisato Art: Senho",
      image: "d/d8/Talent_Kamisato_Art_Senho",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 45.73 },
      { name: "2-Hit", multFactors: 48.68 },
      { name: "3-Hit", multFactors: 62.62 },
      { name: "4-Hit (1/3)", multFactors: 22.65 },
      { name: "5-Hit", multFactors: 78.18 },
    ],
    CA: [{ name: "Charged Attack (1/3)", multFactors: 55.13 }],
    PA: MEDIUM_PAs,
    ES: [{ name: "Skill DMG", multFactors: 239.2 }],
    EB: [
      { name: "Cutting DMG", multFactors: 112.3 },
      { name: "Bloom DMG", multFactors: 168.45 },
    ],
  },
  passiveTalents: [
    {
      name: "Amatsumi Kunitsumi Sanctification",
      image: "d/d9/Talent_Amatsumi_Kunitsumi_Sanctification",
    },
    {
      name: "Kanten Senmyou Blessing",
      image: "d/db/Talent_Kanten_Senmyou_Blessing",
    },
    { name: "Fruits of Shinsa", image: "0/02/Talent_Fruits_of_Shinsa" },
  ],
  constellation: [
    { name: "Snowswept Sakura", image: "e/eb/Constellation_Snowswept_Sakura" },
    {
      name: "Blizzard Blade Seki no To",
      image: "4/4a/Constellation_Blizzard_Blade_Seki_no_To",
    },
    {
      name: "Frostbloom Kamifubuki",
      image: "d/d3/Constellation_Frostbloom_Kamifubuki",
    },
    { name: "Ebb and Flow", image: "f/f7/Constellation_Ebb_and_Flow" },
    {
      name: "Blossom Cloud Irutsuki",
      image: "d/d2/Constellation_Blossom_Cloud_Irutsuki",
    },
    {
      name: "Dance of Suigetsu",
      image: "d/d5/Constellation_Dance_of_Suigetsu",
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Alternate Sprint",
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Ayaka reappears from Senho form, she gains a <Cryo>Cryo Infusion</Cryo> for a brief period.
        </>
      ),
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After using Kamisato Art: Hyouka [ES], Ayaka's <Green>Normal and Charged attack DMG</Green> is increased by{" "}
          <Green b>30%</Green> for 6s.
        </>
      ),
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 30),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When the Cryo application at the end of Kamisato Art: Senho hits an opponent, Ayaka gains <Green b>18%</Green>{" "}
          <Green>Cryo DMG Bonus</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "cryo", 18),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Ayaka gains Usurahi Butou every 10s, increasing her <Green>Charged Attack DMG</Green> by <Green b>298%</Green>
          .
        </>
      ),
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "CA.pct_", 298),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Opponents damaged by Frostflake Seki no To [~EB] will have their <Green>DEF</Green> decreased by{" "}
          <Green b>30%</Green> for 6s.
        </>
      ),
      isGranted: checkCons[4],
      applyDebuff: makeModApplier("resistReduct", "def", 30),
    },
  ],
};

export default Ayaka as AppCharacter;
