import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1, cullTheWeakPassive } from "../series";

const otherClaymores: AppWeapon[] = [
  {
    code: 130,
    name: "White Iron Greatsword",
    icon: "5/56/Weapon_White_Iron_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "def_", scale: "9.6%a" },
    ...cullTheWeakPassive,
  },
  {
    code: 129,
    name: "Ferrous Shadow",
    icon: "e/e9/Weapon_Ferrous_Shadow",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    passiveName: "Unbending",
    descriptions: [
      `When HP falls below {65^5}%, increases {Charged Attack DMG}#[k] by {25^5%}#[v], and Charged Attacks become much
      harder to interrupt.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 25,
        increment: 5,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 50,
    name: "Skyrider Greatsword",
    icon: "6/6e/Weapon_Skyrider_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "phys", scale: "9.6%a" },
    passiveName: "Courage",
    descriptions: [
      `On hit, Normal or Charged Attacks increase {ATK}#[k] by {5^1%}#[v] for 6s. Max {4}#[m] stacks. Can only occur
      once every 0.5s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        base: 5,
        increment: 1,
        stacks: {
          type: "input",
        },
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 51,
    name: "Debate Club",
    icon: "7/74/Weapon_Debate_Club",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "atk_", scale: "7.7%" },
    passiveName: "Blunt Conclusion",
    descriptions: [
      `After using an Elemental Skill, Normal or Charged Attacks, on hit, deal an additional {45^}% ATK DMG in a small
      area. Effect lasts 15s. DMG can only occur once every 3s.`,
    ],
  },
  {
    code: 52,
    name: "Bloodtainted Greatsword",
    icon: "4/4a/Weapon_Bloodtainted_Greatsword",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "em", scale: "41" },
    ...baneSeries1("Fire and Thunder", "Pyro or Electro"),
  },
  {
    code: 58,
    name: "Old Merc's Pal",
    icon: "0/0b/Weapon_Old_Merc%27s_Pal",
    ...GREEN_INFO,
  },
  {
    code: 59,
    name: "Waster Greatsword",
    icon: "4/4c/Weapon_Waster_Greatsword",
    ...GRAY_INFO,
  },
];

export default otherClaymores;
