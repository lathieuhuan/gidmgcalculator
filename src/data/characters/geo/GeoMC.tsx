import type { DataCharacter } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { makeModApplier } from "@Calculators/utils";
import { checkCons } from "../utils";

const GeoMC: DataCharacter = {
  code: 12,
  name: "Geo Traveler",
  ...TRAVELER_INFO,
  vision: "geo",
  NAsConfig: {
    name: "Foreign Rockblade",
  },
  activeTalents: {
    ...TRAVELLER_NCPAs,
    ES: {
      name: "Starfell Sword",
      image: "0/05/Talent_Starfell_Sword",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", multBase: 248 }],
      // getExtraStats: () => [
      //   { name: "Meteorite Duration", value: "30s" },
      //   { name: "CD", value: "8s" }
      // ]
    },
    EB: {
      name: "Wake of Earth",
      image: "5/5f/Talent_Wake_of_Earth",
      xtraLvAtCons: 3,
      stats: [{ name: "DMG per Shockwave", multBase: 148 }],
      // getExtraStats: () => [
      //   { name: "Stonewall Duration", value: "30s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Shattered Darkrock", image: "5/5e/Talent_Shattered_Darkrock" },
    { name: "Frenzied Rockslide", image: "4/40/Talent_Frenzied_Rockslide" },
  ],
  constellation: [
    { name: "Invincible Stonewall", image: "a/a1/Constellation_Invincible_Stonewall" },
    { name: "Rockcore Meltdown", image: "f/f4/Constellation_Rockcore_Meltdown" },
    { name: "Will of the Rock", image: "1/19/Constellation_Will_of_the_Rock" },
    { name: "Reaction Force", image: "4/41/Constellation_Reaction_Force" },
    { name: "Meteorite Impact", image: "f/fd/Constellation_Meteorite_Impact" },
    { name: "Everlasting Boulder", image: "9/95/Constellation_Everlasting_Boulder" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      desc: () => (
        <>
          Party members within the radius of Wake of Earth have their <Green>CRIT Rate</Green>{" "}
          increased by <Green b>10%</Green> and have increased resistance against interruption.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.PARTY,
      applyBuff: makeModApplier("totalAttr", "cRate", 10),
    },
  ],
};

export default GeoMC;
