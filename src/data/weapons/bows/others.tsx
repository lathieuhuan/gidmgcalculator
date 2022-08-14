import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { BaneSeries1, CullTheWeak } from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Src/calculators/utils";
import { makeWpModApplier } from "../utils";

const otherBows: DataWeapon[] = [
  {
    code: 127,
    name: "Recurve Bow",
    icon: "b/b5/Weapon_Recurve_Bow",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "hp_", scale: "10.2%" },
    ...CullTheWeak,
  },
  {
    code: 1,
    name: "Messenger",
    icon: "3/38/Weapon_Messenger",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "cDmg", scale: "6.8%" },
    passiveName: "Archer's Message",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Charged Attack hits on weak spots deal an additional <Green b>{75 + refi * 25}%</Green>{" "}
          <Green>ATK</Green> DMG as CRIT DMG. Can only occur once every 10s.
        </>
      ),
    }),
  },
  {
    code: 2,
    name: "Raven Bow",
    icon: "d/d0/Weapon_Raven_Bow",
    rarity: 3,
    mainStatScale: "40",
    subStat: { type: "em", scale: "20" },
    ...BaneSeries1("Flame and Water", "Hydro or Pyro"),
  },
  {
    code: 3,
    name: "Sharpshooter's Oath",
    icon: "5/52/Weapon_Sharpshooter%27s_Oath",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "cDmg", scale: "10.2%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "CA.pct", 6),
        desc: ({ refi }) => findByCode(otherBows, 3)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Precise",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>DMG</Green> against weak spots by <Green b>{18 + refi * 6}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 4,
    name: "Slingshot",
    icon: "c/ca/Weapon_Slingshot",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "cRate", scale: "6.8%" },
    applyBuff: ({ attPattBonus, desc, tracker }) => {
      if (attPattBonus) {
        applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct"], -10, tracker);
      }
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: ({ attPattBonus, refi, desc, tracker }) => {
          applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct"], 40 + refi * 6, tracker);
        },
        desc: ({ refi }) => findByCode(otherBows, 4)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Slingshot",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          If a <Green>Normal or Charged Attack</Green> hits a target within 0.3s of being fired,
          increases <Green>DMG</Green> by <Green b>{30 + refi * 6}%</Green>. Otherwise, decreases
          DMG by 10%.
        </>
      ),
    }),
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
