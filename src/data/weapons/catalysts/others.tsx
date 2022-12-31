import type { DataWeapon } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const otherCatalysts: DataWeapon[] = [
  {
    code: 128,
    name: "Otherworldly Story",
    icon: "1/11/Weapon_Otherworldly_Story",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "er", scale: "8.5%" },
    passiveName: "Energy Shower",
    passiveDesc: ({ refi }) => ({
      core: <>Each Elemental Orb or Particle collected restores {0.75 + refi * 0.25}% HP.</>,
    }),
  },
  {
    code: 27,
    name: "Emerald Orb",
    icon: "7/7c/Weapon_Emerald_Orb",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "em", scale: "20" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
        desc: ({ refi }) => findByCode(otherCatalysts, 27)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Rapids",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Upon causing a Vaporize, Electro-Charged, Frozen, or a Hydro-infused Swirl reaction,
          increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green> for 12s.
        </>
      ),
    }),
  },
  {
    code: 28,
    name: "Twin Nephrite",
    icon: "e/e3/Weapon_Twin_Nephrite",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "cRate", scale: "3.4%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: ({ totalAttr, refi, desc, tracker }) => {
          applyModifier(desc, totalAttr, "atk_", 10 + refi * 2, tracker);
        },
        desc: ({ refi }) => findByCode(otherCatalysts, 28)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Rapids",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Defeating an opponent increases Movement SPD and <Green>ATK</Green> by{" "}
          <Green b>{10 + refi * 2}%</Green> for 15s.
        </>
      ),
    }),
  },
  {
    code: 29,
    name: "Thrilling Tales of Dragon Slayers",
    icon: "1/19/Weapon_Thrilling_Tales_of_Dragon_Slayers",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.ONE_UNIT,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 24),
        desc: ({ refi }) => findByCode(otherCatalysts, 29)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Legacy",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When switching characters, the new character taking the field has their <Green>ATK</Green>{" "}
          increased by <Green b>{18 + refi * 6}%</Green> for 10s. This effect can only occur once
          every 20s.
        </>
      ),
    }),
  },
  {
    code: 30,
    name: "Magic Guide",
    icon: "3/39/Weapon_Magic_Guide",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "em", scale: "41" },
    ...baneSeries1("Storm and Tide", "Hydro or Electro"),
  },
  {
    code: 35,
    name: "Pocket Grimoire",
    icon: "1/16/Weapon_Pocket_Grimoire",
    ...GREEN_INFO,
  },
  {
    code: 36,
    name: "Apprentice's Notes",
    icon: "c/cf/Weapon_Apprentice%27s_Notes",
    ...GRAY_INFO,
  },
];

export default otherCatalysts;
