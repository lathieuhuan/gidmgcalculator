import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import {
  BaneSeries2,
  BlackcliffSeries,
  FavoniusSeries,
  RoyalSeries,
  SacrificialSeries,
} from "../series";
import { applyPercent, findByCode } from "@Src/utils";
import { getInput, applyModifier } from "@Src/calculators/utils";
import { makeWpModApplier } from "../utils";

const purpleSwords: DataWeapon[] = [
  {
    code: 134,
    name: "Sapwood Blade",
    icon: "0/00/Weapon_Sapwood_Blade",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        applyBuff: makeWpModApplier("totalAttr", "em", 60),
        desc: ({ refi }) => findByCode(purpleSwords, 134)!.passiveDesc({ refi }).extra?.[0],
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
    code: 109,
    name: "The Alley Flash",
    icon: "8/83/Weapon_The_Alley_Flash",
    rarity: 4,
    mainStatScale: "45",
    subStat: { type: "em", scale: "12" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "all.pct", 12),
        desc: ({ refi }) => findByCode(purpleSwords, 109)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Itinerant Hero",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>DMG</Green> dealt by the character equipping this weapon by{" "}
          <Green b>{9 + refi * 3}%</Green>. Taking DMG disables this effect for 5s.
        </>
      ),
    }),
  },
  {
    code: 110,
    name: "Blackcliff Longsword",
    icon: "6/6f/Weapon_Blackcliff_Longsword",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cDmg", scale: "8%" },
    ...BlackcliffSeries,
  },
  {
    code: 111,
    name: "Prototype Rancour",
    icon: "e/ef/Weapon_Prototype_Rancour",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "phys", scale: "7.5%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [4],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (3 + refi * 1) * getInput(inputs, 0, 0);
          applyModifier(desc, totalAttr, ["atk_", "def_"], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleSwords, 111)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Smashed Stone",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, Normal or Charged Attacks increase <Green>ATK</Green> and <Green>DEF</Green> by{" "}
          <Green b>{3 + refi}%</Green> for 6s. Max <Green b>4</Green> stacks. Can only occur once
          every 0.3s.
        </>
      ),
    }),
  },
  {
    code: 112,
    name: "Festering Desire",
    icon: "7/70/Weapon_Festering_Desire",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    applyBuff: makeWpModApplier("attPattBonus", ["ES.pct", "ES.cRate"], [16, 6]),
    passiveName: "Undying Admiration",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental Skill DMG</Green> by <Green b>{12 + refi * 4}%</Green> and{" "}
          <Green>Elemental Skill CRIT Rate</Green> by <Green b>{4.5 + refi * 1.5}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 113,
    name: "The Black Sword",
    icon: "c/cf/Weapon_The_Black_Sword",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate", scale: "6%" },
    applyBuff: makeWpModApplier("attPattBonus", ["NA.pct", "CA.pct"], 20),
    passiveName: "Justice",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>DMG</Green> dealt by <Green>Normal and Charged Attacks</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green>. Additionally, regenerates {50 + refi * 10}% of ATK as
          HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.
        </>
      ),
    }),
  },
  {
    code: 114,
    name: "The Flute",
    icon: "6/63/Weapon_The_Flute",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passiveName: "Chord",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power
          of music and deals <Green b>{75 + refi * 25}%</Green> <Green>ATK</Green> DMG to
          surrounding enemies. Harmonics last up to 30s, and a maximum of 1 can be gained every
          0.5s.
        </>
      ),
    }),
  },
  {
    code: 115,
    name: "Royal Longsword",
    icon: "c/cd/Weapon_Royal_Longsword",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...RoyalSeries,
  },
  {
    code: 116,
    name: "Lion's Roar",
    icon: "e/e6/Weapon_Lion%27s_Roar",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...BaneSeries2("Fire and Thunder", "Pyro or Electro"),
  },
  {
    code: 117,
    name: "Iron Sting",
    icon: "3/35/Weapon_Iron_Sting",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [2],
        },
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (4.5 + refi * 1.5) * getInput(inputs, 0, 0);
          applyModifier(desc, attPattBonus, "all.pct", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleSwords, 117)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Infusion Stinger",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Dealing Elemental DMG increases <Green>all DMG</Green> by{" "}
          <Green b>{4.5 + refi * 1.5}%</Green> for 6s. Max <Green b>2</Green> stacks. Can only occur
          once every 1s.
        </>
      ),
    }),
  },
  {
    code: 118,
    name: "Amenoma Kageuchi",
    icon: "e/ea/Weapon_Amenoma_Kageuchi",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Iwakura Succession",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered
          once every 5s. The Succession Seed lasts for 30s. Up to <Green b>3</Green> Succession
          Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are
          consumed and after 2s, the character regenerates <Green b>{4.5 + refi * 1.5}</Green>{" "}
          <Green>Energy</Green> for each seed consumed.
        </>
      ),
    }),
  },
  {
    code: 119,
    name: "Favonius Sword",
    icon: "9/90/Weapon_Favonius_Sword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er", scale: "13.3%" },
    ...FavoniusSeries,
  },
  {
    code: 120,
    name: "Sacrificial Sword",
    icon: "a/a0/Weapon_Sacrificial_Sword",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er", scale: "13.3%" },
    ...SacrificialSeries,
  },
  {
    code: 121,
    name: "Cinnabar Spindle",
    icon: "d/dc/Weapon_Cinnabar_Spindle",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "def_", scale: "15%" },
    applyFinalBuff: ({ attPattBonus, refi, totalAttr, desc, tracker }) => {
      if (attPattBonus) {
        const buffValue = applyPercent(totalAttr.def, 30 + refi * 10);
        applyModifier(desc, attPattBonus, "ES.flat", buffValue, tracker);
      }
    },
    passiveName: "Spotless Heart",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>Elemental Skill DMG</Green> is increased by <Green b>{30 + refi * 10}%</Green> of
          DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s
          after the Elemental Skill deals DMG.
        </>
      ),
    }),
  },
];

export default purpleSwords;
