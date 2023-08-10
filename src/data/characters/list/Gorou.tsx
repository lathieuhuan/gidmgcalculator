import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 206 }, Gorou as AppCharacter, args);
};

const Gorou: DefaultAppCharacter = {
  code: 44,
  name: "Gorou",
  icon: "f/fe/Gorou_Icon",
  sideIcon: "7/7e/Gorou_Side_Icon",
  rarity: 4,
  nation: "inazuma",
  vision: "geo",
  weaponType: "bow",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [802, 15, 54],
    [2061, 39, 140],
    [2661, 51, 180],
    [3985, 76, 270],
    [4411, 84, 299],
    [5074, 97, 344],
    [5642, 108, 382],
    [6305, 120, 427],
    [6731, 128, 456],
    [7393, 141, 501],
    [7818, 149, 530],
    [8481, 162, 575],
    [8907, 170, 603],
    [9570, 183, 648],
  ],
  bonusStat: {
    type: "geo",
    value: 6,
  },
  calcListConfig: {
    EB: { multAttributeType: "def" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 37.75 },
      { name: "2-Hit", multFactors: 37.15 },
      { name: "3-Hit", multFactors: 49.45 },
      { name: "4-Hit", multFactors: 59 },
    ],
    CA: BOW_CAs,
    PA: LIGHT_PAs,
    ES: [
      {
        name: "Skill DMG",
        multFactors: 107.2,
      },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 98.22 },
      { name: "Crystal Collapse DMG", multFactors: 61.3 },
      {
        name: "Heal Amount (C4)",
        type: "healing",
        multFactors: { root: 50, scale: 0 },
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Ripping Fang Fletching",
    },
    ES: {
      name: "Inuzaka All-Round Defense",
      image: "e/e6/Talent_Inuzaka_All-Round_Defense",
    },
    EB: {
      name: "Juuga: Forward Unto Victory",
      image: "f/f9/Talent_Juuga_Forward_Unto_Victory",
    },
  },
  passiveTalents: [
    {
      name: "Heedless of the Wind and Weather",
      image: "8/89/Talent_Heedless_of_the_Wind_and_Weather",
    },
    { name: "A Favor Repaid", image: "6/61/Talent_A_Favor_Repaid" },
    { name: "Seeker of Shinies", image: "8/82/Talent_Seeker_of_Shinies" },
  ],
  constellation: [
    {
      name: "Rushing Hound: Swift as the Wind",
      image: "2/2e/Constellation_Rushing_Hound_Swift_as_the_Wind",
    },
    {
      name: "Sitting Hound: Steady as a Clock",
      image: "0/0c/Constellation_Sitting_Hound_Steady_as_a_Clock",
    },
    {
      name: "Mauling Hound: Fierce as Fire",
      image: "2/25/Constellation_Mauling_Hound_Fierce_as_Fire",
    },
    {
      name: "Lapping Hound: Warm as Water",
      image: "4/4d/Constellation_Lapping_Hound_Warm_as_Water",
    },
    {
      name: "Striking Hound: Thunderous Force",
      image: "4/47/Constellation_Striking_Hound_Thunderous_Force",
    },
    {
      name: "Valiant Hound: Mountainous Fealty",
      image: "9/9d/Constellation_Valiant_Hound_Mountainous_Fealty",
    },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `• Inuzaka All-Round Defense {[ES] DMG}#[gr] increased by {156%}#[b,gr] of DEF.
      <br />• Juuga: Forward Unto Victory {[ES] DMG}#[gr] increased by {15.6%}#[b,gr] of DEF.`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        const buffValues = [totalAttr.def * 1.56, totalAttr.def * 0.156];
        applyModifier(desc, attPattBonus, ["ES.flat", "EB.flat"], buffValues, tracker);
      },
    },
  ],
  dsGetters: [(args) => `${Math.round(getESBonus(args)[1])}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Provides up to 3 buffs to active characters within the skill's AoE based on the number of {Geo}#[geo]
      characters in the party:
      <br />• 1 character: Adds "Standing Firm" - {@0}#[b,gr] {DEF bonus}#[gr]
      <br />• 2 characters: Adds "Impregnable" - Increased resistance to interruption.
      <br />• 3 characters: Adds "Crunch" - {15%}#[b,gr] {Geo DMG Bonus}#[gr].`,
      inputConfigs: [
        {
          label: "Elemental Skill Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const buffValue = getESBonus(obj)[1];
        const { geo = 0 } = countVision(obj.partyData, obj.charData);

        applyModifier(obj.desc, obj.totalAttr, "def", buffValue, obj.tracker);
        if (geo > 2) {
          applyModifier(obj.desc, obj.totalAttr, "geo", 15, obj.tracker);
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.PARTY,
      description: `After using Juuga: Forward Unto Victory [EB], all nearby party members' {DEF}#[gr] is increased by
      {25%}#[b,gr] for 12s.`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "def_", 25),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.PARTY,
      description: `For 12s after using Inuzaka All-Round Defense [ES] or Juuga: Forward Unto Victory [EB], increases all nearby
      party members' {Geo CRIT DMG}#[gr] based on the buff level of the skill's field:
      <br />• "Standing Firm": {10%}#[b,gr]
      <br />• "Impregnable": {20%}#[b,gr]
      <br />• "Crunch": {40%}#[b,gr]`,
      isGranted: checkCons[6],
      applyBuff: (obj) => {
        const { geo = 0 } = countVision(obj.partyData, obj.charData);
        const buffValue = [10, 20, 40, 40][geo - 1];
        applyModifier(obj.desc, obj.attElmtBonus, "geo.cDmg_", buffValue, obj.tracker);
      },
    },
  ],
};

export default Gorou as AppCharacter;
