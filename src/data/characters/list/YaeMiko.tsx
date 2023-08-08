import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { applyModifier, makeModApplier } from "@Src/utils/calculation";
import { EModSrc, LIGHT_PAs } from "../constants";
import { checkAscs, checkCons } from "../utils";

const YaeMiko: DefaultAppCharacter = {
  code: 49,
  name: "Yae Miko",
  GOOD: "YaeMiko",
  icon: "b/ba/Yae_Miko_Icon",
  sideIcon: "9/97/Yae_Miko_Side_Icon",
  rarity: 5,
  nation: "inazuma",
  vision: "electro",
  weaponType: "catalyst",
  EBcost: 90,
  talentLvBonusAtCons: {
    ES: 3,
    EB: 5,
  },
  stats: [
    [807, 26, 44],
    [2095, 69, 115],
    [2787, 91, 153],
    [4170, 137, 229],
    [4662, 153, 256],
    [5364, 176, 294],
    [6020, 197, 330],
    [6729, 220, 369],
    [7220, 236, 396],
    [7936, 260, 435],
    [8428, 276, 462],
    [9151, 300, 502],
    [9643, 316, 529],
    [10372, 340, 569],
  ],
  bonusStat: {
    type: "cRate_",
    value: 4.8,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 39.66 },
      { name: "2-Hit", multFactors: 38.52 },
      { name: "3-Hit", multFactors: 56.89 },
    ],
    CA: [
      {
        name: "Charged Attack",
        multFactors: 142.89,
      },
    ],
    PA: LIGHT_PAs,
    ES: [
      { name: "Sesshou Sakura DMG Lv.1", multFactors: 60.67 },
      { name: "DMG Lv. 2", multFactors: 75.84 },
      { name: "DMG Lv. 3", multFactors: 94.8 },
      { name: "DMG Lv. 4", multFactors: 118.5 },
    ],
    EB: [
      { name: "Skill DMG", multFactors: 260 },
      { name: "Tenko Thunderbolt DMG", multFactors: 333.82 },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Spiritfox Sin-Eater",
    },
    ES: {
      name: "Yakan Evocation: Sesshou Sakura",
      image: "9/93/Talent_Yakan_Evocation_Sesshou_Sakura",
    },
    EB: {
      name: "Great Secret Art: Tenko Kenshin",
      image: "9/93/Talent_Great_Secret_Art_Tenko_Kenshin",
    },
  },
  passiveTalents: [
    { name: "The Shrine's Sacred Shade", image: "6/68/Talent_The_Shrine%27s_Sacred_Shade" },
    { name: "Enlightened Blessing", image: "b/ba/Talent_Enlightened_Blessing" },
    { name: "Meditation of a Yako", image: "e/e5/Talent_Meditations_of_a_Yako" },
  ],
  constellation: [
    { name: "Yakan Offering", image: "4/4e/Constellation_Yakan_Offering" },
    { name: "Fox's Mooncall", image: "5/55/Constellation_Fox%27s_Mooncall" },
    { name: "The Seven Glamours", image: "a/aa/Constellation_The_Seven_Glamours" },
    { name: "Sakura Channeling", image: "7/70/Constellation_Sakura_Channeling" },
    { name: "Mischievous Teasing", image: "a/ac/Constellation_Mischievous_Teasing" },
    { name: "Forbidden Art: Daisesshou", image: "c/cd/Constellation_Forbidden_Art_Daisesshou" },
  ],
  innateBuffs: [
    {
      src: EModSrc.A4,
      description: `Every point of {Elemental Mastery}#[gr] Yae Miko possesses will increase Sesshou Sakura
      {[ES] DMG}#[gr] by {0.15%}#[b,gr].`,
      isGranted: checkAscs[4],
      applyFinalBuff: ({ totalAttr, attPattBonus, desc, tracker }) => {
        applyModifier(desc, attPattBonus, "ES.pct_", (totalAttr.em * 15) / 100, tracker);
      },
    },
  ],
  buffs: [
    {
      index: 2,
      src: EModSrc.C4,
      affect: EModAffect.PARTY,
      description: `When Sesshou Sakura thunderbolt [ES] hit opponents, the {Electro DMG Bonus}#[gr] of all nearby party
      members is increased by {20%}#[b,gr] for 5s.`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "electro", 20),
    },
    {
      index: 3,
      src: EModSrc.C6,
      affect: EModAffect.SELF,
      description: `Sesshou Sakura's attacks will ignore {60%}#[b,gr] of the opponents' {DEF}#[gr].`,
      isGranted: checkCons[6],
      applyBuff: makeModApplier("attPattBonus", "ES.defIgn_", 60),
    },
  ],
};

export default YaeMiko as AppCharacter;
