import type { DataCharacter } from "@Src/types";
import { Electro, Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const Keqing: DataCharacter = {
  code: 9,
  name: "Keqing",
  icon: "0/06/Character_Keqing_Thumb",
  sideIcon: "b/ba/Character_Keqing_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "electro",
  weaponType: "sword",
  stats: [
    [1020, 25, 62],
    [2646, 65, 161],
    [3521, 87, 215],
    [5268, 130, 321],
    [5889, 145, 359],
    [6776, 167, 413],
    [7604, 187, 464],
    [8500, 209, 519],
    [9121, 225, 556],
    [10025, 247, 612],
    [10647, 262, 649],
    [11561, 285, 705],
    [12182, 300, 743],
    [13103, 323, 799],
  ],
  bonusStat: { type: "cDmg", value: 9.6 },
  NAsConfig: {
    name: "Yunlai Swordsmanship",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 41.02 },
        { name: "2-Hit", multFactors: 41.02 },
        { name: "3-Hit", multFactors: 54.44 },
        { name: "4-Hit", multFactors: [31.48, 34.4] },
        { name: "5-Hit", multFactors: 66.99 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: [76.8, 86] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Stellar Restoration",
      image: "5/5a/Talent_Stellar_Restoration",
      xtraLvAtCons: 5,
      stats: [
        { name: "Lightning Stiletto", multFactors: 50.4 },
        { name: "Slashing / Thunderclap Slash DMG", multFactors: 168 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "7.5s" }],
    },
    EB: {
      name: "Starward Sword",
      image: "1/14/Talent_Starward_Sword",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", multFactors: 88 },
        { name: "Consecutive Slash (1/8)", multFactors: 24 },
        { name: "Last Attack", multFactors: 188.8 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Thundering Penance", image: "a/a4/Talent_Thundering_Penance" },
    { name: "Aristocratic Dignity", image: "d/d3/Talent_Aristocratic_Dignity" },
    { name: "Land's Overseer", image: "2/2c/Talent_Land%27s_Overseer" },
  ],
  constellation: [
    { name: "Thundering Might", image: "c/cc/Constellation_Thundering_Might" },
    { name: "Keen Extraction", image: "0/07/Constellation_Keen_Extraction" },
    { name: "Foreseen Reformation", image: "4/49/Constellation_Foreseen_Reformation" },
    { name: "Attunement", image: "a/ac/Constellation_Attunement" },
    { name: "Beckoning Stars", image: "3/35/Constellation_Beckoning_Stars" },
    { name: "Tenacious Star", image: "b/b9/Constellation_Tenacious_Star" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: () => (
        <>
          After recasting Stellar Restoration [ES] while a Lightning Stiletto is present, Keqing
          gains an <Electro>Electro Infusion</Electro> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      desc: () => (
        <>
          After casting Starward Sword [EB], Keqing's <Green>CRIT Rate</Green> and{" "}
          <Green>Energy Recharge</Green> are increased by <Green b>15%</Green> for 8s.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", ["cRate", "er"], 15),
    },
    {
      index: 2,
      src: EModSrc.C4,
      desc: () => (
        <>
          For 10s after Keqing triggers an Electro-related Elemental Reaction, her{" "}
          <Green>ATK</Green> is increased by <Green b>25%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "atk_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      desc: () => (
        <>
          When initiating a Normal Attack, a Charged Attack, Elemental Skill or Elemental Burst,
          Keqing gains a <Green b>6%</Green> <Green>Electro DMG Bonus</Green> for 8s. Effects
          triggered by different sources are considered independent entities.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "electro", 6 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Keqing;
