import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { makeModApplier } from "@Calculators/utils";
import { checkCons } from "../utils";

const Kaeya: DataCharacter = {
  code: 5,
  name: "Kaeya",
  icon: "3/33/Character_Kaeya_Thumb",
  sideIcon: "d/d0/Character_Kaeya_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weapon: "sword",
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
  bonusStat: { type: "er", value: 6.7 },
  NAsConfig: {
    name: "Ceremonial Bladework",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 53.75 },
        { name: "2-Hit", baseMult: 51.69 },
        { name: "3-Hit", baseMult: 65.27 },
        { name: "4-Hit", baseMult: 70.86 },
        { name: "5-Hit", baseMult: 88.24 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: [55.04, 73.1] }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Frostgnaw",
      image: "5/51/Talent_Frostgnaw",
      xtraLvAtCons: 3,
      stats: [{ name: "Skill DMG", baseMult: 191.2 }],
      // getExtraStats: () => [{ name: "CD", value: "6s" }],
    },
    EB: {
      name: "Glacial Waltz",
      image: "2/29/Talent_Glacial_Waltz",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", baseMult: 77.6 }],
      // getExtraStats: () => [
      //   { name: "Duration", value: "8s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Cold-Blooded Strike", image: "c/c4/Talent_Cold-Blooded_Strike" },
    { name: "Glacial Heart", image: "6/6f/Talent_Glacial_Heart" },
    { name: "Hidden Strength", image: "8/8e/Talent_Hidden_Strength" },
  ],
  constellation: [
    { name: "Excellent Blood", image: "0/0a/Constellation_Excellent_Blood" },
    { name: "Never-Ending Performance", image: "7/78/Constellation_Never-Ending_Performance" },
    { name: "Dance of Frost", image: "2/2d/Constellation_Dance_of_Frost" },
    { name: "Frozen Kiss", image: "a/a3/Constellation_Frozen_Kiss" },
    { name: "Frostbiting Embrace", image: "0/04/Constellation_Frostbiting_Embrace" },
    { name: "Glacial Whirlwind", image: "b/bb/Constellation_Glacial_Whirlwind" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      desc: () => (
        <>
          The <Green>CRIT Rate</Green> of Kaeya's <Green>Normal and Charged Attacks</Green> against
          opponents affected by Cryo is increased by <Green b>15%</Green>.
        </>
      ),
      isGranted: checkCons[1],
      affect: EModAffect.SELF,
      applyBuff: makeModApplier("attPattBonus", ["NA.cRate", "CA.cRate"], 15),
    },
  ],
};

export default Kaeya;
