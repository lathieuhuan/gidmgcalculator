import type { DataCharacter } from "@Src/types";
import { BOW_CAs, MEDIUM_PAs } from "../constants";

const Tartaglia: DataCharacter = {
  code: 26,
  name: "Tartaglia",
  icon: "5/53/Character_Tartaglia_Thumb",
  sideIcon: "c/ca/Character_Tartaglia_Side_Icon",
  rarity: 5,
  nation: "snezhnaya",
  vision: "hydro",
  weapon: "bow",
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
        { name: "1-Hit", baseMult: 41.28 },
        { name: "2-Hit", baseMult: 46.27 },
        { name: "3-Hit", baseMult: 55.38 },
        { name: "4-Hit", baseMult: 57.02 },
        { name: "5-Hit", baseMult: 60.89 },
        { name: "6-Hit", baseMult: 72.76 },
        { name: "Riptide Flash x3", dmgTypes: ["NA", "hydro"], baseMult: 37.2, multType: 2 },
        { name: "Riptide Burst", dmgTypes: ["NA", "hydro"], baseMult: 62, multType: 2 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Foul Legacy: Raging Tide",
      image: "b/b5/Talent_Foul_Legacy_Raging_Tide",
      xtraLvAtCons: 3,
      stats: [
        { name: "Stance Change DMG", baseMult: 72 },
        { name: "1-Hit", dmgTypes: ["NA", "hydro"], baseMult: 38.87, multType: 1 },
        { name: "2-Hit", dmgTypes: ["NA", "hydro"], baseMult: 41.62, multType: 1 },
        { name: "3-Hit", dmgTypes: ["NA", "hydro"], baseMult: 56.33, multType: 1 },
        { name: "4-Hit", dmgTypes: ["NA", "hydro"], baseMult: 59.94, multType: 1 },
        { name: "5-Hit", dmgTypes: ["NA", "hydro"], baseMult: 55.3, multType: 1 },
        { name: "6-Hit", dmgTypes: ["NA", "hydro"], baseMult: [35.43, 37.67], multType: 1 },
        { name: "Charged Attack", dmgTypes: ["CA", "hydro"], baseMult: [60.2, 71.98], multType: 1 },
        { name: "Riptide Slash", baseMult: 60.2 },
      ],
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
      xtraLvAtCons: 5,
      stats: [
        { name: "Melee Skill DMG", baseMult: 464 },
        { name: "Range Skill DMG", baseMult: 378.4 },
        { name: "Riptide Blast", baseMult: 120 },
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
};

export default Tartaglia;