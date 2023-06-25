import type { DataWeapon } from "@Src/types";
import { Green } from "@Components";
import { EModAffect } from "@Src/constants";
import { liyueSeries } from "../series";
import { applyPercent, findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const goldClaymores: DataWeapon[] = [
  {
    code: 151,
    name: "Beacon of the Reed Sea",
    icon: "6/6c/Weapon_Beacon_of_the_Reed_Sea",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Desert Watch",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]}. {this.extra?.[1]}. The 2 aforementioned effects can be triggered even when the character
            is not on the field. {this.extra?.[2]}
          </>
        );
      },
      extra: [
        <>
          After an Elemental Skill hits an opponent, your <Green>ATK</Green> will be increased by{" "}
          <Green b>{15 + refi * 5}%</Green> for 8s.
        </>,
        <>
          After you take DMG, your <Green>ATK</Green> will be increased by <Green b>{15 + refi * 5}%</Green> for 8s.
        </>,
        <>
          When not protected by a shield, your character's <Green>Max HP</Green> will be increased by{" "}
          <Green b>{24 + refi * 8}%</Green>.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldClaymores, 151)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldClaymores, 151)?.passiveDesc({ refi }).extra?.[1],
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
      },
      {
        index: 2,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldClaymores, 151)?.passiveDesc({ refi }).extra?.[2],
        applyBuff: makeWpModApplier("totalAttr", "hp_", 32),
      },
    ],
  },
  {
    code: 53,
    name: "Song of Broken Pines",
    icon: "d/dd/Weapon_Song_of_Broken_Pines",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "phys", scale: "4.5%" },
    passiveName: "Rebel's Banner Hymn",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            A part of the "Millennial Movement" that wanders amidst the winds. Increases <Green>ATK</Green> by{" "}
            <Green b>{12 + refi * 4}%</Green>, and when Normal or Charged Attacks hit opponents, the character gains a
            Sigil of Whispers. This effect can be triggered once every 0.3s. When you possess four Sigils of Whispers,
            all of them will be consumed and all nearby party members will obtain the "Millennial Movement: Banner-Hymn"
            effect for 12s. {this.extra?.[0]} Of the many effects of the "Millennial Movement", buffs of the same type
            will not stack.
          </>
        );
      },
      extra: [
        <>
          "Millennial Movement: Banner-Hymn" increases <Green>Normal ATK SPD</Green> by <Green b>{9 + refi * 3}%</Green>{" "}
          and increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>. Once this effect is triggered, you will
          not gain Sigils of Whispers for 20s.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "atk_", 16),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => findByCode(goldClaymores, 53)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", ["naAtkSpd_", "atk_"], [12, 20]),
      },
    ],
  },
  {
    code: 54,
    name: "Skyward Pride",
    icon: "0/0b/Weapon_Skyward_Pride",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er_", scale: "8%" },
    passiveName: "Sky-ripping Dragon Spine",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>all DMG</Green> by <Green b>{6 + refi * 2}%</Green>. After using an Elemental Burst, Normal
          or Charged Attack, on hit, creates a vacuum blade that does {60 + refi * 20}% of ATK as DMG to opponents along
          its path. Lasts for 20s or 8 vacuum blades.
        </>
      ),
    }),
    applyBuff: makeWpModApplier("attPattBonus", "all.pct_", 8),
  },
  {
    code: 55,
    name: "The Unforged",
    icon: "f/f7/Weapon_The_Unforged",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 56,
    name: "Wolf's Gravestone",
    icon: "4/4f/Weapon_Wolf%27s_Gravestone",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    passiveName: "Wolfish Tracker",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          On hit, attacks against opponents with less than 30% HP increase all party members' <Green>ATK</Green> by{" "}
          <Green b>{30 + refi * 10}%</Green> for 12s. Can only occur once every 30s.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => findByCode(goldClaymores, 56)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", "atk_", 40),
      },
    ],
  },
  {
    code: 57,
    name: "Redhorn Stonethresher",
    icon: "d/d4/Weapon_Redhorn_Stonethresher",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passiveName: "Gokadaiou Otogibanashi",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>DEF</Green> is increased by <Green b>{21 + refi * 7}%</Green>.{" "}
          <Green>Normal and Charged Attack DMG</Green> is increased by <Green b>{30 + refi * 10}%</Green> of{" "}
          <Green>DEF</Green>.
        </>
      ),
    }),
    applyBuff: makeWpModApplier("totalAttr", "def_", 28),
    applyFinalBuff: ({ attPattBonus, refi, totalAttr, desc, tracker }) => {
      if (attPattBonus) {
        const mult = 30 + refi * 10;
        const buffValue = applyPercent(totalAttr.def, mult);
        const finalDesc = desc + ` / ${mult}% of ${Math.round(totalAttr.def)} DEF`;
        applyModifier(finalDesc, attPattBonus, ["NA.flat", "CA.flat"], buffValue, tracker);
      }
    },
  },
];

export default goldClaymores;
