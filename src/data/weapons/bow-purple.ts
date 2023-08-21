import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import {
  blackcliffSeries,
  favoniusPassive,
  fontaineSeries1,
  royalSeries,
  sacrificialPassive,
  watatsumiSeries,
} from "./series";

const purpleBows: AppWeapon[] = [
  {
    code: 170,
    beta: true,
    name: "Range Gauge",
    icon: "",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...fontaineSeries1,
  },
  {
    code: 164,
    name: "Song of Stillness",
    icon: "https://images2.imgbox.com/5b/49/z9GEFv7l_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Benthic Pulse",
    descriptions: [
      `After the wielder is healed, they will deal {12^%}#[v] more {DMG}#[k] for 8s. This can be triggered even when
      the character is not on the field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 12,
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 163,
    name: "Scion of the Blazing Sun",
    icon: "https://images2.imgbox.com/6f/b7/efQwDBFc_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cRate_", scale: "4%" },
    passiveName: "The Way of Sunfire",
    descriptions: [
      `After a Charged Attack hits an opponent, a Sunfire Arrow will descend and deal {45^}% ATK as DMG.`,
      `After a Sunfire Arrow hits an opponent, it will increase the {Charged Attack DMG}#[k] taken by this opponent from
      the wielder by {21^%}#[v]. A Sunfire Arrow can be triggered once every 12s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 21,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 153,
    name: "Ibis Piercer",
    icon: "c/ce/Weapon_Ibis_Piercer",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "Secret Wisdom's Favor",
    descriptions: [
      `The character's {Elemental Mastery}#[k] will increase by {30^}#[v] within 6s after Charged Attacks hit
      opponents. Max {2}#[m] stacks. This effect can triggered once every 0.5s.`,
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
        base: 30,
        stacks: {
          type: "input",
        },
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 166,
    name: "End of the Line",
    icon: "7/71/Weapon_End_of_the_Line",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Net Snapper",
    descriptions: [
      `Triggers the Flowrider effect after using an Elemental Skill, dealing {60^}% ATK as AoE DMG upon hitting an
      opponent with an attack. Flowrider will be removed after 15s or after causing 3 instances of AoE DMG. Only 1
      instance of AoE DMG can be caused every 2s in this way. Flowrider can be triggered once every 12s.`,
    ],
  },
  {
    code: 138,
    name: "King's Squire",
    icon: "a/a2/Weapon_King%27s_Squire",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Labyrinth Lord's Instruction",
    descriptions: [
      `Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing
      {Elemental Mastery}#[k] by {40^20}#[v] for 12s.`,
      `This effect will be removed when switching characters. When the Teachings of the Forest effect ends or is
      removed, it will deal {80^20}% of ATK as DMG to 1 nearby opponent. The Teachings of the Forest effect can be
      triggered once every 20s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 40,
        increment: 20,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 126,
    name: "Fading Twilight",
    icon: "2/2b/Weapon_Fading_Twilight",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Radiance of the Deeps",
    descriptions: [
      `Has three states, Evengleam (1), Afterglow (2), and Dawnblaze (3), which increase {DMG}#[k] dealt by
      {4.5^%}#[v]/{7.5^%}#[v]/{10.5^%}#[v] respectively.`,
      `When attacks hit opponents, this weapon will switch to the next state. This weapon can change states once
      every 7s. The character equipping this weapon can still trigger the state switch while not on the field.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            label: "State number",
            type: "select",
            max: 3,
          },
        ],
        // (1.5 + refi * 0.5) + (3 + refi * 1) * stacks
        base: 3,
        initialBonus: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 12,
    name: "Alley Hunter",
    icon: "0/0a/Weapon_Alley_Hunter",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "Oppidan Ambush",
    descriptions: [
      `While the character equipped with this weapon is in the party but not on the field, their {DMG}#[k] increases by
      {1.5^%}#[v] every second up to a max of {15^%}#[m].`,
      `When the character is on the field for more than 4s, the aforementioned DMG buff decreases by 4% per second
      until it reaches 0%.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 10,
          },
        ],
        base: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 13,
    name: "Blackcliff Warbow",
    icon: "b/b8/Weapon_Blackcliff_Warbow",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cDmg_", scale: "8%" },
    ...blackcliffSeries,
  },
  {
    code: 14,
    name: "Mouun's Moon",
    icon: "4/42/Weapon_Mouun%27s_Moon",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...watatsumiSeries,
  },
  {
    code: 15,
    name: "Sacrificial Bow",
    icon: "e/ec/Weapon_Sacrificial_Bow",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    ...sacrificialPassive,
  },
  {
    code: 16,
    name: "Predator",
    icon: "2/2e/Weapon_Predator",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Strong Strike",
    descriptions: [
      `When Aloy equips Predator, {ATK}#[k] is increased by {66^0}#[v].`,
      `Dealing Cryo DMG to opponents increases this character's {Normal and Charged Attack DMG}#[k] by {10^0%} for 6s.
      This effect can have a maximum of {2}#[m] stacks.<br />• Effective for players on "PlayStation Network" only.`,
    ],
    autoBuffs: [
      {
        base: 66,
        increment: 0,
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 10,
        increment: 0,
        stacks: {
          type: "input",
        },
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 17,
    name: "The Stringless",
    icon: "7/71/Weapon_The_Stringless",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passiveName: "Arrowless Song",
    descriptions: ["Increases {Elemental Skill and Elemental Burst DMG}#[k] by {18^%}#[v]."],
    autoBuffs: [
      {
        base: 18,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
    ],
  },
  {
    code: 18,
    name: "The Viridescent Hunt",
    icon: "f/ff/Weapon_The_Viridescent_Hunt",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Verdant Wind",
    descriptions: [
      `Upon hit, Normal and Aimed Shot Attacks have a 50% chance to generate a Cyclone, which will continuously
      attract surrounding opponents, dealing {30^}% of ATK as DMG to these opponents every 0.5s for 4s. This effect can
      only occur once every {15^-1}s.`,
    ],
  },
  {
    code: 19,
    name: "Mitternachts Waltz",
    icon: "7/77/Weapon_Mitternachts_Waltz",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "phys", scale: "11.3%" },
    passiveName: "Evernight Duet",
    descriptions: [
      `Normal Attack hits on opponents increase {Elemental Skill DMG}#[k] by {15^%}#[v] for 5s.`,
      `Elemental Skill hits on opponents increase {Normal Attack DMG}#[k] by {15^%}#[v] for 5s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetAttPatt: "ES.pct_",
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
    code: 20,
    name: "Royal Bow",
    icon: "9/99/Weapon_Royal_Bow",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...royalSeries,
  },
  {
    code: 21,
    name: "Windblume Ode",
    icon: "3/38/Weapon_Windblume_Ode",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passiveName: "Windblume Wish",
    descriptions: [
      `After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing {ATK}#[k] by
      {12^%}#[v] for 6s.`,
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 12,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 22,
    name: "Rust",
    icon: "1/1c/Weapon_Rust",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Rapid Firing",
    descriptions: ["Increases {Normal Attack DMG}#[k] by {30^%}#[v] but decreases Charged Attack DMG by 10%."],
    autoBuffs: [
      {
        base: 30,
        targetAttPatt: "NA.pct_",
      },
      {
        base: -10,
        increment: 0,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 23,
    name: "Prototype Crescent",
    icon: "4/43/Weapon_Prototype_Crescent",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Unreturning",
    descriptions: [
      "Charged Attack hits on weak points increase Movement SPD by 10% and {ATK}#[k] by {27^%}#[v] for 10s.",
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 27,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 24,
    name: "Compound Bow",
    icon: "3/32/Weapon_Compound_Bow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "phys", scale: "15%" },
    passiveName: "Infusion Arrow",
    descriptions: [
      `Normal Attack and Charged Attack hits increase {ATK}#[k] by {3^%}#[v] and {Normal ATK SPD}#[k] by {0.9^%}#[v] for 6s.
      Max {4}#[m] stacks. Can only occur once every 0.3s.`,
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
        stacks: {
          type: "input",
        },
        wpBonuses: [
          {
            base: 3,
            targetAttribute: "atk_",
          },
          {
            base: 0.9,
            targetAttribute: "naAtkSpd_",
          },
        ],
      },
    ],
  },
  {
    code: 25,
    name: "Hamayumi",
    icon: "d/d9/Weapon_Hamayumi",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Full Draw",
    descriptions: [
      `Increases {Normal Attack DMG}#[k] by {12^%}#[v] and {Charged Attack DMG}#[k] by {9^%}#[v].`,
      `When the equipping character's Energy reaches 100%, the {DMG Bonuses}#[k] are increased by {100%}#[v].`,
    ],
    autoBuffs: [
      {
        base: 12,
        targetAttPatt: "NA.pct_",
      },
      {
        base: 9,
        targetAttPatt: "CA.pct_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        wpBonuses: [
          {
            base: 12,
            targetAttPatt: "NA.pct_",
          },
          {
            base: 9,
            targetAttPatt: "CA.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 26,
    name: "Favonius Warbow",
    icon: "8/85/Weapon_Favonius_Warbow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er_", scale: "13.3%" },
    ...favoniusPassive,
  },
];

export default purpleBows;
