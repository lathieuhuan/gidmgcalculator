import type { AppCharacter, CharInfo, DefaultAppCharacter, ModifierInput, PartyData } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const getESDebuffValue = (fromSelf: boolean, char: CharInfo, inputs: ModifierInput[], partyData: PartyData) => {
  const level = fromSelf
    ? finalTalentLv({ char, charData: Eula as AppCharacter, talentType: "ES", partyData })
    : inputs[0] || 0;
  return level ? Math.min(15 + level, 25) : 0;
};

const Eula: DefaultAppCharacter = {
  code: 33,
  name: "Eula",
  icon: "a/af/Eula_Icon",
  sideIcon: "8/8d/Eula_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1030, 27, 58],
    [2671, 69, 152],
    [3554, 92, 202],
    [5317, 138, 302],
    [5944, 154, 337],
    [6839, 177, 388],
    [7675, 198, 436],
    [8579, 222, 487],
    [9207, 238, 523],
    [10119, 262, 574],
    [10746, 278, 610],
    [11669, 302, 662],
    [12296, 318, 698],
    [13226, 342, 751],
  ],
  bonusStat: { type: "cDmg_", value: 9.6 },
  calcListConfig: {
    PA: {
      multScale: 1,
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 89.73 },
      { name: "2-Hit", multFactors: 93.55 },
      { name: "3-Hit (1/2)", multFactors: 56.8 },
      { name: "4-Hit", multFactors: 112.64 },
      { name: "5-Hit (1/2)", multFactors: 71.83 },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 68.8 },
      { name: "Charged Attack Final", multFactors: 124.4 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Press DMG", multFactors: 146.4 },
      { name: "Hold DMG", multFactors: 245.6 },
      { name: "Icewhirl Brand", multFactors: 96 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 245.6 },
      {
        id: "EB.0",
        name: "Lightfall Sword Base DMG",
        attElmt: "phys",
        multFactors: { root: 367.05, scale: 1 },
      },
      {
        id: "EB.1",
        name: "DMG per Stack",
        attElmt: "phys",
        multFactors: { root: 74.99, scale: 1 },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Favonius Bladework - Edel",
    },
    ES: {
      name: "Icetide Vortex",
      image: "a/ae/Talent_Icetide_Vortex",
    },
    EB: {
      name: "Glacial Illumination",
      image: "a/af/Talent_Glacial_Illumination",
    },
  },
  passiveTalents: [
    { name: "Roiling Rime", image: "5/59/Talent_Roiling_Rime" },
    {
      name: "Wellspring of War-Lust",
      image: "b/b9/Talent_Wellspring_of_War-Lust",
    },
    {
      name: "Aristocratic Introspection",
      image: "4/4e/Talent_Aristocratic_Introspection",
    },
  ],
  constellation: [
    { name: "Tidal Illusion", image: "5/54/Constellation_Tidal_Illusion" },
    { name: "Lady of Seafoam", image: "c/cf/Constellation_Lady_of_Seafoam" },
    {
      name: "Lawrence Pedigree",
      image: "1/15/Constellation_Lawrence_Pedigree",
    },
    {
      name: "The Obstinacy of One's Inferiors",
      image: "2/21/Constellation_The_Obstinacy_of_One%27s_Inferiors",
    },
    {
      name: "Chivalric Quality",
      image: "e/e7/Constellation_Chivalric_Quality",
    },
    { name: "Noble Obligation", image: "3/34/Constellation_Noble_Obligation" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `Every time Grimheart stacks [~ES] are consumed, Eula's {Physical DMG}#[gr] is increased by
      {30%}#[b,gr] for 6s. Each stack consumed increases the duration by 6s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "phys", 30),
    },
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `{Lightfall Swords DMG}#[gr] [~EB] is increased by {25%}#[b,gr] against opponents with less than 50%
      HP.`,
      isGranted: checkCons[4],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C4, ["EB.0", "EB.1"], "pct_", 25));
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.ES,
      description: `If Grimheart stacks are consumed, surrounding opponents will have their {Physical RES}#[gr] and
      {Cryo RES}#[gr] decreased.`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: ({ fromSelf, resistReduct, char, inputs, partyData, desc, tracker }) => {
        const penaltyValue = getESDebuffValue(fromSelf, char, inputs, partyData);
        applyModifier(desc, resistReduct, ["phys", "cryo"], penaltyValue, tracker);
      },
    },
  ],
};

export default Eula as AppCharacter;
