import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";

const otherPolearms: AppWeapon[] = [
  {
    code: 74,
    name: "Halberd",
    icon: "4/41/Weapon_Halberd",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "atk_", scale: "5.1%" },
    passiveName: "Heavy",
    descriptions: [`Normal Attacks deal an additional {120^}% DMG. Can only occur once every 10s.`],
  },
  {
    code: 75,
    name: "White Tassel",
    icon: "1/1f/Weapon_White_Tassel",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cRate_", scale: "5.1%" },
    passiveName: "Sharp",
    descriptions: [`Increases {Normal Attack DMG}#[k] by {18^%}#[v].`],
    autoBuffs: [
      {
        base: 18,
        targetAttPatt: "NA.pct_",
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
    descriptions: [`Increases {DMG}#[k] against slimes by {30^%}#[v].`],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 30,
        targetAttPatt: "all.pct_",
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
