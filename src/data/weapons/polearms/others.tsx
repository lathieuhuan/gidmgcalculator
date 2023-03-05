import type { DataWeapon } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { findByCode } from "@Src/utils";
import { makeWpModApplier } from "../utils";

const otherPolearms: DataWeapon[] = [
  {
    code: 74,
    name: "Halberd",
    icon: "4/41/Weapon_Halberd",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "atk_", scale: "5.1%" },
    passiveName: "Heavy",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Normal Attacks deal an additional <Green b>{120 + refi * 40}%</Green> <Green>DMG</Green>. Can only occur once
          every 10s.
        </>
      ),
    }),
  },
  {
    code: 75,
    name: "White Tassel",
    icon: "1/1f/Weapon_White_Tassel",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cRate_", scale: "5.1%" },
    passiveName: "Sharp",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Normal Attack DMG</Green> by <Green b>{18 + refi * 6}%</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherPolearms, 75)?.passiveDesc({ refi }).core,
        applyBuff: makeWpModApplier("attPattBonus", "NA.pct_", 24),
      },
    ],
  },
  {
    code: 76,
    name: "Black Tassel",
    icon: "4/43/Weapon_Black_Tassel",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "hp_", scale: "10.2%" },
    passiveName: "Bane of the Soft",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>DMG</Green> against slimes by <Green b>{30 + refi * 10}%</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherPolearms, 76)?.passiveDesc({ refi }).core,
        applyBuff: makeWpModApplier("attPattBonus", "all.pct_", 40),
      },
    ],
  },
  {
    code: 83,
    name: "Iron Point",
    icon: "2/25/Weapon_Iron_Point",
    ...GREEN_INFO,
  },
  {
    code: 84,
    name: "Beginner's Protector",
    icon: "f/fc/Weapon_Beginner%27s_Protector",
    ...GRAY_INFO,
  },
];

export default otherPolearms;
