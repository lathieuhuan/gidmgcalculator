import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs } from "../utils";

const Lisa: DataCharacter = {
  code: 10,
  name: "Lisa",
  icon: "5/51/Character_Lisa_Thumb",
  sideIcon: "e/e6/Character_Lisa_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "catalyst",
  stats: [
    [802, 19, 48],
    [2061, 50, 123],
    [2661, 64, 159],
    [3985, 96, 239],
    [4411, 107, 264],
    [5074, 123, 304],
    [5642, 136, 338],
    [6305, 153, 378],
    [6731, 163, 403],
    [7393, 179, 443],
    [7818, 189, 468],
    [8481, 205, 508],
    [8907, 215, 534],
    [9570, 232, 573],
  ],
  bonusStat: { type: "em", value: 24 },
  NAsConfig: {
    name: "Lightning Touch",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: { root: 39.6 } },
        { name: "2-Hit", multFactors: { root: 35.92 } },
        { name: "3-Hit", multFactors: { root: 42.8 } },
        { name: "4-Hit", multFactors: { root: 54.96 } },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", multFactors: { root: 177.12 } }] },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Violet Arc",
      image: "c/c8/Talent_Violet_Arc",
      xtraLvAtCons: 5,
      stats: [
        { name: "Press DMG", multFactors: { root: 80 } },
        { name: "0-stack Hold", multFactors: { root: 320 } },
        { name: "1-stack Hold", multFactors: { root: 368 } },
        { name: "2-stack Hold", multFactors: { root: 424 } },
        { name: "3-stack Hold", multFactors: { root: 487.2 } },
      ],
      // getExtraStats: () => [
      //   { name: "Press CD", value: "1s" },
      //   { name: "Hold CD", value: "16s" },
      // ],
    },
    EB: {
      name: "Lightning Rose",
      image: "f/fd/Talent_Lightning_Rose",
      xtraLvAtCons: 3,
      stats: [{ name: "Discharge DMG", multFactors: { root: 36.56 } }],
      // getExtraStats: () => [
      //   { name: "Duration", value: "15s" },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Induced Aftershock", image: "4/48/Talent_Induced_Aftershock" },
    { name: "Static Electricity Field", image: "9/9a/Talent_Static_Electricity_Field" },
    { name: "General Pharmaceutics", image: "7/7c/Talent_General_Pharmaceutics" },
  ],
  constellation: [
    { name: "Infinite Circuit", image: "1/13/Constellation_Infinite_Circuit" },
    { name: "Electromagnetic Field", image: "f/f5/Constellation_Electromagnetic_Field" },
    { name: "Resonant Thunder", image: "d/de/Constellation_Resonant_Thunder" },
    { name: "Plasma Eruption", image: "2/2b/Constellation_Plasma_Eruption" },
    { name: "Electrocute", image: "1/1d/Constellation_Electrocute" },
    { name: "Pulsating Witch", image: "f/f4/Constellation_Pulsating_Witch" },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C4,
      desc: () => (
        <>
          Opponents hit by Lightning Rose [EB] have their <Green>DEF</Green> decreased by{" "}
          <Green b>15%</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Lisa;
