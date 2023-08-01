import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green } from "@Src/pure-components";
import { findByCode } from "@Src/utils";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1 } from "../series";

const otherCatalysts: AppWeapon[] = [
  {
    code: 128,
    name: "Otherworldly Story",
    icon: "1/11/Weapon_Otherworldly_Story",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "er_", scale: "8.5%" },
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
    passiveName: "Rapids",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Upon causing a Vaporize, Electro-Charged, Frozen, or a Hydro-infused Swirl reaction, increases{" "}
          <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green> for 12s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherCatalysts, 27)?.passiveDesc({ refi }).core,
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 28,
    name: "Twin Nephrite",
    icon: "e/e3/Weapon_Twin_Nephrite",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "cRate_", scale: "3.4%" },
    passiveName: "Rapids",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Defeating an opponent increases Movement SPD and <Green>ATK</Green> by <Green b>{10 + refi * 2}%</Green> for
          15s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherCatalysts, 28)?.passiveDesc({ refi }).core,
        base: 10,
        increment: 2,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 29,
    name: "Thrilling Tales of Dragon Slayers",
    icon: "1/19/Weapon_Thrilling_Tales_of_Dragon_Slayers",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    passiveName: "Legacy",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When switching characters, the new character taking the field has their <Green>ATK</Green> increased by{" "}
          <Green b>{18 + refi * 6}%</Green> for 10s. This effect can only occur once every 20s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.TEAMMATE,
        desc: ({ refi }) => findByCode(otherCatalysts, 29)?.passiveDesc({ refi }).core,
        base: 18,
        targetAttribute: "atk_",
      },
    ],
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
