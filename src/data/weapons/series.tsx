import type { DataWeapon } from "@Src/types";
import { Green, Rose } from "@Components";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "./utils";

type SeriesInfo = Pick<DataWeapon, "applyBuff" | "buffs" | "passiveName" | "passiveDesc">;

export const desertSeries: Pick<
  DataWeapon,
  "applyBuff" | "buffs" | "passiveDesc" | "rarity" | "mainStatScale" | "subStat"
> = {
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
      applyBuff: ({ totalAttr, refi, desc, tracker }) => {
        const mult = 18 + refi * 6;
        const buffValue = applyPercent(totalAttr.em, mult);
        const finalDesc = desc + ` / ${mult}% of ${totalAttr.em} EM`;
        applyModifier(finalDesc, totalAttr, "atk", buffValue, tracker);
      },
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
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const mult = (54 + refi * 18) / 10;
        const buffValue = applyPercent(inputs[0] || 0, mult);
        const finalDesc = desc + ` / ${mult}% of ${inputs[0] || 0} EM`;
        applyModifier(finalDesc, totalAttr, "atk", buffValue, tracker);
      },
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
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const buffValue = (6 + refi * 2) * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "cRate_", buffValue, tracker);
      },
    },
  ],
};

export const blackcliffSeries: SeriesInfo = {
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
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const buffValue = (9 + refi * 3) * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
    },
  ],
  passiveName: "Press the Advantage",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        After defeating an opponent, <Green>ATK</Green> is increased by <Green b>{9 + refi * 3}%</Green> for 30s. This
        effect has a maximum of <Green b>3</Green> stacks, and the duration of each stack is independent of the others.
      </>
    ),
  }),
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
  applyBuff: makeWpModApplier("totalAttr", "shieldS_", 20),
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
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const buffValue = (3 + refi) * (inputs[0] || 0) * (inputs[1] === 1 ? 2 : 1);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
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
  applyBuff: ({ totalAttr, refi, charData, partyData, desc, tracker }) => {
    if (partyData) {
      const stacks = partyData.reduce(
        (result, data) => (data?.nation === "liyue" ? result + 1 : result),
        charData.nation === "liyue" ? 1 : 0
      );
      const buffValues = [(6 + refi) * stacks, (2 + refi) * stacks];
      applyModifier(desc, totalAttr, ["atk_", "cRate_"], buffValues, tracker);
    }
  },
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
      applyBuff: makeWpModApplier("attPattBonus", "all.pct_", 12),
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
      applyBuff: makeWpModApplier("attPattBonus", "all.pct_", 20),
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
  applyBuff: ({ attPattBonus, refi, charData, partyData, desc, tracker }) => {
    if (partyData && attPattBonus) {
      const energyCap = partyData.reduce((result, data) => result + (data?.EBcost || 0), charData.EBcost);
      const mult = (9 + refi * 3) / 100;
      let extraDesc = ` / Energy Cap. ${energyCap} * ${mult}%`;
      let buffValue = round(energyCap * mult, 2);
      const maxValue = 30 + refi * 10;

      if (buffValue > maxValue) {
        buffValue = maxValue;
        extraDesc += ` / limited to ${maxValue}%`;
      }
      applyModifier(desc + extraDesc, attPattBonus, "EB.pct_", buffValue, tracker);
    }
  },
};

export const cullTheWeakSeries: SeriesInfo = {
  passiveName: "Cull the Weak",
  passiveDesc: ({ refi }) => ({
    core: <>Defeating an opponent restores {6 + refi * 2}% HP.</>,
  }),
};
