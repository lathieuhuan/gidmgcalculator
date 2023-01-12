import type { DataCharacter, CharInfo, PartyData } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { CHARACTER_IMAGES } from "@Data/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { EModSrc, LIGHT_PAs } from "../constants";
import { round } from "@Src/utils";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, talents: Yanfei.activeTalents, talentType: "EB", partyData });
  return round(33.4 * TALENT_LV_MULTIPLIERS[5][level], 1);
};

const Yanfei: DataCharacter = {
  code: 34,
  name: "Yanfei",
  // icon: "1/1f/Character_Yanfei_Thumb",
  icon: CHARACTER_IMAGES.Yanfei,
  sideIcon: "4/4c/Character_Yanfei_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "catalyst",
  stats: [
    [784, 20, 49],
    [2014, 52, 126],
    [2600, 67, 163],
    [3894, 100, 244],
    [4311, 111, 271],
    [4959, 127, 311],
    [5514, 141, 346],
    [6161, 158, 387],
    [6578, 169, 413],
    [7225, 185, 453],
    [7641, 196, 480],
    [8289, 213, 520],
    [8705, 223, 546],
    [9352, 240, 587],
  ],
  bonusStat: { type: "pyro", value: 6 },
  NAsConfig: {
    name: "Seal of Approval",

    // getExtraStats: () => [
    //   { name: "Scarlet Seal Stamina Consumption Decrease", value: "15% per Seal" },
    //   { name: "Scarlet Seal Duration", value: "10s" },
    // ],
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 58.34 },
        { name: "2-Hit", multFactors: 52.13 },
        { name: "3-Hit", multFactors: 76.01 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack", multFactors: 98.23 },
        { name: "1-Seal Charged Attack", multFactors: 115.56 },
        { name: "2-Seal Charged Attack", multFactors: 132.9 },
        { name: "3-Seal Charged Attack", multFactors: 150.23 },
        { name: "4-Seal Charged Attack", multFactors: 167.57 },
        { name: "Extra Hit (A4)", multFactors: { root: 80, scale: 0 } },
      ],
      multScale: 5,
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Signed Edict",
      image: "a/a3/Talent_Signed_Edict",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", multFactors: 169.6 }],
      // getExtraStats: () => [{ name: "CD", value: "9s" }],
    },
    EB: {
      name: "Done Deal",
      image: "9/96/Talent_Done_Deal",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multFactors: 182.4 }],
      // getExtraStats: (lv) => [
      //   { name: "Scarlet Seal Grant Interval", value: "1s" },
      //   {
      //     name: "Charged Attack DMG Bonus",
      //     value: round(33.4 * TALENT_LV_MULTIPLIERS[5][lv], 1) + "%",
      //   },
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Proviso", image: "7/73/Talent_Proviso" },
    {
      name: "Blazing Eye",
      image: "1/19/Talent_Blazing_Eye",
      // desc: (
      //   <>
      //     When Yanfei's Charged Attack deals a CRIT Hit to opponents, she will deal an additional
      //     instance of AoE {pyroDmg} equal to <Green b>80%</Green> of her <Green>ATK</Green>. This
      //     DMG counts as Charged Attack DMG.
      //   </>
      // ),
    },
    { name: "Encyclopedic Expertise	", image: "0/08/Talent_Encyclopedic_Expertise" },
  ],
  constellation: [
    { name: "The Law Knows No Kindness", image: "7/79/Constellation_The_Law_Knows_No_Kindness" },
    {
      name: "Right of Final Interpretation",
      image: "e/e2/Constellation_Right_of_Final_Interpretation",
    },
    { name: "Samadhi Fire-Forged", image: "e/e4/Constellation_Samadhi_Fire-Forged" },
    { name: "Supreme Amnesty", image: "5/58/Constellation_Supreme_Amnesty" },
    { name: "Abiding Affidavit", image: "9/9f/Constellation_Abiding_Affidavit" },
    { name: "Extra Clause", image: "c/c5/Constellation_Extra_Clause" },
  ],
  buffs: [
    {
      index: 3,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Increases <Green>Charged Attack DMG</Green> by{" "}
          <Green b>{getEBBuffValue(char, partyData)}%</Green>.
        </>
      ),
      applyBuff: ({ attPattBonus, char, partyData, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct", getEBBuffValue(char, partyData), tracker);
      },
    },
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          When Yanfei's Charged Attack consumes Scarlet Seals, each Scarlet Seal will increase her{" "}
          <Green>Pyro DMG Bonus</Green> by <Green b>5%</Green>. This effect lasts for 6s.
        </>
      ),
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "pyro", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Increases Yanfei's <Green>Charged Attack CRIT Rate</Green> by <Green b>20%</Green> against
          enemies below 50% HP.
        </>
      ),
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate", 20),
    },
  ],
};

export default Yanfei;
