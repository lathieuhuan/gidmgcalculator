import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { round, toMult } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { BOW_CAs, EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons, getTalentMultiplier } from "../utils";

const getESBonus = (args: DescriptionSeedGetterArgs) => {
  return getTalentMultiplier({ talentType: "ES", root: 37.91, scale: 5 }, Yoimiya as AppCharacter, args);
};

const Yoimiya: DefaultAppCharacter = {
  code: 38,
  name: "Yoimiya",
  icon: "8/88/Yoimiya_Icon",
  sideIcon: "2/2a/Yoimiya_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "pyro",
  weaponType: "bow",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [791, 25, 48],
    [2053, 65, 124],
    [2731, 87, 165],
    [4086, 130, 247],
    [4568, 145, 276],
    [5256, 167, 318],
    [5899, 187, 357],
    [6593, 209, 399],
    [7075, 225, 428],
    [7777, 247, 470],
    [8259, 262, 500],
    [8968, 285, 542],
    [9450, 300, 572],
    [10164, 323, 615],
  ],
  bonusStat: {
    type: "cRate_",
    value: 4.8,
  },
  calcListConfig: {
    NA: { multScale: 4 },
  },
  calcList: {
    NA: [
      { name: "1-Hit (1/2)", multFactors: 35.64 },
      { name: "2-Hit", multFactors: 68.38 },
      { name: "3-Hit", multFactors: 88.89 },
      { name: "4-Hit (1/2)", multFactors: 46.42 },
      { name: "5-Hit", multFactors: 105.86 },
    ],
    CA: [
      ...BOW_CAs,
      {
        name: "Kindling Arrow",
        subAttPatt: "FCA",
        multFactors: { root: 16.4, scale: 2 },
      },
    ],
    PA: LIGHT_PAs,
    ES: [],
    EB: [
      { name: "Skill DMG", multFactors: 127.2 },
      { name: "Aurous Blaze Explosion", multFactors: 122 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Firework Flare-Up",
    },
    ES: {
      name: "Niwabi Fire-Dance",
      image: "0/03/Talent_Niwabi_Fire-Dance",
    },
    EB: {
      name: "Ryuukin Saxifrage",
      image: "a/a7/Talent_Ryuukin_Saxifrage",
    },
  },
  passiveTalents: [
    { name: "Tricks of the Trouble-Maker", image: "a/a2/Talent_Tricks_of_the_Trouble-Maker" },
    { name: "Summer Night's Dawn", image: "9/9b/Talent_Summer_Night%27s_Dawn" },
    { name: "Blazing Match", image: "6/6e/Talent_Blazing_Match" },
  ],
  constellation: [
    { name: "Agate Ryuukin", image: "8/8c/Constellation_Agate_Ryuukin" },
    { name: "A Procession of Bonfires", image: "7/77/Constellation_A_Procession_of_Bonfires" },
    { name: "Trickster's Flare", image: "7/7e/Constellation_Trickster%27s_Flare" },
    { name: "Pyrotechnic Professional", image: "e/e2/Constellation_Pyrotechnic_Professional" },
    { name: "A Summer Festival's Eve", image: "b/bc/Constellation_A_Summer_Festival%27s_Eve" },
    { name: "Naganohara Meteor Swarm", image: "c/cc/Constellation_Naganohara_Meteor_Swarm" },
  ],
  dsGetters: [(args) => `${round(toMult(getESBonus(args)[1]), 3)}`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.SELF,
      description: `Yoimiya's {Normal Attack DMG}#[gr] will be increased by {@0}#[b,gr] times and converted to
      {Pyro DMG}#[pyro].
      <br />• At {A1}#[g], Normal Attacks on hit will increase Yoimiya's {Pyro DMG Bonus}#[gr] by {2%}#[b,gr] for 3s.
      Maximum {10}#[r] stacks.`,
      inputConfigs: [
        {
          label: "Stacks (A4)",
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: (obj) => {
        const [level, mult] = getESBonus(obj);
        applyModifier(obj.desc + ` Lv.${level}`, obj.attPattBonus, "NA.multPlus", mult, obj.tracker);

        if (checkAscs[1](obj.char)) {
          applyModifier(EModSrc.A1, obj.totalAttr, "pyro", 2 * (obj.inputs[0] || 0), obj.tracker);
        }
      },
      infuseConfig: {
        overwritable: false,
      },
    },
    {
      index: 2,
      src: EModSrc.A4,
      affect: EModAffect.TEAMMATE,
      description: `Using Ryuukin Saxifrage [EB] causes nearby party members (excluding Yoimiya) to gain a {10%}#[b,gr]
      {ATK Bonus}#[gr] for 15s. A further {1%}#[b,gr] {ATK Bonus}#[gr] will be added for each "Tricks of the
      Trouble-Maker" [A1] stacks Yoimiya possesses when using Ryuukin Saxifrage.`,
      isGranted: checkAscs[4],
      inputConfigs: [
        {
          type: "stacks",
          initialValue: 0,
          max: 10,
        },
      ],
      applyBuff: ({ totalAttr, inputs, desc, tracker }) => {
        applyModifier(desc, totalAttr, "atk_", 10 + (inputs[0] || 0), tracker);
      },
    },
    {
      index: 3,
      src: EModSrc.C1,
      affect: EModAffect.SELF,
      description: `When an opponent affected by Aurous Blaze [EB] is defeated within its duration, Yoimiya's {ATK}#[gr]
      is increased by {20%}#[b,gr] for 20s.`,
      isGranted: checkCons[1],
      applyBuff: makeModApplier("totalAttr", "atk_", 20),
    },
    {
      index: 4,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Yoimiya's Pyro DMG scores a CRIT Hit, she will gain a {25%}#[b,gr] {Pyro DMG Bonus}#[gr] for
      6s. Can work off-field.`,
      isGranted: checkCons[2],
      applyBuff: makeModApplier("totalAttr", "pyro", 25),
    },
  ],
};

export default Yoimiya as AppCharacter;
