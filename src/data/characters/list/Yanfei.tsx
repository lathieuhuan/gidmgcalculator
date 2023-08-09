import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Yanfei as AppCharacter, talentType: "EB", partyData });
  return round(33.4 * TALENT_LV_MULTIPLIERS[5][level], 1);
};

const Yanfei: DefaultAppCharacter = {
  code: 34,
  name: "Yanfei",
  icon: "5/54/Yanfei_Icon",
  sideIcon: "b/b3/Yanfei_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "pyro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
  bonusStat: {
    type: "pyro",
    value: 6,
  },
  calcListConfig: {
    CA: { multScale: 5 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 58.34 },
      { name: "2-Hit", multFactors: 52.13 },
      { name: "3-Hit", multFactors: 76.01 },
    ],
    CA: [
      { name: "Charged Attack", multFactors: 98.23 },
      { name: "1-Seal Charged Attack", multFactors: 115.56 },
      { name: "2-Seal Charged Attack", multFactors: 132.9 },
      { name: "3-Seal Charged Attack", multFactors: 150.23 },
      { name: "4-Seal Charged Attack", multFactors: 167.57 },
      { name: "Extra Hit (A4)", multFactors: { root: 80, scale: 0 } },
    ],
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 169.6,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 182.4 },
      {
        name: "Shield DMG Absorption (C4)",
        multFactors: { root: 45, attributeType: "hp" },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Seal of Approval",
    },
    ES: {
      name: "Signed Edict",
      image: "a/a3/Talent_Signed_Edict",
    },
    EB: {
      name: "Done Deal",
      image: "9/96/Talent_Done_Deal",
    },
  },
  passiveTalents: [
    { name: "Proviso", image: "7/73/Talent_Proviso" },
    { name: "Blazing Eye", image: "1/19/Talent_Blazing_Eye" },
    { name: "Encyclopedic Expertise	", image: "0/08/Talent_Encyclopedic_Expertise" },
  ],
  constellation: [
    { name: "The Law Knows No Kindness", image: "7/79/Constellation_The_Law_Knows_No_Kindness" },
    { name: "Right of Final Interpretation", image: "e/e2/Constellation_Right_of_Final_Interpretation" },
    { name: "Samadhi Fire-Forged", image: "e/e4/Constellation_Samadhi_Fire-Forged" },
    { name: "Supreme Amnesty", image: "5/58/Constellation_Supreme_Amnesty" },
    { name: "Abiding Affidavit", image: "9/9f/Constellation_Abiding_Affidavit" },
    { name: "Extra Clause", image: "c/c5/Constellation_Extra_Clause" },
  ],
  dsGetters: [(args) => `${getEBBuffValue(args.char, args.partyData)}%`],
  buffs: [
    {
      index: 3,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      description: `Increases {Charged Attack DMG}#[gr] by {@0}#[b,gr].`,
      applyBuff: ({ attPattBonus, char, partyData, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct_", getEBBuffValue(char, partyData), tracker);
      },
    },
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `When Yanfei's Charged Attack consumes Scarlet Seals, each Scarlet Seal will increase her
      {Pyro DMG Bonus}#[gr] by {5%}#[b,gr] for 6s.`,
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
      description: `Increases Yanfei's {Charged Attack CRIT Rate}#[gr] by {20%}#[b,gr] against enemies below 50% HP.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attPattBonus", "CA.cRate_", 20),
    },
  ],
};

export default Yanfei as AppCharacter;
