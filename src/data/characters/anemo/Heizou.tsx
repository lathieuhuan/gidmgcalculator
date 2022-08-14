import { Green } from "@Src/styled-components";
import type { DataCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, LIGHT_PAs } from "../constants";
import { applyModifier, AttackPatternPath, makeModApplier } from "@Src/calculators/utils";
import { checkCons } from "../utils";

const Heizou: DataCharacter = {
  code: 53,
  name: "Heizou",
  icon: "e/e4/Character_Shikanoin_Heizou_Thumb",
  sideIcon: "8/89/Character_Shikanoin_Heizou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "anemo",
  weapon: "catalyst",
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
    caStamina: 25,
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 37.47 },
        { name: "2-Hit", baseMult: 36.85 },
        { name: "3-Hit", baseMult: 51.06 },
        { name: "4-Hit", baseMult: [14.78, 16.26, 19.22] },
        { name: "5-Hit", baseMult: 61.45 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 73 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Heartstopper Strike",
      image: "c/cb/Talent_Heartstopper_Strike",
      xtraLvAtCons: 3,
      stats: [
        { name: "Skill DMG", baseMult: 227.52 },
        { name: "Declension DMG Bonus / stack", baseMult: 56.88 },
        { name: "Conviction DMG Bonus", baseMult: 113.76 },
      ],
      // getExtraStats: () => [
      //   { name: "Declension Duration", value: "60s" },
      //   { name: "CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Windmuster Kick",
      image: "0/0a/Talent_Windmuster_Kick",
      xtraLvAtCons: 5,
      stats: [
        { name: "Fudou Style Vacuum Slugger DMG", baseMult: 314.69 },
        { name: "Windmuster Iris DMG", baseMult: 21.5 },
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
      src: EModifierSrc.A4,
      isGranted: () => true,
      desc: () => (
        <>
          After Shikanoin Heizou's Heartstopper Strike hits an opponent, increases all party
          members' (excluding Shikanoin Heizou) <Green>Elemental Mastery</Green> by{" "}
          <Green b>80</Green> for 10s.
        </>
      ),
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
    {
      index: 1,
      src: EModifierSrc.C1,
      desc: () => (
        <>
          For 5s after Shikanoin Heizou takes the field, his <Green>Normal Attack SPD</Green> is
          increased by <Green>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "naAtkSpd", 15),
    },
    {
      index: 2,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Each Declension stack will increase the <Green>CRIT Rate</Green> of the Heartstopper
          Strike unleashed by <Green b>4%</Green>. When Heizou possesses Conviction, this
          Heartstoppper Strike's <Green>CRIT DMG</Green> is increased by <Green b>32%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [4],
      },
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        const fields: AttackPatternPath[] = ["ES.cRate"];
        const bnValues = [4 * +inputs![0]];

        if (inputs![0] === 4) {
          fields.push("ES.cDmg");
          bnValues.push(32);
        }
        applyModifier(desc, attPattBonus, fields, bnValues, tracker);
      },
    },
  ],
};

export default Heizou;
