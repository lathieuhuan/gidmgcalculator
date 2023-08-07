import type { AppCharacter, DefaultAppCharacter } from "@Src/types";
import { EModAffect } from "@Src/constants";
import { makeModApplier } from "@Src/utils/calculation";
import { EModSrc, HEAVY_PAs } from "../constants";
import { checkCons } from "../utils";

const Dori: DefaultAppCharacter = {
  code: 56,
  name: "Dori",
  icon: "5/54/Dori_Icon",
  sideIcon: "6/6d/Dori_Side_Icon",
  rarity: 4,
  nation: "sumeru",
  vision: "electro",
  weaponType: "claymore",
  EBcost: 80,
  talentLvBonusAtCons: {
    ES: 5,
    EB: 3,
  },
  stats: [
    [1039, 19, 61],
    [2670, 48, 156],
    [3447, 62, 201],
    [5163, 93, 301],
    [5715, 103, 333],
    [6573, 118, 384],
    [7309, 131, 427],
    [8168, 147, 477],
    [8719, 157, 509],
    [9577, 172, 559],
    [10129, 182, 591],
    [10987, 198, 641],
    [11539, 208, 673],
    [12397, 223, 723],
  ],
  bonusStat: {
    type: "hp_",
    value: 6,
  },
  calcList: {
    NA: [
      { name: "1-Hit", multFactors: 90.21 },
      { name: "2-Hit", multFactors: [41.07, 43.12] },
      { name: "3-Hit", multFactors: 128.4 },
      {
        name: "Heal on Normal Attacks hit (C6)",
        type: "healing",
        multFactors: { root: 4, attributeType: "hp", scale: 0 },
      },
    ],
    CA: [
      { name: "Charged Attack Spinning", multFactors: 62.55 },
      { name: "Charged Attack Final", multFactors: 113.09 },
    ],
    PA: HEAVY_PAs,
    ES: [
      { name: "Troubleshooter Shot DMG", multFactors: 147.28 },
      { name: "After-Sales Service Round DMG", multFactors: 31.56 },
    ],
    EB: [
      { name: "Connector DMG", multFactors: 15.88 },
      {
        name: "Continuous Healing",
        type: "healing",
        multFactors: { root: 6.67, attributeType: "hp" },
        flatFactor: 642,
      },
      { name: "Jinni Toop (C2)", multFactors: 50, attPatt: "none" },
    ],
  },
  activeTalents: {
    NAs: {
      name: "Marvelous Sword-Dance (Modified)",
    },
    ES: {
      name: "Spirit-Warding Lamp: Troubleshooter Cannon",
      image: "c/c8/Talent_Spirit-Warding_Lamp_Troubleshooter_Cannon",
    },
    EB: {
      name: "Alcazarzaray's Exactitude",
      image: "7/77/Talent_Alcazarzaray%27s_Exactitude",
    },
  },
  passiveTalents: [
    { name: "An Eye for Gold", image: "a/ae/Talent_An_Eye_for_Gold" },
    { name: "Compound Interest", image: "6/6e/Talent_Compound_Interest" },
    { name: "Unexpected Order", image: "d/dc/Talent_Unexpected_Order" },
  ],
  constellation: [
    { name: "Additional Investment", image: "e/e1/Constellation_Additional_Investment" },
    { name: "Special Franchise", image: "9/92/Constellation_Special_Franchise" },
    { name: "Wonders Never Cease", image: "6/6f/Constellation_Wonders_Never_Cease" },
    { name: "Discretionary Supplement", image: "d/d7/Constellation_Discretionary_Supplement" },
    { name: "Value for Mora", image: "a/ab/Constellation_Value_for_Mora" },
    { name: "Sprinkling Weight", image: "a/ab/Constellation_Sprinkling_Weight" },
  ],
  buffs: [
    {
      index: 0,
      src: EModSrc.C4,
      affect: EModAffect.ACTIVE_UNIT,
      description: `When Energy of the character connected to the Lamp Spirit is less than 50%, they gain {30%}#[b,gr]
      {Energy Recharge}#[gr].`,
      isGranted: checkCons[4],
      applyBuff: makeModApplier("totalAttr", "er_", 30),
    },
  ],
};

export default Dori as AppCharacter;
