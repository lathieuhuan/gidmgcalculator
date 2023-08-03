import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1, cullTheWeakPassive } from "../series";

const otherBows: AppWeapon[] = [
  {
    code: 127,
    name: "Recurve Bow",
    icon: "b/b5/Weapon_Recurve_Bow",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "hp_", scale: "10.2%" },
    ...cullTheWeakPassive,
  },
  {
    code: 1,
    name: "Messenger",
    icon: "3/38/Weapon_Messenger",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "cDmg_", scale: "6.8%" },
    passiveName: "Archer's Message",
    description: {
      pots: [
        "Charged Attack hits on weak spots deal an additional {0}% ATK DMG as CRIT DMG. Can only occur once every 10s.",
      ],
      seeds: [{ base: 75, seedType: "dull" }],
    },
  },
  {
    code: 2,
    name: "Raven Bow",
    icon: "d/d0/Weapon_Raven_Bow",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "em", scale: "20" },
    ...baneSeries1("Flame and Water", "Hydro or Pyro"),
  },
  {
    code: 3,
    name: "Sharpshooter's Oath",
    icon: "5/52/Weapon_Sharpshooter%27s_Oath",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cDmg_", scale: "10.2%" },
    passiveName: "Precise",
    description: {
      pots: ["Increases {DMG} against weak spots by {0}%."],
      seeds: [18],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 18,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 4,
    name: "Slingshot",
    icon: "c/ca/Weapon_Slingshot",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "cRate_", scale: "6.8%" },
    passiveName: "Slingshot",
    description: {
      pots: [
        `If a {Normal or Charged Attack} hits a target within 0.3s of being fired, increases {DMG} by {0}%. Otherwise,
        decreases DMG by 10%.`,
      ],
      seeds: [{ base: 30, increment: 6 }],
    },
    autoBuffs: [
      {
        base: -10,
        increment: 0,
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 40,
        increment: 6,
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 10,
    name: "Seasoned Hunter's Bow",
    icon: "8/82/Weapon_Seasoned_Hunter%27s_Bow",
    ...GREEN_INFO,
  },
  {
    code: 11,
    name: "Hunter's Bow",
    icon: "4/44/Weapon_Hunter%27s_Bow",
    ...GRAY_INFO,
  },
];

export default otherBows;
