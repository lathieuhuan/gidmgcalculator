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
    description: {
      pots: [
        `When HP falls below {0}%, increases Charged Attack DMG by {1}%, and Charged Attacks become much harder to
        interrupt.`,
      ],
      seeds: [
        { base: 65, increment: 5, dull: true },
        { base: 25, increment: 5 },
      ],
    },
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
    description: {
      pots: [
        `On hit, Normal or Charged Attacks increase ATK by {0}% for 6s. Max 4 stacks. Can only occur once every 0.5s.`,
      ],
      seeds: [{ base: 5, increment: 1 }],
    },
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
    description: {
      pots: [
        `After using an Elemental Skill, Normal or Charged Attacks, on hit, deal an additional {0}% ATK DMG in a small
        area. Effect lasts 15s. DMG can only occur once every 3s.`,
      ],
      seeds: [{ base: 45, dull: true }],
    },
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
