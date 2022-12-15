import { EModAffect } from "@Src/constants";
import { Green, Hydro } from "@Src/styled-components";
import type { DataCharacter } from "@Src/types";
import { BOW_CAs, EModSrc, MEDIUM_PAs } from "../constants";

const Tartaglia: DataCharacter = {
  code: 26,
  name: "Tartaglia",
  icon: "5/53/Character_Tartaglia_Thumb",
  sideIcon: "c/ca/Character_Tartaglia_Side_Icon",
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
        { name: "1-Hit", multBase: 41.28 },
        { name: "2-Hit", multBase: 46.27 },
        { name: "3-Hit", multBase: 55.38 },
        { name: "4-Hit", multBase: 57.02 },
        { name: "5-Hit", multBase: 60.89 },
        { name: "6-Hit", multBase: 72.76 },
        { name: "Riptide Flash x3", attElmt: "hydro", multBase: 37.2, multType: 2 },
        { name: "Riptide Burst", attElmt: "hydro", multBase: 62, multType: 2 },
      ],
    },
    CA: { stats: BOW_CAs },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Foul Legacy: Raging Tide",
      image: "b/b5/Talent_Foul_Legacy_Raging_Tide",
      xtraLvAtCons: 3,
      stats: [
        { name: "Stance Change DMG", multBase: 72 },
        { name: "1-Hit", attPatt: "NA", multBase: 38.87, multType: 1 },
        { name: "2-Hit", attPatt: "NA", multBase: 41.62, multType: 1 },
        { name: "3-Hit", attPatt: "NA", multBase: 56.33, multType: 1 },
        { name: "4-Hit", attPatt: "NA", multBase: 59.94, multType: 1 },
        { name: "5-Hit", attPatt: "NA", multBase: 55.3, multType: 1 },
        { name: "6-Hit", attPatt: "NA", multBase: [35.43, 37.67], multType: 1 },
        { name: "Charged Attack", attPatt: "CA", multBase: [60.2, 71.98], multType: 1 },
        { name: "Riptide Slash", multBase: 60.2 },
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
        { name: "Melee Skill DMG", multBase: 464 },
        { name: "Range Skill DMG", multBase: 378.4 },
        { name: "Riptide Blast", multBase: 120 },
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
      desc: () => (
        <>
          Tartaglia's <Green>Normal and Charged Attacks</Green> are converted to{" "}
          <Hydro>Hydro DMG</Hydro> that cannot be overridden by any other elemental infusion.
        </>
      ),
      affect: EModAffect.SELF,
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
  ],
};

export default Tartaglia;
