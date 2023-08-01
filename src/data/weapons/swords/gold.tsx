import type { AppWeapon } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";
import { findByCode } from "@Src/utils";
import { liyueSeries } from "../series";

const mistsplitterBuffValuesByStack = (refi: number) => [6 + refi * 2, 12 + refi * 4, 21 + refi * 7];

const goldSwords: AppWeapon[] = [
  {
    code: 148,
    name: "Light of Foliar Incision",
    icon: "d/de/Weapon_Light_of_Foliar_Incision",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cDmg_", scale: "19.2%" },
    passiveName: "Whitemoon Bristle",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>CRIT Rate</Green> is increased by <Green b>{3 + refi}%</Green>. {this.extra?.[0]} You can obtain
            Foliar Incision once every 12s.
          </>
        );
      },
      extra: [
        <>
          When Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing{" "}
          <Green>Normal Attack and Elemental Skill DMG</Green> by <Green b>{90 + refi * 30}%</Green> of{" "}
          <Green>Elemental Mastery</Green>. This effect will disappear after <Rose>28</Rose> DMG instances or 12s.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 3,
        targetAttribute: "cRate_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldSwords, 148)?.passiveDesc({ refi }).extra?.[0],
        base: 0.9,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttPatt: ["NA.flat", "ES.flat"],
      },
    ],
  },
  {
    code: 140,
    name: "Key of Khaj-Nisut",
    icon: "5/52/Weapon_Key_of_Khaj-Nisut",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "hp_", scale: "14.4%" },
    passiveName: "Sunken Song of the Sands",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> increased by <Green b>{15 + refi * 5}%</Green>. {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the
          equipping character's <Green>Elemental Mastery</Green> by <Green b>{(9 + refi * 3) / 100}%</Green> of their{" "}
          <Green>Max HP</Green>. This effect can trigger once every 0.3s. Max <Rose>3</Rose> stacks.
        </>,
        <>
          When Grand Hymn effect gains 3 stacks, or when the third stack's duration is refreshed, the{" "}
          <Green>Elemental Mastery</Green> of all nearby party members will be increased by{" "}
          <Green b>{(15 + refi * 5) / 100}%</Green> of the equipping character's <Green>Max HP</Green> for 20s.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldSwords, 140)!.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        base: 0.09,
        stacks: [
          {
            type: "attribute",
            field: "hp",
            convertRate: 0.01,
          },
          {
            type: "input",
          },
        ],
        targetAttribute: "em",
      },
      {
        index: 1,
        affect: EModAffect.TEAMMATE,
        desc: ({ refi }) => findByCode(goldSwords, 140)!.passiveDesc({ refi }).extra?.[1],
        inputConfigs: [
          {
            label: "Max HP",
            type: "text",
            max: 99999,
          },
        ],
        base: 0.0015,
        stacks: {
          type: "input",
        },
      },
    ],
  },
  {
    code: 124,
    name: "Haran Geppaku Futsu",
    icon: "8/85/Weapon_Haran_Geppaku_Futsu",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate_", scale: "7.2%" },
    passiveName: "Honed Flow",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Obtain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green>. When other nearby party
            members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max{" "}
            <Rose>2</Rose> stacks. This effect can be triggered once every 0.3s. When the character equipping this
            weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Ripping Upheaval.{" "}
            {this.extra}
          </>
        );
      },
      extra: [
        <>
          <Green>Each stack</Green> of Wavepike consumed will increase <Green>Normal Attack DMG</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green> for 8s.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldSwords, 124)!.passiveDesc({ refi }).extra![0],
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 15,
        stacks: {
          type: "input",
        },
        targetAttPatt: "NA.pct_",
      },
    ],
  },
  {
    code: 101,
    name: "Mistsplitter Reforged",
    icon: "0/09/Weapon_Mistsplitter_Reforged",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg_", scale: "9.6%b" },
    passiveName: "Mistsplitter's Edge",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Gain a <Green b>{9 + refi * 3}%</Green> <Green>Elemental DMG Bonus</Green> for every element and receive the
            might of Mistsplitter's Emblem. {this.extra}
          </>
        );
      },
      extra: [
        <>
          At stack levels 1/2/3, Mistsplitter's Emblem provides a{" "}
          <Green b>{mistsplitterBuffValuesByStack(refi).join("/")}%</Green> Elemental DMG Bonus for the{" "}
          <Green>character's Elemental Type</Green>.
        </>,
        <>
          The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack
          deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100%
          (stack disappears when Energy is full). Each stack's duration is calculated independently.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 9,
        targetAttribute: [...VISION_TYPES],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldSwords, 101)!.passiveDesc({ refi }).extra![0],
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        base: 6,
        stacks: {
          type: "input",
          maxStackBonus: 3,
        },
        targetAttribute: "own_element",
      },
    ],
  },
  {
    code: 104,
    name: "Freedom-Sworn",
    icon: "3/39/Weapon_Freedom-Sworn",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "em", scale: "43" },
    passiveName: "Revolutionary Chorale",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            A part of the "Millennial Movement" that wanders amidst the winds. Increases <Green>DMG</Green> by{" "}
            <Green b>{7.5 + refi * 2.5}%</Green>. When triggering Elemental Reactions, the character gains a Sigil of
            Rebellion. This effect can be triggered once every 0.5s. When you possess 2 Sigils of Rebellion, all of them
            will be consumed and all nearby party members will obtain the "Millennial Movement: Song of Resistance"
            effect for 12s. {this.extra![0]} Of the many effects of the "Millennial Movement", buffs of the same type
            will not stack.
          </>
        );
      },
      extra: [
        <>
          "Millennial Movement: Song of Resistance" increases <Green>Normal, Charged, and Plunging Attack DMG</Green> by{" "}
          <Green b>{12 + refi * 4}%</Green> and increases <Green>ATK</Green> by <Green b>{15 + refi * 5}%</Green>. Once
          this effect is triggered, you will not gain Sigils of Rebellion for 20s.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 7.5,
        targetAttPatt: "all.pct_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        desc: ({ refi }) => findByCode(goldSwords, 104)!.passiveDesc({ refi })!.extra![0],
        buffBonuses: [
          {
            base: 12,
            targetAttPatt: [...NCPA_PERCENTS],
          },
          {
            base: 15,
            targetAttribute: "atk_",
          },
        ],
      },
    ],
  },
  {
    code: 106,
    name: "Primordial Jade Cutter",
    icon: "2/2a/Weapon_Primordial_Jade_Cutter",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate_", scale: "9.6%b" },
    passiveName: "Protector's Virtue",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>HP</Green> increased by <Green b>{15 + refi * 5}%</Green>. Additionally, provides an{" "}
          <Green>ATK Bonus</Green> based on <Green b>{(9 + refi * 3) / 10}%</Green> of the wielder's{" "}
          <Green>Max HP</Green>.
        </>
      ),
    }),
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
      },
      {
        base: 0.9,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttribute: "atk",
      },
    ],
  },
  {
    code: 105,
    name: "Summit Shaper",
    icon: "c/ca/Weapon_Summit_Shaper",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 102,
    name: "Aquila Favonia",
    icon: "6/6a/Weapon_Aquila_Favonia",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "phys", scale: "9%" },
    passiveName: "Falcon's Defiance",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>ATK</Green> is increased by <Green b>{15 + refi * 5}%</Green>. Triggers on taking DMG: the soul of the
          Falcon of the West awakens, holding the banner of the resistance aloft, regenerating HP equal to{" "}
          {85 + refi * 15}% of ATK and dealing <Green b>{160 + refi * 40}%</Green>
          of <Green>ATK</Green> as DMG to surrounding opponents. This effect can only occur once every 15s.
        </>
      ),
    }),
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 103,
    name: "Skyward Blade",
    icon: "0/03/Weapon_Skyward_Blade",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er_", scale: "12%" },
    passiveName: "Sky-Piercing Fang",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>Crit Rate</Green> increased by <Green b>{3 + refi}%</Green>. And Normal and Charged hits deal
            additional DMG equal to {15 + refi * 5}% of ATK. Skypiercing Might lasts for 12s. {this.extra}
          </>
        );
      },
      extra: [
        <>
          Gains Skypiercing Might upon using Elemental Burst: Increases Movement SPD and <Green>ATK SPD</Green> by{" "}
          <Green b>10%</Green>.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 3,
        targetAttribute: "cRate_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldSwords, 103)!.passiveDesc({ refi }).extra![0],
        base: 10,
        increment: 0,
        targetAttribute: "naAtkSpd_",
      },
    ],
  },
];

export default goldSwords;
