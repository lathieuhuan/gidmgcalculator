import type { CharInfo, DataCharacter, GetTalentBuffFn, ModifierInput, PartyData } from "@Src/types";
import { Green } from "@Components/atoms";
import { EModAffect } from "@Src/constants";
import { EModSrc, HEAVY_PAs } from "../constants";
import { finalTalentLv, applyModifier, makeModApplier } from "@Src/utils/calculation";
import { charModIsInUse, checkCons, talentBuff } from "../utils";

const getC4TalentBuff: GetTalentBuffFn = ({ char, selfBuffCtrls }) => {
  const isInUse = charModIsInUse(Eula.buffs!, char, selfBuffCtrls, 1);
  return talentBuff([isInUse, "pct_", [false, 4], 25]);
};

const getESDebuffValue = (fromSelf: boolean, char: CharInfo, inputs: ModifierInput[], partyData: PartyData) => {
  const level = fromSelf ? finalTalentLv({ char, dataChar: Eula, talentType: "ES", partyData }) : inputs[0] || 0;
  return level ? Math.min(15 + level, 25) : 0;
};

const Eula: DataCharacter = {
  code: 33,
  name: "Eula",
  // icon: "d/d3/Character_Eula_Thumb",
  icon: "a/af/Eula_Icon",
  sideIcon: "0/0d/Character_Eula_Side_Icon",
  rarity: 5,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "claymore",
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
  NAsConfig: {
    name: "Favonius Bladework - Edel",
  },
  isReverseXtraLv: true,
  activeTalents: {
    NA: {
      stats: [
        { name: "1-Hit", multFactors: 89.73 },
        { name: "2-Hit", multFactors: 93.55 },
        { name: "3-Hit (1/2)", multFactors: 56.8 },
        { name: "4-Hit", multFactors: 112.64 },
        { name: "5-Hit (1/2)", multFactors: 71.83 },
      ],
    },
    CA: {
      stats: [
        { name: "Charged Attack Spinning", multFactors: 68.8 },
        { name: "Charged Attack Final", multFactors: 124.4 },
      ],
    },
    PA: { stats: HEAVY_PAs, multScale: 1 },
    ES: {
      name: "Icetide Vortex",
      image: "a/ae/Talent_Icetide_Vortex",
      stats: [
        { name: "Press DMG", multFactors: 146.4 },
        { name: "Hold DMG", multFactors: 245.6 },
        { name: "Icewhirl Brand", multFactors: 96 },
      ],
      // getExtraStats: (lv) => [
      //   { name: "DEF bonus", value: "30% per Stack" },
      //   { name: "Grimheart Duration", value: "18s" },
      //   { name: "Press CD", value: "6s" },
      //   { name: "Physical RES Decrease", value: Math.min(15 + lv, 25) + "%" },
      //   { name: "Cryo RES Decrease", value: Math.min(15 + lv, 25) + "%" },
      //   { name: "RES Decrease Duration", value: "7s" },
      //   { name: "Press CD", value: "4s" },
      //   { name: "Hold CD", value: "10s" },
      // ],
    },
    EB: {
      name: "Glacial Illumination",
      image: "a/af/Talent_Glacial_Illumination",
      stats: [
        { name: "Skill DMG", multFactors: 245.6 },
        {
          name: "Lightfall Sword Base DMG",
          attElmt: "phys",
          multFactors: { root: 367.05, scale: 1 },
          getTalentBuff: getC4TalentBuff,
        },
        {
          name: "DMG per Stack",
          attElmt: "phys",
          multFactors: { root: 74.99, scale: 1 },
          getTalentBuff: getC4TalentBuff,
        },
      ],
      // otherStats: () => [
      //   { name: "Maximum Stacks", value: 30 },
      //   { name: "CD", value: "20s" },
      // ],
      energyCost: 80,
    },
  },
  passiveTalents: [
    { name: "Roiling Rime", image: "5/59/Talent_Roiling_Rime" },
    { name: "Wellspring of War-Lust", image: "b/b9/Talent_Wellspring_of_War-Lust" },
    { name: "Aristocratic Introspection", image: "4/4e/Talent_Aristocratic_Introspection" },
  ],
  constellation: [
    { name: "Tidal Illusion", image: "5/54/Constellation_Tidal_Illusion" },
    { name: "Lady of Seafoam", image: "c/cf/Constellation_Lady_of_Seafoam" },
    { name: "Lawrence Pedigree", image: "1/15/Constellation_Lawrence_Pedigree" },
    {
      name: "The Obstinacy of One's Inferiors",
      image: "2/21/Constellation_The_Obstinacy_of_One%27s_Inferiors",
    },
    { name: "Chivalric Quality", image: "e/e7/Constellation_Chivalric_Quality" },
    { name: "Noble Obligation", image: "3/34/Constellation_Noble_Obligation" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          Every time Grimheart stacks [~ES] are consumed, Eula's <Green>Physical DMG</Green> is increased by{" "}
          <Green b>30%</Green> for 6s. Each stack consumed increases the duration by 6s.
        </>
      ),
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "phys", 30),
    },
    {
      index: 1,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      desc: () => (
        <>
          <Green>Lightfall Swords DMG</Green> is increased by <Green b>25%</Green> against opponents with less than 50%
          HP.
        </>
      ),
      isGranted: checkCons[4],
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.ES,
      desc: ({ fromSelf, char, inputs, partyData }) => (
        <>
          If Grimheart stacks are consumed, surrounding opponents will have their <Green>Physical RES</Green> and{" "}
          <Green>Cryo RES</Green> decreased by <Green b>{getESDebuffValue(fromSelf, char, inputs, partyData)}%</Green>.
        </>
      ),
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

export default Eula;
