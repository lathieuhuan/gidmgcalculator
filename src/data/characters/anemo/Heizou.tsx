import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkCons } from "../utils";

const Heizou: DataCharacter = {
  code: 53,
  name: "Heizou",
  GOOD: "ShikanoinHeizou",
  icon: "2/20/Shikanoin_Heizou_Icon",
  sideIcon: "c/ca/Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weaponType: "catalyst",
  stats: [
    [894, 19, 57],
    [2296, 48, 147],
    [2963, 63, 190],
    [4438, 94, 285],
    [4913, 104, 315],
    [5651, 119, 363],
    [6283, 133, 403],
    [7021, 148, 451],
    [7495, 158, 481],
    [8233, 174, 528],
    [8707, 184, 559],
    [9445, 200, 606],
    [9919, 210, 637],
    [10657, 225, 684],
  ],
  bonusStat: { type: "anemo", value: 6 },
  NAsConfig: {
    name: "Fudou Style Martial Arts",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 37.47 },
        { name: "2-Hit", multFactors: 36.85 },
        { name: "3-Hit", multFactors: 51.06 },
        { name: "4-Hit", multFactors: [14.78, 16.26, 19.22] },
        { name: "5-Hit", multFactors: 61.45 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: 73 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Heartstopper Strike",
      image: "c/cb/Talent_Heartstopper_Strike",
      stats: [
        { name: "Skill DMG", multFactors: 227.52 },
        { name: "Declension DMG Bonus / stack", multFactors: 56.88 },
        { name: "Conviction DMG Bonus", multFactors: 113.76 },
      ],
      // getExtraStats: () => [
      //   { name: "Declension Duration", value: "60s" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Windmuster Kick",
      image: "0/0a/Talent_Windmuster_Kick",
      stats: [
        { name: "Fudou Style Vacuum Slugger DMG", multFactors: 314.69 },
        { name: "Windmuster Iris DMG", multFactors: 21.5, attElmt: "various" },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Paradoxical Practice", image: "c/c4/Talent_Paradoxical_Practice" },
    { name: "Penetrative Reasoning", image: "8/82/Talent_Penetrative_Reasoning" },
    { name: "Pre-Existing Guilt", image: "b/b1/Talent_Cloud_Strider" },
  ],
  constellation: [
    { name: "Named Juvenile Casebook", image: "6/65/Constellation_Named_Juvenile_Casebook" },
    { name: "Investigative Collection", image: "0/03/Constellation_Investigative_Collection" },
    { name: "Esoteric Puzzle Book", image: "e/ee/Constellation_Esoteric_Puzzle_Book" },
    { name: "Tome of Lies", image: "5/59/Constellation_Tome_of_Lies" },
    { name: "Secret Archive", image: "9/9d/Constellation_Secret_Archive" },
    { name: "Curious Casefiles", image: "3/3a/Constellation_Curious_Casefiles" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      desc: () => (
        <>
          When Heartstopper Strike [ES] hits an opponent, increases all party members' (excluding Heizou){" "}
          <Green>Elemental Mastery</Green> by <Green b>80</Green> for 10s.
        </>
      ),
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
    {
      index: 1,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          For 5s after Heizou takes the field, his <Green>Normal Attack SPD</Green> is increased by <Green>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
    {
      index: 2,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Each Declension stack increases Heartstopper Strike <Green>[ES] CRIT Rate</Green> by <Green b>4%</Green>. When
          Heizou possesses Conviction, Heartstoppper Strike's <Green>[ES] CRIT DMG</Green> is increased by{" "}
          <Green b>32%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const stacks = inputs[0] || 0;

        if (stacks !== 4) {
          applyModifier(desc, attPattBonus, "ES.cRate_", 4 * stacks, tracker);
        } else {
          applyModifier(desc, attPattBonus, ["ES.cRate_", "ES.cDmg_"], [4 * stacks, 32], tracker);
        }
      },
    },
  ],
};

export default Heizou;
