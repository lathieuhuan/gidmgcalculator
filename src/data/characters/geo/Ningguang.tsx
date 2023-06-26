import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/components";
import { EModAffect } from "@Src/constants";
import { EModSrc, LIGHT_PAs } from "../constants";
import { makeModApplier } from "@Src/utils/calculation";
import { checkAscs } from "../utils";

const Ningguang: DataCharacter = {
  code: 13,
  name: "Ningguang",
  icon: "e/e0/Ningguang_Icon",
  sideIcon: "2/25/Ningguang_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "catalyst",
  stats: [
    [821, 18, 48],
    [2108, 46, 123],
    [2721, 59, 159],
    [4076, 88, 239],
    [4512, 98, 264],
    [5189, 113, 304],
    [5770, 125, 338],
    [6448, 140, 378],
    [6884, 149, 403],
    [7561, 164, 443],
    [7996, 174, 468],
    [8674, 188, 508],
    [9110, 198, 534],
    [9787, 212, 573],
  ],
  bonusStat: { type: "geo", value: 6 },
  NAsConfig: {
    name: "Sparkling Scatter",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: { stats: [{ name: "Normal Attack", multFactors: 28 }] },
    CA: {
      stats: [
        { name: "Charged Attack", multFactors: 174.08 },
        { name: "DMG per Star Jade", multFactors: 49.6 },
      ],
    },
    PA: { stats: LIGHT_PAs },
    ES: {
      name: "Jade Screen",
      image: "e/e8/Talent_Jade_Screen",
      stats: [
        {
          name: "Inherited HP",
          notAttack: "other",
          multFactors: { root: 50.1, attributeType: "hp", scale: 5 },
        },
        { name: "Skill DMG", multFactors: 230.4 },
      ],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
    },
    EB: {
      name: "Starshatter",
      image: "4/47/Talent_Starshatter",
      stats: [{ name: "DMG per Gem", multFactors: 86.96 }],
      // getExtraStats: () => [{ name: "CD", value: "12s" }],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Backup Plan", image: "2/2d/Talent_Backup_Plan" },
    { name: "Strategic Reserve", image: "6/62/Talent_Strategic_Reserve" },
    { name: "Trove of Marvelous Treasures", image: "4/43/Talent_Trove_of_Marvelous_Treasures" },
  ],
  constellation: [
    { name: "Piercing Fragments", image: "5/52/Constellation_Piercing_Fragments" },
    { name: "Shock Effect", image: "8/8b/Constellation_Shock_Effect" },
    {
      name: "Majesty be the Array of Stars",
      image: "e/e4/Constellation_Majesty_Be_the_Array_of_Stars",
    },
    {
      name: "Exquisite be the Jade, Outshining All Beneath",
      image: "a/a8/Constellation_Exquisite_be_the_Jade%2C_Outshining_All_Beneath",
    },
    {
      name: "Invincible be the Jade Screen",
      image: "4/45/Constellation_Invincible_Be_the_Jade_Screen",
    },
    {
      name: "Grandeur be the Seven Stars",
      image: "9/9b/Constellation_Grandeur_Be_the_Seven_Stars",
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      desc: () => (
        <>
          A character that passes through the Jade Screen [~ES] will gain a <Green b>12%</Green>{" "}
          <Green>Geo DMG Bonus</Green> for 10s.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "geo", 12),
    },
  ],
};

export default Ningguang;
