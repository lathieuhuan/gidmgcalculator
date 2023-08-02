import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { findByCode } from "@Src/utils";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1, cullTheWeakSeries } from "../series";

const otherClaymores: AppWeapon[] = [
  {
    code: 130,
    name: "White Iron Greatsword",
    icon: "5/56/Weapon_White_Iron_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "def_", scale: "9.6%a" },
    ...cullTheWeakSeries,
  },
  {
    code: 129,
    name: "Ferrous Shadow",
    icon: "e/e9/Weapon_Ferrous_Shadow",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    passive: {
      name: "Unbending",
      description: `When HP falls below {0}%, increases Charged Attack DMG by {1}%, and Charged Attacks become much
      harder to interrupt.`,
      seeds: [
        { base: 65, increment: 5, dull: true },
        { base: 25, increment: 5 },
      ],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            When HP falls below {65 + refi * 5}%, increases <Green>Charged Attack DMG</Green> by{" "}
            <Green b>{25 + refi * 5}%</Green>, and Charged Attacks become much harder to interrupt.
          </>
        ),
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
    passive: {
      name: "Courage",
      description: `On hit, Normal or Charged Attacks increase ATK by {0}% for 6s. Max 4 stacks. Can only occur once
      every 0.5s.`,
      seeds: [{ base: 5, increment: 1 }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            On hit, Normal or Charged Attacks increase <Green>ATK</Green> by <Green b>{5 + refi}%</Green> for 6s. Max{" "}
            <Rose>4</Rose> stacks. Can only occur once every 0.5s.
          </>
        ),
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
    passive: {
      name: "Blunt Conclusion",
      description: `After using an Elemental Skill, Normal or Charged Attacks, on hit, deal an additional {0}% ATK DMG
      in a small area. Effect lasts 15s. DMG can only occur once every 3s.`,
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
