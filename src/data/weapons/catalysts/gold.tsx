import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";

const goldCatalysts: AppWeapon[] = [
  {
    code: 152,
    name: "Jadefall's Splendor",
    icon: "7/7a/Weapon_Jadefall%27s_Splendor",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Primordial Jade Regalia",
    descriptions: [
      `When using an Elemental Burst or creating a shield, the equipping character's {corresponding Elemental DMG}#[k]
      is increased by {0.1^0.2%}#[v] for every 1,000 Max HP they possess for 3s, up to {4^8%}#[m].`,
      `At the same time, they will regain {4^0.5} Energy every 2.5s. This will still take effect even if the character
      is not on the field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 0.1,
        increment: 0.2,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.001,
        },
        targetAttribute: "own_element",
        max: {
          base: 4,
          increment: 8,
        },
      },
    ],
  },
  {
    code: 147,
    name: "Tulaytullah's Remembrance",
    icon: "f/fc/Weapon_Tulaytullah%27s_Remembrance",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg_", scale: "9.6%b" },
    passiveName: "Bygone Azure Teardrop",
    descriptions: [
      `{Normal Attack SPD}#[k] is increased by {7.5^%}#[v].`,
      `After the wielder unleashes an Elemental Skill, {Normal Attack DMG}#[k] will increase by {3.6^%}#[v] every second
      for 12s. After this character hits an opponent with a Normal Attack during this duration, {Normal Attack DMG}#[k]
      will be increased by {7.2^%}#[v]. This increase can be triggered once every 0.3s. Total maximum bonus is {36^%}#[m].`,
      `The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset
      all DMG buffs.`,
    ],
    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "naAtkSpd_",
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          { label: "Seconds passed", type: "text", max: 10 },
          { label: "Normal attacks hit", type: "text", max: 10 },
        ],
        base: 3.6,
        stacks: {
          type: "input",
          index: [{ value: 0 }, { value: 1, convertRate: 2 }],
        },
        targetAttPatt: "NA.pct_",
        max: 36,
      },
    ],
  },
  {
    code: 143,
    name: "A Thousand Floating Dreams",
    icon: "4/4c/Weapon_A_Thousand_Floating_Dreams",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "em", scale: "58" },
    passiveName: "A Thousand Nights' Dawnsong",
    descriptions: [
      `Party members other than the equipping character will provide the equipping character with buffs based on
      whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase
      {Elemental Mastery}#[k] by {24^}#[v]. If not, increase the equipping character's {DMG Bonus}#[k] from
      {their Elemental Type}#[k] by {6^4%}#[v]. Max {3}#[m] stacks.`,
      `Additionally, all nearby party members other than the equipping character will have their {Elemental Mastery}#[k]
      increased by {38^2}#[v]. Multiple such effects from multiple such weapons can stack.`,
    ],
    autoBuffs: [
      {
        base: 24,
        stacks: {
          type: "vision",
          element: "same_excluded",
        },
        targetAttribute: "em",
      },
      {
        base: 6,
        increment: 4,
        stacks: {
          type: "vision",
          element: "different",
        },
        targetAttribute: "own_element",
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        description: 1,
        base: 38,
        increment: 2,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 122,
    name: "Kagura's Verity",
    icon: "b/b7/Weapon_Kagura%27s_Verity",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Kagura Dance of the Sacred Sakura",
    descriptions: [
      `Gains the Kagura Dance effect when using an Elemental Skill, causing the {Elemental Skill DMG}#[k] of the
      character wielding this weapon to increase by {9^%}#[v] for 16s. Max {3}#[m] stacks. This character will gain
      {9^%}#[v] {All Elemental DMG Bonus}#[k] when they possess 3 stacks.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        wpBonuses: [
          {
            base: 9,
            stacks: {
              type: "input",
            },
            targetAttPatt: "ES.pct_",
          },
          {
            checkInput: 3,
            base: 9,
            targetAttribute: [...VISION_TYPES],
          },
        ],
      },
    ],
  },
  {
    code: 34,
    name: "Everlasting Moonglow",
    icon: "e/e1/Weapon_Everlasting_Moonglow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Byakuya Kougetsu",
    descriptions: [
      `{Healing Bonus}#[k] increased by {7.5^%}#[v], {Normal Attack DMG}#[k] is increased by {0.5^0.5%}#[v] of the
      {Max HP}#[k] of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that
      hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.`,
    ],
    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "healB_",
      },
      {
        base: 0.5,
        increment: 0.5,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttPatt: "NA.flat",
      },
    ],
  },
  {
    code: 31,
    name: "Skyward Atlas",
    icon: "3/33/Weapon_Skyward_Atlas",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "atk_", scale: "7.2%" },
    passiveName: "Wandering Clouds",
    descriptions: [
      `Increases {Elemental DMG Bonus}#[k] by {9^%}#[v]. Normal Attack hits have a 50% chance to earn the favor of the
      clouds. which actively seek out nearby opponents to attack for 15s, dealing {120^}% ATK DMG. Can only occur once
      every 30s.`,
    ],
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 32,
    name: "Lost Prayer to the Sacred Winds",
    icon: "9/98/Weapon_Lost_Prayer_to_the_Sacred_Winds",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Boundless Blessing",
    descriptions: [
      `Increases Movement SPD by 10%.`,
      `When in battle, gain an {6^%}#[v] {Elemental DMG Bonus}#[k] every 4s. Max {4}#[m] stacks.`,
      `Lasts until the character falls or leaves combat.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
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
    code: 33,
    name: "Memory of Dust",
    icon: "c/ca/Weapon_Memory_of_Dust",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
];

export default goldCatalysts;
