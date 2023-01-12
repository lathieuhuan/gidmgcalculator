import type { DataWeapon } from "@Src/types";
import { Cryo, Gold, Green, Red, Rose } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import {
  blackcliffSeries,
  favoniusSeries,
  royalSeries,
  sacrificialSeries,
  watatsumiSeries,
} from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const fadingTwilightBuffValuesByState = (refi: number) => [
  4.5 + refi * 1.5,
  7.5 + refi * 2.5,
  10.5 + refi * 3.5,
];

const purpleBows: DataWeapon[] = [
  {
    code: 138,
    name: "King's Squire",
    icon: "a/a2/Weapon_King%27s_Squire",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er", scale: "12%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "em", 60, 3),
        desc: ({ refi }) => findByCode(purpleBows, 138)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Labyrinth Lord's Instruction",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts,
            increasing <Green>Elemental Mastery</Green> by <Green b>{40 + refi * 20}</Green> for
            12s. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          This effect will be removed when switching characters. When the Teachings of the Forest
          effect ends or is removed, it will deal 100% of ATK as DMG to 1 nearby opponent. The
          Teachings of the Forest effect can be triggered once every 20s.
        </>,
      ],
    }),
  },
  {
    code: 126,
    name: "Fading Twilight",
    icon: "2/2b/Weapon_Fading_Twilight",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            label: "State number",
            type: "select",
            max: 3,
          },
        ],
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const valueIndex = (inputs[0] || 0) - 1;
          const buffValue = fadingTwilightBuffValuesByState(refi)[valueIndex];
          applyModifier(desc, attPattBonus, "all.pct", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleBows, 126)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Radiance of the Deeps",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Has three states, Evengleam (1), Afterglow (2), and Dawnblaze (3), which increase{" "}
            <Green>DMG</Green> dealt by{" "}
            <Green b>
              {fadingTwilightBuffValuesByState(refi)
                .map((pct) => pct + "%")
                .join("/")}
            </Green>{" "}
            respectively. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          When attacks hit opponents, this weapon will switch to the next state. This weapon can
          change states once every 7s. The character equipping this weapon can still trigger the
          state switch while not on the field.
        </>,
      ],
    }),
  },
  {
    code: 12,
    name: "Alley Hunter",
    icon: "0/0a/Weapon_Alley_Hunter",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 10,
          },
        ],
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (1.5 + refi * 0.5) * (inputs[0] || 0);
          applyModifier(desc, attPattBonus, "all.pct", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleBows, 12)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Oppidan Ambush",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            While the character equipped with this weapon is in the party but not on the field,
            their <Green>DMG</Green> increases by <Green b>{1.5 + refi * 0.5}%</Green> every second
            up to a max of <Green b>{15 + refi * 5}%</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          When the character is on the field for more than 4s, the aforementioned DMG buff decreases
          by 4% per second until it reaches 0%.
        </>,
      ],
    }),
  },
  {
    code: 13,
    name: "Blackcliff Warbow",
    icon: "b/b8/Weapon_Blackcliff_Warbow",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cDmg", scale: "8%" },
    ...blackcliffSeries,
  },
  {
    code: 14,
    name: "Mouun's Moon",
    icon: "4/42/Weapon_Mouun%27s_Moon",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...watatsumiSeries,
  },
  {
    code: 15,
    name: "Sacrificial Bow",
    icon: "e/ec/Weapon_Sacrificial_Bow",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    ...sacrificialSeries,
  },
  {
    code: 16,
    name: "Predator",
    icon: "2/2e/Weapon_Predator",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    applyBuff: ({ totalAttr, charData, desc, tracker }) => {
      if (charData.code === 39) {
        applyModifier(desc, totalAttr, "atk", 66, tracker);
      }
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
          const buffValue = 10 * (inputs[0] || 0);
          applyModifier(desc, attPattBonus, ["NA.pct", "CA.pct"], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleBows, 16)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Strong Strike",
    passiveDesc: () => ({
      get core() {
        return (
          <>
            When <Gold>Aloy</Gold> equips Predator, <Green>ATK</Green> is increased by{" "}
            <Green b>66</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          Dealing <Cryo>Cryo DMG</Cryo> to opponents increases this character's{" "}
          <Green>Normal and Charged Attack DMG</Green> by <Green b>10%</Green> for 6s. This effect
          can have a maximum of <Green b>2</Green> stacks.
          <br />
          <Red>
            <span className="mr-4">•</span>
            <i>Effective for players on "PlayStation Network" only.</i>
          </Red>
        </>,
      ],
    }),
  },
  {
    code: 17,
    name: "The Stringless",
    icon: "7/71/Weapon_The_Stringless",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    applyBuff: makeWpModApplier("attPattBonus", ["ES.pct", "EB.pct"], 24),
    passiveName: "Arrowless Song",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental Skill</Green> and <Green>Elemental Burst DMG</Green> by{" "}
          <Green b>{18 + refi * 6}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 18,
    name: "The Viridescent Hunt",
    icon: "f/ff/Weapon_The_Viridescent_Hunt",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate", scale: "6%" },
    passiveName: "Verdant Wind",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Upon hit, Normal and Aimed Shot Attacks have a <Green>50% chance</Green> to generate a
          Cyclone, which will continuously attract surrounding opponents, dealing{" "}
          <Green b>{30 + refi * 10}%</Green> of <Green>ATK</Green> as DMG to these opponents every
          0.5s for 4s. This effect can only occur once every <Green b>{15 - refi * 1}s</Green>.
        </>
      ),
    }),
  },
  {
    code: 19,
    name: "Mitternachts Waltz",
    icon: "7/77/Weapon_Mitternachts_Waltz",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "phys", scale: "11.3%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "ES.pct", 20),
        desc: ({ refi }) => findByCode(purpleBows, 19)!.passiveDesc({ refi }).extra![0],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "NA.pct", 20),
        desc: ({ refi }) => findByCode(purpleBows, 19)!.passiveDesc({ refi }).extra![1],
      },
    ],
    passiveName: "Evernight Duet",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          Normal Attack hits on opponents increase <Green>Elemental Skill DMG</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 5s.
        </>,
        <>
          Elemental Skill hits on opponents increase <Green>Normal Attack DMG</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 5s.
        </>,
      ],
    }),
  },
  {
    code: 20,
    name: "Royal Bow",
    icon: "9/99/Weapon_Royal_Bow",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...royalSeries,
  },
  {
    code: 21,
    name: "Windblume Ode",
    icon: "3/38/Weapon_Windblume_Ode",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 16),
        desc: ({ refi }) => findByCode(purpleBows, 21)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Windblume Wish",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After using an Elemental Skill, receive a boon from the ancient wish of the Windblume,
          increasing <Green>ATK</Green> by <Green b>{12 + refi * 4}%</Green> for 6s.
        </>
      ),
    }),
  },
  {
    code: 22,
    name: "Rust",
    icon: "1/1c/Weapon_Rust",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    applyBuff: ({ attPattBonus, refi, desc, tracker }) => {
      if (attPattBonus) {
        applyModifier(desc, attPattBonus, "NA.pct", 30 + refi * 10, tracker);
        applyModifier("Rust passive penalty", attPattBonus, "CA.pct", -10, tracker);
      }
    },
    passiveName: "Rapid Firing",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Normal Attack DMG</Green> by <Green b>{30 + refi * 10}%</Green> but
          decreases Charged Attack DMG by 10%.
        </>
      ),
    }),
  },
  {
    code: 23,
    name: "Prototype Crescent",
    icon: "4/43/Weapon_Prototype_Crescent",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 36),
        desc: ({ refi }) => findByCode(purpleBows, 23)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Unreturning",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Charged Attack hits on weak points increase Movement SPD by 10% and <Green>ATK</Green> by{" "}
          <Green b>{27 + refi * 9}%</Green> for 10s.
        </>
      ),
    }),
  },
  {
    code: 24,
    name: "Compound Bow",
    icon: "3/32/Weapon_Compound_Bow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "phys", scale: "15%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const stacks = inputs[0] || 0;
          const bnValues = [(3 + refi) * stacks, (0.9 + refi * 0.3) * stacks];
          applyModifier(desc, totalAttr, ["atk_", "naAtkSpd"], bnValues, tracker);
        },
        desc: ({ refi }) => findByCode(purpleBows, 24)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Infusion Arrow",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Normal Attack and Charged Attack hits increase <Green>ATK</Green> by{" "}
          <Green b>{3 + refi}%</Green> and <Green>Normal ATK SPD</Green> by{" "}
          <Green b>{0.9 + refi * 0.3}%</Green> for 6s. Max <Rose>4</Rose> stacks. Can only occur
          once every 0.3s.
        </>
      ),
    }),
  },
  {
    code: 25,
    name: "Hamayumi",
    icon: "d/d9/Weapon_Hamayumi",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    applyBuff: makeWpModApplier("attPattBonus", ["NA.pct", "CA.pct"], [16, 12]),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", ["NA.pct", "CA.pct"], [16, 12]),
        desc: ({ refi }) => findByCode(purpleBows, 25)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Full Draw",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases <Green>Normal Attack DMG</Green> by <Green b>{12 + refi * 4}%</Green> and{" "}
            <Green>Charged Attack DMG</Green> by <Green b>{9 + refi * 3}%</Green>.
          </>
        );
      },
      extra: [
        <>
          When the equipping character's Energy reaches 100%, the <Green>DMG Bonuses</Green> are
          increased by <Green b>100%</Green>.
        </>,
      ],
    }),
  },
  {
    code: 26,
    name: "Favonius Warbow",
    icon: "8/85/Weapon_Favonius_Warbow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er", scale: "13.3%" },
    ...favoniusSeries,
  },
];

export default purpleBows;
