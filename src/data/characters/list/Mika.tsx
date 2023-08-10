import type { AppCharacter, DefaultAppCharacter, DescriptionSeedGetterArgs } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, finalTalentLv } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const getESBuffValue = ({ fromSelf, char, partyData, inputs }: DescriptionSeedGetterArgs) => {
  const level = fromSelf
    ? finalTalentLv({ talentType: "ES", char: char, charData: Mika as AppCharacter, partyData })
    : inputs[0] || 0;
  return level ? Math.min(12 + level, 25) : 0;
};

const Mika: DefaultAppCharacter = {
  code: 67,
  name: "Mika",
  icon: "d/dd/Mika_Icon",
  sideIcon: "8/84/Mika_Side_Icon",
  rarity: 4,
  nation: "mondstadt",
  vision: "cryo",
  weaponType: "polearm",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1049, 19, 60],
    [2694, 48, 154],
    [3477, 62, 198],
    [5208, 93, 297],
    [5765, 103, 329],
    [6631, 118, 378],
    [7373, 131, 420],
    [8239, 147, 470],
    [8796, 157, 502],
    [9661, 172, 551],
    [10217, 182, 583],
    [11083, 198, 632],
    [11640, 208, 664],
    [12506, 223, 713],
  ],
  bonusStat: { type: "hp_", value: 6 },
  activeTalents: {
    NAs: {
      name: "Spear of Favonius - Point Passage",
    },
    ES: {
      name: "Starfrost Swirl",
      image: "c/c1/Talent_Starfrost_Swirl",
    },
    EB: {
      name: "Skyfeather Song",
      image: "7/7a/Talent_Skyfeather_Song",
    },
  },
  calcListConfig: {
    EB: {
      multAttributeType: "hp",
    },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 43.26 },
      { name: "2-Hit", multFactors: 41.5 },
      { name: "3-Hit", multFactors: 54.5 },
      { name: "4-Hit (1/2)", multFactors: 27.61 },
      { name: "5-Hit", multFactors: 70.87 },
    ],
    CA: [{ name: "Charged Attack", multFactors: 112.75 }],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Flowfrost Arrow", multFactors: 67.2 },
      { name: "Rimestar Flare", multFactors: 84 },
      { name: "Rimestar Shard", multFactors: 25.2 },
    ],
    EB: [
      {
        name: "Activation Healing",
        type: "healing",
        multFactors: 12.17,
        flatFactor: 1172,
      },
      {
        name: "Eagleplume Regeneration",
        type: "healing",
        multFactors: 2.43,
        flatFactor: 234,
      },
    ],
  },
  passiveTalents: [
    { name: "Suppressive Barrage", image: "b/b4/Talent_Suppressive_Barrage" },
    { name: "Topographical Mapping", image: "7/73/Talent_Topographical_Mapping" },
    { name: "Demarcation", image: "b/bf/Talent_Demarcation" },
  ],
  constellation: [
    { name: "Factor Confluence", image: "f/f3/Constellation_Factor_Confluence" },
    { name: "Companion's Ingress", image: "6/65/Constellation_Companion%27s_Ingress" },
    { name: "Reconnaissance Experience", image: "f/f1/Constellation_Reconnaissance_Experience" },
    { name: "Sunfrost Encomium", image: "6/6f/Constellation_Sunfrost_Encomium" },
    { name: "Signal Arrow", image: "a/af/Constellation_Signal_Arrow" },
    { name: "Companion's Counsel", image: "e/e0/Constellation_Companion%27s_Counsel" },
  ],
  dsGetters: [(args) => `${getESBuffValue(args)}%`],
  buffs: [
    {
      index: 0,
      src: EModSrc.ES,
      affect: EModAffect.ACTIVE_UNIT,
      description: `Grants nearby active characters Soulwind, increasing their {ATK SPD}#[gr] by {@0}#[b,gr].
      <br />• At {A1}#[g], Soulwind can grant characters the Detector effect, increasing their {Physical DMG}#[gr] by
      {10%}#[b,gr] each stack. Max {3}#[r] stacks.
      <br />• At {A4}#[g], the maximum number of {stacks}#[gr] is increased by {1}#[b,gr].
      <br />• At {C6}#[g], the maximum number of {stacks}#[gr] is increased by {1}#[b,gr]. Grants {60%}#[b,gr]
      {Physical CRIT DMG}#[gr] bonus.`,
      inputConfigs: [
        { label: "Elemental Skill Level", type: "level", for: "teammate" },
        { label: "Detector stacks (A1)", type: "select", initialValue: 0, max: 5 },
        { label: "Constellation 6", type: "check", for: "teammate" },
      ],
      applyBuff: (obj) => {
        const { fromSelf, char, inputs, desc, tracker } = obj;
        applyModifier(desc, obj.totalAttr, "naAtkSpd_", getESBuffValue(obj), tracker);

        if (!fromSelf || checkAscs[1](char)) {
          let maxStacks = 5;

          if (fromSelf) {
            if (!checkAscs[4](char)) maxStacks--;
            if (!checkCons[6](char)) maxStacks--;
          }

          const detectorBuffValue = Math.min(fromSelf ? inputs[0] || 0 : inputs[1] || 0, maxStacks) * 10;
          applyModifier(desc + ` + ${EModSrc.A1}`, obj.totalAttr, "phys", detectorBuffValue, tracker);
        }
        if ((fromSelf && checkCons[6](char)) || (!fromSelf && inputs[2])) {
          applyModifier(desc + ` + ${EModSrc.C6}`, obj.attElmtBonus, "phys.cDmg_", 60, tracker);
        }
      },
    },
  ],
};

export default Mika as AppCharacter;
