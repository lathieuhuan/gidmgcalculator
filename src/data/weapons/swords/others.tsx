import type { DataWeapon } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";
import { findByCode } from "@Src/utils";
import { makeWpModApplier } from "../utils";

const otherSwords: DataWeapon[] = [
  {
    code: 132,
    name: "Traveler's Handy Sword",
    icon: "c/c9/Weapon_Traveler%27s_Handy_Sword",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "def_", scale: "6.4%" },
    passiveName: "Journey",
    passiveDesc: ({ refi }) => ({
      core: <>Each Elemental Orb or Particle collected restores {0.75 + refi * 0.25}% HP.</>,
    }),
  },
  {
    code: 131,
    name: "Dark Iron Sword",
    icon: "3/3a/Weapon_Dark_Iron_Sword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "em", scale: "31" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
        desc: ({ refi }) => findByCode(otherSwords, 131)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Overloaded",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Upon causing an Overloaded, Superconduct, Electro-Charged, or an Electro-infused Swirl
          reaction, <Green>ATK</Green> is increased by <Green b>{15 + refi * 5}%</Green> for 12s.
        </>
      ),
    }),
  },
  {
    code: 97,
    name: "Fillet Blade",
    icon: "f/f7/Weapon_Fillet_Blade",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "atk_", scale: "7.7%" },
    passiveName: "Gash",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, has <Green>50% chance</Green> to deal <Green b>{200 + refi * 40}%</Green>{" "}
          <Green>ATK</Green> DMG to a single enemy. Can only occur once every{" "}
          <Green b>{16 - refi}s</Green>.
        </>
      ),
    }),
  },
  {
    code: 98,
    name: "Harbinger of Dawn",
    icon: "2/23/Weapon_Harbinger_of_Dawn",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cDmg_", scale: "10.2%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "cRate_", 14),
        desc: ({ refi }) => findByCode(otherSwords, 98)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Vigorous",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When HP is above 90%, increases <Green>CRIT Rate</Green> by{" "}
          <Green b>{10.5 + refi * 3.5}%</Green>.
        </>
      ),
    }),
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
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 12),
        desc: ({ refi }) => findByCode(otherSwords, 100)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Determination",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Using an Elemental Burst grants a <Green b>{9 + refi * 3}%</Green> increase in{" "}
          <Green>ATK</Green> and Movement SPD for 15s.
        </>
      ),
    }),
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
