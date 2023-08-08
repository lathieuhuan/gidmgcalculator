import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Thoma: DefaultAppCharacter = {
  code: 43,
  name: "Thoma",
  icon: "5/5b/Thoma_Icon",
  sideIcon: "e/e9/Thoma_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [866, 17, 63],
    [2225, 43, 162],
    [2872, 56, 209],
    [4302, 84, 313],
    [4762, 93, 346],
    [5478, 107, 398],
    [6091, 119, 443],
    [6806, 133, 495],
    [7266, 142, 528],
    [7981, 156, 580],
    [8440, 165, 613],
    [9156, 179, 665],
    [9616, 188, 699],
    [10331, 202, 751],
  ],
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.39 },
      { name: "2-Hit", multFactors: 43.63 },
      { name: "3-Hit (1/2)", multFactors: 26.79 },
      { name: "4-Hit", multFactors: 67.36 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 112.75,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 146.4 },
      {
        name: "Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 7.2, attributeType: "hp" },
        flatFactor: 693,
      },
      {
        name: "Max Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 19.6, attributeType: "hp" },
        flatFactor: 1887,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 88 },
      { id: "EB.0", name: "Fiery Collapse DMG", multFactors: 58 },
      {
        name: "Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 1.14, attributeType: "hp" },
        flatFactor: 110,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Swiftshatter Spear",
    },
    ES: {
      name: "Blazing Blessing",
      image: "9/9b/Talent_Blazing_Blessing",
    },
    EB: {
      name: "Crimson Ooyoroi",
      image: "e/e4/Talent_Crimson_Ooyoroi",
    },
  },
  passiveTalents: [
    { name: "Imbricated Armor", image: "4/4b/Talent_Imbricated_Armor" },
    { name: "Flaming Assault", image: "0/03/Talent_Flaming_Assault" },
    { name: "Snap and Swing", image: "1/14/Talent_Snap_and_Swing" },
  ],
  constellation: [
    { name: "A Comrade's Duty", image: "9/9c/Constellation_A_Comrade%27s_Duty" },
    { name: "A Subordinate's Skills", image: "e/e9/Constellation_A_Subordinate%27s_Skills" },
    { name: "Fortified Resolve", image: "9/99/Constellation_Fortified_Resolve" },
    { name: "Long-Term Planning", image: "f/f4/Constellation_Long-Term_Planning" },
    { name: "Raging Wildfire", image: "5/5b/Constellation_Raging_Wildfire" },
    { name: "Burning Heart", image: "0/0f/Constellation_Burning_Heart" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `{Fiery Collapse DMG}#[gr] [~EB] is increased by {2.2%}#[b,gr] of Thoma's {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        calcItemBuffs.push(exclBuff(EModSrc.A4, "EB.0", "flat", applyPercent(totalAttr.hp, 2.2)));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When your current active character obtains or refreshes a Blazing Barrier, this character's
      {Shield Strength}#[gr] will increase by {5%}#[b,gr] for 6s. Max {5}#[r] stacks, each stack can be obtained once
      every 0.3 seconds.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C6,
      isGranted: checkCons[6],
      description: `When a Blazing Barrier is obtained or refreshed, all party members'
      {Normal, Charged, and Plunging Attack DMG}#[gr] is increased by {15%}#[b,gr] for 6s.`,
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("attPattBonus", [...NCPA_PERCENTS], 15),
    },
  ],
};

export default Thoma as AppCharacter;
