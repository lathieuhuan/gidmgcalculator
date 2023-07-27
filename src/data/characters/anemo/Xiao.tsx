import type { AppCharacter, CharInfo, DefaultAppCharacter, PartyData } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { Anemo, Green, Lightgold, Rose } from "@Src/pure-components";
import { round } from "@Src/utils";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc, HEAVIER_PAs } from "../constants";
import { checkAscs } from "../utils";

const getEBBuffValue = (char: CharInfo, partyData: PartyData) => {
  const level = finalTalentLv({ char, charData: Xiao as AppCharacter, talentType: "EB", partyData });
  return round(58.45 * TALENT_LV_MULTIPLIERS[5][level], 2);
};

const Xiao: DefaultAppCharacter = {
  code: 30,
  name: "Xiao",
  icon: "f/fd/Xiao_Icon",
  sideIcon: "4/49/Xiao_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "anemo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
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
  bonusStat: { type: "cRate_", value: 4.8 },
  activeTalents: {
    NAs: {
      name: "Whirlwind Thrust",
    },
    ES: {
      name: "Lemniscatic Wind Cycling",
      image: "d/da/Talent_Lemniscatic_Wind_Cycling",
    },
    EB: {
      name: "Bane of All Evil",
      image: "2/2f/Talent_Bane_of_All_Evil",
    },
  },
  calcListConfig: {
    NA: {
      multScale: 4,
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit (1/2)", multFactors: 27.54 },
      { name: "2-Hit", multFactors: 56.94 },
      { name: "3-Hit", multFactors: 68.55 },
      { name: "4-Hit (1/2)", multFactors: 37.66 },
      { name: "5-Hit", multFactors: 71.54 },
      { name: "6-Hit", multFactors: 95.83 },
    ],
    CA: [{ name: "Charged Attack", multFactors: { root: 121.09, scale: 4 } }],
    PA: HEAVIER_PAs,
    ES: [{ name: "Skill DMG", multFactors: 252.8 }],
    EB: [],
  },
  passiveTalents: [
    { name: "Conqueror of Evil: Tamer of Demons", image: "d/df/Talent_Conqueror_of_Evil_Tamer_of_Demons" },
    { name: "Dissolution Eon: Heaven Fall", image: "d/d8/Talent_Dissolution_Eon_Heaven_Fall" },
    { name: "Transcension: Gravity Defier", image: "4/46/Talent_Transcension_Gravity_Defier" },
  ],
  constellation: [
    { name: "Dissolution Eon: Destroyer of Worlds", image: "e/e7/Constellation_Dissolution_Eon_-_Destroyer_of_Worlds" },
    {
      name: "Annihilation Eon: Blossom of Kaleidos",
      image: "f/f7/Constellation_Annihilation_Eon_-_Blossom_of_Kaleidos",
    },
    { name: "Conqueror of Evil: Wrath Deity", image: "6/69/Constellation_Conqueror_of_Evil_-_Wrath_Deity" },
    {
      name: "Transcension: Extinction of Suffering",
      image: "2/24/Constellation_Transcension_-_Extinction_of_Suffering",
    },
    { name: "Evolution Eon: Origin of Ignorance", image: "f/f9/Constellation_Evolution_Eon_-_Origin_of_Ignorance" },
    { name: "Conqueror of Evil: Guardian Yaksha", image: "d/d7/Constellation_Conqueror_of_Evil_-_Guardian_Yaksha" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.SELF,
      desc: ({ char, partyData }) => (
        <>
          Increases Xiao's <Green>Normal / Charged / Plunge Attack DMG</Green> by{" "}
          <Green b>{getEBBuffValue(char, partyData)}%</Green> and grants him an <Anemo>Anemo Infusion</Anemo> that
          cannot be overridden.
          <br />• At <Lightgold>A1</Lightgold>, Xiao's <Green>DMG</Green> is increased by <Green b>5%</Green>, and a
          further <Green b>5%</Green> for every 3s the ability persists. Max <Rose>25%</Rose>
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ attPattBonus, char, partyData, inputs, desc, tracker }) => {
        const buffValue = getEBBuffValue(char, partyData);
        applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], buffValue, tracker);

        if (checkAscs[1](char)) {
          applyModifier(desc, attPattBonus, "all.pct_", 5 * (inputs[0] || 0), tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Using Lemniscatic Wind Cycling increases subsequent Lemniscatic Wind Cycling <Green>[ES] DMG</Green> by{" "}
          <Green b>15%</Green>. This effect lasts for 7s, and has a maximum of <Rose>3</Rose> stacks.
        </>
      ),
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 15 * (inputs[0] || 0), tracker);
      },
    },
  ],
};

export default Xiao as AppCharacter;
