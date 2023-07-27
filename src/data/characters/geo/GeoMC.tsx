import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, TRAVELER_INFO, TRAVELLER_NCPAs } from "../constants";
import { checkCons } from "../utils";

const GeoMC: DefaultAppCharacter = {
  code: 12,
  name: "Geo Traveler",
  ...TRAVELER_INFO,
  vision: "geo",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  calcList: {
    ...TRAVELLER_NCPAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 248,
      },
    ],
    EB: [
      {
        name: "DMG per Shockwave",
        multFactors: 148,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Foreign Rockblade",
    },
    ES: {
      name: "Starfell Sword",
      image: "0/05/Talent_Starfell_Sword",
    },
    EB: {
      name: "Wake of Earth",
      image: "5/5f/Talent_Wake_of_Earth",
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
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          Party members within the radius of Wake of Earth have their <Green>CRIT Rate</Green> increased by{" "}
          <Green b>10%</Green> and have increased resistance against interruption.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "cRate_", 10),
    },
  ],
};

export default GeoMC as AppCharacter;
