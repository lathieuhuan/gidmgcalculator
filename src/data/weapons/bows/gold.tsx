import type { AppWeapon } from "@Src/types";
import { Green, Rose } from "@Src/pure-components";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { countVision, findByCode } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const polarStarBuffValuesByStack = (refi: number) => [
  7.5 + refi * 2.5,
  15 + refi * 5,
  22.5 + refi * 7.5,
  36 + refi * 12,
];
const thunderingPulseBuffValuesByStack = (refi: number) => [9 + refi * 3, 18 + refi * 6, 30 + refi * 10];
const the1stGreateMagicBuffValuesByStack = (refi: number) => [12 + refi * 4, 24 + refi * 8, 36 + refi * 12];

const goldBows: AppWeapon[] = [
  {
    code: 154,
    name: "The First Great Magic",
    icon: "https://images2.imgbox.com/50/9a/4YTtRZEz_o.png",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "missing passive name",
    passiveDesc: ({ refi }) => {
      const msDiff = refi * 2;
      return {
        core: (
          <>
            <Green>ATK</Green> increased by <Green b>{12 + refi * 4}%</Green>. For every party member with the same
            Elemental Type as the wielder (including the wielder themselves), gain 1 Gimmick stack. For every party
            member with a different Elemental Type from the wielder, gain 1 Theatrics stack. When the wielder has 1/2/3
            or more Gimmick stacks, <Green>ATK</Green> will be increased by{" "}
            <Green b>{the1stGreateMagicBuffValuesByStack(refi).join("/")}%</Green>. When the wielder has 1/2/3 or more
            Theatrics stacks, Movement SPD will be increased by {2 + msDiff}/{5 + msDiff}/{8 + msDiff}%.
          </>
        ),
      };
    },
    applyBuff: ({ totalAttr, charData, partyData, refi, desc, tracker }) => {
      if (partyData) {
        const { [charData.vision]: sameVisionCount } = countVision(partyData, charData);
        let buffValue = 12 + refi * 4;

        if (sameVisionCount) {
          const valueIndex = Math.min(sameVisionCount, 3) - 1;
          buffValue += the1stGreateMagicBuffValuesByStack(refi)[valueIndex] || 0;
        }
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      }
    },

    autoBuffs: [
      {
        base: 12,
        targetGroup: "totalAttr",
        targetPath: "atk_",
      },
      {
        base: 12,
        stacks: {
          type: "vision",
          element: "same_included",
          max: 3,
        },
        targetGroup: "totalAttr",
        targetPath: "atk_",
      },
    ],
  },
  {
    code: 133,
    name: "Hunter's Path",
    icon: "d/dd/Weapon_Hunter%27s_Path",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate_", scale: "9.6%b" },
    passiveName: "At the End of the Beast-Paths",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Gain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green>. {this.extra?.[0]} This effect
            will be removed after <Rose>12</Rose> Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained
            every 12s.
          </>
        );
      },
      extra: [
        <>
          Obtain the Tireless Hunt effect when hitting an opponent with a Charged Attack. This effect increases{" "}
          <Green>Charged Attack DMG</Green> by <Green b>{120 + refi * 40}%</Green> of <Green>Elemental Mastery</Green>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 12),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldBows, 133)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: ({ desc, refi, totalAttr, attPattBonus, tracker }) => {
          const buffValue = totalAttr.em * (1.2 + refi * 0.4);
          applyModifier(desc, attPattBonus, "CA.flat", buffValue, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 9,
        targetGroup: "totalAttr",
        targetPath: [...VISION_TYPES],
      },
    ],
    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 1.2,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetGroup: "attPattBonus",
        targetPath: "CA.flat",
      },
    ],
  },
  {
    code: 125,
    name: "Aqua Simulacra",
    icon: "c/cd/Weapon_Aqua_Simulacra",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passiveName: "The Cleansing Form",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> is increased by <Green>{12 + refi * 4}%</Green>. {this.extra?.[0]} This will take effect
            whether the character is on-field or not.
          </>
        );
      },
      extra: [
        <>
          When there are opponents nearby, the <Green>DMG</Green> dealt by the wielder of this weapon is increased by{" "}
          <Green b>{15 + refi * 5}%</Green>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "hp_", 16),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldBows, 125)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("attPattBonus", "all.pct_", 20),
      },
    ],

    autoBuffs: [
      {
        base: 12,
        targetGroup: "totalAttr",
        targetPath: "hp_",
      },
    ],
    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        base: 15,
        targetGroup: "attPattBonus",
        targetPath: "all.pct_",
      },
    ],
  },
  {
    code: 5,
    name: "Skyward Harp",
    icon: "1/19/Weapon_Skyward_Harp",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cRate_", scale: "4.8%" },
    passiveName: "Echoing Ballad",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>CRIT DMG</Green> by <Green b>{15 + refi * 5}%</Green>. Hits have a{" "}
          <Green b>{50 + refi * 10}%</Green> <Green>chance</Green> to inflict a small AoE attack, dealing{" "}
          <Green>125% Physical ATK DMG</Green>. Can only occur once every <Green b>{4.5 - refi * 0.5}s</Green>.
        </>
      ),
    }),
    applyBuff: makeWpModApplier("totalAttr", "cDmg_", 20),

    autoBuffs: [
      {
        base: 15,
        targetGroup: "totalAttr",
        targetPath: "cDmg_",
      },
    ],
  },
  {
    code: 6,
    name: "Polar Star",
    icon: "4/44/Weapon_Polar_Star",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Daylight's Augury",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>Elemental Skill</Green> and <Green>Elemental Burst DMG</Green> increased by{" "}
            <Green b>{9 + refi * 3}%</Green>. After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst
            hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s. {this.extra?.[0]} The stack of Ashen
            Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst will be counted
            independently of the others.
          </>
        );
      },
      extra: [
        <>
          When 1/2/3/4 stacks of Ashen Nightstar are present, <Green>ATK</Green> is increased by{" "}
          <Green b>{polarStarBuffValuesByStack(refi).join("/")}%</Green>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("attPattBonus", ["ES.pct_", "EB.pct_"], 12),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldBows, 6)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const valueIndex = (inputs[0] || 0) - 1;
          const buffValue = polarStarBuffValuesByStack(refi)[valueIndex];
          applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 9,
        targetGroup: "attPattBonus",
        targetPath: ["ES.pct_", "EB.pct_"],
      },
    ],
    newBuffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        base: 7.5,
        stacks: {
          type: "input",
        },
        targetGroup: "totalAttr",
        targetPath: "atk_",
      },
    ],
  },
  {
    code: 7,
    name: "Thundering Pulse",
    icon: "7/77/Weapon_Thundering_Pulse",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Rule by Thunder",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green> and grants the might of the Thunder
            Emblem. {this.extra?.[0]} The character will obtain 1 stack of Thunder Emblem in each of the following
            scenarios: Normal Attack deals DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is
            less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.
          </>
        );
      },
      extra: [
        <>
          At stack levels 1/2/3, the Thunder Emblem increases <Green>Normal Attack DMG</Green> by{" "}
          <Green b>{thunderingPulseBuffValuesByStack(refi).join("/")}%</Green>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "atk_", 20),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldBows, 7)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const valueIndex = (inputs[0] || 0) - 1;
          const buffValue = thunderingPulseBuffValuesByStack(refi)[valueIndex];
          applyModifier(desc, attPattBonus, "NA.pct_", buffValue, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 15,
        targetGroup: "totalAttr",
        targetPath: "atk_",
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
        base: 9,
        stacks: {
          type: "input",
          maxStackBonus: 3,
        },
        targetGroup: "attPattBonus",
        targetPath: "NA.pct_",
      },
    ],
  },
  {
    code: 8,
    name: "Amos' Bow",
    icon: "d/de/Weapon_Amos%27_Bow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    passiveName: "Strong-Willed",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Increases <Green>Normal Attack and Charged Attack DMG</Green> by <Green b>{9 + refi * 3}%</Green>.{" "}
            {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          After a Normal or Charged Attack is fired, <Green>DMG</Green> dealt increases by a further{" "}
          <Green b>{6 + refi * 2}%</Green> every 0.1 seconds the arrow is in the air for up to <Rose>5</Rose> times.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("attPattBonus", ["NA.pct_", "CA.pct_"], 12),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldBows, 8)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 5,
          },
        ],
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (6 + refi * 2) * (inputs[0] || 0);
          applyModifier(desc, attPattBonus, ["NA.pct_", "CA.pct_"], buffValue, tracker);
        },
      },
    ],

    autoBuffs: [
      {
        base: 9,
        targetGroup: "attPattBonus",
        targetPath: ["NA.pct_", "CA.pct_"],
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
        targetGroup: "attPattBonus",
        targetPath: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 9,
    name: "Elegy for the End",
    icon: "a/a5/Weapon_Elegy_for_the_End",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er_", scale: "12%" },
    passiveName: "The Parting Refrain",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            A part of the "Millennial Movement" that wanders amidst the winds. Increases{" "}
            <Green>Elemental Mastery</Green> by <Green b>{45 + refi * 15}</Green>. When Elemental Skill or Elemental
            Burst hit opponents, the character gains a Sigil of Remembrance. This effect can be triggered once every
            0.2s and can be triggered even if said character is not on the field. When you possess four Sigils of
            Remembrance, all of them will be consumed and all nearby party members will obtain the "Millennial Movement:
            Farewell Song" effect for 12s. {this.extra?.[0]} Once this effect is triggered, you will not gain Sigils of
            Remembrance for 20s. Of the many effects of the "Millennial Movement", buffs of the same type will not
            stack.
          </>
        );
      },
      extra: [
        <>
          "Millennial Movement: Farewell Song" increases <Green>Elemental Mastery</Green> by{" "}
          <Green b>{75 + refi * 25}</Green> and increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>.
        </>,
      ],
    }),
    applyBuff: makeWpModApplier("totalAttr", "em", 60),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => findByCode(goldBows, 9)?.passiveDesc({ refi }).extra?.[0],
        applyBuff: makeWpModApplier("totalAttr", ["em", "atk_"], [100, 20]),
      },
    ],

    autoBuffs: [
      {
        base: 45,
        targetGroup: "totalAttr",
        targetPath: "em",
      },
    ],
    newBuffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        base: [75, 15],
        targetGroup: "totalAttr",
        targetPath: ["em", "atk_"],
      },
    ],
  },
];

export default goldBows;
