import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Albedo: DefaultAppCharacter = {
  code: 29,
  name: "Albedo",
  icon: "3/30/Albedo_Icon",
  sideIcon: "3/34/Albedo_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "geo",
  weaponType: "sword",
  EBcost: 40,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1030, 20, 68],
    [2671, 51, 177],
    [3554, 67, 235],
    [5317, 101, 352],
    [5944, 113, 394],
    [6839, 130, 453],
    [7675, 146, 508],
    [8579, 163, 568],
    [9207, 175, 610],
    [10119, 192, 670],
    [10746, 204, 712],
    [11669, 222, 773],
    [12296, 233, 815],
    [13226, 251, 876],
  ],
  bonusStat: {
    type: "geo",
    value: 7.2,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 36.74 },
      { name: "2-Hit", multFactors: 36.74 },
      { name: "3-Hit", multFactors: 47.45 },
      { name: "4-Hit", multFactors: 49.75 },
      { name: "5-Hit", multFactors: 62.07 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [47.3, 60.2],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 130.4 },
      {
        id: "ES.0",
        name: "Transient Blossom",
        multFactors: { root: 133.6, attributeType: "def" },
      },
    ],
    EB: [
      { name: "Burst DMG", multFactors: 367.2 },
      { name: "Fatal Blossom DMG", multFactors: 72 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Favonius Bladework - Weiss",
    },
    ES: {
      name: "Abiogenesis: Solar Isotoma",
      image: "0/0e/Talent_Abiogenesis_Solar_Isotoma",
    },
    EB: {
      name: "Rite of Progeniture: Tectonic Tide",
      image: "0/0a/Talent_Rite_of_Progeniture_Tectonic_Tide",
    },
  },
  passiveTalents: [
    { name: "Calcite Might", image: "5/56/Talent_Calcite_Might" },
    { name: "Homuncular Nature", image: "8/80/Talent_Homuncular_Nature" },
    { name: "Flash of Genius", image: "3/32/Talent_Flash_of_Genius_%28Albedo%29" },
  ],
  constellation: [
    { name: "Flower of Eden", image: "2/29/Constellation_Flower_of_Eden" },
    { name: "Opening of Phanerozoic", image: "d/d8/Constellation_Opening_of_Phanerozoic" },
    { name: "Grace of Helios", image: "e/e8/Constellation_Grace_of_Helios" },
    { name: "Descent of Divinity", image: "8/8f/Constellation_Descent_of_Divinity" },
    { name: "Tide of Hadean", image: "a/a1/Constellation_Tide_of_Hadean" },
    { name: "Dust of Purification", image: "5/52/Constellation_Dust_of_Purification" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      affect: EModAffect.SELF,
      description: `{Transient Blossoms}#[gr] deal {25%}#[b,gr] more {DMG}#[gr] to opponents whose HP is below 50%.`,
      isGranted: checkAscs[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(genExclusiveBuff(EModSrc.A1, "ES.0", "pct_", 25));
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      description: `Using Rite of Progeniture: Tectonic Tide [EB] increases the {Elemental Mastery}#[gr] of nearby party
      members by {125}#[b,gr] for 10s.`,
      isGranted: checkAscs[4],
      applyBuff: makeModApplier("totalAttr", "em", 125),
    },
    {
      index: 2,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `Rite of Progeniture: Tectonic Tide [EB] consumes all stacks of Fatal Reckoning. Each stack increases
      Albedo's {[EB] DMG}#[gr] by {30%}#[b,gr] of his {DEF}#[gr]. Max {4}#[r] stacks.`,
      isGranted: checkCons[2],
      inputConfigs: [
        {
          type: "stacks",
          max: 4,
        },
      ],
      applyFinalBuff: ({ totalAttr, attPattBonus, inputs, desc, tracker }) => {
        const buffValue = totalAttr.def * 0.3 * (inputs[0] | 0);
        applyModifier(desc, attPattBonus, "EB.flat", Math.round(buffValue), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Active party members within the Solar Isotoma [ES] field have their {Plunging Attack DMG}#[gr]
      increased by {30%}#[b,gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("attPattBonus", "PA.pct_", 30),
    },
    {
      index: 4,
      src: EModSrc.C6,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Active party members within the Solar Isotoma [ES] field who are protected by a shield created by
      Crystallize have their {DMG}#[gr] increased by {17%}#[b,gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "all.pct_", 17),
    },
  ],
};

export default Albedo as AppCharacter;
