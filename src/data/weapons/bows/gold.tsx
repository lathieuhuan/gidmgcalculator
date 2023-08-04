import type { AppWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";

const goldBows: AppWeapon[] = [
  {
    code: 154,
    name: "The First Great Magic",
    icon: "https://images2.imgbox.com/50/9a/4YTtRZEz_o.png",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "missing passive name",
    description: {
      pots: [
        `{ATK} increased by {0}%. For every party member with the same Elemental Type as the wielder (including the
      wielder themselves), gain 1 Gimmick stack. For every party member with a different Elemental Type from the
      wielder, gain 1 Theatrics stack. When the wielder has 1/2/3 or more Gimmick stacks, {ATK} will be increased by
      {0}%/{1}%/{2}%. When the wielder has 1/2/3 or more Theatrics stacks, Movement SPD will be increased by
      {3}%/{4}%/{5}%.`,
      ],
      seeds: [
        12,
        24,
        36,
        { base: 2, increment: 2, seedType: "dull" },
        { base: 5, increment: 2, seedType: "dull" },
        { base: 8, increment: 2, seedType: "dull" },
      ],
    },
    autoBuffs: [
      {
        base: 12,
        targetAttribute: "atk_",
      },
      {
        base: 12,
        stacks: {
          type: "vision",
          element: "same_included",
          max: 3,
        },
        targetAttribute: "atk_",
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
    description: {
      pots: [
        `Gain {0}% {All Elemental DMG Bonus}.`,
        `Obtain the Tireless Hunt effect when hitting an opponent with a Charged Attack. This effect increases
        {Charged Attack DMG} by {1}% of {Elemental Mastery}.`,
        `This effect will be removed after 12 Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained every 12s.`,
      ],
      seeds: [9, 120],
    },
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
        description: 1,
        base: 1.2,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttPatt: "CA.flat",
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
    description: {
      pots: [
        "{HP} is increased by {0}%.",
        "When there are opponents nearby, the {DMG} dealt by the wielder of this weapon is increased by {1}%.",
        "This will take effect whether the character is on-field or not.",
      ],
      seeds: [12, 15],
    },
    autoBuffs: [
      {
        base: 12,
        targetAttribute: "hp_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        base: 15,
        targetAttPatt: "all.pct_",
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
    description: {
      pots: [
        `{Elemental Skill and Elemental Burst DMG} increased by {0}%. After a Normal Attack, Charged Attack, Elemental
        Skill or Elemental Burst hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s.`,
        `When 1/2/3/4 stacks of Ashen Nightstar are present, {ATK} is increased by {1}/{2}/{3}/{4}%.`,
        `The stack of Ashen Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst
        will be counted independently of the others.`,
      ],
      seeds: [9, 7.5, 15, 22.5, 36],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        options: [7.5, 15, 22.5, 36],
        stacks: {
          type: "input",
        },
        targetAttribute: "atk_",
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
    description: {
      pots: [
        `Increases {ATK} by {0}% and grants the might of the Thunder Emblem.`,
        `At stack levels 1/2/3, the Thunder Emblem increases {Normal Attack DMG} by {1}/{2}/{3}%.`,
        `The character will obtain 1 stack of Thunder Emblem in each of the following scenarios: Normal Attack deals
        DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is less than 100% (stack disappears
        when Energy is full). Each stack's duration is calculated independently.`,
      ],
      seeds: [15, 9, 18, 30],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "atk_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        options: [9, 18, 30],
        stacks: {
          type: "input",
        },
        targetAttPatt: "NA.pct_",
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
    description: {
      pots: [
        `A part of the "Millennial Movement" that wanders amidst the winds. Increases {Elemental Mastery} by {0}. When
        Elemental Skill or Elemental Burst hit opponents, the character gains a Sigil of Remembrance. This effect can
        be triggered once every 0.2s and can be triggered even if said character is not on the field. When you possess
        four Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the
        "Millennial Movement: Farewell Song" effect for 12s.`,
        `"Millennial Movement: Farewell Song" increases {Elemental Mastery} by {1} and increases {ATK} by {2}%.`,
        `Once this effect is triggered, you will not gain Sigils of Remembrance for 20s. Of the many effects of the
        "Millennial Movement", buffs of the same type will not stack.`,
      ],
      seeds: [45, 75, 15],
    },
    autoBuffs: [
      {
        base: 45,
        targetAttribute: "em",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        description: 1,
        buffBonuses: [
          {
            base: 75,
            targetAttribute: "em",
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
    code: 8,
    name: "Amos' Bow",
    icon: "d/de/Weapon_Amos%27_Bow",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    passiveName: "Strong-Willed",
    description: {
      pots: [
        `Increases {Normal Attack and Charged Attack DMG} by {0}%.`,
        `After a Normal or Charged Attack is fired, {DMG} dealt increases by a further {1}% every 0.1 seconds the arrow
        is in the air for up to {2} times.`,
      ],
      seeds: [9, 6, { max: 2, increment: 0 }],
    },
    autoBuffs: [
      {
        base: 9,
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        description: 1,
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
        targetAttPatt: ["NA.pct_", "CA.pct_"],
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
    description: {
      pots: [
        `Increases {CRIT DMG} by {0}%. Hits have a {1}% chance to inflict a small AoE attack, dealing 125% Physical ATK
        DMG. Can only occur once every {2}s.`,
      ],
      seeds: [15, { base: 50, increment: 10, seedType: "dull" }, { base: 4.5, increment: -0.5, seedType: "dull" }],
    },
    autoBuffs: [
      {
        base: 15,
        targetAttribute: "cDmg_",
      },
    ],
  },
];

export default goldBows;
