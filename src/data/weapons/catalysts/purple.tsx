import type { DataWeapon } from "@Src/types";
import { Green } from "@Src/styled-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import {
  BlackcliffSeries,
  DesertSeries,
  DragonspineSeries,
  FavoniusSeries,
  RoyalSeries,
  SacrificialSeries,
} from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Calculators/utils";
import { makeWpModApplier } from "../utils";

const purpleCatalysts: DataWeapon[] = [
  {
    code: 144,
    name: "Wandering Evenstar",
    icon: "4/44/Weapon_Wandering_Evenstar",
    passiveName: "Wildling Nightstar",
    ...DesertSeries,
  },
  {
    code: 137,
    name: "Fruit of Fulfillment",
    icon: "9/98/Weapon_Fruit_of_Fulfillment",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [5],
        },
        applyBuff: ({ totalAttr, refi, desc, inputs, tracker }) => {
          const stacks = inputs?.[0] || 0;
          const buffValues = [(21 + refi * 3) * stacks, -5 * stacks];
          applyModifier(desc, totalAttr, ["em", "atk_"], buffValues, tracker);
        },
        desc: ({ refi }) => findByCode(purpleCatalysts, 137)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Full Circle",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining{" "}
            <Green b>{21 + refi * 3}</Green> <Green>Elemental Mastery</Green> while losing 5% ATK.
            For every 0.3s, 1 stack of Wax and Wane can be gained. Max <Green b>5</Green>{" "}
            <Green>stacks</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be
          lost. This effect can be triggered even when the character is off-field.
        </>,
      ],
    }),
  },
  {
    code: 123,
    name: "Oathsworn Eye",
    icon: "a/af/Weapon_Oathsworn_Eye",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "er", 24),
        desc: ({ refi }) => findByCode(purpleCatalysts, 123)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "People of the Faltering Light",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>{18 + refi * 6}%</Green> for 10s
          after using an Elemental Skill.
        </>
      ),
    }),
  },
  {
    code: 37,
    name: "Wine and Song",
    icon: "c/c6/Weapon_Wine_and_Song",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
        desc: ({ refi }) => findByCode(purpleCatalysts, 37)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Ever-Changing",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or
            Alternate sprint by {12 + refi * 2} for 5s. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          Using a Sprint or Alternate Sprint ability increases <Green>ATK</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 5s.
        </>,
      ],
    }),
  },
  {
    code: 38,
    name: "Hakushin Ring",
    icon: "e/ee/Weapon_Hakushin_Ring",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er", scale: "6.7%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        inputConfig: {
          labels: ["Element"],
          renderTypes: ["choices"],
          initialValues: [0],
          options: [["Pyro", "Hydro", "Cryo", "Anemo"]],
        },
        applyBuff: ({ totalAttr, refi, inputs, charData, desc, tracker }) => {
          const { vision } = charData;
          const optionIndex = inputs?.[0] || 0;
          const elmtIndex = [0, 1, 3, 5][optionIndex];

          if (vision === "electro" || vision === VISION_TYPES[elmtIndex]) {
            applyModifier(desc, totalAttr, vision, 7.5 + refi * 2.5, tracker);
          }
        },
        desc: ({ refi }) => findByCode(purpleCatalysts, 38)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Sakura Saiguu",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After the character equipped with this weapon triggers an Electro elemental reaction,
          nearby party members of an Elemental Type involved in the elemental reaction receive a{" "}
          <Green b>{7.5 + refi * 2.5}%</Green> Elemental DMG Bonus for <Green>their element</Green>,
          lasting 6s. Elemental Bonuses gained in this way cannot be stacked.
        </>
      ),
    }),
  },
  {
    code: 39,
    name: "Royal Grimoire",
    icon: "9/99/Weapon_Royal_Grimoire",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...RoyalSeries,
  },
  {
    code: 40,
    name: "Mappa Mare",
    icon: "4/4d/Weapon_Mappa_Mare",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [1],
          maxValues: [2],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (6 + refi * 2) * (inputs?.[0] || 0);
          applyModifier(desc, totalAttr, [...VISION_TYPES], buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(purpleCatalysts, 40)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Infusion Scroll",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Triggering an Elemental reaction grants a <Green b>{6 + refi * 2}%</Green>{" "}
          <Green>Elemental DMG Bonus</Green> for 10s. Max <Green b>2</Green> stacks.
        </>
      ),
    }),
  },
  {
    code: 41,
    name: "The Widsith",
    icon: "f/f0/Weapon_The_Widsith",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg", scale: "12%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Theme Song"],
          renderTypes: ["choices"],
          initialValues: [0],
          options: [["Recitative", "Aria", "Interlude"]],
        },
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffIndex = inputs?.[0] || 0;

          if (buffIndex === 0) {
            applyModifier(desc, totalAttr, "atk_", 45 + refi * 15, tracker);
          } else if (buffIndex === 1) {
            applyModifier(desc, totalAttr, [...VISION_TYPES], 36 + refi * 12, tracker);
          } else {
            applyModifier(desc, totalAttr, "em", 180 + refi * 60, tracker);
          }
        },
        desc: ({ refi }) => findByCode(purpleCatalysts, 41)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Debut",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When a character takes the field, they will gain a random theme song for 10s. This can
          only occur once every 30s. Recitative: <Green>ATK</Green> is increased by{" "}
          <Green b>{45 + refi * 15}%</Green>. Aria: increases <Green>all Elemental DMG</Green> by{" "}
          <Green b>{36 + refi * 12}%</Green>. Interlude: <Green>Elemental Mastery</Green> is
          increased by <Green b>{180 + refi * 60}</Green>.
        </>
      ),
    }),
  },
  {
    code: 42,
    name: "Frostbearer",
    icon: "1/1c/Weapon_Frostbearer",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...DragonspineSeries,
  },
  {
    code: 43,
    name: "Solar Pearl",
    icon: "f/fc/Weapon_Solar_Pearl",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate", scale: "6%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", ["ES.pct", "EB.pct"], 20),
        desc: ({ refi }) => findByCode(purpleCatalysts, 43)!.passiveDesc({ refi }).extra![0],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "NA.pct", 20),
        desc: ({ refi }) => findByCode(purpleCatalysts, 43)!.passiveDesc({ refi }).extra![1],
      },
    ],
    passiveName: "Solar Shine",
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
          Normal Attack hits increase <Green>Elemental Skill</Green> and{" "}
          <Green>Elemental Burst DMG</Green> by <Green b>{15 + refi * 5}%</Green> for 6s.
        </>,
        <>
          Likewise, Elemental Skill or Elemental Burst hits increase{" "}
          <Green>Normal Attack DMG</Green> by <Green b>{15 + refi * 5}%</Green> for 6s.
        </>,
      ],
    }),
  },
  {
    code: 44,
    name: "Prototype Amber",
    icon: "2/2a/Weapon_Prototype_Amber",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "hp_", scale: "9%" },
    passiveName: "Gilding",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Using an Elemental Burst regenerates <Green b>{3.5 + refi * 0.5}</Green>{" "}
          <Green>Energy</Green> every 2s for 6s. All party members will regenerate{" "}
          <Green b>{3.5 + refi * 0.5}%</Green> HP every 2s for this duration.
        </>
      ),
    }),
  },
  {
    code: 45,
    name: "Favonius Codex",
    icon: "3/36/Weapon_Favonius_Codex",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er", scale: "10%" },
    ...FavoniusSeries,
  },
  {
    code: 46,
    name: "Blackcliff Agate",
    icon: "a/a6/Weapon_Blackcliff_Agate",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg", scale: "12%" },
    ...BlackcliffSeries,
  },
  {
    code: 47,
    name: "Dodoco Tales",
    icon: "5/51/Weapon_Dodoco_Tales",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("attPattBonus", "CA.pct", 16),
        desc: ({ refi }) => findByCode(purpleCatalysts, 47)!.passiveDesc({ refi }).extra![0],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "atk_", 8),
        desc: ({ refi }) => findByCode(purpleCatalysts, 47)!.passiveDesc({ refi }).extra![1],
      },
    ],
    passiveName: "Dodoventure!",
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
          Normal Attack hits on opponents increase <Green>Charged Attack DMG</Green> by{" "}
          <Green b>{12 + refi * 4}%</Green> for 6s.
        </>,
        <>
          Charged Attack hits on opponents increase <Green>ATK</Green> by{" "}
          <Green b>{6 + refi * 2}%</Green> for 6s.
        </>,
      ],
    }),
  },
  {
    code: 48,
    name: "Eye of Perception",
    icon: "6/6c/Weapon_Eye_of_Perception",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Echo",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Normal and Charged Attacks have a <Green>50% chance</Green> to fire a Bolt of Perception,
          dealing <Green b>{210 + refi * 30}%</Green> <Green>ATK</Green> as DMG. This bolt can
          bounce between opponents a maximum of 4 times. This effect can occur once every{" "}
          <Green b>{13 - refi}s</Green>.
        </>
      ),
    }),
  },
  {
    code: 49,
    name: "Sacrificial Fragments",
    icon: "6/6c/Weapon_Sacrificial_Fragments",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "em", scale: "48" },
    ...SacrificialSeries,
  },
];

export default purpleCatalysts;
