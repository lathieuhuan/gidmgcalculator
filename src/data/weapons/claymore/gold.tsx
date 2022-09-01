import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect } from "@Src/constants";
import { LiyueSeries } from "../series";
import { applyPercent, findByCode } from "@Src/utils";
import { applyModifier } from "@Src/calculators/utils";
import { makeWpModApplier } from "../utils";

const goldClaymores: DataWeapon[] = [
  {
    code: 53,
    name: "Song of Broken Pines",
    icon: "d/dd/Weapon_Song_of_Broken_Pines",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "phys", scale: "4.5%" },
    applyBuff: makeWpModApplier("totalAttr", "atk_", 16),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        applyBuff: makeWpModApplier("totalAttr", ["naAtkSpd", "atk_"], [12, 20]),
        desc: ({ refi }) => findByCode(goldClaymores, 53)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Rebel's Banner Hymn",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            A part of the "Millennial Movement" that wanders amidst the winds. Increases{" "}
            <Green>ATK</Green> by <Green b>{12 + refi * 4}%</Green>, and when Normal or Charged
            Attacks hit opponents, the character gains a Sigil of Whispers. This effect can be
            triggered once every 0.3s. When you possess four Sigils of Whispers, all of them will be
            consumed and all nearby party members will obtain the "Millennial Movement: Banner-Hymn"
            effect for 12s. {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          "Millennial Movement: Banner-Hymn" increases <Green>Normal ATK SPD</Green> by{" "}
          <Green b>{9 + refi * 3}%</Green> and increases <Green>ATK</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green>. Once this effect is triggered, you will not gain Sigils
          of Whispers for 20s.
        </>,
        <>
          Of the many effects of the "Millennial Movement", buffs of the same type will not stack.
        </>,
      ],
    }),
  },
  {
    code: 54,
    name: "Skyward Pride",
    icon: "0/0b/Weapon_Skyward_Pride",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er", scale: "8%" },
    applyBuff: makeWpModApplier("attPattBonus", "all.pct", 8),
    passiveName: "Sky-ripping Dragon Spine",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>all DMG</Green> by <Green b>{6 + refi * 2}%</Green>. After using an
          Elemental Burst, Normal or Charged Attack, on hit, creates a vacuum blade that does{" "}
          <Green b>{60 + refi * 20}%</Green> of <Green>ATK</Green> as DMG to opponents along its
          path. Lasts for 20s or 8 vacuum blades.
        </>
      ),
    }),
  },
  {
    code: 55,
    name: "The Unforged",
    icon: "f/f7/Weapon_The_Unforged",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...LiyueSeries,
  },
  {
    code: 56,
    name: "Wolf's Gravestone",
    icon: "4/4f/Weapon_Wolf%27s_Gravestone",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 40),
        desc: ({ refi }) => findByCode(goldClaymores, 56)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Wolfish Tracker",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          On hit, attacks against opponents with less than 30% HP increase all party members'{" "}
          <Green>ATK</Green> by <Green b>{30 + refi * 10}%</Green> for 12s. Can only occur once
          every 30s.
        </>,
      ],
    }),
  },
  {
    code: 57,
    name: "Redhorn Stonethresher",
    icon: "d/d4/Weapon_Redhorn_Stonethresher",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg", scale: "19.2%" },
    applyBuff: makeWpModApplier("totalAttr", "def_", 28),
    applyFinalBuff: ({ attPattBonus, refi, totalAttr, desc, tracker }) => {
      if (attPattBonus) {
        const buffValue = applyPercent(totalAttr.def, 30 + refi * 10);
        applyModifier(desc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      }
    },
    passiveName: "Gokadaiou Otogibanashi",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>DEF</Green> is increased by <Green b>{21 + refi * 7}%</Green>.{" "}
          <Green>Normal and Charged Attack DMG</Green> is increased by{" "}
          <Green b>{30 + refi * 10}%</Green> of <Green>DEF</Green>.
        </>
      ),
    }),
  },
];

export default goldClaymores;
