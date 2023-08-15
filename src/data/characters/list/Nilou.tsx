import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { countVision, round } from "@Src/utils";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, MEDIUM_PAs } from "../constants";
import { checkAscs, checkCons, exclBuff } from "../utils";

function getA4BuffValue(maxHP: number) {
  const stacks = maxHP / 1000 - 30;
  return stacks > 0 ? round(Math.min(stacks * 9, 400), 1) : 0;
}

const Nilou: DefaultAppCharacter = {
  code: 60,
  name: "Nilou",
  icon: "5/58/Nilou_Icon",
  sideIcon: "c/c3/Nilou_Side_Icon",
  rarity: 5,
  nation: "sumeru",
  vision: "hydro",
  weaponType: "sword",
  EBcost: 70,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1182, 18, 57],
    [3066, 46, 147],
    [4080, 62, 196],
    [6105, 92, 293],
    [6825, 103, 327],
    [7852, 119, 377],
    [8813, 133, 423],
    [9850, 149, 473],
    [10571, 160, 507],
    [11618, 176, 557],
    [12338, 187, 592],
    [13397, 203, 643],
    [14117, 213, 677],
    [15185, 230, 729],
  ],
  bonusStat: {
    type: "hp_",
    value: 7.2,
  },
  calcListConfig: {
    ES: { multAttributeType: "hp" },
    EB: { multAttributeType: "hp" },
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 50.31 },
      { name: "2-Hit", multFactors: 45.44 },
      { name: "3-Hit", multFactors: 70.35 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: [50.22, 54.44],
      },
    ],
    PA: MEDIUM_PAs,
    ES: [
      { name: "Skill DMG", multFactors: 3.34 },
      { name: "Sword Dance 1-Hit DMG", multFactors: 4.55 },
      { name: "Sword Dance 2-Hit DMG", multFactors: 5.14 },
      {
        id: "ES.0",
        name: "Watery Moon DMG",
        multFactors: 7.17,
      },
      { name: "Whirling Steps 1-Hit DMG", multFactors: 3.26 },
      { name: "Whirling Steps 2-Hit DMG", multFactors: 3.96 },
      { name: "Water Wheel DMG", multFactors: 5.06 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 18.43 },
      { name: "Lingering Aeon DMG", multFactors: 22.53 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Dance of Samser",
    },
    ES: {
      name: "Dance of Haftkarsvar",
      image: "3/3e/Talent_Dance_of_Haftkarsvar",
    },
    EB: {
      name: "Dance of Abzendegi: Distant Dreams, Listening Spring",
      image: "b/b9/Talent_Dance_of_Abzendegi_Distant_Dreams%2C_Listening_Spring",
    },
  },
  passiveTalents: [
    { name: "Court of Dancing Petals", image: "7/74/Talent_Court_of_Dancing_Petals" },
    { name: "Dreamy Dance of Aeons", image: "6/60/Talent_Dreamy_Dance_of_Aeons" },
    { name: "White Jade Lotus", image: "3/39/Talent_White_Jade_Lotus" },
  ],
  constellation: [
    { name: "Dance of the Waning Moon", image: "0/0a/Constellation_Dance_of_the_Waning_Moon" },
    { name: "The Starry Skies Their Flowers Rain", image: "0/09/Constellation_The_Starry_Skies_Their_Flowers_Rain" },
    { name: "Beguiling Shadowstep", image: "6/60/Constellation_Beguiling_Shadowstep" },
    { name: "Fricative Pulse", image: "1/1e/Constellation_Fricative_Pulse" },
    { name: "Twirling Light", image: "a/a2/Constellation_Twirling_Light" },
    { name: "Frostbreaker's Melody", image: "9/93/Constellation_Frostbreaker%27s_Melody" },
  ],
  innateBuffs: [
    {
      src: EModSrc.C1,
      isGranted: checkCons[1],
      description: `{Watery moon DMG}#[gr] is increased by {65%}#[b,gr].`,
      applyBuff: ({ calcItemBuffs }) => {
        calcItemBuffs.push(exclBuff(EModSrc.C1, "ES.0", "pct_", 65));
      },
    },
    {
      src: EModSrc.C6,
      description: `For every 1,000 points of Max HP, Nilou's {CRIT Rate}#[gr] is increased by {0.6%}#[b,gr] (max
      {30%}#[r]) and her {CRIT DMG}#[gr] is increase by {1.2%}#[b,gr] (max {60%}#[r]).`,
      isGranted: checkCons[6],
      applyFinalBuff: ({ totalAttr, desc, tracker }) => {
        const baseValue = round(Math.min((totalAttr.hp / 1000) * 0.6, 30), 1);
        const buffValues = [baseValue, baseValue * 2];
        applyModifier(desc, totalAttr, ["cRate_", "cDmg_"], buffValues, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 0,
      src: "Golden Chalice's Bounty",
      affect: EModAffect.PARTY,
      description: `Increases characters' {Elemental Mastery}#[gr] by {100}#[b,gr] for 10s whenever they are hit
      by Dendro attacks. Also, triggering Bloom reaction will create Bountiful Cores instead of Dendro Cores.
      <br />• At {A4}#[g], each 1,000 points of Nilou {Max HP}#[gr] above 30,000 will cause
      {Bountiful Cores DMG}#[gr] to increase by {9%}#[b,gr]. Maximum {400%}#[r].`,
      isGranted: checkAscs[1],
      inputConfigs: [
        {
          label: "Max HP (A4)",
          type: "text",
          max: 99999,
          for: "teammate",
        },
      ],
      applyBuff: ({ totalAttr, charData, partyData, desc, tracker }) => {
        const { dendro, hydro, ...rest } = countVision(partyData, charData);

        if (dendro && hydro && !Object.keys(rest).length) {
          applyModifier(desc, totalAttr, "em", 100, tracker);
        }
      },
      applyFinalBuff: ({ fromSelf, totalAttr, rxnBonus, inputs, char, desc, tracker }) => {
        if (fromSelf ? checkAscs[4](char) : inputs[0]) {
          const buffValue = getA4BuffValue(fromSelf ? totalAttr.hp : inputs[0]);
          applyModifier(desc, rxnBonus, "bloom.pct_", buffValue, tracker);
        }
      },
    },
    {
      index: 3,
      src: EModSrc.C4,
      affect: EModAffect.SELF,
      description: `After the third dance step of Pirouette state [~ES] hits opponents, Dance of the Lotus: Distant Dreams,
      Listening Spring {[EB] DMG}#[gr] will be increased by {50%}#[b,gr] for 8s.`,
      applyBuff: makeModApplier("attPattBonus", "EB.pct_", 50),
    },
  ],
  debuffs: [
    {
      index: 0,
      src: EModSrc.C2,
      description: `After characters affected by the Golden Chalice's Bounty deal Hydro DMG to opponents, that opponent's
      {Hydro RES}#[gr] will be decreased by {35%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "hydro", 35),
    },
    {
      index: 1,
      src: EModSrc.C2,
      description: `After a triggered Bloom reaction deals DMG to opponents, their {Dendro RES}#[gr] will be decreased by
      {35%}#[b,gr] for 10s.`,
      isGranted: checkCons[2],
      applyDebuff: makeModApplier("resistReduct", "dendro", 35),
    },
  ],
};

export default Nilou as AppCharacter;