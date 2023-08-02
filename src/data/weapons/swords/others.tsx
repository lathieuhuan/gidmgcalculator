import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";

const otherSwords: AppWeapon[] = [
  {
    code: 132,
    name: "Traveler's Handy Sword",
    icon: "c/c9/Weapon_Traveler%27s_Handy_Sword",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "def_", scale: "6.4%" },
    passiveName: "Journey",
    description: {
      pots: [`Each Elemental Orb or Particle collected restores {0}% HP.`],
      seeds: [{ base: 0.75, dull: true }],
    },
  },
  {
    code: 131,
    name: "Dark Iron Sword",
    icon: "3/3a/Weapon_Dark_Iron_Sword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "em", scale: "31" },
    passiveName: "Overloaded",
    description: {
      pots: [
        `Upon causing an Overloaded, Superconduct, Electro-Charged, or an Electro-infused Swirl reaction, ATK is
        increased by {0}% for 12s.`,
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
    code: 97,
    name: "Fillet Blade",
    icon: "f/f7/Weapon_Fillet_Blade",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "atk_", scale: "7.7%" },
    passiveName: "Gash",
    description: {
      pots: [`On hit, has 50% chance to deal {0}% ATK DMG to a single enemy. Can only occur once every {1}s.`],
      seeds: [
        { base: 200, increment: 40, dull: true },
        { base: 16, increment: -1, dull: true },
      ],
    },
  },
  {
    code: 98,
    name: "Harbinger of Dawn",
    icon: "2/23/Weapon_Harbinger_of_Dawn",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cDmg_", scale: "10.2%" },
    passiveName: "Vigorous",
    description: { pots: [`When HP is above 90%, increases CRIT Rate by {0}%.`], seeds: [10.5] },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 10.5,
        targetAttribute: "cRate_",
      },
    ],
  },
  {
    code: 99,
    name: "Cool Steel",
    icon: "9/9c/Weapon_Cool_Steel",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "atk_", scale: "7.7%" },
    ...baneSeries1("Water and Ice", "Hydro or Cryo"),
  },
  {
    code: 100,
    name: "Skyrider Sword",
    icon: "3/34/Weapon_Skyrider_Sword",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "er_", scale: "11.3%" },
    passiveName: "Determination",
    description: {
      pots: [`Using an Elemental Burst grants a {0}% increase in ATK and Movement SPD for 15s.`],
      seeds: [9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 9,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 107,
    name: "Silver Sword",
    icon: "3/32/Weapon_Silver_Sword",
    ...GREEN_INFO,
  },
  {
    code: 108,
    name: "Dull Blade",
    icon: "2/2f/Weapon_Dull_Blade",
    ...GRAY_INFO,
  },
];

export default otherSwords;
