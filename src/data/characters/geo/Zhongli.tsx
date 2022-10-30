import type { DataCharacter } from "@Src/types";
import { Green } from "@Src/styled-components";
import { ATTACK_ELEMENTS, EModAffect } from "@Src/constants";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { applyPercent } from "@Src/utils";
import { applyModifier, AttackPatternPath } from "@Calculators/utils";
import { checkAscs } from "../utils";

const Zhongli: DataCharacter = {
  code: 25,
  name: "Zhongli",
  icon: "c/c2/Character_Zhongli_Thumb",
  sideIcon: "e/e1/Character_Zhongli_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "geo",
  weapon: "polearm",
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
  bonusStat: { type: "geo", value: 7.2 },
  NAsConfig: {
    name: "Rain of Stone",
  },
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", baseMult: 30.77 },
        { name: "2-Hit", baseMult: 31.15 },
        { name: "3-Hit", baseMult: 38.58 },
        { name: "4-Hit", baseMult: 42.94 },
        { name: "5-Hit (1/4)", baseMult: 10.75 },
        { name: "6-Hit", baseMult: 54.5 },
      ],
    },
    CA: { stats: [{ name: "Charged Attack", baseMult: 111.03 }] },
    PA: { stats: MEDIUM_PAs },
    ES: {
      name: "Dominus Lapidis",
      image: "9/93/Talent_Dominus_Lapidis",
      xtraLvAtCons: 3,
      stats: [
        { name: "Stone Stele DMG", baseMult: 16 },
        { name: "Resonance DMG", baseMult: 32 },
        { name: "Hold DMG", baseMult: 80 },
        {
          name: "Shield DMG Absorption",
          notAttack: "shield",
          baseStatType: "hp",
          baseMult: 12.8,
          multType: 2,
          flat: { base: 1232, type: 3 },
        },
      ],
      // getExtraStats: () => [
      //   { name: "Press CD", value: "4s" },
      //   { name: "Shield Duration", value: "20s" },
      //   { name: "CD", value: "12s" },
      // ],
    },
    EB: {
      name: "Planet Befall",
      image: "7/76/Talent_Planet_Befall",
      xtraLvAtCons: 5,
      stats: [{ name: "Skill DMG", baseMult: 401.08, multType: 6 }],
      // getExtraStats: (lv) => [
      //   { name: "Petrification Duration", value: Math.min(30 + lv, 40) / 10 + "s" },
      //   { name: "CD", value: "12s" },
      // ],
      energyCost: 40,
    },
  },
  passiveTalents: [
    { name: "Resonant Waves", image: "4/4f/Talent_Resonant_Waves" },
    { name: "Dominance of Earth", image: "f/ff/Talent_Dominance_of_Earth" },
    { name: "Arcanum of Crystal", image: "9/90/Talent_Arcanum_of_Crystal" },
  ],
  constellation: [
    {
      name: "Rock, the Backbone of Earth",
      image: "a/a5/Constellation_Rock%2C_the_Backbone_of_Earth",
    },
    { name: "Stone, the Cradle of Jade", image: "a/aa/Constellation_Stone%2C_the_Cradle_of_Jade" },
    {
      name: "Jade, Shimmering through Darkness",
      image: "0/08/Constellation_Jade%2C_Shimmering_through_Darkness",
    },
    {
      name: "Topaz, Unbreakable and Fearless",
      image: "f/f3/Constellation_Topaz%2C_Unbreakable_and_Fearless",
    },
    {
      name: "Lazuli, Herald of the Order",
      image: "a/a6/Constellation_Lazuli%2C_Herald_of_the_Order",
    },
    {
      name: "Chrysos, Bounty of Dominator",
      image: "7/7c/Constellation_Chrysos%2C_Bounty_of_Dominator",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      desc: () => (
        <>
          Zhongli deals bonus DMG based on his <Green>Max HP</Green>:<br />• Normal Attack, Charged
          Attack, and Plunging Attack DMG increased by <Green b>1.39%</Green> of Max HP.
          <br />• Dominus Lapidis Stone Stele, resonance, and hold DMG increased by{" "}
          <Green b>1.9%</Green> of Max HP.
          <br />• Planet Befall DMG increased by <Green b>33%</Green> of Max HP.
        </>
      ),
      isGranted: checkAscs[4],
      applyBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const fields: AttackPatternPath[] = ["NA.flat", "CA.flat", "PA.flat", "ES.flat", "EB.flat"];
        const bnValues = [1.39, 1.39, 1.39, 1.9, 33].map((mult) =>
          applyPercent(totalAttr.hp, mult)
        );
        applyModifier(desc, attPattBonus, fields, bnValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      desc: () => (
        <>
          When the Jade Shield takes DMG, it will Fortify: <br />• Fortified characters have{" "}
          <Green b>5%</Green> increased <Green>Shield Strength</Green>.<br />
          Can stack up to <Green b>5</Green> times, and lasts until the Jade Shield disappears.
        </>
      ),
      isGranted: checkAscs[1],
      affect: EModAffect.ACTIVE_UNIT,
      inputConfig: {
        selfLabels: ["Stacks"],
        labels: ["Stacks"],
        renderTypes: ["select"],
        initialValues: [1],
        maxValues: [5],
      },
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "shStr", 5 * (inputs?.[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: "Jade Shield",
      desc: () => (
        <>
          Characters protected by the Jade Shield will decrease the <Green>Elemental RES</Green> and{" "}
          <Green>Physical RES</Green> of opponents in a small AoE by <Green b>20%</Green>. This
          effect cannot be stacked.
        </>
      ),
      applyDebuff: ({ resistReduct, desc, tracker }) => {
        applyModifier(desc, resistReduct, [...ATTACK_ELEMENTS], 20, tracker);
      },
    },
  ],
};

export default Zhongli;
