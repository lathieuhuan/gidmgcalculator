import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs } from "../utils";

const Lisa: DefaultAppCharacter = {
  code: 10,
  name: "Lisa",
  icon: "6/65/Lisa_Icon",
  sideIcon: "2/26/Lisa_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
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
  bonusStat: {
    type: "em",
    value: 24,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 39.6 },
      { name: "2-Hit", multFactors: 35.92 },
      { name: "3-Hit", multFactors: 42.8 },
      { name: "4-Hit", multFactors: 54.96 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 177.12,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "Press DMG", multFactors: 80 },
      { name: "0-stack Hold", multFactors: 320 },
      { name: "1-stack Hold", multFactors: 368 },
      { name: "2-stack Hold", multFactors: 424 },
      { name: "3-stack Hold", multFactors: 487.2 },
    ],
    EB: [
      {
        name: "Discharge DMG",
        multFactors: 36.56,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Lightning Touch",
    },
    ES: {
      name: "Violet Arc",
      image: "c/c8/Talent_Violet_Arc",
    },
    EB: {
      name: "Lightning Rose",
      image: "f/fd/Talent_Lightning_Rose",
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
      src: EModSrc.A4,
      description: `Opponents hit by Lightning Rose [EB] have their {DEF}#[gr} decreased by {15%}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyDebuff: makeModApplier("resistReduct", "def", 15),
    },
  ],
};

export default Lisa as AppCharacter;
