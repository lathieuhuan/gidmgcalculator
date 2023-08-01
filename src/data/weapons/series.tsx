import type { AppWeapon } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { Green, Rose } from "@Src/pure-components";

type SeriesInfo = Pick<AppWeapon, "passiveName" | "passiveDesc" | "autoBuffs" | "buffs">;

export const desertSeries: Pick<AppWeapon, "passiveDesc" | "rarity" | "mainStatScale" | "subStat" | "buffs"> = {
  rarity: 4,
  mainStatScale: "42",
  subStat: { type: "em", scale: "36" },
  passiveDesc: ({ refi }) => ({
    get core() {
      return (
        <>
          {this.extra?.[0]} Multiple instances of this weapon can allow this buff to stack. This effect will still
          trigger even if the character is not on the field.
        </>
      );
    },
    extra: [
      <>
        Every 10s, the equipping character will gain <Green b>{18 + refi * 6}%</Green> of their{" "}
        <Green>Elemental Mastery</Green> as bonus <Green>ATK</Green> for 12s, with nearby party members gaining{" "}
        <Green>30%</Green> of this buff for the same duration.
      </>,
    ],
  }),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => desertSeries.passiveDesc({ refi }).extra?.[0],
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
      desc: ({ refi }) => desertSeries.passiveDesc({ refi }).extra?.[0],
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
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Upon dealing damage to an opponent, increases <Green>CRIT Rate</Green> by <Green b>{6 + refi * 2}%</Green>. Max{" "}
        <Rose>5</Rose> stacks. A CRIT hit removes all existing stacks.
      </>
    ),
  }),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => royalSeries.passiveDesc({ refi }).core,
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
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        After defeating an opponent, <Green>ATK</Green> is increased by <Green b>{9 + refi * 3}%</Green> for 30s. This
        effect has a maximum of <Green b>3</Green> stacks, and the duration of each stack is independent of the others.
      </>
    ),
  }),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => blackcliffSeries.passiveDesc({ refi }).core,
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
  passiveName: "Windfall",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        CRIT hits have a <Green b>{50 + refi * 10}%</Green> <Green>chance</Green> to generate a small amount of
        Elemental Particles, which will regenerate <Green b>6</Green> <Green>Energy</Green> for the character. Can only
        occur once every <Green b>{13.5 - refi * 1.5}s</Green>.
      </>
    ),
  }),
};

export const sacrificialSeries: SeriesInfo = {
  passiveName: "Composed",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        After dealing damage to an opponent with an Elemental Skill, the skill has a <Green b>{30 + refi * 10}%</Green>{" "}
        <Green>chance</Green> to end its own CD. Can only occur once every{" "}
        <Green b>{[0, 30, 26, 22, 19, 16][refi]}s</Green>.
      </>
    ),
  }),
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
  passiveName: "Frost Burial",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Hitting an opponent with Normal and Charged Attacks has a {50 + refi * 10}% chance of forming and dropping an
        Everfrost Icicle above them, dealing {65 + refi * 15}% AoE ATK DMG. Opponents affected by Cryo are dealt{" "}
        {160 + refi * 40}% AoE ATK DMG instead by the icicle. Can only occur once every 10s.
      </>
    ),
  }),
};

export const liyueSeries: SeriesInfo = {
  passiveName: "Golden Majesty",
  passiveDesc: ({ refi }) => ({
    get core() {
      return (
        <>
          Increases Shield Strength by {15 + refi * 5}%. {this.extra}
        </>
      );
    },
    extra: [
      <>
        Scoring hits on opponents increases <Green>ATK</Green> by <Green b>{3 + refi}%</Green> for 8s. Max{" "}
        <Rose>5</Rose> stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is
        increased by <Green>100%</Green>.
      </>,
    ],
  }),
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
      desc: ({ refi }) => liyueSeries.passiveDesc!({ refi }).extra![0],
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
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        For every character in the party who hails from Liyue, the character who equips this weapon gains{" "}
        <Green b>{6 + refi}%</Green> <Green>ATK</Green> increase and <Green b>{2 + refi}%</Green>{" "}
        <Green>CRIT Rate</Green> increase. This effect stacks up to <Green b>4</Green> times.
      </>
    ),
  }),
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
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
        <Green b>{9 + refi * 3}%</Green>.
      </>
    ),
  }),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => baneSeries1(name, elements).passiveDesc({ refi }).core,
      base: 9,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const baneSeries2 = (name: string, elements: string): SeriesInfo => ({
  passiveName: `Bane of ${name}`,
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
        <Green b>{16 + refi * 4}%</Green>.
      </>
    ),
  }),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      desc: ({ refi }) => baneSeries2(name, elements).passiveDesc({ refi }).core,
      base: 16,
      increment: 4,
      targetAttPatt: "all.pct_",
    },
  ],
});

export const watatsumiSeries: SeriesInfo = {
  passiveName: "Watatsumi Wavewalker",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        For every point of the entire party's combined maximum Energy capacity, the <Green>Elemental Burst DMG</Green>{" "}
        of the character equipping this weapon is increased by <Green b>{0.09 + refi * 0.03}%</Green>, up to a maximum
        of <Green b>{30 + refi * 10}%</Green>.
      </>
    ),
  }),
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
  passiveName: "Cull the Weak",
  passiveDesc: ({ refi }) => ({
    core: <>Defeating an opponent restores {6 + refi * 2}% HP.</>,
  }),
};
