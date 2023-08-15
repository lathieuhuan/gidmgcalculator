import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkCons } from "../utils";

const Kaeya: DefaultAppCharacter = {
  code: 5,
  name: "Kaeya",
  icon: "b/b6/Kaeya_Icon",
  sideIcon: "b/b5/Kaeya_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [976, 19, 66],
    [2506, 48, 171],
    [3235, 62, 220],
    [4846, 93, 330],
    [5364, 103, 365],
    [6170, 118, 420],
    [6860, 131, 467],
    [7666, 147, 522],
    [8184, 157, 557],
    [8989, 172, 612],
    [9507, 182, 647],
    [10312, 198, 702],
    [10830, 208, 737],
    [11636, 223, 792],
  ],
  bonusStat: { type: "er_", value: 6.7 },
  activeTalents: {
    NAs: {
      name: "Ceremonial Bladework",
    },
    ES: {
      name: "Frostgnaw",
      image: "5/51/Talent_Frostgnaw",
    },
    EB: {
      name: "Glacial Waltz",
      image: "2/29/Talent_Glacial_Waltz",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 53.75 },
      { name: "2-Hit", multFactors: 51.69 },
      { name: "3-Hit", multFactors: 65.27 },
      { name: "4-Hit", multFactors: 70.86 },
      { name: "5-Hit", multFactors: 88.24 },
    ],
    CA: [{ name: "Charged Attack", multFactors: [55.04, 73.1] }],
    PA: MEDIUM_PAs,
    ES: [{ name: "Skill DMG", multFactors: 191.2 }],
    EB: [{ name: "Skill DMG", multFactors: 77.6 }],
  },
  passiveTalents: [
    { name: "Cold-Blooded Strike", image: "c/c4/Talent_Cold-Blooded_Strike" },
    { name: "Glacial Heart", image: "6/6f/Talent_Glacial_Heart" },
    { name: "Hidden Strength", image: "8/8e/Talent_Hidden_Strength" },
  ],
  constellation: [
    { name: "Excellent Blood", image: "0/0a/Constellation_Excellent_Blood" },
    {
      name: "Never-Ending Performance",
      image: "7/78/Constellation_Never-Ending_Performance",
    },
    { name: "Dance of Frost", image: "2/2d/Constellation_Dance_of_Frost" },
    { name: "Frozen Kiss", image: "a/a3/Constellation_Frozen_Kiss" },
    {
      name: "Frostbiting Embrace",
      image: "0/04/Constellation_Frostbiting_Embrace",
    },
    {
      name: "Glacial Whirlwind",
      image: "b/bb/Constellation_Glacial_Whirlwind",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Kaeya's {Normal and Charged Attack CRIT Rate}#[gr] against opponents affected by Cryo is increased
      by {15%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("attPattBonus", ["NA.cRate_", "CA.cRate_"], 15),
    },
  ],
};

export default Kaeya as AppCharacter;