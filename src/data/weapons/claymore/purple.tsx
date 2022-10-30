import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import {
  BaneSeries2,
  BlackcliffSeries,
  DragonspineSeries,
  FavoniusSeries,
  LithicSeries,
  RoyalSeries,
  SacrificialSeries,
  WatatsumiSeries,
} from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Calculators/utils";
import { makeWpModApplier } from "../utils";

const purpleClaymores: DataWeapon[] = [
  {
    code: 136,
    name: "Forest Regalia",
    icon: "5/51/Weapon_Forest_Regalia",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.ONE_UNIT,
        applyBuff: makeWpModApplier("totalAttr", "em", 60),
        desc: ({ refi }) => findByCode(purpleClaymores, 136)!.passiveDesc({ refi }).extra?.[0],
      },
    ],
    passiveName: "Forest Sanctuary",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a
            Leaf of Consciousness will be created around the character for a maximum of 10s.{" "}
            {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          When picked up, the Leaf will grant the character <Green b>{45 + refi * 15}</Green>{" "}
          <Green>Elemental Mastery</Green> for 12s.
        </>,
        <>
          Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the
          character is not on the field. The Leaf of Consciousness' effect cannot stack.
        </>,
      ],
    }),
  },
  {
    code: 60,
    name: "Snow-Tombed Starsilver",
    icon: "4/49/Weapon_Snow-Tombed_Starsilver",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    ...DragonspineSeries,
  },
  {
    code: 61,
    name: "Sacrificial Greatsword",
    icon: "1/17/Weapon_Sacrificial_Greatsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    ...SacrificialSeries,
  },
  {
    code: 62,
    name: "Royal Greatsword",
    icon: "b/bf/Weapon_Royal_Greatsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...RoyalSeries,
  },
  {
    code: 63,
    name: "Prototype Archaic",
    icon: "a/ab/Weapon_Prototype_Archaic",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "Crush",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, Normal or Charged Attacks have a <Green>50% chance</Green> to deal an additional{" "}
          <Green b>{180 + refi * 60}</Green> <Green>ATK</Green> DMG to opponents within a small AoE.
          Can only occur once every 15s.
        </>
      ),
    }),
  },
  {
    code: 64,
    name: "Whiteblind",
    icon: "0/04/Weapon_Whiteblind",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "def_", scale: "11.3%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [4],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (4.5 + refi * 1.5) * (inputs?.[0] || 0);
          applyModifier(desc, totalAttr, ["atk_", "def_"], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleClaymores, 64)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Infusion Blade",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, Normal or Charged Attacks increase <Green>ATK</Green> and <Green>DEF</Green> by{" "}
          <Green b>{4.5 + refi * 1.5}%</Green> for 6s. Max <Green b>4</Green> stacks. Can only occur
          once every 0.5s.
        </>
      ),
    }),
  },
  {
    code: 65,
    name: "Blackcliff Slasher",
    icon: "d/d7/Weapon_Blackcliff_Slasher",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg", scale: "12%" },
    ...BlackcliffSeries,
  },
  {
    code: 66,
    name: "Lithic Blade",
    icon: "3/3a/Weapon_Lithic_Blade",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...LithicSeries,
  },
  {
    code: 67,
    name: "Serpent Spine",
    icon: "8/88/Weapon_Serpent_Spine",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate", scale: "6%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [5],
        },
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (5 + refi) * (inputs?.[0] || 0);
          applyModifier(desc, attPattBonus, "all.pct", buffValue, tracker);
        },
        desc: ({ refi }) => (
          <>{findByCode(purpleClaymores, 67)!.passiveDesc({ refi }).extra![0]}.</>
        ),
      },
    ],
    passiveName: "Wavesplitter",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          Every 4s a character is on the field, they will deal <Green b>{5 + refi}%</Green>{" "}
          <Green>more DMG</Green> and take {[0, 3, 2.7, 2.4, 2.2, 2][refi]}% more DMG. This effect
          has a maximum of <Green b>5</Green> stacks
        </>,
        <>
          and will not be reset if the character leaves the field, but will be reduced by 1 stack
          when the character takes DMG.
        </>,
      ],
    }),
  },
  {
    code: 68,
    name: "Akuoumaru",
    icon: "c/c5/Weapon_Akuoumaru",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...WatatsumiSeries,
  },
  {
    code: 69,
    name: "Katsuragikiri Nagamasa",
    icon: "2/2e/Weapon_Katsuragikiri_Nagamasa",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    applyBuff: makeWpModApplier("attPattBonus", "ES.pct", 6),
    passiveName: "Samurai Conduct",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental Skill DMG</Green> by <Green b>{4.5 + refi * 1.5}%</Green>.
          After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates{" "}
          <Green b>{2.5 + refi * 0.5}</Green> <Green>Energy</Green> every 2s for the next 6s. This
          effect can occur once every 10s. Can be triggered even when the character is not on the
          field.
        </>
      ),
    }),
  },
  {
    code: 70,
    name: "The Bell",
    icon: "6/6e/Weapon_The_Bell",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "all.pct", 12),
        desc: ({ refi }) => findByCode(purpleClaymores, 70)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Rebellious Guardian",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Taking DMG generates a shield which absorbs DMG up to {17 + refi * 3}% of max HP. This
            shield lasts for 10s or until broken, and can only be triggered once every 45s.{" "}
            {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          While protected by a shield, the character gains <Green b>{9 + refi * 3}%</Green>{" "}
          <Green>increased DMG</Green>.
        </>,
      ],
    }),
  },
  {
    code: 71,
    name: "Rainslasher",
    icon: "d/d4/Weapon_Rainslasher",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    ...BaneSeries2("Storm and Tide", "Hydro or Electro"),
  },
  {
    code: 72,
    name: "Luxurious Sea-Lord",
    icon: "a/ab/Weapon_Luxurious_Sea-Lord",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    applyBuff: makeWpModApplier("attPattBonus", "EB.pct", 12),
    passiveName: "Oceanic Victory",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental Burst DMG</Green> by <Green b>{9 + refi * 3}%</Green>. When
          Elemental Burst hits opponents, there is a 100% chance of summoning a titanic tuna that
          charges and deals <Green b>{75 + refi * 25}%</Green> <Green>ATK</Green> as AoE DMG. This
          effect can occur once every 15s.
        </>
      ),
    }),
  },
  {
    code: 73,
    name: "Favonius Greatsword",
    icon: "9/9c/Weapon_Favonius_Greatsword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er", scale: "13.3%" },
    ...FavoniusSeries,
  },
];

export default purpleClaymores;
