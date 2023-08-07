import type { AppCharacter, ApplyCharBuffArgs, DefaultAppCharacter, TotalAttribute } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = ({
  toSelf,
  char,
  partyData,
  inputs,
}: Pick<ApplyCharBuffArgs, "toSelf" | "char" | "partyData" | "inputs">) => {
  const level = toSelf
    ? finalTalentLv({ char, charData: Mona as AppCharacter, talentType: "EB", partyData })
    : inputs[0] || 0;
  return level ? Math.min(40 + level * 2, 60) : 0;
};

const getA4BuffValue = (totalAttr: TotalAttribute) => Math.round(totalAttr.er_ * 2) / 10;

const Mona: DefaultAppCharacter = {
  code: 16,
  name: "Mona",
  icon: "4/41/Mona_Icon",
  sideIcon: "6/61/Mona_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [810, 22, 51],
    [2102, 58, 132],
    [2797, 77, 176],
    [4185, 115, 263],
    [4678, 129, 294],
    [5383, 148, 338],
    [6041, 167, 379],
    [6752, 186, 424],
    [7246, 200, 455],
    [7964, 220, 500],
    [8458, 233, 531],
    [9184, 253, 576],
    [9677, 267, 607],
    [10409, 287, 653],
  ],
  bonusStat: {
    type: "er_",
    value: 8,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 37.6 },
      { name: "2-Hit", multFactors: 36 },
      { name: "3-Hit", multFactors: 44.8 },
      { name: "4-Hit", multFactors: 56.16 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 149.72,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "DoT", multFactors: 32 },
      { name: "Explosion DMG", multFactors: 132.8 },
    ],
    EB: [
      {
        name: "Bubble Explosion DMG",
        multFactors: 442.4,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Ripple of Fate",
    },
    ES: {
      name: "Mirror Reflection of Doom",
      image: "4/45/Talent_Mirror_Reflection_of_Doom",
    },
    EB: {
      name: "Stellaris Phantasm",
      image: "c/c4/Talent_Stellaris_Phantasm",
    },
    altSprint: {
      name: "Illusory Torrent",
      image: "9/9a/Talent_Illusory_Torrent",
    },
  },
  passiveTalents: [
    { name: "Come 'n' Get Me, Hag!", image: `8/8f/Talent_"Come_%27n%27_Get_Me%2C_Hag%21"` },
    { name: "Waterborne Destiny", image: "6/6a/Talent_Waterborne_Destiny" },
    { name: "Principium of Astrology", image: "4/48/Talent_Principium_of_Astrology" },
  ],
  constellation: [
    { name: "Prophecy of Submersion", image: "2/27/Constellation_Prophecy_of_Submersion" },
    { name: "Lunar Chain", image: "1/16/Constellation_Lunar_Chain" },
    { name: "Restless Revolution", image: "2/2a/Constellation_Restless_Revolution" },
    { name: "Prophecy of Oblivion", image: "3/38/Constellation_Prophecy_of_Oblivion" },
    { name: "Mockery of Fortuna", image: "b/bd/Constellation_Mockery_of_Fortuna" },
    { name: "Rhetorics of Calamitas", image: "6/62/Constellation_Rhetorics_of_Calamitas" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Increases Mona's {Hydro DMG Bonus}#[gr] by a degree equivalent to {20%}#[b,gr] of her
      {Energy Recharge}#[gr] rate.`,
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hydro", getA4BuffValue(totalAttr), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.PARTY,
      description: `Omen increases {DMG}#[gr] taken by opponents.
      <br />• At {C1}#[g], increases {Electro-Charged DMG}#[gr], {Vaporize DMG}#[gr], and {Hydro Swirl DMG}#[gr] by
      {15%}#[b,gr] for 8s.
      <br />• At {C4}#[g], increases {CRIT Rate}#[gr] by {15%}#[b,gr].`,
      inputConfigs: [
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 4", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, attPattBonus, rxnBonus, desc, tracker, ...rest }) => {
        const { toSelf, inputs, char } = rest;
        applyModifier(desc, attPattBonus, "all.pct_", getEBBuffValue(rest), tracker);

        if ((toSelf && checkCons[1](char)) || (!toSelf && inputs[1])) {
          applyModifier(desc, rxnBonus, ["electroCharged.pct_", "swirl.pct_", "vaporize.pct_"], 15, tracker);
        }
        if ((toSelf && checkCons[4](char)) || (!toSelf && inputs[2])) {
          applyModifier(desc, totalAttr, "cRate_", 15, tracker);
        }
      },
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Upon entering Illusory Torrent, Mona gains a {60%}#[b,gr] {DMG bonus}#[gr] of her next
      {Charged Attack}#[gr] per second of movement (up to {180%}#[r]) for 8s.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct_", 60 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Mona as AppCharacter;
