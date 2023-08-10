import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyPercent, countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getEBBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "EB", root: 32.16 }, YunJin as AppCharacter, args);
};

const YunJin: DefaultAppCharacter = {
  code: 48,
  name: "Yun Jin",
  GOOD: "YunJin",
  icon: "9/9c/Yun_Jin_Icon",
  sideIcon: "f/fb/Yun_Jin_Side_Icon",
  rarity: 4,
  nation: "liyue",
  vision: "geo",
  weaponType: "polearm",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [894, 16, 62],
    [2296, 41, 158],
    [2963, 53, 204],
    [4438, 80, 306],
    [4913, 88, 339],
    [5651, 101, 389],
    [6283, 113, 433],
    [7021, 126, 484],
    [7495, 134, 517],
    [8233, 148, 567],
    [8707, 156, 600],
    [9445, 169, 651],
    [9919, 178, 684],
    [10657, 191, 734],
  ],
  bonusStat: {
    type: "er_",
    value: 6.7,
  },
  calcListConfig: {
    ES: { multAttributeType: "def" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 40.51 },
      { name: "2-Hit", multFactors: 40.25 },
      { name: "3-Hit", multFactors: [22.96, 27.52] },
      { name: "4-Hit", multFactors: [23.99, 28.81] },
      { name: "5-Hit", multFactors: 67.34 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 121.69,
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Press DMG", multFactors: 149.12 },
      { name: "Charge Level 1 DMG", multFactors: 260.96 },
      { name: "Charge Level 2 DMG", multFactors: 372.8 },
      {
        name: "Shield DMG Absorption",
        type: "shield",
        multFactors: { root: 12, attributeType: "hp" },
        flatFactor: 1155,
      },
    ],
    EB: [
      {
        name: "Skill DMG",
        multFactors: 244,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Cloud-Grazing Strike",
    },
    ES: {
      name: "Whirling Opener",
      image: "9/92/Talent_Opening_Flourish",
    },
    EB: {
      name: "Cliffbreaker's Banner",
      image: "5/59/Talent_Cliffbreaker%27s_Banner",
    },
  },
  passiveTalents: [
    { name: "True to Oneself", image: "3/34/Talent_True_to_Oneself" },
    { name: "No Mere Traditionalist", image: "f/fa/Talent_Breaking_Conventions" },
    { name: "Light Nourishment", image: "3/39/Talent_Light_Nourishment" },
  ],
  constellation: [
    { name: "Stylized Equestrianism", image: "c/cd/Constellation_Thespian_Gallop" },
    { name: "Myriad Mise-en-Scène", image: "e/e5/Constellation_Myriad_Mise-En-Sc%C3%A8ne" },
    { name: "Seafaring General", image: "4/4c/Constellation_Seafaring_General" },
    { name: "Ascend, Cloud-Hanger", image: "a/a4/Constellation_Flower_and_a_Fighter" },
    { name: "Famed Throughout the Land", image: "f/f4/Constellation_Famed_Throughout_the_Land" },
    { name: "Decorous Harmony", image: "1/10/Constellation_Decorous_Harmony" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `The {Normal Attack DMG Bonus}#[gr] granted by Flying Cloud Flag Formation [~EB] is further increased
      by {2.5%}#[b,gr]/{5%}#[b,gr]/{7.5%}#[b,gr]/{11.5%}#[b,gr] of Yun Jin's {DEF}#[gr] when the party contains
      characters of 1/2/3/4 Elemental Types, respectively.`,
      isGranted: checkAscs[4],
    },
  ],
  dsGetters: [(args) => `${round(getEBBonus(args)[1], 2)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      description: `Increases {Normal Attack DMG}#[gr] based on {@0}#[b,gr] of Yun Jin's {current DEF}#[gr].
      <br />• At {A4}#[g], further increases the bonus based on how many element types in the party.
      <br />• At {C2}#[g], increases {Normal Attack DMG}#[gr] by {15%}#[b,gr].
      <br />• At {C6}#[g], increases {Normal ATK SPD}#[gr] by {12%}#[b,gr].`,
      affect: EModAffect.PARTY,
      inputConfigs: [
        { label: "Current DEF", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: EModSrc.A4, type: "check", for: "teammate" },
        { label: EModSrc.C2, type: "check", for: "teammate" },
        { label: EModSrc.C6, type: "check", for: "teammate" },
      ],
      applyFinalBuff: (obj) => {
        const { fromSelf, inputs, char, tracker } = obj;
        const descRoot = fromSelf ? "Self" : "Yun Jin";
        const DEF = fromSelf ? obj.totalAttr.def : inputs[0] || 0;
        let [level, mult] = getEBBonus(obj);
        let description = `${obj.desc} Lv.${level}`;

        if (fromSelf ? checkAscs[4](char) : inputs[2]) {
          const visionCount = countVision(obj.partyData, obj.charData);
          const numOfElmts = Object.keys(visionCount).length;
          mult += numOfElmts * 2.5 + (numOfElmts === 4 ? 1.5 : 0);
          description += ` + ${EModSrc.A4}`;
        }
        description += ` / ${round(mult, 2)}% of DEF`;
        const buffValue = applyPercent(DEF, mult);

        applyModifier(description, obj.attPattBonus, "NA.flat", buffValue, tracker);

        if (fromSelf ? checkCons[2](char) : inputs[3]) {
          const descriptionC2 = `${descRoot} / ${EModSrc.C2}`;
          applyModifier(descriptionC2, obj.attPattBonus, "NA.pct_", 15, tracker);
        }
        if (fromSelf ? checkCons[6](char) : inputs[4]) {
          const descriptionC6 = `${descRoot} / ${EModSrc.C6}`;
          applyModifier(descriptionC6, obj.totalAttr, "naAtkSpd_", 12, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `When Yun Jin trigger the Crystallize Reaction, her {DEF}#[gr] is increased by {20%}#[b,gr] for 12s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "def_", 20),
    },
  ],
};

export default YunJin as AppCharacter;
