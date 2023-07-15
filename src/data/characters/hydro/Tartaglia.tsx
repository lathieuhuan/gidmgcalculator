import type { AppCharacter } from "@Src/types";
import { Green, Hydro } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { BOW_CAs, EModSrc, MEDIUM_PAs } from "../constants";

const Tartaglia: AppCharacter = {
  code: 26,
  name: "Tartaglia",
  icon: "8/85/Tartaglia_Icon",
  sideIcon: "2/2f/Tartaglia_Side_Icon",
  rarity: 5,
  nation: "snezhnaya",
  vision: "hydro",
  weaponType: "bow",
  stats: [
    [1020, 23, 63],
    [2646, 61, 165],
    [3521, 81, 219],
    [5268, 121, 328],
    [5889, 135, 366],
    [6776, 156, 421],
    [7604, 175, 473],
    [8500, 195, 528],
    [9121, 210, 567],
    [10025, 231, 623],
    [10647, 247, 662],
    [11561, 266, 719],
    [12182, 280, 757],
    [13103, 301, 815],
  ],
  bonusStat: { type: "hydro", value: 7.2 },
  NAsConfig: {
    name: "Cutting Torrent",
    // getExtraStats: () => [{ name: "Riptide Duration", value: "10s" }],
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 41.28 },
        { name: "2-Hit", multFactors: 46.27 },
        { name: "3-Hit", multFactors: 55.38 },
        { name: "4-Hit", multFactors: 57.02 },
        { name: "5-Hit", multFactors: 60.89 },
        { name: "6-Hit", multFactors: 72.76 },
        { name: "Riptide Flash (1/3)", attElmt: "hydro", multFactors: { root: 12.4, scale: 2 } },
        { name: "Riptide Burst", attElmt: "hydro", multFactors: { root: 62, scale: 2 } },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Foul Legacy: Raging Tide",
      image: "b/b5/Talent_Foul_Legacy_Raging_Tide",
      stats: [
        { name: "Stance Change DMG", multFactors: { root: 72, scale: 2 } },
        { name: "1-Hit", attPatt: "NA", multFactors: 38.87 },
        { name: "2-Hit", attPatt: "NA", multFactors: 41.62 },
        { name: "3-Hit", attPatt: "NA", multFactors: 56.33 },
        { name: "4-Hit", attPatt: "NA", multFactors: 59.94 },
        { name: "5-Hit", attPatt: "NA", multFactors: 55.3 },
        { name: "6-Hit", attPatt: "NA", multFactors: [35.43, 37.67] },
        { name: "Charged Attack", attPatt: "CA", multFactors: [60.2, 71.98] },
        { name: "Riptide Slash", multFactors: 60.2 },
      ],
      multScale: 1,
      // getExtraStats: () => [
      //   { name: "Charged Attack Stamina Cost", value: 20 },
      //   { name: "Max Duration", value: "12s" },
      //   { name: "Preemtive CD", value: "6-36s" },
      //   { name: "Max CD", value: "45s" },
      // ],
    },
    EB: {
      name: "Havoc: Obliteration",
      image: "0/03/Talent_Havoc_Obliteration",
      stats: [
        { name: "Melee Skill DMG", multFactors: 464 },
        { name: "Range Skill DMG", multFactors: 378.4 },
        { name: "Riptide Blast", multFactors: 120 },
      ],
      // getExtraStats: () => [
      //   { name: "Energy Return (Range)", value: "12s" },
      //   { name: "CD", value: "15s" },
      // ],
      energyCost: 60,
    },
  },
  passiveTalents: [
    { name: "Never Ending", image: "e/ea/Talent_Never_Ending" },
    { name: "Sword of Torrents", image: "d/d8/Talent_Sword_of_Torrents" },
    { name: "Master of Weaponry", image: "4/45/Talent_Master_of_Weaponry" },
  ],
  constellation: [
    {
      name: "Foul Legacy: Tide Withholder",
      image: "f/ff/Constellation_Foul_Legacy_Tide_Withholder",
    },
    { name: "Foul Legacy: Understream", image: "0/0e/Constellation_Foul_Legacy_Understream" },
    {
      name: "Abyssal Mayhem: Vortex of Turmoil",
      image: "6/6d/Constellation_Abyssal_Mayhem_Vortex_of_Turmoil",
    },
    { name: "Abyssal Mayhem: Hydrospout", image: "9/9d/Constellation_Abyssal_Mayhem_Hydrospout" },
    { name: "Havoc: Formless Blade", image: "2/20/Constellation_Havoc_Formless_Blade" },
    { name: "Havoc: Annihilation", image: "5/5a/Constellation_Havoc_Annihilation" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Tartaglia's <Green>Normal and Charged Attacks</Green> are converted to <Hydro>Hydro DMG</Hydro> that cannot be
          overridden.
        </>
      ),
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
  ],
};

export default Tartaglia;
