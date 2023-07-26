import type { AppWeapon } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { baneSeries1, cullTheWeakSeries } from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const otherClaymores: AppWeapon[] = [
  {
    code: 130,
    name: "White Iron Greatsword",
    icon: "5/56/Weapon_White_Iron_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "def_", scale: "9.6%a" },
    ...cullTheWeakSeries,
  },
  {
    code: 129,
    name: "Ferrous Shadow",
    icon: "e/e9/Weapon_Ferrous_Shadow",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    passiveName: "Unbending",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When HP falls below {65 + refi * 5}%, increases <Green>Charged Attack DMG</Green> by{" "}
          <Green b>{25 + refi * 5}%</Green>, and Charged Attacks become much harder to interrupt.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherClaymores, 129)?.passiveDesc({ refi }).core,
        applyBuff: makeWpModApplier("attPattBonus", "CA.pct_", 30, 6),
      },
    ],
  },
  {
    code: 50,
    name: "Skyrider Greatsword",
    icon: "6/6e/Weapon_Skyrider_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "phys", scale: "9.6%a" },
    passiveName: "Courage",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, Normal or Charged Attacks increase <Green>ATK</Green> by <Green b>{5 + refi}%</Green> for 6s. Max{" "}
          <Rose>4</Rose> stacks. Can only occur once every 0.5s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(otherClaymores, 50)?.passiveDesc({ refi }).core,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, "atk_", (5 + refi) * (inputs[0] || 0), tracker);
        },
      },
    ],
  },
  {
    code: 51,
    name: "Debate Club",
    icon: "7/74/Weapon_Debate_Club",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "atk_", scale: "7.7%" },
    passiveName: "Blunt Conclusion",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After using an Elemental Skill, Normal or Charged Attacks, on hit, deal an additional{" "}
          <Green b>{45 + refi * 15}%</Green> <Green>ATK</Green> DMG in a small area. Effect lasts 15s. DMG can only
          occur once every 3s.
        </>
      ),
    }),
  },
  {
    code: 52,
    name: "Bloodtainted Greatsword",
    icon: "4/4a/Weapon_Bloodtainted_Greatsword",
    rarity: 3,
    mainStatScale: "38",
    subStat: { type: "em", scale: "41" },
    ...baneSeries1("Fire and Thunder", "Pyro or Electro"),
  },
  {
    code: 58,
    name: "Old Merc's Pal",
    icon: "0/0b/Weapon_Old_Merc%27s_Pal",
    ...GREEN_INFO,
  },
  {
    code: 59,
    name: "Waster Greatsword",
    icon: "4/4c/Weapon_Waster_Greatsword",
    ...GRAY_INFO,
  },
];

export default otherClaymores;
