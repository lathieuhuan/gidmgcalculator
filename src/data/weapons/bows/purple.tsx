import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Cryo, Green, Red, Rose } from "@Src/pure-components";
import { blackcliffSeries, favoniusSeries, royalSeries, sacrificialSeries, watatsumiSeries } from "../series";

const purpleBows: AppWeapon[] = [
  {
    code: 164,
    name: "Song of Stillness",
    icon: "https://images2.imgbox.com/5b/49/z9GEFv7l_o.png",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: {
      name: "",
      description: `After the wielder is healed, they will deal {0}% more DMG for 8s. This can be triggered even when
      the character is not on the field.`,
      seeds: [12],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            After the wielder is healed, they will deal <Green b>{12 + refi * 4}%</Green> more <Green>DMG</Green> for
            8s. This can be triggered even when the character is not on the field.
          </>
        ),
        base: 12,
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 163,
    name: "Scion of the Blazing Sun",
    icon: "https://images2.imgbox.com/6f/b7/efQwDBFc_o.png",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cRate_", scale: "4%" },
    passive: {
      name: "",
      description: `After a Charged Attack hits an opponent, a Sunfire Arrow will descend and deal {0}% ATK as DMG.
      After a Sunfire Arrow hits an opponent, it will increase the Charged Attack DMG taken by this opponent from
      the wielder by {1}%. A Sunfire Arrow can be triggered once every 12s.`,
      seeds: [{ base: 45, dull: true }, 21],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            After a Sunfire Arrow hits an opponent, it will increase the <Green>Charged Attack DMG</Green> taken by this
            opponent from the wielder by <Green b>{21 + refi * 7}%</Green>.
          </>
        ),
        base: 21,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 153,
    name: "Ibis Piercer",
    icon: "c/ce/Weapon_Ibis_Piercer",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passive: {
      name: "Secret Wisdom's Favor",
      description: `The character's Elemental Mastery will increase by {0} within 6s after Charged Attacks hit
      opponents. Max 2 stacks. This effect can triggered once every 0.5s.`,
      seeds: [30],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            The character's <Green>Elemental Mastery</Green> will increase by <Green b>{30 + refi * 10}</Green> within
            6s after Charged Attacks hit opponents. Max <Rose>2</Rose> stacks. This effect can triggered once every
            0.5s.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 30,
        stacks: {
          type: "input",
        },
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 166,
    name: "End of the Line",
    icon: "7/71/Weapon_End_of_the_Line",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "er_", scale: "10%" },
    passive: {
      name: "Net Snapper",
      description: `Triggers the Flowrider effect after using an Elemental Skill, dealing {0}% ATK as AoE DMG upon
      hitting an opponent with an attack. Flowrider will be removed after 15s or after causing 3 instances of AoE
      DMG. Only 1 instance of AoE DMG can be caused every 2s in this way. Flowrider can be triggered once every 12s.`,
      seeds: [{ base: 60, dull: true }],
    },
  },
  {
    code: 138,
    name: "King's Squire",
    icon: "a/a2/Weapon_King%27s_Squire",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passive: {
      name: "Labyrinth Lord's Instruction",
      description: `Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing
      Elemental Mastery by {0} for 12s. This effect will be removed when switching characters. When the Teachings of
      the Forest effect ends or is removed, it will deal {1}% of ATK as DMG to 1 nearby opponent. The Teachings of the
      Forest effect can be triggered once every 20s.`,
      seeds: [
        { base: 40, increment: 20 },
        { base: 80, increment: 20, dull: true },
      ],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Obtain the Teachings of the Forest effect when unleashing Elemental Skills and Bursts, increasing{" "}
            <Green>Elemental Mastery</Green> by <Green b>{40 + refi * 20}</Green> for 12s.
          </>
        ),
        base: 40,
        increment: 20,
        targetAttribute: "em",
      },
    ],
  },
  {
    code: 126,
    name: "Fading Twilight",
    icon: "2/2b/Weapon_Fading_Twilight",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "er_", scale: "6.7%" },
    passive: {
      name: "Radiance of the Deeps",
      description: `Has three states, Evengleam (1), Afterglow (2), and Dawnblaze (3), which increase DMG dealt by
      {0}/{1}/{2}% respectively. When attacks hit opponents, this weapon will switch to the next state. This weapon can
      change states once every 7s. The character equipping this weapon can still trigger the state switch while not on
      the field.`,
      seeds: [4.5, 7.5, 10.5],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Has three states, Evengleam (1), Afterglow (2), and Dawnblaze (3), which increase <Green>DMG</Green> dealt
            by <Green b>{[4.5 + refi * 1.5, 7.5 + refi * 2.5, 10.5 + refi * 3.5].join("/")}%</Green> respectively.
          </>
        ),
        inputConfigs: [
          {
            label: "State number",
            type: "select",
            max: 3,
          },
        ],
        // (1.5 + refi * 0.5) + (3 + refi * 1) * stacks
        base: 3,
        initialBonus: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 12,
    name: "Alley Hunter",
    icon: "0/0a/Weapon_Alley_Hunter",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "atk_", scale: "6%" },
    passive: {
      name: "Oppidan Ambush",
      description: `While the character equipped with this weapon is in the party but not on the field, their DMG
      increases by {0}% every second up to a max of {1}%. When the character is on the field for more than 4s, the
      aforementioned DMG buff decreases by 4% per second until it reaches 0%.`,
      seeds: [1.5, { base: 15, dull: true }],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            While the character equipped with this weapon is in the party but not on the field, their <Green>DMG</Green>{" "}
            increases by <Green b>{1.5 + refi * 0.5}%</Green> every second up to a max of <Rose>{15 + refi * 5}%</Rose>.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 10,
          },
        ],
        base: 1.5,
        stacks: {
          type: "input",
        },
        targetAttPatt: "all.pct_",
      },
    ],
  },
  {
    code: 13,
    name: "Blackcliff Warbow",
    icon: "b/b8/Weapon_Blackcliff_Warbow",
    rarity: 4,
    mainStatScale: "44",
    subStat: { type: "cDmg_", scale: "8%" },
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
    subStat: { type: "er_", scale: "6.7%" },
    ...sacrificialSeries,
  },
  {
    code: 16,
    name: "Predator",
    icon: "2/2e/Weapon_Predator",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: {
      name: "Strong Strike",
      description: `When Aloy equips Predator, ATK is increased by {0}. Dealing Cryo DMG to opponents increases this
      character's Normal and Charged Attack DMG by {1}% for 6s. This effect can have a maximum of 2 stacks.<br />
      • Effective for players on "PlayStation Network" only.`,
      seeds: [
        { base: 66, increment: 0 },
        { base: 10, increment: 0 },
      ],
    },
    autoBuffs: [
      {
        base: 66,
        increment: 0,
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => (
          <>
            Dealing <Cryo>Cryo DMG</Cryo> to opponents increases this character's{" "}
            <Green>Normal and Charged Attack DMG</Green> by <Green b>10%</Green> for 6s. This effect can have a maximum
            of <Rose b>2</Rose> stacks.
            <br />
            <Red>
              <span className="mr-4">•</span>
              <i>Effective for players on "PlayStation Network" only.</i>
            </Red>
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 2,
          },
        ],
        base: 10,
        increment: 0,
        stacks: {
          type: "input",
        },
        targetAttPatt: ["NA.pct_", "CA.pct_"],
      },
    ],
  },
  {
    code: 17,
    name: "The Stringless",
    icon: "7/71/Weapon_The_Stringless",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "em", scale: "36" },
    passive: {
      name: "Arrowless Song",
      description: "Increases Elemental Skill and Elemental Burst DMG by {0}%.",
      seeds: [18],
    },
    autoBuffs: [
      {
        base: 18,
        targetAttPatt: ["ES.pct_", "EB.pct_"],
      },
    ],
  },
  {
    code: 18,
    name: "The Viridescent Hunt",
    icon: "f/ff/Weapon_The_Viridescent_Hunt",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "cRate_", scale: "6%" },
    passive: {
      name: "Verdant Wind",
      description: `Upon hit, Normal and Aimed Shot Attacks have a 50% chance to generate a Cyclone, which will
      continuously attract surrounding opponents, dealing {0}% of ATK as DMG to these opponents every 0.5s for 4s. This
      effect can only occur once every {1}s.`,
      seeds: [
        { base: 30, dull: true },
        { base: 15, increment: -1, dull: true },
      ],
    },
  },
  {
    code: 19,
    name: "Mitternachts Waltz",
    icon: "7/77/Weapon_Mitternachts_Waltz",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "phys", scale: "11.3%" },
    passive: {
      name: "Evernight Duet",
      description: `Normal Attack hits on opponents increase Elemental Skill DMG by {0}% for 5s. Elemental Skill hits
      on opponents increase Normal Attack DMG by {1}% for 5s.`,
      seeds: [15, 15],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Normal Attack hits on opponents increase <Green>Elemental Skill DMG</Green> by{" "}
            <Green b>{15 + refi * 5}%</Green> for 5s.
          </>
        ),
        base: 15,
        targetAttPatt: "ES.pct_",
      },
      {
        index: 1,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Elemental Skill hits on opponents increase <Green>Normal Attack DMG</Green> by{" "}
            <Green b>{15 + refi * 5}%</Green> for 5s.
          </>
        ),
        base: 15,
        targetAttPatt: "NA.pct_",
      },
    ],
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
    passive: {
      name: "Windblume Wish",
      description: `After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing
      ATK by {0}% for 6s.`,
      seeds: [12],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            After using an Elemental Skill, receive a boon from the ancient wish of the Windblume, increasing{" "}
            <Green>ATK</Green> by <Green b>{12 + refi * 4}%</Green> for 6s.
          </>
        ),
        base: 12,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 22,
    name: "Rust",
    icon: "1/1c/Weapon_Rust",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: {
      name: "Rapid Firing",
      description: "Increases Normal Attack DMG by {0}% but decreases Charged Attack DMG by 10%.",
      seeds: [30],
    },
    autoBuffs: [
      {
        base: 30,
        targetAttPatt: "NA.pct_",
      },
      {
        base: -10,
        increment: 0,
        targetAttPatt: "CA.pct_",
      },
    ],
  },
  {
    code: 23,
    name: "Prototype Crescent",
    icon: "4/43/Weapon_Prototype_Crescent",
    rarity: 4,
    mainStatScale: "42",
    subStat: { type: "atk_", scale: "9%" },
    passive: {
      name: "Unreturning",
      description: "Charged Attack hits on weak points increase Movement SPD by 10% and ATK by {0}% for 10s.",
      seeds: [27],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Charged Attack hits on weak points increase Movement SPD by 10% and <Green>ATK</Green> by{" "}
            <Green b>{27 + refi * 9}%</Green> for 10s.
          </>
        ),
        base: 27,
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 24,
    name: "Compound Bow",
    icon: "3/32/Weapon_Compound_Bow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "phys", scale: "15%" },
    passive: {
      name: "Infusion Arrow",
      description: `Normal Attack and Charged Attack hits increase ATK by {0}% and Normal ATK SPD by {1}% for 6s. Max 4
      stacks. Can only occur once every 0.3s.`,
      seeds: [3, 0.9],
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => (
          <>
            Normal Attack and Charged Attack hits increase <Green>ATK</Green> by <Green b>{3 + refi}%</Green> and{" "}
            <Green>Normal ATK SPD</Green> by <Green b>{0.9 + refi * 0.3}%</Green> for 6s. Max <Rose>4</Rose> stacks. Can
            only occur once every 0.3s.
          </>
        ),
        inputConfigs: [
          {
            type: "stacks",
            max: 4,
          },
        ],
        stacks: {
          type: "input",
        },
        buffBonuses: [
          {
            base: 3,
            targetAttribute: "atk_",
          },
          {
            base: 0.9,
            targetAttribute: "naAtkSpd_",
          },
        ],
      },
    ],
  },
  {
    code: 25,
    name: "Hamayumi",
    icon: "d/d9/Weapon_Hamayumi",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "atk_", scale: "12%" },
    passive: {
      name: "Full Draw",
      description: `Increases Normal Attack DMG by {0}% and Charged Attack DMG by {1}%. When the equipping character's
      Energy reaches 100%, the DMG Bonuses are increased by 100%.`,
      seeds: [12, 9],
    },
    autoBuffs: [
      {
        base: 12,
        targetAttPatt: "NA.pct_",
      },
      {
        base: 9,
        targetAttPatt: "CA.pct_",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: () => (
          <>
            When the equipping character's Energy reaches 100%, the <Green>DMG Bonuses</Green> are increased by{" "}
            <Green b>100%</Green>.
          </>
        ),
        buffBonuses: [
          {
            base: 12,
            targetAttPatt: "NA.pct_",
          },
          {
            base: 9,
            targetAttPatt: "CA.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 26,
    name: "Favonius Warbow",
    icon: "8/85/Weapon_Favonius_Warbow",
    rarity: 4,
    mainStatScale: "41",
    subStat: { type: "er_", scale: "13.3%" },
    ...favoniusSeries,
  },
];

export default purpleBows;
