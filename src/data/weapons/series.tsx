import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";

type SeriesInfo = Pick<AppWeapon, "passiveName" | "descriptions" | "autoBuffs" | "buffs">;

export const desertSeries: Pick<
  AppWeapon,
  "rarity" | "mainStatScale" | "subStat" | "passiveName" | "descriptions" | "buffs"
> = {
  rarity: 4,
  mainStatScale: "42",
  subStat: { type: "em", scale: "36" },
  passiveName: "Wildling Nightstar",
  descriptions: [
    `Every 10s, the equipping character will gain {18^%}#[v] of their {Elemental Mastery}#[k] as bonus {ATK}#[k] for
    12s, with nearby party members gaining {30%}#[v] of this buff for the same duration.`,
    `Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the
    character is not on the field.`,
  ],
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
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
  passiveName: "Focus",
  descriptions: [
    `Upon dealing damage to an opponent, increases {CRIT Rate}#[k] by {6^%}#[v]. Max {5}#[m] stacks. A CRIT hit removes
    all existing stacks.`,
  ],
  buffs: [
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
      targetAttribute: "cRate_",
    },
  ],
};

export const blackcliffSeries: SeriesInfo = {
  passiveName: "Press the Advantage",
  descriptions: [
    `After defeating an opponent, {ATK}#[k] is increased by {9^%}#[v] for 30s. This effect has a maximum of {3}#[m]
    stacks, and the duration of each stack is independent of the others.`,
  ],
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      description: 0,
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

export const favoniusPassive: SeriesInfo = {
  passiveName: "Windfall",
  descriptions: [
    `CRIT hits have a {50^10}% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy
    for the character. Can only occur once every {13.5^-1.5}s.`,
  ],
};

export const sacrificialPassive: SeriesInfo = {
  passiveName: "Composed",
  descriptions: [
    `After dealing damage to an opponent with an Elemental Skill, the skill has a {30^%} chance to end its own CD. Can
    only occur once every {30$26$22$19$16}s.`,
  ],
};

export const dragonspinePassive: SeriesInfo = {
  passiveName: "Frost Burial",
  descriptions: [
    `Hitting an opponent with Normal and Charged Attacks has a {50^10}% chance of forming and dropping an Everfrost
    Icicle above them, dealing {65^15}% AoE ATK DMG. Opponents affected by Cryo are dealt {160^40}% AoE ATK DMG instead by the
    icicle. Can only occur once every 10s.`,
  ],
};

export const liyueSeries: SeriesInfo = {
  passiveName: "Golden Majesty",
  descriptions: [
    `Increases {Shield Strength}#[k] by {15^%}#[v].`,
    `Scoring hits on opponents increases {ATK}#[k] by {3^%}#[v] for 8s. Max {2}#[m] stacks. Can only occur once every 0.3s. While
    protected by a shield, this {ATK increase}#[k] effect is increased by {100%}#[v].`,
  ],
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
      description: 1,
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
  passiveName: "Lithic Axiom - Unity",
  descriptions: [
    `For every character in the party who hails from Liyue, the character who equips this weapon gains {6^1%}#[v]
    {ATK}#[k] increase and {2^1%}#[v] {CRIT Rate}#[k] increase. This effect stacks up to {4}#[m] times.`,
  ],
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
  passiveName: `Bane of ${name}`,
  descriptions: [`Increases {DMG}#[k] against opponents affected by ${elements} by {9^%}#[v].`],
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      description: 0,
      base: 9,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const baneSeries2 = (name: string, elements: string): SeriesInfo => ({
  passiveName: `Bane of ${name}`,
  descriptions: [`Increases {DMG}#[k] against opponents affected by ${elements} by {16^4%}#[v].`],
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      base: 16,
      increment: 4,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const watatsumiSeries: SeriesInfo = {
  passiveName: "Watatsumi Wavewalker",
  descriptions: [
    `For every point of the entire party's combined maximum Energy capacity, the {Elemental Burst DMG}#[k] of the character
    equipping this weapon is increased by {0.09^%}#[v], up to a maximum of {30^%}#[m].`,
  ],
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

export const cullTheWeakPassive: SeriesInfo = {
  passiveName: "Cull the Weak",
  descriptions: ["Defeating an opponent restores {6^%} HP."],
};
