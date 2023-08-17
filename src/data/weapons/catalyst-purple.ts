import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import {
  blackcliffSeries,
  desertSeries,
  dragonspinePassive,
  favoniusPassive,
  royalSeries,
  sacrificialPassive,
} from "./series";

const purpleCatalysts: AppWeapon[] = [
  {
    code: 162,
    name: "Flowing Purity",
    icon: "https://images2.imgbox.com/56/62/FXT7IK0o_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "Unfinished Masterpiece",
    descriptions: [
      `When using an Elemental Skill, {All Elemental DMG Bonus}#[k] will be increased by {6^%}#[v] for 15s`,
      `, and a Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once every 10s.`,
      `When the Bond of Life is cleared, every 1,000 HP cleared in the process will provide {1.5^%}#[v]
      {All Elemental DMG Bonus}#[k], up to a maximum of {9^%}#[m]. This effect lasts 15s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 6,
        targetAttribute: [...VISION_TYPES],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 2,
        base: 1.5,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.00024,
        },
        targetAttribute: [...VISION_TYPES],
        max: 9,
      },
    ],
  },
  {
    code: 161,
    name: "Sacrificial Jade",
    icon: "https://images2.imgbox.com/80/94/Ke393kt9_o.png",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "cRate_", scale: "8%" },
    passiveName: "Jade Circulation",
    descriptions: [
      `When not on the field for more than 6s, {Max HP}#[k] will be increased by {24^%}#[v] and {Elemental Mastery}#[k]
      will be increased by {30^}#[v].`,
      `These effects will be canceled after the wielder has been on the field for 6s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        wpBonuses: [
          {
            base: 24,
            targetAttribute: "hp_",
          },
          {
            base: 30,
            targetAttribute: "em",
          },
        ],
      },
    ],
  },
  {
    code: 144,
    name: "Wandering Evenstar",
    icon: "4/44/Weapon_Wandering_Evenstar",
    ...desertSeries,
  },
  {
    code: 137,
    name: "Fruit of Fulfillment",
    icon: "9/98/Weapon_Fruit_of_Fulfillment",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Full Circle",
    descriptions: [
      `Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining {21^3}#[v]
      {Elemental Mastery}#[k] while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max {5}#[m]
      stacks.`,
      `For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can
      be triggered even when the character is off-field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        stacks: {
          type: "input",
        },
        wpBonuses: [
          {
            base: 21,
            increment: 3,
            targetAttribute: "em",
          },
          {
            base: -5,
            increment: 0,
            targetAttribute: "atk_",
          },
        ],
      },
    ],
  },
  {
    code: 123,
    name: "Oathsworn Eye",
    icon: "a/af/Weapon_Oathsworn_Eye",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "People of the Faltering Light",
    descriptions: ["Increases {Energy Recharge}#[k] by {18^%}#[v] for 10s after using an Elemental Skill."],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 18,
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 37,
    name: "Wine and Song",
    icon: "c/c6/Weapon_Wine_and_Song",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Ever-Changing",
    descriptions: [
      `Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate sprint by
      {12^2}% for 5s.`,
      `Using a Sprint or Alternate Sprint ability increases {ATK}#[k] by {15^%}#[v] for 5s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 38,
    name: "Hakushin Ring",
    icon: "e/ee/Weapon_Hakushin_Ring",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Sakura Saiguu",
    descriptions: [
      `After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of an
      Elemental Type involved in the elemental reaction receive a {7.5^%}#[v] {Elemental DMG Bonus for their element}#[k],
      lasting 6s. Elemental Bonuses gained in this way cannot be stacked.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        base: 7.5,
        targetAttribute: "own_element",
      },
    ],
  },
  {
    code: 39,
    name: "Royal Grimoire",
    icon: "9/99/Weapon_Royal_Grimoire",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...royalSeries,
  },
  {
    code: 40,
    name: "Mappa Mare",
    icon: "4/4d/Weapon_Mappa_Mare",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passiveName: "Infusion Scroll",
    descriptions: [
      `Triggering an Elemental reaction grants a {6^%}#[v] {Elemental DMG Bonus}#[k] for 10s. Max {2}#[m] stacks.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
        },
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 41,
    name: "The Widsith",
    icon: "f/f0/Weapon_The_Widsith",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    passiveName: "Debut",
    descriptions: [
      `When a character takes the field, they will gain a random theme song for 10s. This can only occur once every
      30s. Recitative: {ATK}#[k] is increased by {45^%}#[v]. Aria: increases {All Elemental DMG}#[k] by {36^%}#[v].
      Interlude: {Elemental Mastery}#[k] is increased by {180^}#[v].`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            label: "Theme Song",
            type: "select",
            initialValue: 0,
            options: ["Recitative", "Aria", "Interlude"],
          },
        ],
        wpBonuses: [
          {
            checkInput: 0,
            base: 45,
            targetAttribute: "atk_",
          },
          {
            checkInput: 1,
            base: 36,
            targetAttribute: [...VISION_TYPES],
          },
          {
            checkInput: 2,
            base: 180,
            targetAttribute: "em",
          },
        ],
      },
    ],
  },
  {
    code: 42,
    name: "Frostbearer",
    icon: "1/1c/Weapon_Frostbearer",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...dragonspinePassive,
  },
  {
    code: 43,
    name: "Solar Pearl",
    icon: "f/fc/Weapon_Solar_Pearl",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Solar Shine",
    descriptions: [
      `Normal Attack hits increase {Elemental Skill and Elemental Burst DMG}#[k] by {15^%}#[v] for 6s.`,
      `Likewise, Elemental Skill or Elemental Burst hits increase {Normal Attack DMG}#[k] by {15^%}#[v] for 6s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        base: 15,
        targetAttPatt: "NA.pct_",
      },
    ],
  },
  {
    code: 44,
    name: "Prototype Amber",
    icon: "2/2a/Weapon_Prototype_Amber",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    passiveName: "Gilding",
    descriptions: [
      `Using an Elemental Burst regenerates {3.5^0.5} Energy every 2s for 6s. All party members will regenerate
      {3.5^0.5}% HP every 2s for this duration.`,
    ],
  },
  {
    code: 45,
    name: "Favonius Codex",
    icon: "3/36/Weapon_Favonius_Codex",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    ...favoniusPassive,
  },
  {
    code: 46,
    name: "Blackcliff Agate",
    icon: "a/a6/Weapon_Blackcliff_Agate",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    ...blackcliffSeries,
  },
  {
    code: 47,
    name: "Dodoco Tales",
    icon: "5/51/Weapon_Dodoco_Tales",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Dodoventure!",
    descriptions: [
      `Normal Attack hits on opponents increase {Charged Attack DMG}#[k] by {12^%}#[v] for 6s.`,
      `Charged Attack hits on opponents increase {ATK}#[k] by {6^%}#[v] for 6s`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 12,
        targetAttPatt: "CA.pct_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        base: 6,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 48,
    name: "Eye of Perception",
    icon: "6/6c/Weapon_Eye_of_Perception",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Echo",
    descriptions: [
      `Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing {210^30}% ATK as DMG. This bolt
      can bounce between opponents a maximum of 4 times. This effect can occur once every {13^-1}s.`,
    ],
  },
  {
    code: 49,
    name: "Sacrificial Fragments",
    icon: "6/6c/Weapon_Sacrificial_Fragments",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "em", scale: "48" },
    ...sacrificialPassive,
  },
];

export default purpleCatalysts;
