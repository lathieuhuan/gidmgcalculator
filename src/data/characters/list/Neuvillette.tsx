import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, genExclusiveBuff } from "../utils";

const Neuvillette: DefaultAppCharacter = {
  code: 77,
  beta: true,
  name: "Neuvillette",
  icon: "https://images2.imgbox.com/ae/d2/PqXhvc16_o.png",
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
        id: "CA.0",
        name: "Charged Attack: Equitable Judgment",
        multFactors: { root: 7.32, scale: 7, attributeType: "hp" },
      },
      {
        id: "CA.0",
        name: "Additional Current (1/2) (C6)",
        multFactors: { root: 10, scale: 0, attributeType: "hp" },
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
  buffs: [
    {
      index: 0,
      src: EModSrc.A1,
      isGranted: checkAscs[1],
      affect: EModAffect.SELF,
      description: `When a party member triggers a hydro-related reaction, Neuvillette obtains 1 stack of Past Draconic
      Glories for 30s. Max 3 stacks. The effect increases Charged Attack: {Equitable Judgment DMG}#[gr] by
      {1.1}#[b,gr]/{1.3}#[b,gr]/{1.6}#[b,gr] times.
      <br/>• At {C2}#[g], each stack also increases {Equitable Judgment CRIT DMG}#[gr] by {14%}#[b,gr].`,
      inputConfigs: [
        {
          type: "stacks",
          max: 3,
        },
      ],
      applyBuff: (obj) => {
        const stacks = obj.inputs[0] || 0;
        const buffValue = [10, 30, 60][stacks - 1] || 0;

        obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "CA.0", "multPlus", buffValue));

        if (checkCons[2](obj.char)) {
          obj.calcItemBuffs.push(genExclusiveBuff(obj.desc, "CA.0", "cDmg_", 14 * stacks));
        }
      },
    },
    {
      index: 1,
      src: EModSrc.A4,
      isGranted: checkAscs[4],
      affect: EModAffect.SELF,
      description: `For each {1%}#[gr] of Neuvillette's {HP}#[gr] over 30%, he will gain {0.6%}#[b,gr]
      {Hydro DMG Bonus}#[gr], upto {30%}#[m].`,
      inputConfigs: [
        {
          label: "Current HP%",
          type: "text",
          initialValue: 100,
          max: 100,
        },
      ],
      applyBuff: (obj) => {
        const stacks = (obj.inputs[0] || 0) - 30;
        const buffValue = Math.max(Math.min(stacks * 0.6, 30), 0);
        applyModifier(obj.desc, obj.totalAttr, "hydro", buffValue, obj.tracker);
      },
    },
  ],
};

export default Neuvillette as AppCharacter;
