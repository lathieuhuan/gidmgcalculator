import { EModAffect } from "@Src/constants";
import { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { round, toMult } from "@Src/utils";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 34.07, scale: 5 }, Neuvillette as AppCharacter, args);
};

const Neuvillette: DefaultAppCharacter = {
  code: 77,
  beta: true,
  name: "Neuvillette",
  icon: "",
  sideIcon: "",
  rarity: 5,
  nation: "fontaine",
  vision: "hydro",
  weaponType: "catalyst",
  EBcost: 70,
  talentLvBonusAtCons: {
    NAs: 3,
    EB: 5,
  },
  stats: [
    [1144, 16, 45],
    [2967, 42, 116],
    [3948, 56, 155],
    [5908, 84, 232],
    [6605, 94, 259],
    [7599, 108, 298],
    [8528, 121, 335],
    [9533, 135, 374],
    [10230, 145, 401],
    [11243, 159, 441],
    [11940, 169, 468],
    [12965, 184, 509],
    [13662, 194, 536],
    [14695, 208, 576],
  ],
  bonusStat: { type: "cDmg_", value: 9.6 },
  activeTalents: {
    NAs: {
      name: "As Still Waters",
    },
    ES: {
      name: "O Tears, I Shall Repay",
      image: "",
    },
    EB: {
      name: "O Tides, I Have Returned",
      image: "",
    },
  },
  calcListConfig: {
    EB: { multAttributeType: "hp" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 54.58 },
      { name: "2-Hit", multFactors: 46.25 },
      { name: "3-Hit", multFactors: 72.34 },
    ],
    CA: [
      { name: "Charged Attack", multFactors: 136.8 },
      {
        name: "Charged Attack: Equitable Judgment",
        multFactors: { root: 7.32, attributeType: "hp", scale: 7 },
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "Skill DMG", multFactors: { root: 12.86, attributeType: "hp" } },
      { name: "Spiritbreath Thorn", multFactors: 20.8 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 22.26 },
      { name: "Waterfall DMG", multFactors: 9.11 },
    ],
  },
  passiveTalents: [
    { name: "Heir to the Ancient Sea's Legacy", image: "" },
    { name: "The High Arbitrator's Discipline", image: "" },
    { name: "Gather Like the Tide", image: "" },
  ],
  constellation: [
    { name: "Venerable Institution", image: "" },
    { name: "The Law Commands", image: "" },
    { name: "Ancient Fiction", image: "" },
    { name: "Crowned in Compassion", image: "" },
    { name: "Axiomatic Judgment", image: "" },
    { name: "Wrathful Recompense", image: "" },
  ],
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `In Chilling Penalty state, when Neuvillette's HP is above 50%, his {Normal Attack DMG}#[gr] will be
      increased by {@0}#[b,gr] times and normal attacks will consume his HP on hit.
      <br />• At {A4}#[g], when Neuvillette's current HP increases or decreases, this state gain 1 stack. Each stack
      increase Neuvillette's {ATK}#[gr] by {6%}#[b,gr]. Max {5}#[r] stacks. At {C2}#[g], each stack also increases
      Darkgold Wolfbite {[EB] DMG}#[gr] by {40%}#[b,gr].`,
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 5,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getESBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "NA.multPlus", mult, obj.tracker);

        if (checkAscs[4](obj.char)) {
          const stacks = obj.inputs[0] || 0;
          applyModifier(EModSrc.A1, obj.totalAttr, "atk_", 6 * stacks, obj.tracker);

          if (checkCons[2](obj.char)) {
            applyModifier(EModSrc.C2, obj.attPattBonus, "EB.pct_", 40 * stacks, obj.tracker);
          }
        }
      },
    },
    {
      index: 1,
      src: "Gracious Rebuke [A1]",
      affect: EModAffect.SELF,
      description: `When Neuvillette's HP is less than 60%, his next {Charged Attack}#[gr] becomes
      <b>Rebuke: Vaulting Fist</b> dealing {30%}#[b,gr] increased {DMG}#[gr]. Effect cooldown: 5s.
      <br />• At {C1}#[g], this effect triggers when Neuvillette's HP is less than 50% or while he is in the Chilling
      Penalty state, when the fifth normal attack hits. Rebuke: Vaulting Fist deals {50%}#[b,gr] increased {DMG}#[gr].
      Effect cooldown: 2.5s.
      <br/ >• At {C6}#[g], increases Rebuke: Vaulting Fist {CRIT Rate}#[gr] by {10%}#[b,gr] and {CRIT DMG}#[gr] by
      {80%}#[b,gr]`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.attPattBonus, "CA.pct_", checkCons[1](obj.char) ? 50 : 30, obj.tracker);

        if (checkCons[6](obj.char)) {
          applyModifier(EModSrc.C6, obj.attPattBonus, ["CA.cRate_", "CA.cDmg_"], [10, 80], obj.tracker);
        }
      },
    },
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Neuvillette is over healed, if he is on the field, his {ATK SPD}#[gr] will be increased by
      {20%}#[b,gr] for 4s, otherwise all party members' {ATK SPD}#[gr] will be increased by {10%}#[b,gr] for 6s.`,
      applyBuff: (obj) => {
        applyModifier(obj.desc, obj.totalAttr, "naAtkSpd_", obj.fromSelf ? 20 : 10, obj.tracker);
      },
    },
  ],
};

export default Neuvillette as AppCharacter;
