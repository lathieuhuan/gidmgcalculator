import type { AppWeapon, TotalAttribute } from "@Src/types";
import { EModAffect, VISION_TYPES } from "@Src/constants";
import { Green, Red, Rose } from "@Src/pure-components";
import { applyPercent, findByCode, round } from "@Src/utils";
import { liyueSeries } from "../series";

const getStaffOfHomaBuff = (totalAttr: TotalAttribute, refi: number) => {
  const mult = 0.8 + refi * 0.2;
  return {
    desc: ` / ${round(mult, 1)}% of ${Math.round(totalAttr.hp)} HP`,
    value: applyPercent(totalAttr.hp, mult),
  };
};

const goldPolearms: AppWeapon[] = [
  {
    code: 139,
    name: "Staff of the Scarlet Sands",
    icon: "4/44/Weapon_Staff_of_the_Scarlet_Sands",
    rarity: 5,
    mainStatScale: "44b",
    subStat: { type: "cRate_", scale: "9.6%b" },
    passiveName: "Heat Haze at Horizon's End",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            The equipping character gains <Green b>{39 + refi * 13}%</Green> of their <Green>Elemental Mastery</Green>{" "}
            as bonus <Green>ATK</Green>. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 10s: the
          equipping character will gain <Green b>{21 + refi * 7}%</Green> of their <Green>Elemental Mastery</Green> as
          bonus <Green>ATK</Green>. Max <Rose>3</Rose> stacks.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 0.39,
        stacks: {
          type: "attribute",
          field: "em",
        },
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldPolearms, 139)?.passiveDesc({ refi }).extra?.[0],
        inputConfigs: [
          {
            type: "stacks",
            max: 3,
          },
        ],
        base: 0.21,
        stacks: [
          {
            type: "attribute",
            field: "em",
          },
          {
            type: "input",
          },
        ],
        targetAttribute: "atk",
      },
    ],
  },
  {
    code: 82,
    name: "Calamity Queller",
    icon: "8/8b/Weapon_Calamity_Queller",
    rarity: 5,
    mainStatScale: "49",
    subStat: { type: "atk_", scale: "3.6%" },
    passiveName: "Eagle Spear of Justice",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            Gain <Green b>{9 + refi * 3}%</Green> <Green>All Elemental DMG Bonus</Green>. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          Obtain Consummation for 20s after using an Elemental Skill, causing <Green>ATK</Green> to increase by{" "}
          <Green b>{(24 + refi * 8) / 10}%</Green> per second, up to <Rose>6</Rose> times. When the character equipped
          with this weapon is not on the field, Consummation's ATK increase is <Green>doubled</Green>.
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
        desc: ({ refi }) => findByCode(goldPolearms, 82)?.passiveDesc({ refi }).extra?.[0],
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
        base: 2.4,
        stacks: {
          type: "input",
          doubledAtInput: 1,
        },
        targetAttribute: "atk_",
      },
    ],
  },
  {
    code: 79,
    name: "Engulfing Lightning",
    icon: "2/21/Weapon_Engulfing_Lightning",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "er_", scale: "12%" },
    passiveName: "Timeless Dream: Eternal Stove",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>ATK</Green> increased by <Green b>{21 + refi * 7}%</Green> of <Green>Energy Recharge</Green> over the
            base 100%. You can gain a maximum bonus of {70 + refi * 10}% ATK. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          Gain <Green b>{25 + refi * 5}%</Green> <Green>Energy Recharge</Green> for 12s after using an Elemental Burst.
        </>,
      ],
    }),
    autoBuffs: [
      {
        base: 0.21,
        stacks: [
          {
            type: "attribute",
            field: "er_",
            pedestal: 100,
          },
          {
            type: "attribute",
            field: "base_atk",
            convertRate: 0.01,
          },
        ],
        targetAttribute: "atk",
        // max: {
        //   base: 70,
        //   increment: 10,
        // },
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldPolearms, 79)?.passiveDesc({ refi }).extra?.[0],
        base: 25,
        increment: 5,
        targetAttribute: "er_",
      },
    ],
  },
  {
    code: 80,
    name: "Staff of Homa",
    icon: "1/17/Weapon_Staff_of_Homa",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "cDmg_", scale: "14.4%" },
    passiveName: "Reckless Cinnabar",
    passiveDesc: ({ refi }) => ({
      get core() {
        return (
          <>
            <Green>HP</Green> increased by <Green b>{15 + refi * 5}%</Green>. Additionally, provides an{" "}
            <Green>ATK Bonus</Green> based on <Green b>{Math.round(6 + refi * 2) / 10}%</Green> of the wielder's{" "}
            <Green>Max HP</Green>. {this.extra?.[0]}
          </>
        );
      },
      extra: [
        <>
          When the wielder's HP is less than 50%, this <Green>ATK Bonus</Green> is increased by an additional{" "}
          <Green b>{Math.round(8 + refi * 2) / 10}%</Green> of <Green>Max HP</Green>.
        </>,
      ],
    }),

    autoBuffs: [
      {
        base: 15,
        targetAttribute: "hp_",
      },
      {
        base: 0.6,
        stacks: {
          type: "attribute",
          field: "hp",
          convertRate: 0.01,
        },
        targetAttribute: "atk",
      },
    ],
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi, totalAttr }) => (
          <>
            {findByCode(goldPolearms, 80)?.passiveDesc({ refi }).extra?.[0]}{" "}
            <Red>ATK bonus: {getStaffOfHomaBuff(totalAttr, refi).value}.</Red>
          </>
        ),
        base: 0.8,
        increment: 0.2,
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
    code: 81,
    name: "Vortex Vanquisher",
    icon: "d/d6/Weapon_Vortex_Vanquisher",
    rarity: 5,
    mainStatScale: "46",
    subStat: { type: "atk_", scale: "10.8%" },
    ...liyueSeries,
  },
  {
    code: 78,
    name: "Primordial Jade Winged-Spear",
    icon: "8/80/Weapon_Primordial_Jade_Winged-Spear",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "cRate_", scale: "4.8%" },
    passiveName: "Eagle Spear of Justice",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          On hit, increases <Green>ATK</Green> by <Green b>{2.5 + refi * 0.7}%</Green> for 6s. Max <Rose>7</Rose>{" "}
          stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks,{" "}
          <Green>DMG</Green> dealt is increased by <Green b>{9 + refi * 3}%</Green>.
        </>
      ),
    }),
    buffs: [
      {
        index: 0,
        affect: EModAffect.SELF,
        desc: ({ refi }) => findByCode(goldPolearms, 78)?.passiveDesc({ refi }).core,
        inputConfigs: [
          {
            type: "stacks",
            max: 7,
          },
        ],
        buffBonuses: [
          {
            base: 2.5,
            increment: 0.7,
            stacks: {
              type: "input",
            },
            targetAttribute: "atk_",
          },
          {
            checkInput: 7,
            base: 9,
            targetAttPatt: "all.pct_",
          },
        ],
      },
    ],
  },
  {
    code: 77,
    name: "Skyward Spine",
    icon: "6/69/Weapon_Skyward_Spine",
    rarity: 5,
    mainStatScale: "48",
    subStat: { type: "er_", scale: "8%" },
    passiveName: "Blackwing",
    passiveDesc: ({ refi }) => ({
      core: (
        <>
          Increases <Green>CRIT Rate</Green> by <Green b>{6 + refi * 2}%</Green> and increases{" "}
          <Green>Normal ATK SPD</Green> by <Green b>12%</Green>. Additionally, Normal and Charged Attacks hits on
          opponents have a 50% chance to trigger a vacuum blade that deals {25 + refi * 15}% of ATK as DMG in a small
          AoE. This effect can occur no more than once every 2s.
        </>
      ),
    }),
    autoBuffs: [
      {
        base: 6,
        targetAttribute: "cRate_",
      },
      {
        base: 12,
        increment: 0,
        targetAttribute: "naAtkSpd_",
      },
    ],
  },
];

export default goldPolearms;
