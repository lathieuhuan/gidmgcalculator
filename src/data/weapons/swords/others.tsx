import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { findByCode } from "@Src/utils";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";

const otherSwords: AppWeapon[] = [
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
    passiveName: "Overloaded",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Upon causing an Overloaded, Superconduct, Electro-Charged, or an Electro-infused Swirl reaction,{" "}
          <Green>ATK</Green> is increased by <Green b>{15 + refi * 5}%</Green> for 12s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherSwords, 131)!.passiveDesc({ refi }).core,
        base: 15,
        targetAttribute: "atk_",
      },
    ],
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
          On hit, has <Green>50% chance</Green> to deal <Green b>{200 + refi * 40}%</Green> <Green>ATK</Green> DMG to a
          single enemy. Can only occur once every <Green b>{16 - refi}s</Green>.
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
    passiveName: "Vigorous",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When HP is above 90%, increases <Green>CRIT Rate</Green> by <Green b>{10.5 + refi * 3.5}%</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherSwords, 98)!.passiveDesc({ refi }).core,
        base: 10.5,
        targetAttribute: "cRate_",
      },
    ],
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
    passiveName: "Determination",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Using an Elemental Burst grants a <Green b>{9 + refi * 3}%</Green> increase in <Green>ATK</Green> and Movement
          SPD for 15s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherSwords, 100)!.passiveDesc({ refi }).core,
        base: 9,
        targetAttribute: "atk_",
      },
    ],
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
