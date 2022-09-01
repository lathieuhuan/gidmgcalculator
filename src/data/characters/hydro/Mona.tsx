import type { ApplyCharBuffArgs, DataCharacter, TotalAttribute } from "@Src/types";
import { Green, Red } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModifierSrc, LIGHT_PAs } from "../constants";
import { finalTalentLv } from "@Src/utils";
import { applyModifier, getInput, makeModApplier } from "@Src/calculators/utils";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = ({
  toSelf,
  char,
  partyData,
  inputs,
}: Pick<ApplyCharBuffArgs, "toSelf" | "char" | "partyData" | "inputs">) => {
  const level = toSelf ? finalTalentLv(char, "EB", partyData) : getInput(inputs, 0, 0);
  return level ? Math.min(40 + level * 2, 60) : 0;
};

const getA4BuffValue = (totalAttr: TotalAttribute) => Math.round(totalAttr.er * 2) / 10;

const Mona: DataCharacter = {
  code: 16,
  name: "Mona",
  icon: "a/a0/Character_Mona_Thumb",
  sideIcon: "1/1a/Character_Mona_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "hydro",
  weapon: "catalyst",
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
  bonusStat: { type: "er", value: 8 },
  NAsConfig: {
    name: "Ripple of Fate",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 37.6 },
        { name: "2-Hit", baseMult: 36 },
        { name: "3-Hit", baseMult: 44.8 },
        { name: "4-Hit", baseMult: 56.16 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 149.72 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Mirror Reflection of Doom",
      image: "4/45/Talent_Mirror_Reflection_of_Doom",
      xtraLvAtCons: 5,
      stats: [
        { name: "DoT", baseMult: 32 },
        { name: "Explosion DMG", baseMult: 132.8 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
    },
    EB: {
      name: "Stellaris Phantasm",
      image: "c/c4/Talent_Stellaris_Phantasm",
      xtraLvAtCons: 3,
      stats: [{ name: "Bubble Explosion DMG", baseMult: 442.4 }],
      // getExtraStats: (lv) => [
      //   { name: "", value: "8s" },
      //   { name: "DMG Bonus", value: Math.min(40 + lv * 2, 60) + "%" },
      //   { name: "Omen Duration", value: Math.min(3.5 + Math.ceil(lv / 3) * 0.5, 5) + "s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
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
  buffs: [
    {
      index: 0,
      src: EModifierSrc.EB,
      desc: (obj) => (
        <>
          Omen increases <Green b>{getEBBuffValue(obj)}%</Green> <Green>DMG taken</Green> by
          opponents. (This is actually a DMG bonus.)
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfig: {
        labels: ["Elemental Burst Level"],
        renderTypes: ["text"],
        initialValues: [1],
        maxValues: [13],
      },
      applyBuff: ({ attPattBonus, desc, tracker, ...rest }) => {
        applyModifier(desc, attPattBonus, "all.pct", getEBBuffValue(rest), tracker);
      },
    },
    {
      index: 1,
      src: EModifierSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Increases Mona's <Green>Hydro DMG Bonus</Green> by a degree equivalent to{" "}
          <Green b>20%</Green> of her <Green>Energy Recharge</Green> rate.
          <Red>Hydro DMG Bonus: {getA4BuffValue(totalAttr)}%.</Red>
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: ({ totalAttr, desc, tracker }) => {
        applyModifier(desc, totalAttr, "hydro", getA4BuffValue(totalAttr), tracker);
      },
    },
    {
      index: 2,
      src: EModifierSrc.C1,
      desc: () => (
        <>
          When any of your own party members hits an opponent affected by an Omen,{" "}
          <Green>Electro-Charged DMG</Green>, <Green>Vaporize DMG</Green>,{" "}
          <Green>Hydro Swirl DMG</Green>, and <Green>Frozen duration</Green> are increased by{" "}
          <Green b>15%</Green> for 8s.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("rxnBonus", ["electroCharged", "swirl", "vaporize"], 15),
    },
    {
      index: 3,
      src: EModifierSrc.C4,
      desc: () => (
        <>
          When any party member attacks an opponent affected by an Omen, their{" "}
          <Green>CRIT Rate</Green> is increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[4],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "cRate", 15),
    },
    {
      index: 4,
      src: EModifierSrc.C6,
      desc: () => (
        <>
          Upon entering Illusory Torrent, Mona gains a <Green b>60%</Green>{" "}
          <Green>DMG increase</Green> of her next <Green>Charged Attack</Green> per second of
          movement (up to <Green b>180%</Green>) for 8s.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      inputConfig: {
        selfLabels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [3],
      },
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct", 60 * getInput(inputs, 0, 0), tracker);
      },
    },
  ],
};

export default Mona;
