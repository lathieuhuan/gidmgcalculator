import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { GRAY_INFO, GREEN_INFO } from "../constants";
import { BaneSeries1, CullTheWeak } from "../series";
import { applyModifier } from "@Src/calculators/utils";
import { findByCode } from "@Src/utils";

const otherClaymores: DataWeapon[] = [
  {
    code: 130,
    name: "White Iron Greatsword",
    icon: "5/56/Weapon_White_Iron_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "def_", scale: "9.6%a" },
    ...CullTheWeak,
  },
  {
    code: 129,
    name: "Ferrous Shadow",
    icon: "e/e9/Weapon_Ferrous_Shadow",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "hp_", scale: "7.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: ({ attPattBonus, refi, desc, tracker }) => {
          applyModifier(desc, attPattBonus, "CA.pct", 25 + refi * 5, tracker);
        },
        desc: ({ refi }) => findByCode(otherClaymores, 129)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Unbending",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When HP falls below {65 + refi * 5}%, increases <Green>Charged Attack DMG</Green> by{" "}
          <Green b>{25 + refi * 5}%</Green>, and Charged Attacks become much harder to interrupt.
        </>
      ),
    }),
  },
  {
    code: 50,
    name: "Skyrider Greatsword",
    icon: "6/6e/Weapon_Skyrider_Greatsword",
    rarity: 3,
    mainStatScale: "39",
    subStat: { type: "phys", scale: "9.6%a" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [4],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          applyModifier(desc, totalAttr, "atk_", (5 + refi) * +inputs![0], tracker);
        },
        desc: ({ refi }) => findByCode(otherClaymores, 50)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Courage",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, Normal or Charged Attacks increase <Green>ATK</Green> by{" "}
          <Green b>{5 + refi}%</Green> for 6s. Max <Green b>4</Green> stacks. Can only occur once
          every 0.5s.
        </>
      ),
    }),
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
          <Green b>{45 + refi * 15}%</Green> <Green>ATK</Green> DMG in a small area. Effect lasts
          15s. DMG can only occur once every 3s.
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
    ...BaneSeries1("Fire and Thunder", "Pyro or Electro"),
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
