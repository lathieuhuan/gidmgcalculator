import type { AppWeapon } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import {
  blackcliffSeries,
  desertSeries,
  dragonspineSeries,
  favoniusSeries,
  royalSeries,
  sacrificialSeries,
} from "../series";
import { findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const purpleCatalysts: AppWeapon[] = [
  {
    code: 162,
    name: "Flowing Purity",
    icon: "https://images2.imgbox.com/56/62/FXT7IK0o_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passiveName: "",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]}, and a Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once
            every 10s. {this.extra?.[1]} Bond of Life: Absorbs healing for the character based on its base value, and
            clears after healing equal to this value is obtained.
          </>
        );
      },
      extra: [
        <>
          When using an Elemental Skill, <Green>All Elemental DMG Bonus</Green> will be increased by{" "}
          <Green b>{6 + refi * 2}%</Green> for 12s
        </>,
        <>
          When the Bond of Life is cleared, every 1,000 HP cleared in the process will provide{" "}
          <Green b>{1.5 + refi * 0.5}%</Green> <Green>All Elemental DMG Bonus</Green>. Up to a maximum of{" "}
          <Rose>{9 + refi * 3}%</Rose> All Elemental DMG can be gained this way. This effect lasts 12s.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 162)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 8),
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 162)?.passiveDesc({ refi }).extra?.[1],
        applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
          const bondValue = Math.round(totalAttr.hp * 0.24);
          const stacks = bondValue / 1000;
          const limit = 9 + refi * 3;
          let buffValue = (1.5 + refi * 0.5) * stacks;
          let finalDesc = desc + ` / ${1.5 + refi * 0.5}% * ${stacks} stacks (Bond ${bondValue})`;
          if (buffValue > limit) {
            buffValue = limit;
            finalDesc += ` / limit to ${limit}%`;
          }
          applyModifier(finalDesc, totalAttr, [...VISION_TYPES], buffValue, tracker);
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 6,
        targetGroup: "totalAttr",
        targetPath: [...VISION_TYPES],
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        base: 1.5,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.00024,
        },
        targetGroup: "totalAttr",
        targetPath: [...VISION_TYPES],
        max: 9,
      },
    ],
  },
  {
    code: 161,
    name: "Sacrificial Jade",
    icon: "https://images2.imgbox.com/80/94/Ke393kt9_o.png",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "cRate_", scale: "8%" },
    passiveName: "",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When not on the field for more than 6s, <Green>Max HP</Green> will be increased by{" "}
          <Green b>{15 + refi * 5}%</Green> and <Green>Elemental Mastery</Green> will be increased by{" "}
          <Green b>{60 + refi * 20}</Green>. These effects will be canceled after the wielder has been on the field for
          6s.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 161)?.passiveDesc({ refi }).core,
        applyBuff: makeWpModApplier("totalAttr", ["hp_", "em"], [20, 80]),
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        targetGroup: "totalAttr",
        buffBonuses: [
          {
            base: 15,
            targetPath: "hp_",
          },
          {
            base: 60,
            targetPath: "em",
          },
        ],
      },
    ],
  },
  {
    code: 144,
    name: "Wandering Evenstar",
    icon: "4/44/Weapon_Wandering_Evenstar",
    passiveName: "Wildling Nightstar",
    ...desertSeries,
  },
  {
    code: 137,
    name: "Fruit of Fulfillment",
    icon: "9/98/Weapon_Fruit_of_Fulfillment",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passiveName: "Full Circle",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]} For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be
            lost. This effect can be triggered even when the character is off-field.
          </>
        );
      },
      extra: [
        <>
          Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining{" "}
          <Green b>{21 + refi * 3}</Green> <Green>Elemental Mastery</Green> while losing 5% ATK. For every 0.3s, 1 stack
          of Wax and Wane can be gained. Max <Rose>5</Rose> stacks.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 137)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        applyBuff: ({ totalAttr, refi, desc, inputs, tracker }) => {
          const stacks = inputs[0] || 0;
          const buffValues = [(21 + refi * 3) * stacks, -5 * stacks];
          applyModifier(desc, totalAttr, ["em", "atk_"], buffValues, tracker);
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        stacks: {
          type: "input",
        },
        targetGroup: "totalAttr",
        buffBonuses: [
          {
            base: 21,
            increment: 3,
            targetPath: "em",
          },
          {
            base: -5,
            increment: 0,
            targetPath: "atk_",
          },
        ],
      },
    ],
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
        applyBuff: makeWpModApplier("totalAttr", "er_", 24),
        desc: ({ refi }) => findByCode(purpleCatalysts, 123)?.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "People of the Faltering Light",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Energy Recharge</Green> by <Green b>{18 + refi * 6}%</Green> for 10s after using an Elemental
          Skill.
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
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Ever-Changing",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate sprint by{" "}
            {12 + refi * 2}% for 5s. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          Using a Sprint or Alternate Sprint ability increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>{" "}
          for 5s.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 37)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetGroup: "totalAttr",
        targetPath: "atk_",
      },
    ],
  },
  {
    code: 38,
    name: "Hakushin Ring",
    icon: "e/ee/Weapon_Hakushin_Ring",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passiveName: "Sakura Saiguu",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of
          an Elemental Type involved in the elemental reaction receive a <Green b>{7.5 + refi * 2.5}%</Green>{" "}
          <Green>Elemental DMG Bonus for their element</Green>, lasting 6s. Elemental Bonuses gained in this way cannot
          be stacked.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => findByCode(purpleCatalysts, 38)?.passiveDesc({ refi }).core,
        applyBuff: ({ totalAttr, refi, charData, desc, tracker }) => {
          applyModifier(desc, totalAttr, charData.vision, 7.5 + refi * 2.5, tracker);
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        base: 7.5,
        targetGroup: "totalAttr",
        targetPath: "own_element",
      },
    ],
  },
  {
    code: 39,
    name: "Royal Grimoire",
    icon: "9/99/Weapon_Royal_Grimoire",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    ...royalSeries,
  },
  {
    code: 40,
    name: "Mappa Mare",
    icon: "4/4d/Weapon_Mappa_Mare",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "em", scale: "24" },
    passiveName: "Infusion Scroll",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Triggering an Elemental reaction grants a <Green b>{6 + refi * 2}%</Green> <Green>Elemental DMG Bonus</Green>{" "}
          for 10s. Max <Rose>2</Rose> stacks.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 40)?.passiveDesc({ refi }).core,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (6 + refi * 2) * (inputs[0] || 0);
          applyModifier(desc, totalAttr, [...VISION_TYPES], buffValue, tracker);
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
        },
        targetGroup: "totalAttr",
        targetPath: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 41,
    name: "The Widsith",
    icon: "f/f0/Weapon_The_Widsith",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    passiveName: "Debut",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          When a character takes the field, they will gain a random theme song for 10s. This can only occur once every
          30s. Recitative: <Green>ATK</Green> is increased by <Green b>{45 + refi * 15}%</Green>. Aria: increases{" "}
          <Green>all Elemental DMG</Green> by <Green b>{36 + refi * 12}%</Green>. Interlude:{" "}
          <Green>Elemental Mastery</Green> is increased by <Green b>{180 + refi * 60}</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 41)?.passiveDesc({ refi }).core,
        inputConfigs: [
          {
            label: "Theme Song",
            type: "select",
            initialValue: 0,
            options: ["Recitative", "Aria", "Interlude"],
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          switch (inputs[0] || 0) {
            case 0:
              applyModifier(desc, totalAttr, "atk_", 45 + refi * 15, tracker);
              break;
            case 1:
              applyModifier(desc, totalAttr, [...VISION_TYPES], 36 + refi * 12, tracker);
              break;
            default:
              applyModifier(desc, totalAttr, "em", 180 + refi * 60, tracker);
          }
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            label: "Theme Song",
            type: "select",
            initialValue: 0,
            options: ["Recitative", "Aria", "Interlude"],
          },
        ],
        targetGroup: "totalAttr",
        buffBonuses: [
          {
            checkInput: 0,
            base: 45,
            targetPath: "atk_",
          },
          {
            checkInput: 1,
            base: 36,
            targetPath: [...VISION_TYPES],
          },
          {
            checkInput: 2,
            base: 180,
            targetPath: "em",
          },
        ],
      },
    ],
  },
  {
    code: 42,
    name: "Frostbearer",
    icon: "1/1c/Weapon_Frostbearer",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    ...dragonspineSeries,
  },
  {
    code: 43,
    name: "Solar Pearl",
    icon: "f/fc/Weapon_Solar_Pearl",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passiveName: "Solar Shine",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]} {this.extra?.[1]}
          </>
        );
      },
      extra: [
        <>
          Normal Attack hits increase <Green>Elemental Skill</Green> and <Green>Elemental Burst DMG</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 6s.
        </>,
        <>
          Likewise, Elemental Skill or Elemental Burst hits increase <Green>Normal Attack DMG</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 6s.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 43)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("attPattBonus", ["ES.pct_", "EB.pct_"], 20),
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 43)?.passiveDesc({ refi }).extra?.[1],
        applyBuff: makeWpModApplier("attPattBonus", "NA.pct_", 20),
      },
    ],
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
          Using an Elemental Burst regenerates <Green b>{3.5 + refi * 0.5}</Green> <Green>Energy</Green> every 2s for
          6s. All party members will regenerate <Green b>{3.5 + refi * 0.5}%</Green> HP every 2s for this duration.
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
    subStat: { type: "er_", scale: "10%" },
    ...favoniusSeries,
  },
  {
    code: 46,
    name: "Blackcliff Agate",
    icon: "a/a6/Weapon_Blackcliff_Agate",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cDmg_", scale: "12%" },
    ...blackcliffSeries,
  },
  {
    code: 47,
    name: "Dodoco Tales",
    icon: "5/51/Weapon_Dodoco_Tales",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passiveName: "Dodoventure!",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]} {this.extra?.[1]}
          </>
        );
      },
      extra: [
        <>
          Normal Attack hits on opponents increase <Green>Charged Attack DMG</Green> by{" "}
          <Green b>{12 + refi * 4}%</Green> for 6s.
        </>,
        <>
          Charged Attack hits on opponents increase <Green>ATK</Green> by <Green b>{6 + refi * 2}%</Green> for 6s.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 47)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("attPattBonus", "CA.pct_", 16),
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(purpleCatalysts, 47)?.passiveDesc({ refi }).extra?.[1],
        applyBuff: makeWpModApplier("totalAttr", "atk_", 8),
      },
    ],
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
          Normal and Charged Attacks have a <Green>50% chance</Green> to fire a Bolt of Perception, dealing{" "}
          <Green b>{210 + refi * 30}%</Green> <Green>ATK</Green> as DMG. This bolt can bounce between opponents a
          maximum of 4 times. This effect can occur once every <Green b>{13 - refi}s</Green>.
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
    ...sacrificialSeries,
  },
];

export default purpleCatalysts;
