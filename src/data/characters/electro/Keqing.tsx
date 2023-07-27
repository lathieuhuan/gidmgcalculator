import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Electro, Green } from "@Src/pure-components";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const Keqing: DefaultAppCharacter = {
  code: 9,
  name: "Keqing",
  icon: "5/52/Keqing_Icon",
  sideIcon: "6/60/Keqing_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "electro",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "cDmg_",
    value: 9.6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 41.02 },
      { name: "2-Hit", multFactors: 41.02 },
      { name: "3-Hit", multFactors: 54.44 },
      { name: "4-Hit", multFactors: [31.48, 34.4] },
      { name: "5-Hit", multFactors: 66.99 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [76.8, 86],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Lightning Stiletto", multFactors: 50.4 },
      { name: "Slashing / Thunderclap Slash DMG", multFactors: 168 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 88 },
      { name: "Consecutive Slash (1/8)", multFactors: 24 },
      { name: "Last Attack", multFactors: 188.8 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Yunlai Swordsmanship",
    },
    ES: {
      name: "Stellar Restoration",
      image: "5/5a/Talent_Stellar_Restoration",
    },
    EB: {
      name: "Starward Sword",
      image: "1/14/Talent_Starward_Sword",
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
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After recasting Stellar Restoration [ES] while a Lightning Stiletto is present, Keqing gains an{" "}
          <Electro>Electro Infusion</Electro> for 5s.
        </>
      ),
      isGranted: checkAscs[1],
      infuseConfig: {
        overwritable: true,
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          After casting Starward Sword [EB], Keqing's <Green>CRIT Rate</Green> and <Green>Energy Recharge</Green> are
          increased by <Green b>15%</Green> for 8s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", ["cRate_", "er_"], 15),
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          For 10s after Keqing triggers an Electro-related Elemental Reaction, her <Green>ATK</Green> is increased by{" "}
          <Green b>25%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "atk_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When initiating a Normal Attack, a Charged Attack, Elemental Skill or Elemental Burst, Keqing gains a{" "}
          <Green b>6%</Green> <Green>Electro DMG Bonus</Green> for 8s. Effects triggered by different sources are
          considered independent entities.
        </>
      ),
      isGranted: checkCons[6],
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

export default Keqing as AppCharacter;
