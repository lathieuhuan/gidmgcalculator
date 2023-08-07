import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Freminet: DefaultAppCharacter = {
  code: 74,
  name: "Freminet",
  icon: "https://images2.imgbox.com/fa/bf/A2tmjH1a_o.png",
  sideIcon: "",
  rarity: 4,
  nation: "fontaine",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 60,
  talentLvBonusAtCons: {
    NAs: 3,
    ES: 5,
  },
  stats: [
    [1012, 21, 59],
    [2600, 55, 153],
    [3356, 71, 197],
    [5027, 106, 295],
    [5564, 117, 327],
    [6400, 135, 376],
    [7117, 150, 418],
    [7953, 168, 467],
    [8490, 179, 498],
    [9325, 197, 547],
    [9862, 208, 579],
    [10698, 226, 628],
    [11235, 237, 659],
    [12071, 255, 708],
  ],
  bonusStat: {
    type: "atk_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 84.24 },
      { name: "2-Hit", multFactors: 80.68 },
      { name: "3-Hit", multFactors: 101.9 },
      { name: "4-Hit", multFactors: 123.8 },
    ],
    CA: [
      { name: "Charged Attack Cyclic", multFactors: 62.52 },
      { name: "Charged Attack Final", multFactors: 113.09 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Upward Thrust", multFactors: 83.04 },
      {
        id: "ES.0",
        name: "Frost DMG",
        multFactors: 7.2,
      },
      {
        id: "ES.1",
        name: "Level 0 Shattering Pressure",
        multFactors: 200.48,
      },
      {
        id: "ES.2",
        name: "Level 1 Shattering Pressure (cryo)",
        multFactors: 100.24,
      },
      {
        id: "ES.3",
        name: "Level 1 Shattering Pressure (physical)",
        multFactors: 48.7,
        attElmt: "phys",
      },
      {
        id: "ES.4",
        name: "Level 2 Shattering Pressure (cryo)",
        multFactors: 70.17,
      },
      {
        id: "ES.5",
        name: "Level 2 Shattering Pressure (physical)",
        multFactors: 85.2,
        attElmt: "phys",
      },
      {
        id: "ES.6",
        name: "Level 3 Shattering Pressure (cryo)",
        multFactors: 40.1,
      },
      {
        id: "ES.7",
        name: "Level 3 Shattering Pressure (physical)",
        multFactors: 121.7,
        attElmt: "phys",
      },
      {
        id: "ES.8",
        name: "Level 4 Shattering Pressure",
        multFactors: 243.4,
        attElmt: "phys",
      },
      { name: "Spiritbreath Thorn", multFactors: 14.4 },
    ],
    EB: [{ name: "Skill DMG", multFactors: 318.4 }],
  },
  activeTalents: {
    NAs: {
      name: "Flowing Eddies",
    },
    ES: {
      name: "Pressurized Floe",
      image: "",
    },
    EB: {
      name: "Shadowhunter's Ambush",
      image: "",
    },
  },
  passiveTalents: [
    {
      name: "Saturation Deep Dive",
      image: "",
      description:
        "When using Shattering Pressure [~ES], if Pers Time has less than 4 levels of Pressure, the CD of Pressurized Floe will be decreased by 1s",
    },
    {
      name: "Parallel Condensers",
      image: "",
      description:
        "When Freminet triggers Shatter against opponents, Shattering Pressure DMG [~ES] will be increased by 40% for 5s.",
    },
    { name: "Deepwater Navigation", image: "" },
  ],
  constellation: [
    {
      name: "Dreams of the Seething Deep",
      image: "",
      description: "The CRIT Rate of Shattering Pressure will be increased by 15%.",
    },
    {
      name: "Penguins and the Land of Plenty",
      image: "",
      description:
        "Unleashing Pressurized Floe: Shattering Pressure will restore 2 Energy to Freminet. If a Pressure Level 4 Shattering Pressure is unleashed, this will restore 3 Energy.",
    },
    { name: "Song of the Eddies and Bleached Sands", image: "" },
    {
      name: "Dance of the Snowy Moon and Flute",
      image: "",
      description:
        "When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his ATK will be increased by 9% for 6s. Max 2 stacks. This can be triggered once every 0.3s.",
    },
    { name: "Nights of Hearth and Happiness", image: "" },
    {
      name: "Moment of Waking and Resolve",
      image: "",
      description:
        "When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his CRIT DMG will be increased by 12 for 6s. Max 3 stacks. This can be triggered once every 0.3s.",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      description: `The {CRIT Rate}#[gr] of {Shattering Pressure}#[gr] will be increased by {15%}#[b,gr].`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        const ids = Array.from({ length: 8 }).map((_, i) => `ES.${i + 1}`);
        calcItemBuffs.push(exclBuff(EModSrc.C1, ids, "cRate_", 15));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Stalking mode",
      affect: EModAffect.SELF,
      description: `While in Stalking mode, {Frost}#[gr] released by his Normal Attacks deal {200%}#[b,gr] of their
      original DMG.`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff("Stalking mode", "ES.0", "multPlus", 100));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Shatter against opponents, {Shattering Pressure DMG}#[gr] [~ES] will be
      increased by {40%}#[b,gr] for 5s.`,
      isGranted: checkAscs[4],
      applyBuff: ({ calcItemBuffs }) => {
        const ids = Array.from({ length: 8 }).map((_, i) => `ES.${i + 1}`);
        calcItemBuffs.push(exclBuff(EModSrc.A4, ids, "pct_", 40));
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his {ATK}#[gr] will be
      increased by {9%}#[b,gr] for 6s. Max {2}#[r] stacks. This can be triggered once every 0.3s.`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          type: "stacks",
          max: 2,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 9 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "atk_", buffValue, tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `When Freminet triggers Frozen, Shatter, or Superconduct against opponents, his {CRIT DMG}#[gr] will
      be increased by {12%}#[b,gr] for 6s. Max {3}#[r] stacks. This can be triggered once every 0.3s.`,
      isGranted: checkCons[6],
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        const buffValue = 12 * (inputs[0] || 0);
        applyModifier(desc, totalAttr, "cDmg_", buffValue, tracker);
      },
    },
  ],
};

export default Freminet as AppCharacter;
