import type { AppWeapon } from "@Src/types";
import { Green } from "@Src/pure-components";
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
    passive: {
      name: "Heavy",
      description: `Normal Attacks deal an additional {0}% DMG. Can only occur once every 10s.`,
      seeds: [{ base: 120, dull: true }],
    },
  },
  {
    code: 75,
    name: "White Tassel",
    icon: "1/1f/Weapon_White_Tassel",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cRate_", scale: "5.1%" },
    passive: {
      name: "Sharp",
      description: `Increases Normal Attack DMG by {0}%.`,
      seeds: [18],
    },
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
    passive: {
      name: "Bane of the Soft",
      description: `Increases DMG against slimes by {0}%.`,
      seeds: [30],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Increases <Green>DMG</Green> against slimes by <Green b>{30 + refi * 10}%</Green>.
          </>
        ),
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
