import type { DataCharacter } from "@Src/types";
import { Green, Pyro } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, TALENT_LV_MULTIPLIERS } from "../constants";
import { applyPercent, finalTalentLv } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const HuTao: DataCharacter = {
  code: 31,
  name: "Hu Tao",
  GOOD: "HuTao",
  icon: "a/a4/Character_Hu_Tao_Thumb",
  sideIcon: "7/78/Character_Hu_Tao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "pyro",
  weapon: "polearm",
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
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Secret Spear of Wangsheng",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multBase: 46.89, multType: 4 },
        { name: "2-Hit", multBase: 48.25, multType: 4 },
        { name: "3-Hit", multBase: 61.05, multType: 4 },
        { name: "4-Hit", multBase: 65.64, multType: 4 },
        { name: "5-Hit", multBase: [33.27, 35.2], multType: 4 },
        { name: "6-Hit", multBase: 85.96, multType: 4 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 135.96, multType: 4 }] },
    PA: {
      stats: [
        { name: "Plunge DMG", multBase: 65.42, multType: 4 },
        { name: "Low Plunge", multBase: 130.81, multType: 4 },
        { name: "High Plunge", multBase: 163.39, multType: 4 },
      ],
    },
    ES: {
      name: "Guide to Afterlife",
      image: "b/be/Talent_Guide_to_Afterlife",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "ATK Increase",
          notAttack: "other",
          baseStatType: "hp",
          multBase: 3.84,
          multType: 5,
          getLimit: ({ totalAttr }) => totalAttr.base_atk * 4,
        },
        { name: "Blood Blossom DMG", multBase: 64 },
      ],
      getExtraStats: () => [
        { name: "Activation Cost", value: "30% Current HP" },
        { name: "Blood Blossom Durtion", value: "8s" },
        { name: "Durtion", value: "9s" },
        { name: "CD", value: "16s" },
      ],
    },
    EB: {
      name: "Spirit Soother",
      image: "1/11/Talent_Spirit_Soother",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", multBase: 303.27, multType: 5 },
        { name: "Low HP Skill DMG", multBase: 379.09, multType: 5 },
        { name: "HP Regen.", notAttack: "other", baseStatType: "hp", multBase: 6.26, multType: 5 },
        {
          name: "Low HP Regen.",
          notAttack: "other",
          baseStatType: "hp",
          multBase: 8.35,
          multType: 5,
        },
      ],
      // getExtraStats: () => [{ name: "CD", value: "15s" }],
      energyCost: 60,
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
      desc: () => (
        <>
          Increases the Blood Blossom <Green>[ES] DMG</Green> by an amount equal to{" "}
          <Green b>10%</Green> of Hu Tao's <Green>Max HP</Green>.
        </>
      ),
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
      desc: () => (
        <>
          Increases Hu Tao's <Green>ATK</Green> based on her <Green>Max HP</Green>, and convert her{" "}
          <Green>attack DMG</Green> to <Pyro>Pyro DMG</Pyro>.
        </>
      ),
      affect: EModAffect.SELF,
      applyFinalBuff: ({ totalAttr, char, partyData, desc, tracker }) => {
        const level = finalTalentLv(char, "ES", partyData);
        let buffValue = applyPercent(totalAttr.hp, 3.84 * TALENT_LV_MULTIPLIERS[5][level]);
        buffValue = Math.min(buffValue, totalAttr.base_atk * 4);
        applyModifier(desc, totalAttr, "atk", buffValue, tracker);
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => (
        <>
          When a Paramita Papilio [ES] state ends, all allies in the party (excluding Hu Tao) will
          have their <Green>CRIT Rate</Green> increased by <Green b>12%</Green> for 8s.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.TEAMMATE,
      applyBuff: makeModApplier("totalAttr", "cRate", 12),
    },
    {
      index: 2,
      src: EModSrc.A4,
      desc: () => (
        <>
          When Hu Tao's HP is equal to or less than 50%, her <Green>Pyro DMG Bonus</Green> is
          increased by <Green b>33%</Green>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "pyro", 33),
    },
    {
      index: 5,
      src: EModSrc.C4,
      desc: () => (
        <>
          Upon defeating an enemy affected by a Blood Blossom that Hu Tao applied herself, all
          nearby allies in the party (excluding Hu Tao) will have their <Green>CRIT Rate</Green>{" "}
          increased by <Green b>12%</Green> for 15s.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.TEAMMATE,
      applyFinalBuff: makeModApplier("totalAttr", "cRate", 12),
    },
    {
      index: 4,
      src: EModSrc.C6,
      desc: () => (
        <>
          When Hu Tao's HP drops below 25%, or when she suffers a lethal strike, her{" "}
          <Green>CRIT Rate</Green> is increased by <Green b>100%</Green> for 10s.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("totalAttr", "cRate", 100),
    },
  ],
};

export default HuTao;
