import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { findByIndex, round, toMult } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const getESBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({
    talentType: "ES",
    char,
    charData: Wanderer as AppCharacter,
    partyData,
  });
  return {
    NA: 32.98 * TALENT_LV_MULTIPLIERS[5][level],
    CA: 26.39 * TALENT_LV_MULTIPLIERS[5][level],
  };
};

const Wanderer: DefaultAppCharacter = {
  code: 63,
  name: "Wanderer",
  icon: "f/f8/Wanderer_Icon",
  sideIcon: "6/67/Wanderer_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "anemo",
  weaponType: "catalyst",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [791, 26, 47],
    [2053, 66, 123],
    [2731, 88, 163],
    [4086, 131, 244],
    [4568, 147, 273],
    [5256, 169, 313],
    [5899, 190, 352],
    [6593, 213, 394],
    [7076, 228, 423],
    [7777, 251, 465],
    [8259, 266, 493],
    [8968, 289, 536],
    [9450, 305, 564],
    [10164, 328, 607],
  ],
  bonusStat: { type: "cRate_", value: 4.8 },
  activeTalents: {
    NAs: {
      name: "Yuuban Meigen",
    },
    ES: {
      name: "Hanega: Song of the Wind",
      image: "b/b0/Talent_Hanega_Song_of_the_Wind",
    },
    EB: {
      name: "Kyougen: Five Ceremonial Plays",
      image: "6/64/Talent_Kyougen_Five_Ceremonial_Plays",
    },
  },
  calcListConfig: {
    NA: { multScale: 7 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 68.71 },
      { name: "2-Hit", multFactors: 65.02 },
      { name: "3-Hit (1/2)", multFactors: 47.64 },
      { name: "Additional 1-Hit (C6)", multFactors: 27.48 },
      { name: "Additional 2-Hit (C6)", multFactors: 26 },
      { name: "Additional 3-Hit (1/2) (C6)", multFactors: 19.06 },
      {
        id: "NA.0",
        name: "Wind Arrow DMG (A4) (1/4)",
        attPatt: "none",
        multFactors: { root: 35, scale: 0 },
      },
    ],
    CA: [{ name: "Charged Attack", multFactors: { root: 132.08, scale: 2 } }],
    PA: LIGHT_PAs,
    ES: [{ name: "Skill DMG", multFactors: 95.2 }],
    EB: [{ name: "Skill DMG (1/5)", multFactors: 147.2 }],
  },
  passiveTalents: [
    { name: "Jade-Claimed Flower", image: "9/95/Talent_Jade-Claimed_Flower" },
    { name: "Gales of Reverie", image: "4/4f/Talent_Gales_of_Reverie" },
    {
      name: "Strum the Swirling Winds",
      image: "8/85/Talent_Strum_the_Swirling_Winds",
    },
  ],
  constellation: [
    { name: "Shoban: Ostentatious Plumage", image: "c/c9/Constellation_Shoban_Ostentatious_Plumage" },
    {
      name: "Niban: Moonlit Isle Amidst White Waves",
      image: "4/4a/Constellation_Niban_Moonlit_Isle_Amidst_White_Waves",
    },
    { name: "Sanban: Moonflower Kusemai", image: "c/c0/Constellation_Sanban_Moonflower_Kusemai" },
    { name: "Yonban: Set Adrift into Spring", image: "7/77/Constellation_Yonban_Set_Adrift_into_Spring" },
    {
      name: "Matsuban: Ancient Illuminator From Abroad",
      image: "8/85/Constellation_Matsuban_Ancient_Illuminator_From_Abroad",
    },
    {
      name: "Shugen: The Curtains' Melancholic Sway",
      image: "0/01/Constellation_Shugen_The_Curtains%27_Melancholic_Sway",
    },
  ],
  dsGetters: [
    (args) => `${round(toMult(getESBuffValue(args.char, args.partyData).NA), 3)}`,
    (args) => `${round(toMult(getESBuffValue(args.char, args.partyData).CA), 3)}`,
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Increases {Normal Attack DMG}#[gr] by {@0}#[b,gr] times and {Charged Attack DMG}#[gr] by {@1}#[b,gr]
      times.
      <br />• At {C1}#[g], increases {Normal and Charged Attack SPD}#[gr] by {10%}#[b,gr], increases
      {Wind Arrow DMG}#[gr] [~A4] by {25%}#[b,gr] of {ATK}#[gr].`,
      applyBuff: ({ totalAttr, attPattBonus, calcItemBuffs, char, partyData, desc, tracker }) => {
        const { NA, CA } = getESBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, ["NA.multPlus", "CA.multPlus"], [NA, CA], tracker);

        if (checkCons[1](char)) {
          applyModifier(desc, totalAttr, ["naAtkSpd_", "caAtkSpd_"], 10, tracker);
          calcItemBuffs.push(genExclusiveBuff(EModSrc.C1, "NA.0", "mult_", 25));
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `If Hanega: Song of the Wind [ES] comes into contact with:
      <br />• Hydro: {Kuugoryoku Point cap}#[gr] increases by {20}#[b,gr].
      <br />• Pyro: {ATK}#[gr] increases by {30%}#[b,gr].
      <br />• Cryo: {CRIT Rate}#[gr] increases by {20%}#[b,gr].`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Infused element 1",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Infused element 2",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
        {
          label: "Random infused element (C4)",
          type: "select",
          initialValue: 0,
          options: ["Pyro", "Cryo", "Hydro"],
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        if (inputs.includes(0)) {
          applyModifier(desc, totalAttr, "atk_", 30, tracker);
        }
        if (inputs.includes(1)) {
          applyModifier(desc, totalAttr, "cRate_", 20, tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When in the Windfavored State [~ES], Kyougen: Five Ceremonial Plays {[EB] DMG}#[gr] will be
      increased by {4%}#[b,gr] per point of {difference between the max and the current amount of Kuugoryoku Points}#[gr]
      when using this skill. Maximum {200%}#[r].`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          label: "Current Kuugoryoku Points",
          type: "text",
          max: 120,
        },
      ],
      applyBuff: (obj) => {
        const isHydroInfusedES = checkCons[4](obj.char)
          ? findByIndex(obj.charBuffCtrls, 1)?.inputs?.includes(2)
          : false;
        const difference = (isHydroInfusedES ? 120 : 100) - (obj.inputs[0] || 0);
        const buffValue = Math.min(Math.max(difference, 0) * 4, 200);
        applyModifier(obj.desc, obj.attPattBonus, "EB.pct_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Wanderer as AppCharacter;
