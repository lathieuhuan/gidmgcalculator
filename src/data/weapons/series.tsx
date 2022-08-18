import type { DataWeapon } from "@Src/types";
import { applyModifier } from "@Src/calculators/utils";
import { EModAffect } from "@Src/constants";
import { round2 } from "@Src/utils";
import { Green } from "@Src/styled-components";
import { getInput, makeWpModApplier } from "./utils";

type SeriesInfo = Pick<DataWeapon, "applyBuff" | "buffs" | "passiveName" | "passiveDesc">;

export const RoyalSeries: SeriesInfo = {
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      inputConfig: {
        labels: ["Stacks"],
        renderTypes: ["stacks"],
        initialValues: [5],
      },
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const buffValue = (6 + refi * 2) * getInput(inputs, 0);
        applyModifier(desc, totalAttr, "cRate", buffValue, tracker);
      },
      desc: ({ refi }) => RoyalSeries.passiveDesc({ refi }).core,
    },
  ],
  passiveName: "Focus",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Upon dealing damage to an opponent, increases <Green>CRIT Rate</Green> by{" "}
        <Green b>{6 + refi * 2}%</Green>. Max <Green b>5</Green> stacks. A CRIT hit removes all
        existing stacks.
      </>
    ),
  }),
};

export const BlackcliffSeries: SeriesInfo = {
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      inputConfig: {
        labels: ["Stacks"],
        renderTypes: ["stacks"],
        initialValues: [3],
      },
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        const buffValue = (9 + refi * 3) * (inputs![0] as number);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
      desc: ({ refi }) => BlackcliffSeries.passiveDesc({ refi }).core,
    },
  ],
  passiveName: "Press the Advantage",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        After defeating an opponent, <Green>ATK</Green> is increased by{" "}
        <Green b>{9 + refi * 3}%</Green> for 30s. This effect has a maximum of <Green b>3</Green>{" "}
        stacks, and the duration of each stack is independent of the others.
      </>
    ),
  }),
};

export const FavoniusSeries: SeriesInfo = {
  passiveName: "Windfall",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        CRIT hits have a <Green b>{50 + refi * 10}%</Green> <Green>chance</Green> to generate a
        small amount of Elemental Particles, which will regenerate <Green b>6</Green>{" "}
        <Green>Energy</Green> for the character. Can only occur once every{" "}
        <Green b>{13.5 - refi * 1.5}s</Green>.
      </>
    ),
  }),
};

export const SacrificialSeries: SeriesInfo = {
  passiveName: "Composed",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        After dealing damage to an opponent with an Elemental Skill, the skill has a{" "}
        <Green b>{30 + refi * 10}%</Green> <Green>chance</Green> to end its own CD. Can only occur
        once every <Green b>{[0, 30, 26, 22, 19, 16][refi]}s</Green>.
      </>
    ),
  }),
};

export const DragonspineSeries: SeriesInfo = {
  // pasvProcD: [
  //   {
  //     name: "Usual DMG",
  //     baseSType: "ATK",
  //     multiplier: [0, 0.8, 0.95, 1.1, 1.25, 1.4],
  //     dmgType: "Physical"
  //   },
  //   {
  //     name: "Boosted DMG",
  //     baseSType: "ATK",
  //     multiplier: [0, 2, 2.4, 2.8, 3.2, 3.6],
  //     dmgType: "Physical"
  //   }
  // ],
  passiveName: "Frost Burial",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Hitting an opponent with Normal and Charged Attacks has a <Green b>{50 + refi * 10}%</Green>{" "}
        <Green>chance</Green> of forming and dropping an Everfrost Icicle above them, dealing{" "}
        <Green b>{65 + refi * 15}%</Green> <Green>AoE ATK DMG</Green>. Opponents affected by Cryo
        are dealt <Green b>{160 + refi * 40}%</Green> <Green>AoE ATK DMG</Green> instead by the
        icicle. Can only occur once every 10s.
      </>
    ),
  }),
};

export const LiyueSeries: SeriesInfo = {
  applyBuff: makeWpModApplier("totalAttr", "shStr", 5),
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      inputConfig: {
        labels: ["Stacks", "Protected by a Shield"],
        renderTypes: ["stacks", "check"],
        initialValues: [5],
      },
      applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
        let buffValue = (3 + refi) * (inputs![0] as number);
        if (inputs![1]) {
          buffValue *= 2;
        }
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
      desc: ({ refi }) => LiyueSeries.passiveDesc!({ refi }).extra![0],
    },
  ],
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
        Scoring hits on opponents increases <Green>ATK</Green> by <Green b>{3 + refi}%</Green> for
        8s. Max <Green b>5</Green> stacks. Can only occur once every 0.3s. While protected by a
        shield, this ATK increase effect is increased by <Green>100%</Green>.
      </>,
    ],
  }),
};

export const LithicSeries: SeriesInfo = {
  applyBuff: ({ totalAttr, refi, charData, partyData, desc, tracker }) => {
    if (partyData) {
      const stacks = partyData.reduce(
        (result, data) => (data.nation === "liyue" ? result + 1 : result),
        charData.nation === "liyue" ? 1 : 0
      );
      const bnValues = [(6 + refi) * stacks, (2 + refi) * stacks];
      applyModifier(desc, totalAttr, ["atk_", "cRate"], bnValues, tracker);
    }
  },
  passiveName: "Lithic Axiom - Unity",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        For every character in the party who hails from Liyue, the character who equips this weapon
        gains <Green b>{6 + refi}%</Green> <Green>ATK</Green> increase and{" "}
        <Green b>{2 + refi}%</Green> <Green>CRIT Rate</Green> increase. This effect stacks up to{" "}
        <Green b>4</Green> times.
      </>
    ),
  }),
};

export const BaneSeries1 = (name: string, elements: string): SeriesInfo => ({
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      applyBuff: makeWpModApplier("attPattBonus", "all.pct", 3),
      desc: ({ refi }) => BaneSeries1(name, elements).passiveDesc({ refi }).core,
    },
  ],
  passiveName: `Bane of ${name}`,
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
        <Green b>{9 + refi * 3}%</Green>.
      </>
    ),
  }),
});

export const BaneSeries2 = (name: string, elements: string): SeriesInfo => ({
  buffs: [
    {
      index: 0,
      affect: EModAffect.SELF,
      applyBuff: ({ attPattBonus, refi, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "all.pct", 16 + refi * 4, tracker);
      },
      desc: ({ refi }) => BaneSeries2(name, elements).passiveDesc({ refi }).core,
    },
  ],
  passiveName: `Bane of ${name}`,
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        Increases <Green>DMG</Green> against opponents affected by <Green>{elements}</Green> by{" "}
        <Green b>{16 + refi * 4}%</Green>.
      </>
    ),
  }),
});

export const WatatsumiSeries: SeriesInfo = {
  applyBuff: ({ attPattBonus, refi, charData, partyData, desc, tracker }) => {
    if (partyData && attPattBonus) {
      const maxEnergy = partyData.reduce((result, data) => result + data.EBcost, charData.EBcost);
      const buffValue = round2(maxEnergy * (0.09 + refi * 0.03));
      applyModifier(desc, attPattBonus, "EB.pct", buffValue, tracker);
    }
  },
  passiveName: "Watatsumi Wavewalker",
  passiveDesc: ({ refi }) => ({
    core: (
      <>
        For every point of the entire party's combined maximum Energy capacity, the{" "}
        <Green>Elemental Burst DMG</Green> of the character equipping this weapon is increased by{" "}
        <Green b>{0.09 + refi * 0.03}%</Green>, up to a maximum of{" "}
        <Green b>{30 + refi * 10}%</Green>.
      </>
    ),
  }),
};

export const CullTheWeak: SeriesInfo = {
  passiveName: "Cull the Weak",
  passiveDesc: ({ refi }) => ({
    core: <>Defeating an opponent restores {6 + refi * 2}% HP.</>,
  }),
};
