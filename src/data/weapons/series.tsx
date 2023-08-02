import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";

type SeriesInfo = Pick<AppWeapon, "passive" | "autoBuffs" | "buffs">;

export const desertSeries: Pick<AppWeapon, "rarity" | "mainStatScale" | "subStat" | "passive" | "buffs"> = {
  rarity: 4,
  mainStatScale: "42",
  subStat: { type: "em", scale: "36" },
  passive: {
    name: "Wildling Nightstar",
    description: `Every 10s, the equipping character will gain {0}% of their Elemental Mastery as bonus ATK for 12s,
    with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can
    allow this buff to stack. This effect will still trigger even if the character is not on the field.`,
    seeds: [18],
  },
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          Every 10s, the equipping character will gain <Green b>{18 + refi * 6}%</Green> of their{" "}
          <Green>Elemental Mastery</Green> as bonus <Green>ATK</Green> for 12s, with nearby party members gaining{" "}
          <Green>30%</Green> of this buff for the same duration.
        </>
      ),
      base: 0.18,
      stacks: {
        type: "attribute",
        field: "em",
      },
      targetAttribute: "atk",
    },
    {
      index: 1,
      affect: EModAffect.TEAMMATE,
      desc: ({ refi }) => (
        <>
          Every 10s, the equipping character will gain <Green b>{18 + refi * 6}%</Green> of their{" "}
          <Green>Elemental Mastery</Green> as bonus <Green>ATK</Green> for 12s, with nearby party members gaining{" "}
          <Green>30%</Green> of this buff for the same duration.
        </>
      ),
      inputConfigs: [
        {
          label: "Elemental Mastery",
          type: "text",
        },
      ],
      base: 0.054,
      stacks: {
        type: "input",
      },
      targetAttribute: "atk",
    },
  ],
};

export const royalSeries: SeriesInfo = {
  passive: {
    name: "Focus",
    description: `Upon dealing damage to an opponent, increases CRIT Rate by {0}%. Max 5 stacks. A CRIT hit removes all
    existing stacks.`,
    seeds: [6],
  },
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          Upon dealing damage to an opponent, increases <Green>CRIT Rate</Green> by <Green b>{6 + refi * 2}%</Green>.
          Max <Rose>5</Rose> stacks. A CRIT hit removes all existing stacks.
        </>
      ),
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
      targetAttribute: "cRate_",
    },
  ],
};

export const blackcliffSeries: SeriesInfo = {
  passive: {
    name: "Press the Advantage",
    description: `After defeating an opponent, ATK is increased by {0}% for 30s. This effect has a maximum of 3 stacks,
    and the duration of each stack is independent of the others.`,
    seeds: [9],
  },
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          After defeating an opponent, <Green>ATK</Green> is increased by <Green b>{9 + refi * 3}%</Green> for 30s. This
          effect has a maximum of <Green b>3</Green> stacks, and the duration of each stack is independent of the
          others.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      base: 9,
      stacks: {
        type: "input",
      },
      targetAttribute: "atk_",
    },
  ],
};

export const favoniusSeries: SeriesInfo = {
  passive: {
    name: "Windfall",
    description: `CRIT hits have a {0}% chance to generate a small amount of Elemental Particles, which will regenerate
    6 Energy for the character. Can only occur once every {1}s.`,
    seeds: [
      { base: 50, increment: 10, dull: true },
      { base: 13.5, increment: -1.5, dull: true },
    ],
  },
};

export const sacrificialSeries: SeriesInfo = {
  passive: {
    name: "Composed",
    description: `After dealing damage to an opponent with an Elemental Skill, the skill has a {0}% chance to end its
    own CD. Can only occur once every {1}s.`,
    seeds: [
      { base: 30, dull: true },
      { options: [30, 26, 22, 19, 16], dull: true },
    ],
  },
};

export const dragonspineSeries: SeriesInfo = {
  // pasvProcD: [
  //   {
  //     name: "Usual DMG",
  //     baseSType: "ATK",
  //     mult: [0, 0.8, 0.95, 1.1, 1.25, 1.4],
  //     dmgType: "Physical"
  //   },
  //   {
  //     name: "Boosted DMG",
  //     baseSType: "ATK",
  //     mult: [0, 2, 2.4, 2.8, 3.2, 3.6],
  //     dmgType: "Physical"
  //   }
  // ],
  passive: {
    name: "Frost Burial",
    description: `Hitting an opponent with Normal and Charged Attacks has a {0}% chance of forming and dropping an
    Everfrost Icicle above them, dealing {1}% AoE ATK DMG. Opponents affected by Cryo are dealt {2}% AoE ATK DMG
    instead by the icicle. Can only occur once every 10s.`,
    seeds: [
      { base: 50, increment: 10, dull: true },
      { base: 65, increment: 15, dull: true },
      { base: 160, increment: 40, dull: true },
    ],
  },
};

export const liyueSeries: SeriesInfo = {
  passive: {
    name: "Golden Majesty",
    description: `Increases Shield Strength by {0}%. Scoring hits on opponents increases ATK by {1}% for 8s. Max 5
    stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by
    100%.`,
    seeds: [15, 3],
  },
  autoBuffs: [
    {
      base: 15,
      targetAttribute: "shieldS_",
    },
  ],
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          Scoring hits on opponents increases <Green>ATK</Green> by <Green b>{3 + refi}%</Green> for 8s. Max{" "}
          <Rose>5</Rose> stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect
          is increased by <Green>100%</Green>.
        </>
      ),
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
        {
          label: "Protected by a Shield",
          type: "check",
        },
      ],
      base: 3,
      stacks: {
        type: "input",
        doubledAtInput: 1,
      },
      targetAttribute: "atk_",
    },
  ],
};

export const lithicSeries: SeriesInfo = {
  passive: {
    name: "Lithic Axiom - Unity",
    description: `For every character in the party who hails from Liyue, the character who equips this weapon gains
    {0}% ATK increase and {1}% CRIT Rate increase. This effect stacks up to 4 times.`,
    seeds: [
      { base: 6, increment: 1 },
      { base: 2, increment: 1 },
    ],
  },
  autoBuffs: [
    {
      base: 6,
      increment: 1,
      stacks: {
        type: "nation",
      },
      targetAttribute: "atk_",
    },
    {
      base: 2,
      increment: 1,
      stacks: {
        type: "nation",
      },
      targetAttribute: "cRate_",
    },
  ],
};

export const baneSeries1 = (name: string, elements: string): SeriesInfo => ({
  passive: {
    name: `Bane of ${name}`,
    description: `Increases DMG against opponents affected by ${elements} by {0}%.`,
    seeds: [9],
  },
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
          <Green b>{9 + refi * 3}%</Green>.
        </>
      ),
      base: 9,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const baneSeries2 = (name: string, elements: string): SeriesInfo => ({
  passive: {
    name: `Bane of ${name}`,
    description: `Increases DMG against opponents affected by ${elements} by {0}%.`,
    seeds: [{ base: 16, increment: 4 }],
  },
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => (
        <>
          Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
          <Green b>{16 + refi * 4}%</Green>.
        </>
      ),
      base: 16,
      increment: 4,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const watatsumiSeries: SeriesInfo = {
  passive: {
    name: "Watatsumi Wavewalker",
    description: `For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of
    the character equipping this weapon is increased by {0}%, up to a maximum of {1}%.`,
    seeds: [0.09, { base: 30, dull: true }],
  },
  autoBuffs: [
    {
      base: 0.09,
      stacks: {
        type: "energy",
      },
      targetAttPatt: "EB.pct_",
      max: 30,
    },
  ],
};

export const cullTheWeakSeries: SeriesInfo = {
  passive: {
    name: "Cull the Weak",
    description: "Defeating an opponent restores {0}% HP",
    seeds: [6],
  },
};
