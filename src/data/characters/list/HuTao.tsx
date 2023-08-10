import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const HuTao: DefaultAppCharacter = {
  code: 31,
  name: "Hu Tao",
  GOOD: "HuTao",
  icon: "e/e9/Hu_Tao_Icon",
  sideIcon: "8/8c/Hu_Tao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "pyro",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1211, 8, 68],
    [3141, 21, 177],
    [4179, 29, 235],
    [6253, 43, 352],
    [6990, 48, 394],
    [8042, 55, 453],
    [9026, 62, 508],
    [10089, 69, 568],
    [10826, 74, 610],
    [11899, 81, 670],
    [12637, 86, 712],
    [13721, 94, 773],
    [14459, 99, 815],
    [15552, 106, 876],
  ],
  bonusStat: {
    type: "cDmg_",
    value: 9.6,
  },
  calcListConfig: {
    NA: { multScale: 4 },
    PA: { multScale: 4 },
    EB: { multScale: 5 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 46.89 },
      { name: "2-Hit", multFactors: 48.25 },
      { name: "3-Hit", multFactors: 61.05 },
      { name: "4-Hit", multFactors: 65.64 },
      {
        name: "5-Hit",
        multFactors: [33.27, 35.2],
      },
      { name: "6-Hit", multFactors: 85.96 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: { root: 135.96, scale: 4 },
      },
    ],
    PA: [
      { name: "Plunge DMG", multFactors: 65.42 },
      { name: "Low Plunge", multFactors: 130.81 },
      { name: "High Plunge", multFactors: 163.39 },
    ],
    ES: [
      {
        name: "Blood Blossom DMG",
        multFactors: 64,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 303.27 },
      { name: "Low HP Skill DMG", multFactors: 379.09 },
      {
        name: "HP Regen.",
        type: "other",
        multFactors: { root: 6.26, attributeType: "hp" },
      },
      {
        name: "Low HP Regen.",
        type: "other",
        multFactors: { root: 8.35, attributeType: "hp" },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Secret Spear of Wangsheng",
    },
    ES: {
      name: "Guide to Afterlife",
      image: "b/be/Talent_Guide_to_Afterlife",
    },
    EB: {
      name: "Spirit Soother",
      image: "1/11/Talent_Spirit_Soother",
    },
  },
  passiveTalents: [
    { name: "Flutter By", image: "1/13/Talent_Flutter_By" },
    { name: "Sanguine Rouge", image: "2/24/Talent_Sanguine_Rouge" },
    { name: "The More the Merrier", image: "6/68/Talent_The_More_the_Merrier" },
  ],
  constellation: [
    { name: "Crimson Bouquet", image: "0/08/Constellation_Crimson_Bouquet" },
    { name: "Ominous Rainfall", image: "b/b6/Constellation_Ominous_Rainfall" },
    { name: "Lingering Carmine", image: "7/7f/Constellation_Lingering_Carmine" },
    { name: "Garden of Eternal Rest", image: "5/57/Constellation_Garden_of_Eternal_Rest" },
    { name: "Floral Incense", image: "f/f2/Constellation_Floral_Incense" },
    { name: "Butterfly's Embrace", image: "0/09/Constellation_Butterfly%27s_Embrace" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C2,
      description: `Increases the Blood Blossom {[ES] DMG}#[gr] by {10%}#[b,gr] of Hu Tao's {Max HP}#[gr].`,
      isGranted: checkCons[2],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.flat", Math.round(totalAttr.hp / 10), tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Increases Hu Tao's {ATK}#[gr] based on her {Max HP}#[gr] and grants her a {Pyro Infusion}#[pyro].`,
      applyFinalBuff: (obj) => {
        const [level, mult] = getTalentMultiplier(
          { talentType: "ES", root: 3.84, scale: 5 },
          HuTao as AppCharacter,
          obj
        );
        let description = obj.desc + ` Lv.${level} / ${round(mult, 2)} of Max HP`;
        let buffValue = applyPercent(obj.totalAttr.hp, mult);
        const limit = obj.totalAttr.base_atk * 4;

        if (buffValue > limit) {
          buffValue = limit;
          description += ` / limited to ${limit}`;
        }
        applyModifier(description, obj.totalAttr, "atk", buffValue, obj.tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.TEAMMATE,
      description: `When a Paramita Papilio [ES] state ends, all allies in the party (excluding Hu Tao) will have their
      {CRIT Rate}#[gr] increased by {12%}#[b,gr] for 8s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `When Hu Tao's HP is equal to or less than 50%, her {Pyro DMG Bonus}#[gr] is increased by {33%}#[b,gr].`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "pyro", 33),
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.TEAMMATE,
      description: `Upon defeating an enemy affected by a Blood Blossom that Hu Tao applied herself, all nearby allies in the
      party (excluding Hu Tao) will have their {CRIT Rate}#[gr] increased by {12%}#[b,gr] for 15s.`,
      isGranted: checkCons[4],
      applyFinalBuff: makeModApplier("totalAttr", "cRate_", 12),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Hu Tao's HP drops below 25%, or when she suffers a lethal strike, her {CRIT Rate}#[gr] is
      increased by {100%}#[b,gr] for 10s.`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("totalAttr", "cRate_", 100),
    },
  ],
};

export default HuTao as AppCharacter;
