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
  WatatsumiSeries,
} from "../series";
import { findByCode } from "@Src/utils";
import { getInput, applyModifier } from "@Src/calculators/utils";
import { makeWpModApplier } from "../utils";

import shiftingWindbladeImg from "@Src/assets/images/shifting-windblade.png";

const purplePolearms: DataWeapon[] = [
  {
    code: 141,
    beta: true,
    name: "Shifting Windblade",
    icon: shiftingWindbladeImg,
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "The Wind Unattained",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Within 10s after an Elemental Reaction is triggered, <Green>ATK</Green> is increased by{" "}
          <Green b>{7.5 + refi * 2.5}%</Green> and <Green>Elemental Mastery</Green> is increased by{" "}
          <Green b>{30 + refi * 10}</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", ["atk_", "em"], [10, 40]),
        desc: ({ refi }) => findByCode(purplePolearms, 141)!.passiveDesc({ refi }).core,
      },
    ],
  },
  {
    code: 135,
    name: "Moonpiercer",
    icon: "a/a4/Weapon_Moonpiercer",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passiveName: "Stillwood Moonshadow",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a
            Leaf of Revival will be created around the character for a maximum of 10s.{" "}
            {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          When picked up, the Leaf will grant the character <Green b>{12 + refi * 4}%</Green>{" "}
          <Green>ATK</Green> for 12s.
        </>,
        <>
          Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the
          character is not on the field.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 16),
        desc: ({ refi }) => findByCode(purplePolearms, 135)!.passiveDesc({ refi }).extra?.[0],
      },
    ],
  },
  {
    code: 85,
    name: "Wavebreaker's Fin",
    icon: "6/66/Weapon_Wavebreaker%27s_Fin",
    rarity: 4,
    mainStatScale: "45",
    subStat: { type: "atk_", scale: "3%" },
    ...WatatsumiSeries,
  },
  {
    code: 86,
    name: "Crescent Pike",
    icon: "4/4c/Weapon_Crescent_Pike",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    passiveName: "Infusion Needle",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional{" "}
          <Green b>{15 + refi * 5}%</Green> <Green>ATK</Green> as DMG for 5s.
        </>
      ),
    }),
  },
  {
    code: 87,
    name: "Lithic Spear",
    icon: "2/2a/Weapon_Lithic_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...LithicSeries,
  },
  {
    code: 88,
    name: "Kitain Cross Spear",
    icon: "1/13/Weapon_Kitain_Cross_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
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
    code: 89,
    name: "Royal Spear",
    icon: "f/fd/Weapon_Royal_Spear",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...RoyalSeries,
  },
  {
    code: 90,
    name: "Favonius Lance",
    icon: "5/57/Weapon_Favonius_Lance",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    ...FavoniusSeries,
  },
  {
    code: 91,
    name: "Prototype Starglitter",
    icon: "7/7e/Weapon_Prototype_Starglitter",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [2],
        },
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (6 + refi * 2) * getInput(inputs, 0, 0);
          applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct"], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purplePolearms, 91)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Magic Affinity",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After using an Elemental Skill, increases <Green>Normal and Charged Attack DMG</Green> by{" "}
          <Green b>{6 + refi * 2}%</Green> for 12s. Max <Green b>2</Green> stacks.
        </>
      ),
    }),
  },
  {
    code: 92,
    name: `"The Catch"`,
    icon: "f/f5/Weapon_The_Catch",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    applyBuff: makeWpModApplier("attPattBonus", ["EB.pct", "EB.cRate"], [16, 6]),
    passiveName: "Shanty",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental Burst DMG</Green> by <Green b>{12 + refi * 4}%</Green> and{" "}
          <Green>Elemental Burst CRIT Rate</Green> by <Green b>{4.5 + refi * 1.5}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 93,
    name: "Blackcliff Pole",
    icon: "d/d5/Weapon_Blackcliff_Pole",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg", scale: "12%" },
    ...BlackcliffSeries,
  },
  {
    code: 94,
    name: "Dragonspine Spear",
    icon: "1/1a/Weapon_Dragonspine_Spear",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "phys", scale: "15%" },
    ...DragonspineSeries,
  },
  {
    code: 95,
    name: "Deathmatch",
    icon: "6/69/Weapon_Deathmatch",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "cRate", scale: "8%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Fewer than 2 opponents"],
          renderTypes: ["check"],
          initialValues: [true],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          if (getInput(inputs, 0, false)) {
            applyModifier(desc, totalAttr, "atk_", 18 + refi * 6, tracker);
          } else {
            const buffValue = 12 + refi * 4;
            applyModifier(desc, totalAttr, ["atk_", "def_"], buffValue, tracker);
          }
        },
        desc: ({ refi }) => findByCode(purplePolearms, 95)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Gladiator",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          If there are at least 2 opponents nearby, <Green>ATK</Green> is increased by{" "}
          <Green b>{12 + refi * 4}%</Green> and <Green>DEF</Green> is increased by{" "}
          <Green b>{12 + refi * 4}%</Green>. If there are fewer than 2 opponents nearby,{" "}
          <Green>ATK</Green> is increased by <Green b>{18 + refi * 6}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 96,
    name: "Dragon's Bane",
    icon: "2/24/Weapon_Dragon%27s_Bane",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "em", scale: "48" },
    ...BaneSeries2("Flame and Water", "Hydro or Pyro"),
  },
];

export default purplePolearms;
