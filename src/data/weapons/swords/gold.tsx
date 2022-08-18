import type { DataWeapon } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green } from "@Src/styled-components";
import { applyModifier } from "@Src/calculators/utils";
import { applyPercent, findByCode } from "@Src/utils";
import { NCPA_PERCENTS } from "@Data/constants";
import { LiyueSeries } from "../series";
import { getInput, makeWpModApplier } from "../utils";

const goldSwords: DataWeapon[] = [
  {
    code: 124,
    name: "Haran Geppaku Futsu",
    icon: "8/85/Weapon_Haran_Geppaku_Futsu",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cRate", scale: "7.2%" },
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 3),
    buffs: [
      {
        index: 1,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [2],
        },
        applyBuff: ({ attPattBonus, refi, inputs, desc, tracker }) => {
          const buffValue = (15 + refi * 5) * getInput(inputs, 0);
          applyModifier(desc, attPattBonus, "NA.pct", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(goldSwords, 124)!.passiveDesc({ refi }).extra![0],
      },
      // index: 0,
      // outdated: true,
      // - When the character equipping this weapon uses an Elemental Skill, all stacks of
      // Wavespike will be consumed to gain Ripping Upheaval. <Green>Each stack</Green> of
      // wavepike consumed will increase <Green>Normal Attack DMG</Green> by <Green b>8%</Green>{" "}
      // for 8s.
    ],
    passiveName: "Honed Flow",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Obtain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green>. When
            other nearby party members use Elemental Skills, the character equipping this weapon
            will gain 1 Wavespike stack. Max <Green b>2</Green> <Green>stacks</Green>. This effect
            can be triggered once every 0.3s. {this.extra}
          </>
        );
      },
      extra: [
        <>
          When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike
          will be consumed to gain Ripping Upheaval. <Green>Each stack</Green> of Wavepike consumed
          will increase <Green>Normal Attack DMG</Green> by <Green b>{15 + refi * 5}%</Green> for
          8s.
        </>,
      ],
    }),
  },
  {
    code: 101,
    name: "Mistsplitter Reforged",
    icon: "0/09/Weapon_Mistsplitter_Reforged",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cDmg", scale: "9.6%b" },
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 3),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfig: {
          labels: ["Stacks"],
          renderTypes: ["stacks"],
          initialValues: [3],
        },
        applyBuff: ({ totalAttr, refi, inputs, charData, desc, tracker }) => {
          const { stackValues } = findByCode(goldSwords, 101)!;
          const buffValue = stackValues!({ refi })[+inputs![0] - 1];
          applyModifier(desc, totalAttr, charData.vision, buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(goldSwords, 101)!.passiveDesc({ refi }).extra![0],
      },
    ],
    stackValues: ({ refi }) => [6 + refi * 2, 12 + refi * 4, 21 + refi * 7],
    passiveName: "Mistsplitter's Edge",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Gain a <Green b>{9 + refi * 3}%</Green> <Green>Elemental DMG Bonus</Green> for every
            element and receive the might of Mistsplitter's Emblem. {this.extra}
          </>
        );
      },
      extra: [
        <>
          At stack levels 1/2/3, Mistsplitter's Emblem provides a{" "}
          <Green b>{findByCode(goldSwords, 101)!.stackValues!({ refi }).join("/")}%</Green>{" "}
          Elemental DMG Bonus for the <Green>character's Elemental Type</Green>.
        </>,
        <>
          The character will obtain 1 stack of Mistsplitter's Emblem in each of the following
          scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst
          (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each
          stack's duration is calculated independently.
        </>,
      ],
    }),
  },
  {
    code: 102,
    name: "Aquila Favonia",
    icon: "6/6a/Weapon_Aquila_Favonia",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "phys", scale: "9%" },
    applyBuff: makeWpModApplier("totalAttr", "atk_", 5),
    passiveName: "Falcon's Defiance",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>ATK</Green> is increased by <Green b>{15 + refi * 5}%</Green>. Triggers on taking
          DMG: the soul of the Falcon of the West awakens, holding the banner of the resistance
          aloft, regenerating HP equal to {85 + refi * 15}% of ATK and dealing{" "}
          <Green b>{160 + refi * 40}%</Green>
          of <Green>ATK</Green> as DMG to surrounding opponents. This effect can only occur once
          every 15s.
        </>
      ),
    }),
  },
  {
    code: 103,
    name: "Skyward Blade",
    icon: "0/03/Weapon_Skyward_Blade",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er", scale: "12%" },
    applyBuff: makeWpModApplier("totalAttr", "cRate", 1),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: ({ totalAttr, desc, tracker }) => {
          applyModifier(desc, totalAttr, ["naAtkSpd", "caAtkSpd"], 10, tracker);
        },
        desc: ({ refi }) => findByCode(goldSwords, 103)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Sky-Piercing Fang",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>Crit Rate</Green> increased by <Green b>{3 + refi}%</Green>. And Normal and
            Charged hits deal additional DMG equal to <Green b>{15 + refi * 5}%</Green> of ATK.
            Skypiercing Might lasts for 12s. {this.extra}
          </>
        );
      },
      extra: [
        <>
          Gains Skypiercing Might upon using Elemental Burst: Increases Movement SPD and{" "}
          <Green>ATK SPD</Green> by <Green b>10%</Green>.
        </>,
      ],
    }),
  },
  {
    code: 104,
    name: "Freedom-Sworn",
    icon: "3/39/Weapon_Freedom-Sworn",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "em", scale: "43" },
    applyBuff: makeWpModApplier("attPattBonus", "all.pct", 2.5),
    buffs: [
      {
        index: 0,
        affect: EModAffect.PARTY,
        applyBuff: ({ totalAttr, attPattBonus, refi, desc, tracker }) => {
          applyModifier(desc, attPattBonus, [...NCPA_PERCENTS], 12 + refi * 4, tracker);
          applyModifier(desc, totalAttr, "atk_", 15 + refi * 5, tracker);
        },
        desc: ({ refi }) => findByCode(goldSwords, 104)!.passiveDesc({ refi })!.extra![0],
      },
    ],
    passiveName: "Revolutionary Chorale",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            A part of the "Millennial Movement" that wanders amidst the winds. Increases{" "}
            <Green>DMG</Green> by <Green b>{7.5 + refi * 2.5}%</Green>. When triggering Elemental
            Reactions, the character gains a Sigil of Rebellion. This effect can be triggered once
            every 0.5s. When you possess 2 Sigils of Rebellion, all of them will be consumed and all
            nearby party members will obtain the "Millennial Movement: Song of Resistance" effect
            for 12s. {this.extra![0]} {this.extra![1]}
          </>
        );
      },
      extra: [
        <>
          "Millennial Movement: Song of Resistance" increases{" "}
          <Green>Normal, Charged, and Plunging Attack DMG</Green> by{" "}
          <Green b>{12 + refi * 4}%</Green> and increases <Green>ATK</Green> by{" "}
          <Green b>{15 + refi * 5}%</Green>. Once this effect is triggered, you will not gain Sigils
          of Rebellion for 20s.
        </>,
        <>
          Of the many effects of the "Millennial Movement", buffs of the same type will not stack.
        </>,
      ],
    }),
  },
  {
    code: 105,
    name: "Summit Shaper",
    icon: "c/ca/Weapon_Summit_Shaper",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...LiyueSeries,
  },
  {
    code: 106,
    name: "Primordial Jade Cutter",
    icon: "2/2a/Weapon_Primordial_Jade_Cutter",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate", scale: "9.6%b" },
    applyBuff: makeWpModApplier("totalAttr", "hp_", 5),
    applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
      const bnPct = 0.9 + refi * 0.3;
      const buffValue = applyPercent(totalAttr.hp, bnPct);
      const xtraDesc = ` / ${bnPct}% of ${totalAttr.hp} HP`;
      applyModifier(desc + xtraDesc, totalAttr, "atk", buffValue, tracker);
    },
    passiveName: "Protector's Virtue",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          <Green>HP</Green> increased by <Green b>{15 + refi * 5}%</Green>. Additionally, provides
          an <Green>ATK Bonus</Green> based on <Green b>{(9 + refi * 3) / 10}%</Green> of the
          wielder's <Green>Max HP</Green>.
        </>
      ),
    }),
  },
];

export default goldSwords;
