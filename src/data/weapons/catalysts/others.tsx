import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";

const otherCatalysts: AppWeapon[] = [
  {
    code: 128,
    name: "Otherworldly Story",
    icon: "1/11/Weapon_Otherworldly_Story",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "er_", scale: "8.5%" },
    passiveName: "Energy Shower",
    description: {
      pots: [`Each Elemental Orb or Particle collected restores {0}% HP.`],
      seeds: [{ base: 0.75, dull: true }],
    },
  },
  {
    code: 27,
    name: "Emerald Orb",
    icon: "7/7c/Weapon_Emerald_Orb",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "em", scale: "20" },
    passiveName: "Rapids",
    description: {
      pots: [
        `Upon causing a Vaporize, Electro-Charged, Frozen, or a Hydro-infused Swirl reaction, increases ATK by {0}% for
        12s.`,
      ],
      seeds: [15],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 28,
    name: "Twin Nephrite",
    icon: "e/e3/Weapon_Twin_Nephrite",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "cRate_", scale: "3.4%" },
    passiveName: "Rapids",
    description: {
      pots: ["Defeating an opponent increases Movement SPD and ATK by {0}% for 15s."],
      seeds: [{ base: 10, increment: 2 }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 10,
        increment: 2,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 29,
    name: "Thrilling Tales of Dragon Slayers",
    icon: "1/19/Weapon_Thrilling_Tales_of_Dragon_Slayers",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    passiveName: "Legacy",
    description: {
      pots: [
        `When switching characters, the new character taking the field has their ATK increased by {0}% for 10s. This
        effect can only occur once every 20s.`,
      ],
      seeds: [18],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.TEAMMATE,
        base: 18,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 30,
    name: "Magic Guide",
    icon: "3/39/Weapon_Magic_Guide",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "em", scale: "41" },
    ...baneSeries1("Storm and Tide", "Hydro or Electro"),
  },
  {
    code: 35,
    name: "Pocket Grimoire",
    icon: "1/16/Weapon_Pocket_Grimoire",
    ...GREEN_INFO,
  },
  {
    code: 36,
    name: "Apprentice's Notes",
    icon: "c/cf/Weapon_Apprentice%27s_Notes",
    ...GRAY_INFO,
  },
];

export default otherCatalysts;
