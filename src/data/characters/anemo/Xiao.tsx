import type { CharInfo, DataCharacter, PartyData } from "@Src/types";
import { Anemo, Green, Rose } from "@Src/styled-components";
import { EModAffect, NORMAL_ATTACKS } from "@Src/constants";
import { EModSrc, HEAVIER_PAs, TALENT_LV_MULTIPLIERS } from "../constants";
import { finalTalentLv, round2 } from "@Src/utils";
import { applyModifier } from "@Calculators/utils";
import { checkAscs } from "../utils";
import { NCPA_PERCENTS } from "@Data/constants";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv(char, "EB", partyData);
  return round2(58.45 * TALENT_LV_MULTIPLIERS[5][level]);
};

const Xiao: DataCharacter = {
  code: 30,
  name: "Xiao",
  icon: "b/b9/Character_Xiao_Thumb",
  sideIcon: "8/83/Character_Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weapon: "polearm",
  stats: [
    [991, 27, 62],
    [2572, 71, 161],
    [3422, 94, 215],
    [5120, 140, 321],
    [5724, 157, 359],
    [6586, 181, 413],
    [7391, 203, 464],
    [8262, 227, 519],
    [8866, 243, 556],
    [9744, 267, 612],
    [10348, 284, 649],
    [11236, 308, 705],
    [11840, 325, 743],
    [12736, 349, 799],
  ],
  bonusStat: { type: "cRate", value: 4.8 },
  NAsConfig: {
    name: "Whirlwind Thrust",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit (1/2)", multBase: 27.54, multType: 4 },
        { name: "2-Hit", multBase: 56.94, multType: 4 },
        { name: "3-Hit", multBase: 68.55, multType: 4 },
        { name: "4-Hit (1/2)", multBase: 37.66, multType: 4 },
        { name: "5-Hit", multBase: 71.54, multType: 4 },
        { name: "6-Hit", multBase: 95.83, multType: 4 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multBase: 121.09 }] },
    PA: { stats: HEAVIER_PAs },
    ES: {
      name: "Lemniscatic Wind Cycling",
      image: "d/da/Talent_Lemniscatic_Wind_Cycling",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", multBase: 252.8 }],
      // getExtraStats: () => [{ name: "CD", value: "10s" }],
    },
    EB: {
      name: "Bane of All Evil",
      image: "2/2f/Talent_Bane_of_All_Evil",
      xtraLvAtCons: 5,
      stats: [],
      // getExtraStats: (lv = 1) => [
      //   {
      //     name: "Normal/Charged/Plunging Attack DMG Bonus",
      //     value: round2(58.45 * TALENT_LV_MULTIPLIERS[5][lv]) + "%",
      //   },
      //   {
      //     name: "Life Drain",
      //     value: Math.max(3.5 - Math.ceil(lv / 3) * 0.5, 2) + "% Current HP per Second",
      //   },
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "18s" },
      // ],
      energyCost: 70,
    },
  },
  passiveTalents: [
    {
      name: "Conqueror of Evil: Tamer of Demons",
      image: "d/df/Talent_Conqueror_of_Evil_Tamer_of_Demons",
    },
    { name: "Dissolution Eon: Heaven Fall", image: "d/d8/Talent_Dissolution_Eon_Heaven_Fall" },
    { name: "Transcension: Gravity Defier", image: "4/46/Talent_Transcension_Gravity_Defier" },
  ],
  constellation: [
    {
      name: "Dissolution Eon: Destroyer of Worlds",
      image: "e/e7/Constellation_Dissolution_Eon_-_Destroyer_of_Worlds",
    },
    {
      name: "Annihilation Eon: Blossom of Kaleidos",
      image: "f/f7/Constellation_Annihilation_Eon_-_Blossom_of_Kaleidos",
    },
    {
      name: "Conqueror of Evil: Wrath Deity",
      image: "6/69/Constellation_Conqueror_of_Evil_-_Wrath_Deity",
    },
    {
      name: "Transcension: Extinction of Suffering",
      image: "2/24/Constellation_Transcension_-_Extinction_of_Suffering",
    },
    {
      name: "Evolution Eon: Origin of Ignorance",
      image: "f/f9/Constellation_Evolution_Eon_-_Origin_of_Ignorance",
    },
    {
      name: "Conqueror of Evil: Guardian Yaksha",
      image: "d/d7/Constellation_Conqueror_of_Evil_-_Guardian_Yaksha",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      desc: ({ char, partyData }) => (
        <>
          Increases Xiao's <Green>Normal / Charged / Plunge Attack DMG</Green> by{" "}
          <Green b>{getEBBuffValue(char, partyData)}%</Green> and converts them to{" "}
          <Anemo>Anemo DMG</Anemo>.
        </>
      ),
      affect: EModAffect.SELF,
      applyBuff: ({ attPattBonus, char, partyData, desc, tracker }) => {
        const buffValue = getEBBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], buffValue, tracker);
      },
      infuseConfig: {
        range: [...NORMAL_ATTACKS],
        overwritable: false,
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      desc: () => (
        <>
          With the effects of Bane of All Evil [EB], Xiao's <Green>DMG</Green> is increases by{" "}
          <Green b>5%</Green>. DMG increases by a further <Green b>5%</Green> for every 3s the
          ability persists. Max <Rose>25%</Rose>.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct", 5 * (inputs?.[0] || 0), tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      desc: () => (
        <>
          Using Lemniscatic Wind Cycling increases subsequent Lemniscatic Wind Cycling{" "}
          <Green>[ES] DMG</Green> by <Green b>15%</Green>. This effect lasts for 7s, and has a
          maximum of <Rose>3 stacks</Rose>.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct", 15 * (inputs?.[0] || 0), tracker);
      },
    },
  ],
};

export default Xiao;
