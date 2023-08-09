import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { TALENT_LV_MULTIPLIERS } from "@Src/constants/character-stats";
import { applyPercent, round } from "@Src/utils";
import { applyModifier, finalTalentLv, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkCons } from "../utils";

const getEBBuffResult = ({ fromSelf, char, partyData, inputs }: DescriptionSeedGetterArgs) => {
  const level = fromSelf
    ? finalTalentLv({ talentType: "EB", char, charData: Bennett as AppCharacter, partyData })
    : inputs[1] || 0;

  if (level) {
    const mult = round(56 * TALENT_LV_MULTIPLIERS[2][level], 2);
    return [level, mult];
  }
  return [0, 0];
};

const Bennett: DefaultAppCharacter = {
  code: 19,
  name: "Bennett",
  icon: "7/79/Bennett_Icon",
  sideIcon: "0/01/Bennett_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "pyro",
  weaponType: "sword",
  EBcost: 60,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [1039, 16, 65],
    [2670, 41, 166],
    [3447, 53, 214],
    [5163, 80, 321],
    [5715, 88, 356],
    [6573, 101, 409],
    [7309, 113, 455],
    [8168, 126, 508],
    [8719, 134, 542],
    [9577, 148, 596],
    [10129, 156, 630],
    [10987, 169, 684],
    [11539, 178, 718],
    [12397, 191, 771],
  ],
  bonusStat: {
    type: "er_",
    value: 6.7,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 44.55 },
      { name: "2-Hit", multFactors: 42.7 },
      { name: "3-Hit", multFactors: 54.61 },
      { name: "4-Hit", multFactors: 59.68 },
      { name: "5-Hit", multFactors: 71.9 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [55.9, 60.72],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Press", multFactors: 137.6 },
      { name: "Charge Level 1", multFactors: [84, 92] },
      { name: "Charge Level 2", multFactors: [88, 96] },
      { name: "Explosion", multFactors: 132 },
      { name: "Additional attack (C4)", multFactors: 124.2 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 232.8 },
      {
        name: "Regeneration",
        type: "healing",
        multFactors: { root: 6, attributeType: "hp" },
        flatFactor: 577,
      },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Strike of Fortune",
    },
    ES: {
      name: "Passion Overload",
      image: "6/66/Talent_Passion_Overload",
    },
    EB: {
      name: "Fantastic Voyage",
      image: "a/a2/Talent_Fantastic_Voyage",
    },
  },
  passiveTalents: [
    { name: "Rekindle", image: "7/77/Talent_Rekindle" },
    { name: "Fearnaught", image: "1/1a/Talent_Fearnaught" },
    { name: "It Should Be Safe...", image: "2/2a/Talent_It_Should_Be_Safe..." },
  ],
  constellation: [
    { name: "Grand Expectation", image: "c/c0/Constellation_Grand_Expectation" },
    { name: "Impasse Conqueror", image: "8/87/Constellation_Impasse_Conqueror" },
    { name: "Unstoppable Fervor", image: "e/ed/Constellation_Unstoppable_Fervor" },
    { name: "Unexpected Odyssey", image: "0/0e/Constellation_Unexpected_Odyssey" },
    { name: "True Explorer", image: "3/39/Constellation_True_Explorer" },
    { name: "Fire Ventures with Me", image: "3/3a/Constellation_Fire_Ventures_With_Me" },
  ],
  dsGetters: [(args) => `${getEBBuffResult(args)[1]}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.EB,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Increases {ATK}#[gr] of the characters within its AoE based on {@0}#[b,gr]
      of Bennett's {Base ATK}#[gr].
      <br />• At {C1}#[g], the {ATK Bonus}#[gr] is further increased by {20%}#[b,gr] of his Base ATK.
      <br />• At {C6}#[g], the characters also gain a {15%}#[b,gr] {Pyro DMG Bonus}#[gr].`,
      inputConfigs: [
        { label: "Base ATK", type: "text", max: 9999, for: "teammate" },
        { label: "Elemental Burst Level", type: "level", for: "teammate" },
        { label: "Constellation 1", type: "check", for: "teammate" },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf, totalAttr, inputs } = obj;
        let [level, multiplier] = getEBBuffResult(obj);

        if (multiplier) {
          const baseAtk = fromSelf ? totalAttr.base_atk : inputs[0] || 0;
          const boosted = fromSelf ? checkCons[1](obj.char) : inputs[2] === 1;
          let description = obj.desc + ` Lv. ${level}`;

          if (boosted) {
            multiplier += 20;
            description += ` + C1 (20%)`;
          }
          description += ` / ${multiplier}% of ${baseAtk} Base ATK`;
          applyModifier(description, totalAttr, "atk", applyPercent(baseAtk, multiplier), obj.tracker);
        }

        if (fromSelf ? checkCons[6](obj.char) : inputs[3]) {
          const descriptionC6 = `${fromSelf ? "Self" : "Bennet"} / ${EModSrc.C6}`;
          applyModifier(descriptionC6, totalAttr, "pyro", 15, obj.tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C2,
      affect: EModAffect.SELF,
      description: `When Bennett's HP falls below 70%, his {Energy Recharge}#[gr] is increased by {30%}#[b,gr].`,
      applyBuff: makeModApplier("totalAttr", "er_", 30),
    },
  ],
};

export default Bennett as AppCharacter;
