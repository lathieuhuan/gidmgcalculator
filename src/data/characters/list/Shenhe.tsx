import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { NCPA_PERCENTS } from "@Data/constants";
import { EModAffect } from "@Src/constants";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBPenalty = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "EB", char: args.char, charData: Shenhe as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const value = Math.min(5 + level, 15);
    return [level, value];
  }
  return [0, 0];
};

const Shenhe: DefaultAppCharacter = {
  code: 47,
  name: "Shenhe",
  icon: "a/af/Shenhe_Icon",
  sideIcon: "3/31/Shenhe_Side_Icon",
  rarity: 5,
  nation: "liyue",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1011, 24, 65],
    [2624, 61, 168],
    [3491, 82, 223],
    [5224, 122, 334],
    [5840, 137, 373],
    [6719, 157, 429],
    [7540, 176, 482],
    [8429, 197, 538],
    [9045, 211, 578],
    [9941, 232, 635],
    [10557, 247, 674],
    [11463, 268, 732],
    [12080, 282, 772],
    [12993, 304, 830],
  ],
  bonusStat: { type: "atk_", value: 7.2 },
  activeTalents: {
    NAs: {
      name: "Dawnstar Shooter",
    },
    ES: {
      name: "Spring Spirit Summoning",
      image: "6/6c/Talent_Spring_Spirit_Summoning",
    },
    EB: {
      name: "Divine Maiden's Deliverance",
      image: "d/d5/Talent_Divine_Maiden%27s_Deliverance",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 43.26 },
      { name: "2-Hit", multFactors: 40.25 },
      { name: "3-Hit", multFactors: 53.32 },
      { name: "4-Hit (1/2)", multFactors: 26.32 },
      { name: "5-Hit", multFactors: 65.62 },
    ],
    CA: [{ name: "Charged Attack", multFactors: 110.67 }],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Press Skill DMG", multFactors: 139.2 },
      { name: "Hold Skill DMG", multFactors: 188.8 },
      { name: "DMG Bonus", type: "other", multFactors: 45.66 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 100.8 },
      { name: "DoT", multFactors: 33.12 },
    ],
  },
  passiveTalents: [
    { name: "Deific Embrace", image: "2/29/Talent_Deific_Embrace" },
    {
      name: "Spirit Communion Seal",
      image: "5/5c/Talent_Spirit_Communion_Seal",
    },
    {
      name: "Precise Comings and Goings",
      image: "d/d0/Talent_Precise_Comings_and_Goings",
    },
  ],
  constellation: [
    { name: "Clarity of Heart", image: "1/13/Constellation_Clarity_of_Heart" },
    { name: "Centered Spirit", image: "9/90/Constellation_Centered_Spirit" },
    { name: "Seclusion", image: "d/d9/Constellation_Seclusion" },
    { name: "Insight", image: "4/46/Constellation_Insight" },
    {
      name: "Divine Attainment",
      image: "5/58/Constellation_Divine_Attainment",
    },
    { name: "Mystical Abandon", image: "0/0d/Constellation_Mystical_Abandon" },
  ],
  dsGetters: [(args) => `${getEBPenalty(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.PARTY,
      description: `When Normal, Charged and Plunging Attacks, Elemental Skills, and Elemental Bursts deal {Cryo}#[cryo]
      DMG the {DMG}#[gr] dealt is increased based on Shenhe's {current ATK}#[gr].`,
      inputConfigs: [
        { label: "Current ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const ATK = obj.fromSelf ? obj.totalAttr.atk : obj.inputs[0] || 0;
        const [level, mult] = getTalentMultiplier(
          { talentType: "ES", root: 45.66, inputIndex: 1 },
          Shenhe as AppCharacter,
          obj
        );
        const description = obj.desc + ` Lv.${level} / ${round(mult, 2)}% of ATK`;
        const buffValue = applyPercent(ATK, mult);
        applyModifier(description, obj.attElmtBonus, "cryo.flat", buffValue, obj.tracker);
      },
    },
    {
      index: 1,
      src: EModSrc.A1,
      affect: EModAffect.ACTIVE_UNIT,
      description: `An active character within Divine Maiden's Deliverance [EB] field gain {15%}#[b,gr]
      {Cryo DMG Bonus}#[gr].`,
      isGranted: checkAscs[1],
      applyBuff: makeModApplier("totalAttr", "cryo", 15),
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.PARTY,
      description: `After Shenhe uses Spring Spirit Summoning [ES], she will grant all nearby party members:
      <br />• Press: {15%}#[b,gr] {Elemental Skill and Elemental Burst DMG}#[gr] for 10s.
      <br />• Hold: {15%}#[b,gr] {Normal, Charged and Plunging Attack DMG}#[gr] for 15s.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        { label: "Press", type: "check", initialValue: 1 },
        { label: "Hold", type: "check", initialValue: 0 },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        if (inputs[0] === 1) {
          applyModifier(desc + " / Press", attPattBonus, ["ES.pct_", "EB.pct_"], 15, tracker);
        }
        if (inputs[1] === 1) {
          applyModifier(desc + " / Hold", attPattBonus, [...NCPA_PERCENTS], 15, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Active characters within Divine Maiden's Deliverance's field deal {15%}#[b,gr] increased
      {Cryo CRIT DMG}#[gr].`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("attElmtBonus", "cryo.cDmg_", 15),
    },
    {
      index: 4,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `Every time a character triggers Icy Quill's DMG Bonus, Shenhe will gain a Skyfrost Mantra stack for
      60s. Each stack increases her next Spring Spirit Summoning {[ES] DMG}#[gr] by {5%}#[b,gr]. Maximum {50}#[r] stacks.`,
      isGranted: checkCons[4],
      inputConfigs: [
        {
          label: "Stacks",
          type: "text",
          max: 50,
        },
      ],
      applyBuff: ({ attPattBonus, inputs, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", 5 * (inputs[0] || 0), tracker);
      },
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.EB,
      description: `The field decreases opponents' {Cryo RES}#[gr] and {Physical RES}#[gr] by {@0}#[b,gr].`,
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyDebuff: (obj) => {
        const [level, penalty] = getEBPenalty(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.resistReduct, ["phys", "cryo"], penalty, obj.tracker);
      },
    },
  ],
};

export default Shenhe as AppCharacter;
