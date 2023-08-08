import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { ATTACK_ELEMENTS, EModAffect } from "@Src/constants";
import { applyPercent } from "@Src/utils";
import { AttackPatternPath, applyModifier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs } from "../utils";

const Zhongli: DefaultAppCharacter = {
  code: 25,
  name: "Zhongli",
  icon: "a/a6/Zhongli_Icon",
  sideIcon: "6/68/Zhongli_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1144, 20, 57],
    [2967, 51, 149],
    [3948, 67, 198],
    [5908, 101, 297],
    [6605, 113, 332],
    [7599, 130, 382],
    [8528, 146, 428],
    [9533, 163, 479],
    [10230, 175, 514],
    [11243, 192, 564],
    [11940, 204, 599],
    [12965, 222, 651],
    [13662, 233, 686],
    [14695, 251, 738],
  ],
  bonusStat: {
    type: "geo",
    value: 7.2,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 30.77 },
      { name: "2-Hit", multFactors: 31.15 },
      { name: "3-Hit", multFactors: 38.58 },
      { name: "4-Hit", multFactors: 42.94 },
      { name: "5-Hit (1/4)", multFactors: 10.75 },
      { name: "6-Hit", multFactors: 54.5 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 111.03,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Stone Stele DMG", multFactors: 16 },
      { name: "Resonance DMG", multFactors: 32 },
      { name: "Hold DMG", multFactors: 80 },
      {
        name: "Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 12.8, attributeType: "hp" },
        flatFactor: 1232,
      },
    ],
    EB: [
      {
        name: "Skill DMG",
        multFactors: { root: 401.08, scale: 6 },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Rain of Stone",
    },
    ES: {
      name: "Dominus Lapidis",
      image: "9/93/Talent_Dominus_Lapidis",
    },
    EB: {
      name: "Planet Befall",
      image: "7/76/Talent_Planet_Befall",
    },
  },
  passiveTalents: [
    { name: "Resonant Waves", image: "4/4f/Talent_Resonant_Waves" },
    { name: "Dominance of Earth", image: "f/ff/Talent_Dominance_of_Earth" },
    { name: "Arcanum of Crystal", image: "9/90/Talent_Arcanum_of_Crystal" },
  ],
  constellation: [
    { name: "Rock, the Backbone of Earth", image: "a/a5/Constellation_Rock%2C_the_Backbone_of_Earth" },
    { name: "Stone, the Cradle of Jade", image: "a/aa/Constellation_Stone%2C_the_Cradle_of_Jade" },
    { name: "Jade, Shimmering through Darkness", image: "0/08/Constellation_Jade%2C_Shimmering_through_Darkness" },
    { name: "Topaz, Unbreakable and Fearless", image: "f/f3/Constellation_Topaz%2C_Unbreakable_and_Fearless" },
    { name: "Lazuli, Herald of the Order", image: "a/a6/Constellation_Lazuli%2C_Herald_of_the_Order" },
    { name: "Chrysos, Bounty of Dominator", image: "7/7c/Constellation_Chrysos%2C_Bounty_of_Dominator" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• {Normal Attack, Charged Attack, and Plunging Attack DMG}#[gr] increased by {1.39%}#[b,gr] of
      {Max HP}#[gr].
      <br />• Dominus Lapidis Stone Stele, resonance, and hold {[ES] DMG}#[gr] increased by {1.9%}#[b,gr] of
      {Max HP}#[gr].
      <br />• Planet Befall {[EB] DMG}#[gr] increased by {33%}#[b,gr] of {Max HP}#[gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "PA.flat", "ES.flat", "EB.flat"];
        const buffValues = [1.39, 1.39, 1.39, 1.9, 33].map((mult) => applyPercent(totalAttr.hp, mult));
        applyModifier(desc, attPattBonus, fields, buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When Jade Shield takes DMG, the characters have their {Shield Strength}#[gr] increased by
      {5%}#[b,gr] until the Jade Shield disappears. Max {5}#[r] stacks.`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shieldS_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      description: `Jade Shield decreases {Elemental RES}#[gr] and {Physical RES}#[gr] of opponents in a small AoE
      by {20%}#[b,gr]. Cannot be stacked.`,
      applyDebuff: ({ resistReduct, desc, tracker }) => {
        applyModifier(desc, resistReduct, [...ATTACK_ELEMENTS], 20, tracker);
      },
    },
  ],
};

export default Zhongli as AppCharacter;
