import type { ApplyCharBuffArgs, DataCharacter, TotalAttribute } from "@Src/types";
import { Green, Lightgold, Red } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { finalTalentLv } from "@Src/utils";
import { applyModifier } from "@Calculators/utils";
import { checkAscs, checkCons } from "../utils";

const getEBBuffValue = ({
  toSelf,
  char,
  partyData,
  inputs,
}: Pick<ApplyCharBuffArgs, "toSelf" | "char" | "partyData" | "inputs">) => {
  const level = toSelf ? finalTalentLv(char, "EB", partyData) : inputs[0] || 0;
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
  weaponType: "catalyst",
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
        { name: "1-Hit", multBase: 37.6 },
        { name: "2-Hit", multBase: 36 },
        { name: "3-Hit", multBase: 44.8 },
        { name: "4-Hit", multBase: 56.16 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 149.72 }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Mirror Reflection of Doom",
      image: "4/45/Talent_Mirror_Reflection_of_Doom",
      xtraLvAtCons: 5,
      stats: [
        { name: "DoT", multBase: 32 },
        { name: "Explosion DMG", multBase: 132.8 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
    },
    EB: {
      name: "Stellaris Phantasm",
      image: "c/c4/Talent_Stellaris_Phantasm",
      xtraLvAtCons: 3,
      stats: [{ name: "Bubble Explosion DMG", multBase: 442.4 }],
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
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: ({ totalAttr }) => (
        <>
          Increases Mona's <Green>Hydro DMG Bonus</Green> by a degree equivalent to{" "}
          <Green b>20%</Green> of her <Green>Energy Recharge</Green> rate.{" "}
          <Red>Hydro DMG Bonus: {getA4BuffValue(totalAttr)}%.</Red>
        </>
      ),
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
      desc: (obj) => (
        <>
          Omen increases <Green b>{getEBBuffValue(obj)}%</Green> <Green>DMG</Green> taken by
          opponents.
          <br />• At <Lightgold>C1</Lightgold>, increases <Green>Electro-Charged DMG</Green>,{" "}
          <Green>Vaporize DMG</Green>, and <Green>Hydro Swirl DMG</Green> by <Green b>15%</Green>{" "}
          for 8s.
          <br />• At <Lightgold>C4</Lightgold>, increases <Green>CRIT Rate</Green> by{" "}
          <Green b>15%</Green>.
        </>
      ),
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Elemental Burst Level", type: "text", initialValue: 1, max: 13, for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 4", type: "check", for: "teammate" },
      ],
      applyBuff: ({ totalAttr, attPattBonus, rxnBonus, desc, tracker, ...rest }) => {
        const { toSelf, inputs, char } = rest;

        applyModifier(desc, attPattBonus, "all.pct", getEBBuffValue(rest), tracker);

        if ((toSelf && checkCons[1](char)) || (!toSelf && inputs[1])) {
          applyModifier(
            desc,
            rxnBonus,
            ["electroCharged.pct", "swirl.pct", "vaporize.pct"],
            15,
            tracker
          );
        }
        if ((toSelf && checkCons[4](char)) || (!toSelf && inputs[2])) {
          applyModifier(desc, totalAttr, "cRate", 15, tracker);
        }
      },
    },
    {
      index: 4,
      src: EModSrc.C6,
      desc: () => (
        <>
          Upon entering Illusory Torrent, Mona gains a <Green b>60%</Green>{" "}
          <Green>DMG increase</Green> of her next <Green>Charged Attack</Green> per second of
          movement (up to <Green b>180%</Green>) for 8s.
        </>
      ),
      isGranted: checkCons[6],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "CA.pct", 60 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Mona;
