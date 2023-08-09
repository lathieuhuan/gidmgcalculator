import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkCons, exclBuff } from "../utils";

const getEBBuffResult = (args: DescriptionSeedGetterArgs) => {
  const level = args.fromSelf
    ? finalTalentLv({ talentType: "EB", char: args.char, charData: Ayato as AppCharacter, partyData: args.partyData })
    : args.inputs[0] || 0;

  if (level) {
    const mult = Math.min(level + 10, 20);
    return [level, mult];
  }
  return [0, 0];
};

const Ayato: DefaultAppCharacter = {
  code: 50,
  name: "Ayato",
  GOOD: "KamisatoAyato",
  icon: "2/27/Kamisato_Ayato_Icon",
  sideIcon: "2/2c/Kamisato_Ayato_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1068, 23, 60],
    [2770, 60, 155],
    [3685, 80, 206],
    [5514, 120, 309],
    [6165, 134, 345],
    [7092, 155, 397],
    [7960, 174, 446],
    [8897, 194, 499],
    [9548, 208, 535],
    [10494, 229, 588],
    [11144, 243, 624],
    [12101, 264, 678],
    [12751, 278, 715],
    [13715, 299, 769],
  ],
  bonusStat: {
    type: "cDmg_",
    value: 9.6,
  },
  calcListConfig: {
    NA: { multScale: 7 },
    ES: { multScale: 7 },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.96 },
      { name: "2-Hit", multFactors: 47.16 },
      { name: "3-Hit", multFactors: 58.61 },
      { name: "4-Hit (1/2)", multFactors: 29.45 },
      { name: "5-Hit", multFactors: 75.6 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: { root: 129.53, scale: 7 },
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      {
        id: "ES.0",
        name: "Shunsuiken 1-Hit DMG",
        attPatt: "NA",
        multFactors: 52.89,
      },
      {
        id: "ES.1",
        name: "Shunsuiken 2-Hit DMG",
        attPatt: "NA",
        multFactors: 58.91,
      },
      {
        id: "ES.2",
        name: "Shunsuiken 3-Hit DMG",
        attPatt: "NA",
        multFactors: 64.93,
      },
      {
        id: "ES.3",
        name: "Extra Shunsuiken strike (1/2) (C6)",
        attPatt: "NA",
        multFactors: { root: 450, scale: 0 },
      },
      { name: "Water Illusion DMG", multFactors: 101.48 },
    ],
    EB: [
      {
        name: "Bloomwater Blade DMG",
        multFactors: 66.46,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Kamisato Art - Marobashi",
    },
    ES: {
      name: "Kamisato Art: Kyouka",
      image: "5/5d/Talent_Kamisato_Art_Kyouka",
    },
    EB: {
      name: "Kamisato Art: Suiyuu",
      image: "e/e8/Talent_Kamisato_Art_Suiyuu",
    },
  },
  passiveTalents: [
    { name: "Kamisato Art: Mine Wo Matoishi Kiyotaki", image: "7/77/Talent_Kamisato_Art_Mine_Wo_Matoishi_Kiyotaki" },
    { name: "Kamisato Art: Michiyuku Hagetsu", image: "b/ba/Talent_Kamisato_Art_Michiyuku_Hagetsu" },
    { name: "Kamisato Art: Daily Cooking", image: "4/43/Talent_Kamisato_Art_Daily_Cooking" },
  ],
  constellation: [
    { name: "Kyouka Fushi", image: "a/ac/Constellation_Kyouka_Fuushi" },
    { name: "World Source", image: "e/ed/Constellation_World_Source" },
    { name: "To Admire the Flower", image: "0/06/Constellation_To_Admire_the_Flowers" },
    { name: "Endles Flow", image: "d/de/Constellation_Endless_Flow" },
    { name: "Bansui Ichiro", image: "f/f1/Constellation_Bansui_Ichiro" },
    { name: "Boundless Origin", image: "d/da/Constellation_Boundless_Origin" },
  ],
  dsGetters: [(args) => `${getEBBuffResult(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `• Converts his Normal Attack DMG into AoE {Hydro DMG}#[hydro] (Shunsuiken) that cannot be overridden.
      <br />• On hit, Shunsuikens grant Ayato Namisen stacks which increase {Shunsuiken DMG}#[gr] based on his
      {Max HP}#[gr].
      <br />• At {C2}#[g], Ayato's {Max HP}#[gr] is increased by {50%}#[b,gr] when he has at least 3 Namisen stacks.`,
      inputConfigs: [
        {
          label: "Namisen stacks",
          type: "stacks",
          max: 5,
        },
      ],
      applyBuff: ({ char, totalAttr, inputs, desc, tracker }) => {
        if (checkCons[2](char) && (inputs[0] || 0) >= 3) {
          applyModifier(desc, totalAttr, "hp_", 50, tracker);
        }
      },
      applyFinalBuff: ({ char, totalAttr, calcItemBuffs, inputs, partyData }) => {
        const level = finalTalentLv({
          char,
          charData: Ayato as AppCharacter,
          talentType: "ES",
          partyData,
        });
        const finalMult = 0.56 * (inputs[0] || 0) * TALENT_LV_MULTIPLIERS[7][level];

        calcItemBuffs.push(
          exclBuff(EModSrc.ES, ["ES.0", "ES.1", "ES.2"], "flat", applyPercent(totalAttr.hp, finalMult))
        );
      },
      infuseConfig: {
        overwritable: false,
        disabledNAs: true,
      },
    },
    {
      index: 1,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Increases the {Normal Attack DMG}#[gr] of characters within its AoE by {@0}#[b,gr].`,
      inputConfigs: [
        {
          label: "Elemental Burst Level",
          type: "level",
          for: "teammate",
        },
      ],
      applyBuff: (obj) => {
        const [level, buffValue] = getEBBuffResult(obj);
        applyModifier(obj.desc + ` Lv. ${level}`, obj.attPattBonus, "NA.pct_", buffValue, obj.tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `{Shunsuiken DMG}#[gr] is increased by {40%}#[b,gr] against opponents with 50% HP or less.`,
      isGranted: checkCons[1],
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C1, ["ES.0", "ES.1", "ES.2", "ES.3"], "pct_", 40));
      },
    },
    {
      index: 5,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `After using Kamisato Art: Suiyuu [EB], all nearby party members will have {15%}#[b,gr] increased
      {Normal Attack SPD}#[gr] for 15s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "naAtkSpd_", 15),
    },
  ],
};

export default Ayato as AppCharacter;
