import type { DataWeapon, TotalAttribute } from "@Src/types";
import { Green, Red, Rose } from "@Components/atoms";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { liyueSeries } from "../series";
import { applyPercent, findByCode, round } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { makeWpModApplier } from "../utils";

const getStaffOfHomaBuff = (totalAttr: TotalAttribute, refi: number) => {
  const mult = 0.8 + refi * 0.2;
  return {
    desc: ` / ${round(mult, 1)}% of ${totalAttr.hp} HP`,
    value: applyPercent(totalAttr.hp, mult),
  };
};

const goldPolearms: DataWeapon[] = [
  {
    code: 139,
    name: "Staff of the Scarlet Sands",
    icon: "4/44/Weapon_Staff_of_the_Scarlet_Sands",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate", scale: "9.6%b" },
    applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
      const buffValue = applyPercent(totalAttr.em, 39 + refi * 13);
      applyModifier(desc, totalAttr, "atk", buffValue, tracker);
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        applyFinalBuff: ({ totalAttr, refi, desc, inputs, tracker }) => {
          const mult = 21 + refi * 7;
          const stacks = inputs[0] || 0;
          const buffValue = applyPercent(totalAttr.em, mult) * stacks;
          const xtraDesc = ` / ${stacks} stacks / (each) ${round(mult, 1)}% of ${
            totalAttr.em
          } Elemental Mastery`;

          applyModifier(desc + xtraDesc, totalAttr, "atk", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(goldPolearms, 139)!.passiveDesc({ refi }).extra?.[0],
      },
    ],
    passiveName: "Heat Haze at Horizon's End",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            The equipping character gains <Green b>{39 + refi * 13}%</Green> of their{" "}
            <Green>Elemental Mastery</Green> as bonus <Green>ATK</Green>. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be
          gained for 10s: the equipping character will gain <Green b>{21 + refi * 7}%</Green> of
          their <Green>Elemental Mastery</Green> as bonus <Green>ATK</Green>. Max <Rose>3</Rose>{" "}
          stacks.
        </>,
      ],
    }),
  },
  {
    code: 77,
    name: "Skyward Spine",
    icon: "6/69/Weapon_Skyward_Spine",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er", scale: "8%" },
    applyBuff: ({ totalAttr, refi, desc, tracker }) => {
      applyModifier(desc, totalAttr, ["cRate", "naAtkSpd"], [6 + refi * 2, 12], tracker);
    },
    passiveName: "Blackwing",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>CRIT Rate</Green> by <Green b>{6 + refi * 2}%</Green> and increases{" "}
          <Green>Normal ATK SPD</Green> by <Green b>12%</Green>. Additionally, Normal and Charged
          Attacks hits on opponents have a <Green>50% chance</Green> to trigger a vacuum blade that
          deals <Green b>{25 + refi * 15}%</Green> of <Green>ATK</Green> as DMG in a small AoE. This
          effect can occur no more than once every 2s.
        </>
      ),
    }),
  },
  {
    code: 78,
    name: "Primordial Jade Winged-Spear",
    icon: "8/80/Weapon_Primordial_Jade_Winged-Spear",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cRate", scale: "4.8%" },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 7,
          },
        ],
        applyBuff: ({ totalAttr, attPattBonus, refi, inputs, desc, tracker }) => {
          const stacks = inputs[0] || 0;
          const bnValue1 = (2.5 + refi * 0.7) * stacks;
          applyModifier(desc, totalAttr, "atk_", bnValue1, tracker);

          if (stacks === 7) {
            applyModifier(desc, attPattBonus, "all.pct", 9 + refi * 3, tracker);
          }
        },
        desc: ({ refi }) => findByCode(goldPolearms, 78)!.passiveDesc({ refi }).core,
      },
    ],
    passiveName: "Eagle Spear of Justice",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, increases <Green>ATK</Green> by <Green b>{2.5 + refi * 0.7}%</Green> for 6s. Max{" "}
          <Green b>7</Green> stacks. This effect can only occur once every 0.3s. While in possession
          of the maximum possible stacks, <Green>DMG</Green> dealt is increased by{" "}
          <Green b>{9 + refi * 3}%</Green>.
        </>
      ),
    }),
  },
  {
    code: 79,
    name: "Engulfing Lightning",
    icon: "2/21/Weapon_Engulfing_Lightning",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er", scale: "12%" },
    applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
      const ER = round(totalAttr.er - 100, 1);
      const mult = 21 + refi * 7;
      let buffValue = (ER / 100) * mult;
      let xtraDesc = ` / ${mult}% of ${ER}% Energy Recharge => ${round(buffValue, 2)}%`;
      const limit = 70 + refi * 10;

      if (buffValue > limit) {
        buffValue = limit;
        xtraDesc += ` (limited to ${limit}%)`;
      }
      xtraDesc += ` ATK = ${totalAttr.base_atk} * ${round(buffValue / 100, 4)}`;
      buffValue = applyPercent(totalAttr.base_atk, buffValue);
      applyModifier(desc + xtraDesc, totalAttr, "atk", buffValue, tracker);
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyBuff: makeWpModApplier("totalAttr", "er", 30, 6),
        desc: ({ refi }) => findByCode(goldPolearms, 79)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Timeless Dream: Eternal Stove",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>ATK</Green> increased by <Green b>{21 + refi * 7}%</Green> of{" "}
            <Green>Energy Recharge</Green> over the base 100%. You can gain a maximum bonus of{" "}
            {70 + refi * 10}% ATK. {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          Gain <Green b>{25 + refi * 5}%</Green> <Green>Energy Recharge</Green> for 12s after using
          an Elemental Burst.
        </>,
      ],
    }),
  },
  {
    code: 80,
    name: "Staff of Homa",
    icon: "1/17/Weapon_Staff_of_Homa",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg", scale: "14.4%" },
    applyBuff: makeWpModApplier("totalAttr", "hp_", 20),
    applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
      const mult = 0.6 + refi * 0.2;
      const xtraDesc = ` / ${mult}% of ${totalAttr.hp} HP`;
      applyModifier(desc + xtraDesc, totalAttr, "atk", applyPercent(totalAttr.hp, mult), tracker);
    },
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        applyFinalBuff: ({ totalAttr, refi, desc, tracker }) => {
          const buff = getStaffOfHomaBuff(totalAttr, refi);
          applyModifier(desc + buff.desc, totalAttr, "atk", buff.value, tracker);
        },
        desc: ({ refi, totalAttr }) => (
          <>
            {findByCode(goldPolearms, 80)!.passiveDesc({ refi }).extra![0]}{" "}
            <Red>ATK Bonus: {getStaffOfHomaBuff(totalAttr, refi).value}.</Red>
          </>
        ),
      },
    ],
    passiveName: "Reckless Cinnabar",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> increased by <Green b>{15 + refi * 5}%</Green>. Additionally, provides
            an <Green>ATK Bonus</Green> based on <Green b>{Math.round(6 + refi * 2) / 10}%</Green>{" "}
            of the wielder's <Green>Max HP</Green>.
          </>
        );
      },
      extra: [
        <>
          When the wielder's HP is less than 50%, this <Green>ATK Bonus</Green> is increased by an
          additional <Green b>{Math.round(8 + refi * 2) / 10}%</Green> of <Green>Max HP</Green>.
        </>,
      ],
    }),
  },
  {
    code: 81,
    name: "Vortex Vanquisher",
    icon: "d/d6/Weapon_Vortex_Vanquisher",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 82,
    name: "Calamity Queller",
    icon: "8/8b/Weapon_Calamity_Queller",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "atk_", scale: "3.6%" },
    applyBuff: makeWpModApplier("totalAttr", [...VISION_TYPES], 12),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        inputConfigs: [
          {
            type: "stacks",
            max: 6,
          },
          {
            label: "Not on the field",
            type: "check",
          },
        ],
        applyBuff: ({ totalAttr, refi, inputs, desc, tracker }) => {
          const buffValue = (2.4 + refi * 0.8) * (inputs[0] || 0) * (inputs[1] === 1 ? 2 : 1);
          applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
        },
        desc: ({ refi }) => findByCode(goldPolearms, 82)!.passiveDesc({ refi }).extra![0],
      },
    ],
    passiveName: "Eagle Spear of Justice",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Gain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green>.{" "}
            {this.extra![0]}
          </>
        );
      },
      extra: [
        <>
          Obtain Consummation for 20s after using an Elemental Skill, causing <Green>ATK</Green> to
          increase by <Green b>{(24 + refi * 8) / 10}%</Green> per second. This ATK increase can
          stack <Green b>6</Green> times. When the character equipped with this weapon is not on the
          field, Consummation's ATK increase is <Green>doubled</Green>.
        </>,
      ],
    }),
  },
];

export default goldPolearms;
