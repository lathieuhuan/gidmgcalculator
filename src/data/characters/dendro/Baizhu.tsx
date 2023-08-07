import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round } from "@Src/utils";
import { applyModifier, makeModApplier, ReactionBonusPath } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

const Baizhu: DefaultAppCharacter = {
  code: 70,
  name: "Baizhu",
  icon: "https://images2.imgbox.com/da/d9/A4umtyus_o.png",
  sideIcon: "f/f9/Baizhu_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "dendro",
  weaponType: "catalyst",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [2695, 39, 101],
    [3586, 52, 134],
    [5366, 77, 201],
    [4165, 120, 253],
    [5999, 87, 225],
    [6902, 100, 258],
    [7747, 112, 290],
    [8659, 125, 324],
    [9292, 134, 348],
    [10213, 147, 382],
    [10846, 156, 406],
    [11777, 170, 441],
    [12410, 179, 464],
    [13348, 193, 500],
  ],
  bonusStat: { type: "hp_", value: 7.2 },
  activeTalents: {
    NAs: {
      name: "The Classics of Acupuncture",
    },
    ES: {
      name: "Universal Diagnosis",
      image: "6/69/Talent_Universal_Diagnosis",
    },
    EB: {
      name: "Holistic Revivification",
      image: "1/1b/Talent_Holistic_Revivification",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 37.37 },
      { name: "2-Hit", multFactors: 36.42 },
      { name: "3-Hit (x2)", multFactors: 22.54 },
      { name: "4-Hit", multFactors: 54.14 },
    ],
    CA: [{ name: "Charged Attack", multFactors: 121.04 }],
    PA: LIGHT_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 79.2 },
      {
        name: "Healing",
        type: "healing",
        multFactors: { root: 8, attributeType: "hp" },
        flatFactor: 770,
      },
      {
        name: "Gossamer Sprite: Splice DMG (C2)",
        multFactors: { root: 250, scale: 0 },
      },
      {
        name: "Gossamer Sprite: Splice Healing (C2)",
        type: "healing",
        multFactors: { root: 1.6, attributeType: "hp" },
        flatFactor: 154,
      },
    ],
    EB: [
      {
        name: "Seamless Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 0.8, attributeType: "hp" },
        flatFactor: 77,
      },
      {
        name: "Spiritvein Healing",
        type: "healing",
        multFactors: { root: 5.2, attributeType: "hp" },
        flatFactor: 501,
      },
      {
        id: "EB.0",
        name: "Spiritvein DMG",
        notOfficial: true,
        multFactors: 97.06,
      },
    ],
  },
  passiveTalents: [
    {
      name: "Five Fortunes Forever",
      image: "b/b6/Talent_Five_Fortunes_Forever",
    },
    {
      name: "All Things Are of the Earth",
      image: "2/29/Talent_All_Things_Are_of_the_Earth",
    },
    {
      name: "Herbal Nourishment",
      image: "6/66/Talent_Herbal_Nourishment",
    },
  ],
  constellation: [
    {
      name: "Attentive Observation",
      image: "3/33/Constellation_Attentive_Observation",
    },
    {
      name: "Incisive Discernment",
      image: "b/b3/Constellation_Incisive_Discernment",
    },
    {
      name: "All Aspects Stabilized",
      image: "9/94/Constellation_All_Aspects_Stabilized",
    },
    {
      name: "Ancient Art of Perception",
      image: "e/e9/Constellation_Ancient_Art_of_Perception",
    },
    {
      name: "The Hidden Ebb and Flow",
      image: "e/e7/Constellation_The_Hidden_Ebb_and_Flow",
    },
    {
      name: "Elimination of Malicious Qi",
      image: "6/6a/Constellation_Elimination_of_Malicious_Qi",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.C6,
      description: `Increases {Spiritveins DMG}#[gr] [~EB] by {8%}#[b,gr] of Baizhu's {Max HP}#[gr].`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ calcItemBuffs, totalAttr }) => {
        const desc = `${EModSrc.C6} / 8% of ${Math.round(totalAttr.hp)} HP`;
        calcItemBuffs.push(exclBuff(desc, "EB.0", "flat", Math.round(totalAttr.hp * 0.08)));
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      isGranted: checkAscs[1],
      description: `Baizhu gains different effects according to the current HP of your current active character:
      <br />• When their HP is less than 50%, Baizhu gains {20%}#[b,gr] {Healing Bonus}#[gr].
      <br />• When their HP is equal to or more than 50%, Baizhu gains {25%}#[b,gr] {Dendro DMG Bonus}#[gr].`,
      inputConfigs: [{ label: "HP less than 50%", type: "check" }],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, inputs[0] ? "healB_" : "dendro", inputs[0] ? 20 : 25, tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      isGranted: checkAscs[4],
      description: `Characters healed by Holistic Revivification [EB] will gain the Year of Verdant Favor effect: Each
      1,000 Max HP that Baizhu possesses below 50,000 will increase their
      {Burning, Bloom, Hyperbloom, and Burgeon DMG}#[gr] by {2%}#[b,gr], while their {Aggravate and Spread DMG}#[gr]
      will be increased by {0.8%}#[b,gr]. This effect lasts 6s.`,
      inputConfigs: [{ label: "Max HP", type: "text", max: 99999, for: "teammate" }],
      applyFinalBuff: ({ toSelf, totalAttr, rxnBonus, inputs, desc, tracker }) => {
        const hp = toSelf ? totalAttr.hp : inputs[0] || 0;
        const stacks = round(Math.min(hp, 50000) / 1000, 1);
        const fields: ReactionBonusPath[] = ["burning.pct_", "bloom.pct_", "hyperbloom.pct_", "burgeon.pct_"];

        applyModifier(desc, rxnBonus, fields, stacks * 2, tracker);
        applyModifier(desc, rxnBonus, ["aggravate.pct_", "spread.pct_"], stacks * 0.8, tracker);
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      isGranted: checkCons[4],
      description: `For 15s after Holistic Revivification [EB] is used, Baizhu will increase all nearby party members'
      {Elemental Mastery}#[gr] by {80}#[b,gr].`,
      applyBuff: makeModApplier("totalAttr", "em", 80),
    },
  ],
};

export default Baizhu as AppCharacter;
