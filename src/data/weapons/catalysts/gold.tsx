import type { AppWeapon } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";
import { applyPercent, findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const goldCatalysts: AppWeapon[] = [
  {
    code: 152,
    name: "Jadefall's Splendor",
    icon: "7/7a/Weapon_Jadefall%27s_Splendor",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Primordial Jade Regalia",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            {this.extra?.[0]} At the same time, they will regain {4 + refi * 0.5} Energy every 2.5s. This will still
            take effect even if the character is not on the field.
          </>
        );
      },
      extra: [
        <>
          When using an Elemental Burst or creating a shield, the equipping character's{" "}
          <Green>corresponding Elemental DMG</Green> is increased by <Green b>{(10 + refi * 20) / 100}%</Green> for
          every 1,000 Max HP they possess for 3s, up to <Rose>{4 + refi * 8}%</Rose>.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldCatalysts, 152)?.passiveDesc({ refi }).extra?.[0],
        applyFinalBuff: ({ totalAttr, refi, charData, desc, tracker }) => {
          const stacks = Math.floor(totalAttr.hp / 1000);
          const buffValue = Math.min(stacks * (0.1 + refi * 0.2), 4 + refi * 8);
          applyModifier(desc, totalAttr, charData.vision, buffValue, tracker);
        },
      },
    ],

    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        isFinal: true,
        base: 0.1,
        increment: 0.2,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.001,
        },
        targetAttribute: "own_element",
        max: {
          base: 4,
          increment: 8,
        },
      },
    ],
  },
  {
    code: 147,
    name: "Tulaytullah's Remembrance",
    icon: "f/fc/Weapon_Tulaytullah%27s_Remembrance",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg_", scale: "9.6%b" },
    passiveName: "Bygone Azure Teardrop",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>Normal Attack SPD</Green> is increased by <Green b>{7.5 + refi * 2.5}%</Green>. {this.extra?.[0]} The
            effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset all
            DMG buffs.
          </>
        );
      },
      extra: [
        <>
          After the wielder unleashes an Elemental Skill, <Green>Normal Attack DMG</Green> will increase by{" "}
          <Green b>{(36 + refi * 12) / 10}%</Green> every second for 12s. After this character hits an opponent with a
          Normal Attack during this duration, <Green>Normal Attack DMG</Green> will be increased by{" "}
          <Green b>{(72 + refi * 24) / 10}%</Green>. This increase can be triggered once every 0.3s. Total maximum bonus
          is <Rose>48%</Rose>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "naAtkSpd_", 10),
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldCatalysts, 147)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          { label: "Seconds passed", type: "text", max: 10 },
          { label: "Normal attacks hit", type: "text", max: 10 },
        ],
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const stacks = (inputs[0] || 0) + (inputs[1] || 0) * 2;
          const valuePerStack = (36 + refi * 12) / 10;
          let buffValue = stacks * valuePerStack;
          buffValue = Math.min(buffValue, valuePerStack * 10);
          applyModifier(desc, attPattBonus, "NA.pct_", buffValue, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "naAtkSpd_",
      },
    ],
    newBuffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        inputConfigs: [
          { label: "Seconds passed", type: "text", max: 10 },
          { label: "Normal attacks hit", type: "text", max: 10 },
        ],
        base: 3.6,
        stacks: {
          type: "input",
          index: [{ value: 0 }, { value: 1, convertRate: 2 }],
        },
        targetAttPatt: "NA.pct_",
        max: 36,
      },
    ],
  },
  {
    code: 143,
    name: "A Thousand Floating Dreams",
    icon: "4/4c/Weapon_A_Thousand_Floating_Dreams",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "em", scale: "58" },
    passiveName: "A Thousand Nights' Dawnsong",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Party members other than the equipping character will provide the equipping character with buffs based on
            whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same,
            increase <Green>Elemental Mastery</Green> by <Green b>{24 + refi * 8}</Green>. If not, increase the
            equipping character's <Green>DMG Bonus</Green> from their Elemental Type by <Green b>{6 + refi * 4}%</Green>
            . Max <Rose>3</Rose> stacks. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          Additionally, all nearby party members other than the equipping character will have their{" "}
          <Green>Elemental Mastery</Green> increased by <Green b>{38 + refi * 2}</Green>. Multiple such effects from
          multiple such weapons can stack.
        </>,
      ],
    }),
    applyBuff: ({ totalAttr, charData, partyData, refi, desc, tracker }) => {
      if (partyData) {
        const sameVision = partyData.reduce((result, data) => {
          return data?.vision === charData.vision ? result + 1 : result;
        }, 0);
        const emBuffValue = sameVision * (24 + refi * 8);
        const elmtDmgBuffValue = (partyData.filter(Boolean).length - sameVision) * (6 + refi * 4);

        applyModifier(desc, totalAttr, "em", emBuffValue, tracker);
        applyModifier(desc, totalAttr, charData.vision, elmtDmgBuffValue, tracker);
      }
    },
    buffs: [
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        desc: ({ refi }) => findByCode(goldCatalysts, 143)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: ({ totalAttr, refi, desc, tracker }) => {
          applyModifier(desc, totalAttr, "em", 38 + refi * 2, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 24,
        stacks: {
          type: "vision",
          element: "same_excluded",
        },
        targetAttribute: "em",
      },
      {
        base: 6,
        increment: 4,
        stacks: {
          type: "vision",
          element: "different",
        },
        targetAttribute: "own_element",
      },
    ],
    newBuffs: [
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        base: 38,
        increment: 2,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 122,
    name: "Kagura's Verity",
    icon: "b/b7/Weapon_Kagura%27s_Verity",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Kagura Dance of the Sacred Sakura",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Gains the Kagura Dance effect when using an Elemental Skill, causing the <Green>Elemental Skill DMG</Green> of
          the character wielding this weapon to increase by <Green b>{9 + refi * 3}%</Green> for 16s. Max <Rose>3</Rose>{" "}
          stacks. This character will gain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green> when
          they possess 3 stacks.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldCatalysts, 122)?.passiveDesc({ refi }).core,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyBuff: ({ totalAttr, attPattBonus, refi, inputs, desc, tracker }) => {
          const stack = inputs[0] || 0;
          applyModifier(desc, attPattBonus, "ES.pct_", (9 + refi * 3) * stack, tracker);

          if (stack === 3) {
            applyModifier(desc, totalAttr, [...VISION_TYPES], 9 + refi * 3, tracker);
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
            type: "stacks",
            max: 3,
          },
        ],
        buffBonuses: [
          {
            base: 9,
            stacks: {
              type: "input",
            },
            targetAttPatt: "ES.pct_",
          },
          {
            checkInput: 3,
            base: 9,
            targetAttribute: [...VISION_TYPES],
          },
        ],
      },
    ],
  },
  {
    code: 34,
    name: "Everlasting Moonglow",
    icon: "e/e1/Weapon_Everlasting_Moonglow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "hp_", scale: "10.8%" },
    passiveName: "Byakuya Kougetsu",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>Healing Bonus</Green> increased by <Green b>{7.5 + refi * 2.5}%</Green>,{" "}
          <Green>Normal Attack DMG</Green> is increased by <Green b>{0.75 + refi * 0.25}%</Green> of the{" "}
          <Green>Max HP</Green> of the character equipping this weapon. For 12s after using an Elemental Burst, Normal
          Attacks that hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.
        </>
      ),
    }),
    applyBuff: makeWpModApplier("totalAttr", "healB_", 10),
    applyFinalBuff: ({ totalAttr, attPattBonus, refi, desc, tracker }) => {
      if (attPattBonus) {
        const buffValue = applyPercent(totalAttr.hp, 0.75 + refi * 0.25);
        applyModifier(desc, attPattBonus, "NA.flat", buffValue, tracker);
      }
    },

    autoBuffs: [
      {
        base: 7.5,
        targetAttribute: "healB_",
      },
      {
        isFinal: true,
        base: 0.75,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttPatt: "NA.flat",
      },
    ],
  },
  {
    code: 31,
    name: "Skyward Atlas",
    icon: "3/33/Weapon_Skyward_Atlas",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "atk_", scale: "7.2%" },
    passiveName: "Wandering Clouds",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>Elemental DMG Bonus</Green> by <Green b>{9 + refi * 3}%</Green>. Normal Attack hits have a
          50% chance to earn the favor of the clouds. which actively seek out nearby opponents to attack for 15s,
          dealing {120 + refi * 40}% ATK DMG. Can only occur once every 30s.
        </>
      ),
    }),
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 12),

    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 32,
    name: "Lost Prayer to the Sacred Winds",
    icon: "9/98/Weapon_Lost_Prayer_to_the_Sacred_Winds",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Boundless Blessing",
    passiveDesc: ({ refi }) => ({
      get core() {
        return <>Increases Movement SPD by 10%. {this.extra?.[0]} Lasts until the character falls or leaves combat.</>;
      },
      extra: [
        <>
          When in battle, gain an <Green b>{6 + refi * 2}%</Green> <Green>Elemental DMG Bonus</Green> every 4s. Max{" "}
          <Rose>4</Rose> stacks.
        </>,
      ],
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldCatalysts, 32)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
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
            max: 5,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
        },
        targetAttribute: [...VISION_TYPES],
      },
    ],
  },
  {
    code: 33,
    name: "Memory of Dust",
    icon: "c/ca/Weapon_Memory_of_Dust",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
];

export default goldCatalysts;
