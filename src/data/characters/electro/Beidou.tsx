import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { applyModifier, makeModApplier } from "@Calculators/utils";
import { checkAscs, checkCons, talentBuff } from "../utils";

const Beidou: DataCharacter = {
  code: 6,
  name: "Beidou",
  icon: "6/61/Character_Beidou_Thumb",
  sideIcon: "5/54/Character_Beidou_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "electro",
  weapon: "claymore",
  stats: [
    [1094, 19, 54],
    [2811, 48, 140],
    [3628, 63, 180],
    [5435, 94, 270],
    [6015, 104, 299],
    [6919, 119, 344],
    [7694, 133, 382],
    [8597, 148, 427],
    [9178, 158, 456],
    [10081, 174, 501],
    [10662, 184, 530],
    [11565, 200, 575],
    [12146, 210, 603],
    [13050, 225, 648],
  ],
  bonusStat: { type: "electro", value: 6 },
  NAsConfig: {
    name: "Oceanborne",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 71.12 },
        { name: "2-Hit", baseMult: 70.86 },
        { name: "3-Hit", baseMult: 88.32 },
        { name: "4-Hit", baseMult: 86.52 },
        { name: "5-Hit", baseMult: 112.14 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", baseMult: 56.24 },
        { name: "Charged Attack Final", baseMult: 101.82 },
        {
          name: "Extra Hit (C4)",
          conditional: true,
          dmgTypes: [null, "electro"],
          baseMult: 0,
          multType: 1,
          getTalentBuff: ({ char }) => talentBuff([checkCons[4](char), "mult", [false, 4], 20]),
        },
      ],
    },
    PA: { stats: HEAVY_PAs },
    ES: {
      name: "Tidecaller",
      image: "9/92/Talent_Tidecaller",
      xtraLvAtCons: 3,
      stats: [
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          baseMult: 14.4,
          multType: 2,
          flat: { base: 1386, type: 3 },
        },
        { name: "Base DMG", baseMult: 121.6 },
        { name: "DMG Bonus on Hit", baseMult: 160 },
        { name: "Full Counter", baseMult: 441.6, conditional: true },
      ],
      // getExtraStats: () => [{ name: "CD", value: "7.5s" }],
    },
    EB: {
      name: "Stormbreaker",
      image: "3/33/Talent_Stormbreaker",
      xtraLvAtCons: 5,
      stats: [
        { name: "Skill DMG", baseMult: 121.6 },
        { name: "Lightning DMG", baseMult: 96 },
      ],
      // getExtraStats: (lv) => [
      //   {
      //     name: "DMG Reduction",
      //     value: [0, 20, 21, 22, 24, 25, 26, 28, 30, 32, 34, 35, 36, 37, 38, 39][lv] + "%",
      //   },
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Retribution", image: "6/69/Talent_Retribution" },
    { name: "Lightning Storm", image: "8/8a/Talent_Lightning_Storm" },
    { name: "Conqueror of Tides", image: "d/d3/Talent_Conqueror_of_Tides" },
  ],
  constellation: [
    { name: "Sea Beast's Scourge", image: "2/23/Constellation_Sea_Beast%27s_Scourge" },
    {
      name: "Upon the Turbulent Sea, the Thunder Arises",
      image: "d/df/Constellation_Upon_the_Turbulent_Sea%2C_the_Thunder_Arises",
    },
    { name: "Summoner of Storm", image: "8/8e/Constellation_Summoner_of_Storm" },
    { name: "Stunning Revenge", image: "6/63/Constellation_Stunning_Revenge" },
    { name: "Crimson Tidewalker", image: "2/23/Constellation_Crimson_Tidewalker" },
    { name: "Bane of Evil", image: "c/c5/Constellation_Bane_of_Evil" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      desc: () => (
        <>
          After unleashing Tidecaller with its maximum DMG Bonus, Beidou's{" "}
          <Green>Normal and Charged Attacks DMG</Green> and <Green>ATK SPD</Green> are increased by{" "}
          <Green b>15%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct"], 15, tracker);
        applyModifier(desc, totalAttr, ["naAtkSpd", "caAtkSpd"], 15, tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C6,
      desc: () => (
        <>
          During the duration of Stormbreaker, the <Green>Electro RES</Green> of surrounding
          opponents is decreased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[6],
      applyDebuff: makeModApplier("resistReduct", "electro", 15),
    },
  ],
};

export default Beidou;
